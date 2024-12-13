import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { OpenAI } from 'https://esm.sh/openai@4.26.0';

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting question generation process...');
    
    const today = new Date();
    const firstDayCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    
    const { data: existingQuestions } = await supabase
      .from('daily_questions')
      .select('display_date')
      .gte('display_date', firstDayCurrentMonth.toISOString())
      .lt('display_date', new Date(firstDayNextMonth.getTime() + 31 * 24 * 60 * 60 * 1000).toISOString())
      .order('display_date');

    const existingDates = new Set(existingQuestions?.map(q => q.display_date) || []);

    const missingDates = [];
    let currentDate = new Date(firstDayCurrentMonth);
    const endDate = new Date(firstDayNextMonth.getTime() + 31 * 24 * 60 * 60 * 1000);

    while (currentDate < endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      if (!existingDates.has(dateString)) {
        missingDates.push(dateString);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(`Found ${missingDates.length} missing dates`);

    if (missingDates.length === 0) {
      console.log('No missing questions to generate');
      return new Response(
        JSON.stringify({ message: 'No missing questions to generate' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate French questions
    const frCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en développement personnel et professionnel. Génère des questions de réflexion profondes et pertinentes pour aider les professionnels à progresser.'
        },
        {
          role: 'user',
          content: `Génère ${missingDates.length} questions uniques en français pour l'introspection quotidienne. Format: une question par ligne, sans numérotation ni ponctuation au début. Les questions doivent être variées et couvrir différents aspects du développement professionnel.`
        }
      ]
    });

    // Generate English questions
    const enCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in personal and professional development. Generate deep and relevant reflection questions to help professionals grow.'
        },
        {
          role: 'user',
          content: `Generate ${missingDates.length} unique questions in English for daily introspection. Format: one question per line, without numbering or punctuation at the start. Questions should be varied and cover different aspects of professional development.`
        }
      ]
    });

    const frQuestions = frCompletion.choices[0].message.content!.split('\n')
      .filter(q => q.trim().length > 0);
    
    const enQuestions = enCompletion.choices[0].message.content!.split('\n')
      .filter(q => q.trim().length > 0);

    const questions = missingDates.map((date, index) => ({
      question: frQuestions[index].trim(),
      question_en: enQuestions[index].trim(),
      display_date: date
    }));

    console.log(`Generated ${questions.length} new questions in both languages`);

    const { error } = await supabase
      .from('daily_questions')
      .insert(questions);

    if (error) throw error;

    console.log('Successfully inserted new questions');

    return new Response(
      JSON.stringify({ 
        success: true, 
        questionsGenerated: questions.length,
        dates: missingDates
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});