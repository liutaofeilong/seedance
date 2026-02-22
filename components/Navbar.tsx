import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/router'
import Logo from './Logo'

export default function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    checkUser()
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    // 生成用户头像颜色（基于邮箱）
  const getUserAvatarColor = (email: string) => {
    const colors = [
      'from-cyan-500 to-blue-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-yellow-500 to-orange-500',
    ]
    const index = email.charCodeAt(0) % colors.length
    return colors[index]
  }

  return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 glass border-b border-primary/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <Logo className="w-12 h-12" />
            </motion.div>
            <span className="text-2xl font-bold font-display tracking-wider">
              SEED<span className="text-gradient">ANCE</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/generate" className="text-gray-300 hover:text-primary transition-colors font-medium">
              Generate
            </Link>
            <Link href="/#features" className="text-gray-300 hover:text-primary transition-colors font-medium">
              Features
            </Link>
            <Link href="/#pricing" className="text-gray-300 hover:text-primary transition-colors font-medium">
              Pricing
            </Link>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl glass glass-hover border border-primary/30 transition-all"
                >
                  <div className={`w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br ${
                    user.user_metadata?.avatar_url 
                      ? '' 
                      : getUserAvatarColor(user.email || '')
                  } flex items-center justify-center shadow-lg`}>
                    {user.user_metadata?.avatar_url ? (
                      <img 
                        src={user.user_metadata.avatar_url} 
                        alt="Avatar" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="text-sm font-bold text-white">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium hidden lg:block">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full right-0 mt-2 w-56 glass border border-primary/30 rounded-xl overflow-hidden z-50 shadow-2xl"
                  >
                    <div className="px-4 py-3 border-b border-primary/10">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br ${
                          user.user_metadata?.avatar_url 
                            ? '' 
                            : getUserAvatarColor(user.email || '')
                        } flex items-center justify-center shadow-lg`}>
                          {user.user_metadata?.avatar_url ? (
                            <img 
                              src={user.user_metadata.avatar_url} 
                              alt="Avatar" 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <span className="text-base font-bold text-white">
                              {user.email?.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {user.user_metadata?.full_name || user.email?.split('@')[0]}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-3 hover:bg-white/5 transition-colors border-b border-primary/10"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Profile</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        handleSignOut()
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center gap-2 text-accent"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="px-5 py-2.5 rounded-xl glass glass-hover border border-primary/30 font-semibold transition-all"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="px-6 py-2.5 btn-primary rounded-xl font-semibold hover:scale-105 transition-all glow-cyan"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button 
            className="md:hidden p-2 rounded-lg glass border border-primary/30"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass border-t border-primary/20"
        >
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link href="/generate" className="block py-3 text-gray-300 hover:text-primary transition-colors">Generate</Link>
            <Link href="/#features" className="block py-3 text-gray-300 hover:text-primary transition-colors">Features</Link>
            <Link href="/#pricing" className="block py-3 text-gray-300 hover:text-primary transition-colors">Pricing</Link>
            {user ? (
              <>
                <Link href="/profile" className="block py-3 text-gray-300 hover:text-primary transition-colors">Profile</Link>
                <button onClick={handleSignOut} className="block py-3 text-accent font-semibold w-full text-left">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-3 text-gray-300 hover:text-primary transition-colors">Sign In</Link>
                <Link href="/signup" className="block py-3 text-primary font-semibold">Get Started</Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

