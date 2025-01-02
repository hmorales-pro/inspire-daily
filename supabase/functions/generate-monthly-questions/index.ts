import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import OpenAI from 'https://esm.sh/openai@4.26.0';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const generateQuestion = async (openai: OpenAI): Promise<{ fr: string; en: string }> => {
  console.log('Starting question generation with OpenAI...');
  
  try {
    const prompt = `Generate a thought-provoking question for self-reflection and personal growth. 
    The question should be open-ended and encourage deep thinking.
    Return the response in JSON format with 'fr' for French and 'en' for English translations.
    Example: {"fr": "Quel est le plus grand obstacle que vous avez surmonté et comment cela vous a-t-il changé ?", "en": "What's the biggest obstacle you've overcome and how has it changed you?"}`;

    console.log('Sending request to OpenAI with model: gpt-4o');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    });

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No response content from OpenAI');
    }

    console.log('Received response from OpenAI:', completion.choices[0].message.content);
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error in generateQuestion:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      if ('response' in error) {
        console.error('OpenAI API response:', error.response);
      }
    }
    throw error;
  }
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Starting generate-monthly-questions function...');

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

    const { months = 1 } = await req.json().catch(() => ({}));
    console.log(`Generating questions for the next ${months} months`);

    // Calculate dates for the specified number of months
    const allDates = [];
    const today = new Date();
    
    for (let i = 0; i < months; i++) {
      const currentMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
      
      for (let day = 1; day <= lastDay; day++) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        allDates.push(date.toISOString().split('T')[0]);
      }
    }

    console.log('Checking existing questions...');
    const { data: existingQuestions, error: queryError } = await supabase
      .from('daily_questions')
      .select('display_date')
      .in('display_date', allDates);

    if (queryError) {
      console.error('Error querying existing questions:', queryError);
      throw queryError;
    }

    const existingDates = new Set(existingQuestions?.map(q => q.display_date) || []);
    const missingDates = allDates.filter(date => !existingDates.has(date));

    console.log(`Found ${missingDates.length} missing dates to generate questions for`);

    let successCount = 0;
    let errorCount = 0;

    // Generate and insert questions for missing dates
    for (const date of missingDates) {
      try {
        console.log(`Generating question for date: ${date}`);
        const { fr, en } = await generateQuestion(openai);
        
        console.log(`Inserting question for date ${date}:`, { fr, en });
        const { error: insertError } = await supabase
          .from('daily_questions')
          .insert([{
            id: Date.now(),
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
    console.error('Error in generate-monthly-questions function:', error);
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