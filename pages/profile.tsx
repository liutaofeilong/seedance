import { useState, useEffect } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    
    setUser(user)
    setName(user.user_metadata?.name || '')
    setAvatarUrl(user.user_metadata?.avatar_url || '')
    setLoading(false)
  }

  const handleUpdateProfile = async () => {
    setError('')
    setMessage('')
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name, avatar_url: avatarUrl }
      })

      if (error) throw error
      setMessage('Profile updated successfully!')
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleChangePassword = async () => {
    setError('')
    setMessage('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error
      setMessage('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setAvatarUrl(data.publicUrl)
      setMessage('Avatar uploaded! Click Update Profile to save.')
    } catch (error: any) {
      setError(error.message)
    }
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
        <title>Profile - Seedance</title>
      </Head>

      <div className="min-h-screen">
        <Navbar />
        
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center font-display">
              MY <span className="text-gradient">PROFILE</span>
            </h1>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary/10 border border-primary/30 text-primary rounded-xl p-4 mb-6"
              >
                {message}
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-accent/10 border border-accent/30 text-accent rounded-xl p-4 mb-6"
              >
                {error}
              </motion.div>
            )}

            {/* Membership Status */}
            <div className="glass rounded-2xl p-8 mb-8 border border-primary/20">
              <h2 className="text-2xl font-bold mb-6 font-display">Membership Status</h2>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                  <span className="text-3xl">👑</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold">Free Plan</span>
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">Active</span>
                  </div>
                  <p className="text-gray-400">Upgrade to unlock unlimited video generation</p>
                  <button
                    onClick={() => router.push('/#pricing')}
                    className="mt-4 px-6 py-2 btn-primary rounded-xl font-semibold hover:scale-105 transition-all glow-cyan"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="glass rounded-2xl p-8 mb-8 border border-primary/20">
              <h2 className="text-2xl font-bold mb-6 font-display">Profile Information</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-gray-300">Avatar</label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-dark-lighter border-2 border-primary/30">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        👤
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="px-6 py-2 glass glass-hover border border-primary/30 rounded-xl font-semibold cursor-pointer inline-block transition-all"
                    >
                      Change Avatar
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-300">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-dark-lighter border border-primary/20 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-300">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-dark-lighter border border-primary/20 rounded-xl p-4 text-gray-500 cursor-not-allowed"
                />
              </div>

              <button
                onClick={handleUpdateProfile}
                className="w-full py-3 btn-primary rounded-xl font-bold hover:scale-105 transition-all glow-cyan"
              >
                Update Profile
              </button>
            </div>

            {/* Change Password */}
            <div className="glass rounded-2xl p-8 border border-primary/20">
              <h2 className="text-2xl font-bold mb-6 font-display">Change Password</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-300">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-dark-lighter border border-primary/20 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                  minLength={8}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-300">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-dark-lighter border border-primary/20 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                  minLength={8}
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={!newPassword || !confirmPassword}
                className="w-full py-3 btn-primary rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 glow-cyan"
              >
                Change Password
              </button>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </>
  )
}

