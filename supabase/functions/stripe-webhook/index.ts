import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (request) => {
  const signature = request.headers.get('Stripe-Signature')

  if (!signature) {
    console.error('No signature found')
    return new Response('No signature found', { status: 400 })
  }

  try {
    const body = await request.text()
    console.log('Received webhook body:', body)
    
    const receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')!,
      undefined,
      cryptoProvider
    )

    console.log(`Event received: ${receivedEvent.type}`)

    switch (receivedEvent.type) {
      case 'checkout.session.completed': {
        const session = receivedEvent.data.object as Stripe.Checkout.Session
        const customerId = session.customer as string
        
        console.log('Processing checkout session completed:', {
          sessionId: session.id,
          customerId: customerId
        })
        
        // Get user profile by Stripe customer ID
        const { data: profile, error: profileError } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profileError) {
          console.error('Error fetching profile:', profileError)
          throw new Error('No profile found for customer')
        }

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
          throw new Error('Failed to update profile')
        }

        console.log('Successfully updated profile subscription to premium')
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = receivedEvent.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        console.log('Processing subscription deleted:', {
          subscriptionId: subscription.id,
          customerId: customerId
        })
        
        // Get user profile by Stripe customer ID
        const { data: profile, error: profileError } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profileError) {
          console.error('Error fetching profile:', profileError)
          throw new Error('No profile found for customer')
        }

        console.log('Found profile:', profile)

        // Update subscription status
        const { error: updateError } = await supabaseClient
          .from('profiles')
          .update({
            subscription_type: 'free',
            subscription_status: 'inactive'
          })
          .eq('id', profile.id)

        if (updateError) {
          console.error('Error updating profile:', updateError)
          throw new Error('Failed to update profile')
        }

        console.log('Successfully updated profile subscription to free')
        break
      }
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return new Response(err.message, { status: 400 })
  }
})