import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

serve(async (request) => {
  try {
    console.log('Webhook called - processing request')
    const body = await request.text()
    const event = JSON.parse(body)
    console.log('Event type received:', event.type)

    if (event.type === 'checkout.session.completed') {
      console.log('Processing checkout.session.completed event')
      const session = event.data.object
      const customerId = session.customer
      console.log('Customer ID:', customerId)

      // Initialize Supabase client
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      )

      console.log('Fetching profile for customer:', customerId)
      const { data: profiles, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('stripe_customer_id', customerId)

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        throw profileError
      }

      if (!profiles || profiles.length === 0) {
        console.error('No profile found for customer:', customerId)
        throw new Error('No profile found for customer')
      }

      const profile = profiles[0]
      console.log('Found profile:', profile)

      console.log('Updating profile subscription status')
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({
          subscription_type: 'premium',
          subscription_status: 'active'
        })
        .eq('id', profile.id)

      if (updateError) {
        console.error('Error updating profile:', updateError)
        throw updateError
      }

      console.log('Successfully updated profile subscription to premium')
    }

    return new Response(JSON.stringify({ ok: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Error in webhook handler:', err)
    return new Response(
      JSON.stringify({ error: err.message }), 
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})