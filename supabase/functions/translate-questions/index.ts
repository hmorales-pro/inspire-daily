import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { OpenAI } from 'https://esm.sh/openai@4.26.0';

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting translation of questions...');

    // Fetch all questions without English translation
    const { data: questions, error: fetchError } = await supabase
      .from('daily_questions')
      .select('*')
      .is('question_en', null);

    if (fetchError) {
      console.error('Error fetching questions:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${questions?.length} questions to translate`);

    if (!questions || questions.length === 0) {
      console.log('No questions to translate');
      return new Response(
        JSON.stringify({ message: 'No questions to translate' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const translations = [];

    // Translate questions in batches
    for (const question of questions) {
      console.log(`Translating question: ${question.question}`);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a professional translator. Translate the following French question to English. Keep the same tone and style. Only return the translation, nothing else.'
          },
          {
            role: 'user',
            content: question.question
          }
        ]
      });

      const translatedQuestion = completion.choices[0].message.content;
      console.log(`Translation: ${translatedQuestion}`);

      // Update the question with the English translation
      const { error: updateError } = await supabase
        .from('daily_questions')
        .update({ question_en: translatedQuestion })
        .eq('id', question.id);

      if (updateError) {
        console.error(`Error updating question ${question.id}:`, updateError);
        continue;
      }

      translations.push({
        original: question.question,
        translated: translatedQuestion
      });

      // Add a small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('Translation process completed successfully');
    console.log('Translations:', translations);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully translated ${translations.length} questions`,
        translations
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in translate-questions function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});