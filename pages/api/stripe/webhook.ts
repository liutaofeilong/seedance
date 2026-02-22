import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { buffer } from 'micro'
import clientPromise from '@/lib/mongodb'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const buf = await buffer(req)
  const sig = req.headers['stripe-signature']!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      await handleCheckoutComplete(session)
      break
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription
      await handleSubscriptionChange(subscription)
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.json({ received: true })
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const client = await clientPromise
  const db = client.db('seedance')

  const userId = session.metadata?.userId
  const plan = session.metadata?.plan

  if (userId && plan) {
    await db.collection('users').updateOne(
      { _id: userId },
      {
        $set: {
          'subscription.plan': plan,
          'subscription.status': 'active',
          'subscription.stripeCustomerId': session.customer,
          'subscription.stripeSubscriptionId': session.subscription,
          'subscription.updatedAt': new Date(),
        },
      }
    )
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const client = await clientPromise
  const db = client.db('seedance')

  await db.collection('users').updateOne(
    { 'subscription.stripeSubscriptionId': subscription.id },
    {
      $set: {
        'subscription.status': subscription.status,
        'subscription.updatedAt': new Date(),
      },
    }
  )
}

