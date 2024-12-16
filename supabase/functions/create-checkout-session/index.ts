import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

// Add debug logging
console.log('DENO_ENV:', Deno.env.get('DENO_ENV'));
console.log('Using stripe key:', Deno.env.get('DENO_ENV') === 'development' ? 'TEST KEY' : 'PRODUCTION KEY');

// Use test key in development, production key in production
const stripeKey = Deno.env.get('DENO_ENV') === 'development' 
  ? Deno.env.get('STRIPE_SECRET_KEY_TEST')
  : Deno.env.get('STRIPE_SECRET_KEY');

// Price IDs for different subscription types
const PRICE_IDS = {
  premium: 'price_1QRYA7FBde5KXeAQpiM1fZdB',
  premiumYear: 'price_1QWaNcFBde5KXeAQtrD7YtdN',
  lifetime: 'price_1QWaOoFBde5KXeAQhvoFR8Ls'
};

const stripe = new Stripe(stripeKey as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      throw new Error('Not authenticated')
    }

    console.log('User:', user.id);

    // Get request body to determine subscription type
    const { subscriptionType = 'premium' } = await req.json();
    console.log('Subscription type:', subscriptionType);

    // Get or create Stripe customer
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    console.log('Profile:', profile);
    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      console.log('Creating new customer');
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
          subscription_type: subscriptionType
        },
      })
      customerId = customer.id
      console.log('New customer ID:', customerId);

      // Update profile with Stripe customer ID
      await supabaseClient
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    } else {
      console.log('Using existing customer ID:', customerId);
      // Update customer metadata
      await stripe.customers.update(customerId, {
        metadata: {
          subscription_type: subscriptionType
        }
      });
    }

    const priceId = PRICE_IDS[subscriptionType as keyof typeof PRICE_IDS];
    if (!priceId) {
      throw new Error('Invalid subscription type');
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: subscriptionType === 'premium' ? 'subscription' : 'payment',
      success_url: `${req.headers.get('origin')}/settings?success=true`,
      cancel_url: `${req.headers.get('origin')}/settings?canceled=true`,
      metadata: {
        subscription_type: subscriptionType
      }
    })

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})