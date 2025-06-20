import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const isSupabaseConfigured = !!supabase

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!isSupabaseConfigured) {
      toast.error('Database is not configured. Cannot log in.')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      // Use production URL for magic link redirect, fallback to current origin for local dev
      const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // This tells Supabase where to send the user back after they click the magic link
          emailRedirectTo: `${redirectUrl}/admin`,
        },
      })
      if (error) throw error
      toast.success(`Login link sent to ${email}`)
    } catch (error) {
      toast.error('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-container flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-weight-200 text-white mb-2" style={{ letterSpacing: '-1px' }}>
            Admin Authentication
          </h1>
          <p className="text-gray-400" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>
            Locus System Access
          </p>
        </div>
        <div className="admin-card p-6">
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="text-gray-400" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem' }}>
                ADMIN EMAIL
              </label>
              <input
                id="email"
                type="email"
                placeholder="your-admin-email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="admin-input w-full mt-2"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !isSupabaseConfigured}
              className="admin-button w-full mt-6"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
          {!isSupabaseConfigured && (
            <p className="text-center text-red-400 mt-4" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>
              Error: Supabase not configured.
            </p>
          )}
          {message && (
            <p className="text-center text-green-400 mt-4" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 