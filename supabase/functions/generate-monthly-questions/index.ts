import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { OpenAI } from 'https://esm.sh/openai@4.26.0';

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

Deno.serve(async (req) => {
  try {
    // Vérifier si la requête vient du CRON
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Obtenir le premier jour du mois en cours
    const today = new Date();
    const firstDayCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Calculer le nombre de jours dans le mois en cours
    const lastDayCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysInCurrentMonth = lastDayCurrentMonth.getDate();

    console.log(`Generating questions for ${firstDayCurrentMonth.toISOString().split('T')[0]} to ${lastDayCurrentMonth.toISOString().split('T')[0]}`);

    // Générer les questions avec GPT-4
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en développement personnel et professionnel. Génère des questions de réflexion profondes et pertinentes pour aider les professionnels à progresser.'
        },
        {
          role: 'user',
          content: `Génère ${daysInCurrentMonth} questions uniques en français pour l'introspection quotidienne. Format: une question par ligne, sans numérotation ni ponctuation au début. Les questions doivent être variées et couvrir différents aspects du développement professionnel.`
        }
      ]
    });

    const questions = completion.choices[0].message.content!.split('\n')
      .filter(q => q.trim().length > 0);

    console.log(`Generated ${questions.length} questions`);

    // Insérer les questions dans la base de données
    const questionsToInsert = questions.map((question, index) => ({
      question,
      display_date: new Date(firstDayCurrentMonth.getFullYear(), firstDayCurrentMonth.getMonth(), index + 1).toISOString().split('T')[0]
    }));

    const { error } = await supabase
      .from('daily_questions')
      .insert(questionsToInsert);

    if (error) throw error;

    console.log('Questions successfully inserted into the database');

    return new Response(
      JSON.stringify({ success: true, questionsGenerated: questions.length }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});