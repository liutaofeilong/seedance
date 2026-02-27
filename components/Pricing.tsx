import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'

const plans = [
  {
    name: 'Free Trial',
    price: '$0',
    period: 'one-time',
    description: 'Perfect for testing',
    features: [
      '1 video generation',
      'Text to video',
      'Image to video',
      '720p resolution',
      'Watermark included',
      'Community support',
    ],
    cta: 'Start Free',
    popular: false,
    gradient: 'from-gray-600 to-gray-800',
  },
  {
    name: 'Monthly',
    price: '$100',
    period: 'per month',
    description: 'For regular creators',
    features: [
      'Unlimited generations',
      'Text & Image to video',
      '4K Ultra HD resolution',
      'No watermark',
      'Priority processing',
      'Commercial license',
      'Advanced AI models',
      'Email support',
    ],
    cta: 'Subscribe Now',
    popular: true,
    gradient: 'from-primary to-secondary',
    priceId: 'monthly-plan',
    amount: '100.00',
  },
  {
    name: 'Quarterly',
    price: '$250',
    period: 'per 3 months',
    savings: 'Save $50',
    description: 'Best value for pros',
    features: [
      'Everything in Monthly',
      'Batch processing',
      'API access',
      'Custom styles',
      'Priority support',
      'Team collaboration',
      'Advanced analytics',
    ],
    cta: 'Subscribe Now',
    popular: false,
    gradient: 'from-secondary to-accent',
    priceId: 'quarterly-plan',
    amount: '250.00',
  },
  {
    name: 'Annual',
    price: '$800',
    period: 'per year',
    savings: 'Save $400',
    description: 'For power users',
    features: [
      'Everything in Quarterly',
      'Dedicated account manager',
      'Custom AI training',
      'White-label option',
      'SLA guarantee',
      'Early feature access',
      'Unlimited API calls',
      '24/7 phone support',
    ],
    cta: 'Subscribe Now',
    popular: false,
    gradient: 'from-accent to-primary',
    priceId: 'annual-plan',
    amount: '800.00',
  },
]

export default function Pricing() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: any) => {
    // 检查用户是否登录
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // 未登录，跳转到登录页面
      router.push('/login?redirect=pricing')
      return
    }

    // 已登录，跳转到 PayPal 支付页面
    setLoading(plan.priceId)
    router.push(`/checkout?plan=${plan.priceId}&amount=${plan.amount}&name=${encodeURIComponent(plan.name)}`)
  }
  return (
    <section id="pricing" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-4 px-6 py-2 glass rounded-full border border-accent/30"
          >
            <span className="text-accent font-semibold">💎 Flexible Plans</span>
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 font-display">
            SIMPLE <span className="text-gradient">PRICING</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your creative journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className={`relative glass glass-hover rounded-2xl p-8 ${
                plan.popular ? 'border-2 border-primary glow-cyan' : 'border border-primary/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-full text-sm font-bold glow-cyan">
                    ⭐ MOST POPULAR
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 font-display">{plan.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-5xl font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                    {plan.price}
                  </span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
                {plan.savings && (
                  <div className="inline-block px-3 py-1 bg-accent/20 border border-accent/30 rounded-full">
                    <span className="text-accent text-sm font-semibold">{plan.savings}</span>
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => plan.name === 'Free Trial' ? router.push('/signup') : handleSubscribe(plan)}
                disabled={loading === plan.priceId}
                className={`block w-full py-4 rounded-xl font-bold text-center transition-all ${
                  plan.popular
                    ? 'btn-primary glow-cyan hover:scale-105'
                    : 'glass glass-hover border border-primary/30 hover:border-primary/50'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                {loading === plan.priceId ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                  </span>
                ) : (
                  plan.cta
                )}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="glass rounded-2xl p-8 max-w-3xl mx-auto border border-primary/20">
            <p className="text-gray-400 mb-4">
              🔒 Secure payment processing • 💳 All major cards accepted • 🔄 Cancel anytime
            </p>
            <p className="text-sm text-gray-500">
              All plans include instant access and 30-day money-back guarantee
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

