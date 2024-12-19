import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

Deno.serve(async (req) => {
  try {
    console.log("Setting up daily emails CRON job");
    
    // Supprimer l'ancien job s'il existe
    await supabase.rpc('cron_job_delete', { job_name: 'send-daily-emails' });
    
    // Créer le job CRON pour envoyer les emails quotidiens
    const { data, error } = await supabase.rpc('cron_job_create', {
      job_name: 'send-daily-emails',
      schedule: '0 8 * * *',
      command: $$
        SELECT net.http_post(
          url:='https://hpyvlzstxtdrqolmrlgj.supabase.co/functions/v1/send-daily-questions',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhweXZsenN0eHRkcnFvbG1ybGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjc3NjEsImV4cCI6MjA0ODcwMzc2MX0.2COQ2dIHh7HhMnNDJnplarmMaZ9wGjnPvnRN8kSDHyk"}'::jsonb
        ) as request_id;
      $$
    });
    
    if (error) {
      console.error("Error setting up CRON job:", error);
      throw error;
    }

    console.log("CRON job setup successful:", data);

    return new Response(
      JSON.stringify({ success: true, message: 'Daily emails CRON job configured successfully' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in setup-daily-emails-cron function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});