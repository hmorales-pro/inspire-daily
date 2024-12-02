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

const stripe = new Stripe(stripeKey as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

serve(async (request) => {
  try {
    const signature = request.headers.get('Stripe-Signature')
    
    if (!signature) {
      console.error('No Stripe signature found in headers')
      return new Response('No Stripe signature found in request', { status: 400 })
    }

    console.log('Processing webhook with signature:', signature)
    const body = await request.text()
    
    // Vérification de la signature du webhook
    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET') as string
      )
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed:`, err.message)
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 })
    }

    console.log('✓ Webhook signature verified')
    console.log('Event type:', event.type)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      console.log('Processing checkout session:', session)
      
      const customerId = session.customer as string
      if (!customerId) {
        throw new Error('No customer ID found in session')
      }
      
      console.log('Customer ID:', customerId)

      // Initialisation du client Supabase avec la clé service
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // Recherche du profil utilisateur
      const { data: profiles, error: profileError } = await supabaseAdmin
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

      // Vérification du statut du paiement
      if (session.payment_status !== 'paid') {
        console.error('Payment not completed')
        throw new Error('Payment not completed')
      }

      // Mise à jour du profil
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          subscription_type: 'premium',
          subscription_status: 'active',
          optimizations_count: null
        })
        .eq('id', profile.id)

      if (updateError) {
        console.error('Error updating profile:', updateError)
        throw updateError
      }

      console.log('✓ Profile updated successfully')
      return new Response(JSON.stringify({ success: true }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Pour les autres types d'événements
    return new Response(JSON.stringify({ received: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('❌ Error processing webhook:', err)
    return new Response(
      JSON.stringify({ error: err.message }), 
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})