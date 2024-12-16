import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    // Handle CORS preflight requests first
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Quick validation of environment variables
    if (!RESEND_API_KEY || !supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const today = new Date().toISOString().split('T')[0];

    // Set a timeout for the database query
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database query timeout')), 5000);
    });

    const queryPromise = supabase
      .from('daily_questions')
      .select('*')
      .eq('display_date', today)
      .single();

    // Race between the query and the timeout
    const { data: questionData } = await Promise.race([queryPromise, timeoutPromise]) as any;

    if (!questionData) {
      throw new Error('No question found for today');
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #F6F6F7; font-family: 'Inter', sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background-color: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <h1 style="color: #1A1F2C; font-size: 24px; margin: 0 0 24px 0;">📝 Question du Jour</h1>
              <p style="color: #1A1F2C; font-size: 18px; line-height: 1.6; margin: 0 0 32px 0;">${questionData.question}</p>
              <a href="https://inspire-daily.eu" 
                 style="display: inline-block; background-color: #9b87f5; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 8px; font-weight: 500; transition: background-color 0.2s ease;">
                Répondre Maintenant
              </a>
            </div>
            <div style="text-align: center; margin-top: 24px;">
              <p style="color: #7E69AB; font-size: 14px;">
                Inspire Daily - Votre moment de réflexion quotidien
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Set a timeout for the email sending
    const emailTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email sending timeout')), 5000);
    });

    const emailPromise = fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Inspire Daily <onboarding@resend.dev>",
        to: ["hugo.morales.pro@gmail.com"],
        subject: "Votre Question du Jour",
        html: emailHtml,
      }),
    });

    // Race between the email sending and the timeout
    const emailResponse = await Promise.race([emailPromise, emailTimeoutPromise]);

    if (!emailResponse.ok) {
      throw new Error(`Failed to send email: ${await emailResponse.text()}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Test email sent successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-test-daily-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: error.message.includes('timeout') ? 504 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);