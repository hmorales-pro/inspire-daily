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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting question generation process...');
    
    // Get the current date and calculate first day of current and next month
    const today = new Date();
    const firstDayCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    
    // Calculate days in current and next month
    const daysInCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysInNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0).getDate();

    console.log(`Generating questions for ${firstDayCurrentMonth.toISOString().split('T')[0]} to ${firstDayNextMonth.toISOString().split('T')[0]}`);

    // Generate questions for current month
    const currentMonthCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en développement personnel et professionnel. Génère des questions de réflexion profondes et pertinentes pour aider les professionnels à progresser.'
        },
        {
          role: 'user',
          content: `Génère ${daysInCurrentMonth} questions uniques en français pour l'introspection quotidienne du mois en cours. Format: une question par ligne, sans numérotation ni ponctuation au début. Les questions doivent être variées et couvrir différents aspects du développement professionnel.`
        }
      ]
    });

    // Generate questions for next month
    const nextMonthCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en développement personnel et professionnel. Génère des questions de réflexion profondes et pertinentes pour aider les professionnels à progresser.'
        },
        {
          role: 'user',
          content: `Génère ${daysInNextMonth} questions uniques en français pour l'introspection quotidienne du mois prochain. Format: une question par ligne, sans numérotation ni ponctuation au début. Les questions doivent être variées et couvrir différents aspects du développement professionnel.`
        }
      ]
    });

    const currentMonthQuestions = currentMonthCompletion.choices[0].message.content!.split('\n')
      .filter(q => q.trim().length > 0);
    const nextMonthQuestions = nextMonthCompletion.choices[0].message.content!.split('\n')
      .filter(q => q.trim().length > 0);

    console.log(`Generated ${currentMonthQuestions.length} questions for current month`);
    console.log(`Generated ${nextMonthQuestions.length} questions for next month`);

    // Prepare questions for both months
    const questionsToInsert = [
      ...currentMonthQuestions.map((question, index) => ({
        question,
        display_date: new Date(firstDayCurrentMonth.getFullYear(), firstDayCurrentMonth.getMonth(), index + 1).toISOString().split('T')[0]
      })),
      ...nextMonthQuestions.map((question, index) => ({
        question,
        display_date: new Date(firstDayNextMonth.getFullYear(), firstDayNextMonth.getMonth(), index + 1).toISOString().split('T')[0]
      }))
    ];

    // Insert all questions
    const { error } = await supabase
      .from('daily_questions')
      .insert(questionsToInsert);

    if (error) throw error;

    console.log('Questions successfully inserted into the database');

    return new Response(
      JSON.stringify({ 
        success: true, 
        questionsGenerated: questionsToInsert.length,
        currentMonth: {
          start: firstDayCurrentMonth.toISOString().split('T')[0],
          questions: currentMonthQuestions.length
        },
        nextMonth: {
          start: firstDayNextMonth.toISOString().split('T')[0],
          questions: nextMonthQuestions.length
        }
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