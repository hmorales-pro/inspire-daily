import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { OpenAI } from "https://deno.land/x/openai@v4.24.0/mod.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const generateDayOneQuestion = async (openai: OpenAI): Promise<{ fr: string; en: string }> => {
  console.log('Starting Day One style question generation with OpenAI...');
  
  try {
    const prompt = `Generate a reflective journaling question in the style of Day One app. 
    The question should encourage personal reflection, emotional awareness, and meaningful documentation of daily life.
    Focus on one of these themes randomly:
    1. Daily highlights and memorable moments
    2. Emotional reflection and feelings
    3. Gratitude and appreciation
    4. Personal growth and learning
    5. Meaningful interactions and conversations
    6. Sensory experiences and observations
    7. Goals and aspirations
    8. Places and environments
    
    Return the response in JSON format with 'fr' for French and 'en' for English translations.
    Example: {
      "fr": "Quel moment de votre journée mérite d'être immortalisé ? Décrivez les émotions, les sensations et les détails qui le rendent spécial.",
      "en": "What moment from your day deserves to be immortalized? Describe the emotions, sensations, and details that make it special."
    }`;

    console.log('Sending request to OpenAI with model: gpt-4o');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 200,
    });

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No response content from OpenAI');
    }

    console.log('Received response from OpenAI:', completion.choices[0].message.content);
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error in generateDayOneQuestion:', error);
    throw error;
  }
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Starting generate-questions-now function...');

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      throw new Error('OpenAI API key is not configured');
    }

    console.log('Initializing Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    console.log('Initializing OpenAI client...');
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    // Generate questions for the next 30 days
    const startDate = new Date();
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date.toISOString().split('T')[0];
    });

    console.log('Checking existing questions...');
    const { data: existingQuestions, error: queryError } = await supabase
      .from('daily_questions')
      .select('display_date')
      .in('display_date', dates);

    if (queryError) {
      console.error('Error querying existing questions:', queryError);
      throw queryError;
    }

    const existingDates = new Set(existingQuestions?.map(q => q.display_date) || []);
    const missingDates = dates.filter(date => !existingDates.has(date));

    console.log(`Found ${missingDates.length} missing dates to generate questions for`);

    let successCount = 0;
    let errorCount = 0;

    // Generate and insert questions for missing dates
    for (const date of missingDates) {
      try {
        console.log(`Generating Day One style question for date: ${date}`);
        const { fr, en } = await generateDayOneQuestion(openai);
        
        console.log(`Inserting question for date ${date}:`, { fr, en });
        const { error: insertError } = await supabase
          .from('daily_questions')
          .insert([{
            question: fr,
            question_en: en,
            display_date: date,
          }]);

        if (insertError) {
          console.error(`Error inserting question for ${date}:`, insertError);
          errorCount++;
        } else {
          console.log(`Successfully generated and inserted question for ${date}`);
          successCount++;
        }

        // Add a delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error processing date ${date}:`, error);
        errorCount++;
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Generated ${successCount} questions successfully. ${errorCount} errors occurred.`,
        details: {
          totalDates: missingDates.length,
          successCount,
          errorCount,
        }
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in generate-questions-now function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
};

serve(handler);