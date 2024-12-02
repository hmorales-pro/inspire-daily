import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (request) => {
  try {
    const signature = request.headers.get('Stripe-Signature')
    console.log('Webhook called with signature:', signature)

    const body = await request.text()
    let event
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature!,
        Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')!,
        undefined,
        cryptoProvider
      )
    } catch (err) {
      console.error('Error verifying webhook signature:', err)
      return new Response(err.message, { status: 400 })
    }

    console.log('Event type:', event.type)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      console.log('Session data:', session)
      
      const customerId = session.customer as string
      console.log('Customer ID:', customerId)

      // Initialize Supabase client
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      )

      console.log('Fetching profile for customer:', customerId)
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

      // Vérifier le statut du paiement
      console.log('Session payment status:', session.payment_status)
      if (session.payment_status !== 'paid') {
        console.error('Payment not completed')
        throw new Error('Payment not completed')
      }

      console.log('Updating profile subscription status')
      const { data: updateData, error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          subscription_type: 'premium',
          subscription_status: 'active',
          optimizations_count: null // Mettre à null pour les utilisateurs premium (pas de limite)
        })
        .eq('id', profile.id)

      if (updateError) {
        console.error('Error updating profile:', updateError)
        throw updateError
      }

      console.log('Profile updated successfully:', updateData)
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