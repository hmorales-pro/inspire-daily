import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Starting daily questions email function");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const today = new Date().toISOString().split('T')[0];

    console.log(`Fetching question for date: ${today}`);

    // Récupérer la question du jour
    const { data: questionData, error: questionError } = await supabase
      .from('daily_questions')
      .select('*')
      .eq('display_date', today)
      .single();

    if (questionError) {
      console.error('Error fetching question:', questionError);
      throw new Error(`Error fetching question: ${questionError.message}`);
    }

    console.log('Question data:', questionData);

    // Récupérer tous les utilisateurs avec leurs profils
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .eq('subscription_status', 'active');

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw new Error(`Error fetching profiles: ${profilesError.message}`);
    }

    console.log(`Found ${profiles.length} active profiles to send emails to`);

    // Envoyer un email à chaque utilisateur
    const emailPromises = profiles.map(async (profile) => {
      console.log(`Preparing email for user: ${profile.email}`);
      
      const questionText = profile.preferred_language === 'en' && questionData.question_en
        ? questionData.question_en
        : questionData.question;

      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">📝 ${profile.preferred_language === 'en' ? 'Daily Question' : 'Question du Jour'}</h1>
          <p style="font-size: 18px; color: #333; margin: 24px 0;">${questionText}</p>
          <a href="https://inspire-daily.app" 
             style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; margin-top: 24px;">
            ${profile.preferred_language === 'en' ? 'Answer Now' : 'Répondre Maintenant'}
          </a>
        </div>
      `;

      try {
        console.log(`Sending email to: ${profile.email}`);
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Inspire Daily <daily@inspire-daily.app>",
            to: [profile.email],
            subject: profile.preferred_language === 'en' ? "Your Daily Question" : "Votre Question du Jour",
            html: emailHtml,
          }),
        });

        if (!res.ok) {
          const error = await res.text();
          console.error(`Error sending email to ${profile.email}:`, error);
        } else {
          console.log(`Successfully sent email to: ${profile.email}`);
        }
      } catch (error) {
        console.error(`Failed to send email to ${profile.email}:`, error);
      }
    });

    await Promise.all(emailPromises);

    console.log("Daily questions email function completed successfully");

    return new Response(
      JSON.stringify({ success: true, message: `Emails sent to ${profiles.length} users` }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-daily-questions function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);