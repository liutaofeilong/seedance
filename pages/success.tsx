import { useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Success() {
  const router = useRouter()
  const { order } = router.query

  useEffect(() => {
    // 可以在这里触发一些成功后的操作
    console.log('Payment successful, order ID:', order)
  }, [order])

  return (
    <>
      <Head>
        <title>Payment Successful - Seedance</title>
      </Head>

      <div className="min-h-screen">
        <Navbar />
        
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center glow-cyan"
            >
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-6xl font-bold mb-6 font-display"
            >
              PAYMENT <span className="text-gradient">SUCCESSFUL!</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-gray-300 mb-8"
            >
              Thank you for subscribing to Seedance!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass rounded-2xl p-8 mb-8 border border-primary/20"
            >
              <h2 className="text-2xl font-bold mb-4 font-display">What's Next?</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Start Creating Videos</h3>
                    <p className="text-gray-400 text-sm">Access unlimited video generation with your new subscription</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-secondary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Check Your Email</h3>
                    <p className="text-gray-400 text-sm">We've sent a confirmation email with your subscription details</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-accent font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Explore Features</h3>
                    <p className="text-gray-400 text-sm">Discover all the premium features available to you</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {order && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-sm text-gray-500 mb-8"
              >
                Order ID: {order}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/generate"
                className="px-8 py-4 btn-primary rounded-xl font-bold hover:scale-105 transition-all glow-cyan"
              >
                Start Creating Videos
              </Link>
              <Link
                href="/profile"
                className="px-8 py-4 glass glass-hover border border-primary/30 rounded-xl font-semibold transition-all"
              >
                View Profile
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </>
  )
}


