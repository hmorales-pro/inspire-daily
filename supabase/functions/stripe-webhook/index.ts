import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

console.log('Webhook function starting...')

serve(async (request) => {
  const signature = request.headers.get('Stripe-Signature')

  if (!signature) {
    console.error('No signature found')
    return new Response('No signature found', { status: 400 })
  }

  try {
    const body = await request.text()
    console.log('Received webhook body:', body)
    
    const event = JSON.parse(body)
    console.log('Event type:', event.type)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const customerId = session.customer
      
      console.log('Processing checkout session:', {
        sessionId: session.id,
        customerId: customerId
      })

      // Get user profile by Stripe customer ID
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

      // Update subscription status
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
    console.error('Error processing webhook:', err)
    return new Response(
      JSON.stringify({ error: err.message }), 
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})