import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from './supabase'

export default function useAdminAuth() {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // If supabase isn't configured, we can't do anything.
    if (!supabase) {
      setIsAdmin(false)
      setLoading(false)
      return
    }

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)

      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
      if (session?.user?.email === adminEmail) {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
      if (session?.user?.email === adminEmail) {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return { session, isAdmin, loading, router }
} 