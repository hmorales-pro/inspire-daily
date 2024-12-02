import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

// Use test key in development, production key in production
const stripeKey = Deno.env.get('DENO_ENV') === 'development' 
  ? Deno.env.get('STRIPE_SECRET_KEY_TEST')
  : Deno.env.get('STRIPE_SECRET_KEY');

const stripe = new Stripe(stripeKey as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
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

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error('Not authenticated')

    console.log('Cancelling subscription for user:', user.id)

    // Get customer ID from profiles
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      throw new Error('No subscription found')
    }

    console.log('Found Stripe customer:', profile.stripe_customer_id)

    // Get all active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'active',
    })

    console.log('Found active subscriptions:', subscriptions.data.length)

    // Cancel all active subscriptions
    for (const subscription of subscriptions.data) {
      console.log('Cancelling subscription:', subscription.id)
      await stripe.subscriptions.cancel(subscription.id)
    }

    // Update profile
    await supabaseClient
      .from('profiles')
      .update({
        subscription_type: 'free',
        subscription_status: 'canceled',
        optimizations_count: 0,
        optimizations_reset_date: new Date().toISOString()
      })
      .eq('id', user.id)

    console.log('Profile updated successfully')

    return new Response(
      JSON.stringify({ success: true }),
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