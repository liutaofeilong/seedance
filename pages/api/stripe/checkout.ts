import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user?.email) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { priceId, plan } = req.body

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
        plan: plan,
      },
    })

    return res.status(200).json({ sessionId: checkoutSession.id })
  } catch (error) {
    console.error('Stripe error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

