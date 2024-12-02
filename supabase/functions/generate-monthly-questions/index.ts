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

    // Obtenir le premier jour du mois prochain
    const today = new Date();
    const firstDayNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    
    // Calculer le nombre de jours dans le mois prochain
    const lastDayNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    const daysInNextMonth = lastDayNextMonth.getDate();

    // Générer les questions avec GPT-4o
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en développement personnel et professionnel. Génère des questions de réflexion profondes et pertinentes pour aider les professionnels à progresser.'
        },
        {
          role: 'user',
          content: `Génère ${daysInNextMonth} questions uniques en français pour l'introspection quotidienne. Format: une question par ligne, sans numérotation ni ponctuation au début. Les questions doivent être variées et couvrir différents aspects du développement professionnel.`
        }
      ]
    });

    const questions = completion.choices[0].message.content!.split('\n')
      .filter(q => q.trim().length > 0);

    // Insérer les questions dans la base de données
    const questionsToInsert = questions.map((question, index) => ({
      question,
      display_date: new Date(firstDayNextMonth.getFullYear(), firstDayNextMonth.getMonth(), index + 1).toISOString().split('T')[0]
    }));

    const { error } = await supabase
      .from('daily_questions')
      .insert(questionsToInsert);

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, questionsGenerated: questions.length }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});