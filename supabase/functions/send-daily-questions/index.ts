import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const today = new Date().toISOString().split('T')[0];

    // Récupérer la question du jour
    const { data: questionData, error: questionError } = await supabase
      .from('daily_questions')
      .select('*')
      .eq('display_date', today)
      .single();

    if (questionError) {
      throw new Error(`Error fetching today's question: ${questionError.message}`);
    }

    // Récupérer tous les utilisateurs avec un abonnement actif
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('email');

    if (profilesError) {
      throw new Error(`Error fetching profiles: ${profilesError.message}`);
    }

    console.log(`Found ${profiles.length} profiles to send emails to`);

    // Préparer le contenu de l'email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; background-color: #F6F6F7; font-family: 'Inter', sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background-color: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <h1 style="color: #1A1F2C; font-size: 24px; margin: 0 0 24px 0;">📝 Question du Jour / Daily Question</h1>
              
              <!-- French Question -->
              <div style="margin-bottom: 24px; padding: 20px; background-color: #F6F6F7; border-radius: 8px;">
                <h2 style="color: #7E69AB; font-size: 18px; margin: 0 0 12px 0;">🇫🇷 En Français</h2>
                <p style="color: #1A1F2C; font-size: 16px; line-height: 1.6; margin: 0;">${questionData.question}</p>
              </div>

              <!-- English Question -->
              <div style="margin-bottom: 24px; padding: 20px; background-color: #F6F6F7; border-radius: 8px;">
                <h2 style="color: #7E69AB; font-size: 18px; margin: 0 0 12px 0;">🇬🇧 In English</h2>
                <p style="color: #1A1F2C; font-size: 16px; line-height: 1.6; margin: 0;">${questionData.question_en}</p>
              </div>

              <a href="https://inspire-daily.eu" 
                 style="display: inline-block; background-color: #9b87f5; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 8px; font-weight: 500; transition: background-color 0.2s ease;">
                Répondre / Answer Now
              </a>
            </div>
            <div style="text-align: center; margin-top: 24px;">
              <p style="color: #7E69AB; font-size: 14px;">
                Inspire Daily - Votre moment de réflexion quotidien / Your daily moment of reflection
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Envoyer l'email à chaque utilisateur
    for (const profile of profiles) {
      try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': BREVO_API_KEY!,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            sender: {
              name: 'Inspire Daily',
              email: 'hello@inspire-daily.eu'
            },
            to: [{
              email: profile.email
            }],
            subject: '📝 Votre Question du Jour / Your Daily Question',
            htmlContent: emailHtml
          })
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error(`Error sending email to ${profile.email}:`, errorData);
        } else {
          console.log(`Successfully sent email to ${profile.email}`);
        }

        // Ajouter un petit délai entre chaque envoi pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error sending email to ${profile.email}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Emails sent to ${profiles.length} users`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in send-daily-questions function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});