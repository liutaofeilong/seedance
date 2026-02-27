import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import Logo from '@/components/Logo'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        // 检查是否有重定向参数
        const redirect = router.query.redirect as string
        if (redirect === 'pricing') {
          router.push('/#pricing')
        } else {
          router.push('/generate')
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const redirect = router.query.redirect as string
      const redirectUrl = redirect === 'pricing' 
        ? `${window.location.origin}/#pricing`
        : `${window.location.origin}/generate`

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      })

      if (error) {
        setError(error.message)
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <>
      <Head>
        <title>Sign In - Seedance</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass rounded-3xl p-10 w-full max-w-md border border-primary/20"
        >
          <Link href="/" className="flex items-center justify-center space-x-3 mb-8 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Logo className="w-12 h-12" />
            </motion.div>
            <span className="text-2xl font-bold font-display">SEED<span className="text-gradient">ANCE</span></span>
          </Link>

          <h1 className="text-3xl font-bold mb-2 text-center font-display">WELCOME BACK</h1>
          <p className="text-gray-400 text-center mb-8">Sign in to continue creating</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-accent/10 border border-accent/30 text-accent rounded-xl p-4 mb-6"
            >
              {error}
            </motion.div>
          )}

          <button
            onClick={handleGoogleLogin}
            className="w-full py-4 glass glass-hover rounded-xl font-semibold mb-6 flex items-center justify-center gap-3 border border-primary/30 hover:border-primary/50 transition-all group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="group-hover:text-primary transition-colors">Continue with Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark-card text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-lighter border border-primary/20 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-lighter border border-primary/20 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 btn-primary rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 glow-cyan"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-8">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:text-primary-light font-semibold transition-colors">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  )
}

