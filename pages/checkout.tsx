import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'

export default function Checkout() {
  const router = useRouter()
  const { plan, amount, name } = router.query
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login?redirect=pricing')
      return
    }
    setUser(user)
    setLoading(false)
  }

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          description: `Seedance ${name} Subscription`,
          amount: {
            value: amount,
            currency_code: 'USD',
          },
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
      },
    })
  }

  const onApprove = async (data: any, actions: any) => {
    const order = await actions.order.capture()
    console.log('Payment successful:', order)

    // 保存订阅信息到 Supabase
    try {
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan: plan,
          amount: amount,
          paypal_order_id: order.id,
          status: 'active',
          created_at: new Date().toISOString(),
        })

      if (error) {
        console.error('Database error:', error)
      }

      // 跳转到成功页面
      router.push('/success?order=' + order.id)
    } catch (error) {
      console.error('Error saving subscription:', error)
    }
  }

  const onError = (err: any) => {
    console.error('PayPal error:', err)
    alert('Payment failed. Please try again.')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Checkout - Seedance</title>
      </Head>

      <div className="min-h-screen">
        <Navbar />
        
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center font-display">
              COMPLETE <span className="text-gradient">PAYMENT</span>
            </h1>

            <div className="glass rounded-2xl p-8 mb-8 border border-primary/20">
              <h2 className="text-2xl font-bold mb-6 font-display">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-4 border-b border-primary/20">
                  <span className="text-gray-400">Plan</span>
                  <span className="font-bold text-xl">{name}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-primary/20">
                  <span className="text-gray-400">Amount</span>
                  <span className="font-bold text-2xl text-gradient">${amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Email</span>
                  <span className="text-sm">{user?.email}</span>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-300">
                  ✓ Instant access after payment<br />
                  ✓ Secure payment via PayPal<br />
                  ✓ Cancel anytime
                </p>
              </div>

              <PayPalScriptProvider
                options={{
                  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                  currency: 'USD',
                }}
              >
                <PayPalButtons
                  style={{
                    layout: 'vertical',
                    color: 'blue',
                    shape: 'rect',
                    label: 'subscribe',
                  }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                />
              </PayPalScriptProvider>
            </div>

            <div className="text-center text-sm text-gray-400">
              <p>By completing this purchase, you agree to our Terms of Service and Privacy Policy</p>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </>
  )
}

