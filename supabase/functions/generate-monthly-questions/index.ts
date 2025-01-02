import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@4.26.0';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const generateQuestion = async (openai: OpenAIApi): Promise<{ fr: string; en: string }> => {
  const prompt = `Generate a thought-provoking question for self-reflection and personal growth. 
  The question should be open-ended and encourage deep thinking.
  Return the response in JSON format with 'fr' for French and 'en' for English translations.
  Example: {"fr": "Quel est le plus grand obstacle que vous avez surmonté et comment cela vous a-t-il changé ?", "en": "What's the biggest obstacle you've overcome and how has it changed you?"}`;

  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const responseText = completion.data.choices[0]?.message?.content || '';
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    throw new Error('Failed to generate question');
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
    const openai = new OpenAIApi(configuration);

    // Get the request body to check if we want to generate for multiple months
    const { months = 12 } = await req.json().catch(() => ({}));
    console.log(`Generating questions for the next ${months} months`);

    // Calculate dates for the specified number of months
    const allDates = [];
    const today = new Date();
    
    // Generate dates for the specified number of months
    for (let i = 0; i < months; i++) {
      const currentMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
      
      for (let day = 1; day <= lastDay; day++) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        allDates.push(date.toISOString().split('T')[0]);
      }
    }

    // Check which dates don't have questions yet
    const { data: existingQuestions } = await supabase
      .from('daily_questions')
      .select('display_date')
      .in('display_date', allDates);

    const existingDates = new Set(existingQuestions?.map(q => q.display_date) || []);
    const missingDates = allDates.filter(date => !existingDates.has(date));

    console.log(`Generating questions for ${missingDates.length} missing dates`);

    // Generate and insert questions for missing dates
    for (const date of missingDates) {
      try {
        const { fr, en } = await generateQuestion(openai);
        
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
        } else {
          console.log(`Successfully generated question for ${date}`);
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error generating question for ${date}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Generated questions for ${missingDates.length} dates` 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in generate-monthly-questions function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
};

serve(handler);