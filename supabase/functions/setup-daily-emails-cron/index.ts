import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

Deno.serve(async (req) => {
  try {
    // Créer le job CRON pour envoyer les emails quotidiens
    const { data, error } = await supabase.rpc('setup_daily_emails_cron');
    
    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, message: 'Daily emails CRON job configured successfully' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});