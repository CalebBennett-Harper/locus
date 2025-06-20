import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if valid environment variables are provided
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://')) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database helper functions
export const waitlistService = {
  // Add a new signup to the waitlist
  async addSignup(data) {
    if (!supabase) {
      return { result: null, error: { message: 'Database not configured' } }
    }
    
    // Debug logging for RLS issues
    console.log('Attempting signup with data:', {
      name: data.name,
      email: data.email,
      age: data.age
    })
    
    // Try direct Supabase insert first
    const { data: result, error } = await supabase
      .from('waitlist_signups')
      .insert([
        {
          name: data.name,
          email: data.email,
          occupation: data.occupation,
          age: parseInt(data.age),
          university: data.university || null,
          cities: data.cities || null,
          linkedin_url: data.linkedin || null,
        }
      ])
      .select()

    if (error) {
      console.error('Supabase insert error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      
      // If RLS error, try API endpoint fallback
      if (error.message.includes('row level security') || error.message.includes('policy')) {
        console.log('RLS error detected, trying API fallback...')
        try {
          const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: data.name,
              email: data.email,
              occupation: data.occupation,
              age: data.age,
              university: data.university,
              cities: data.cities,
              linkedin: data.linkedin,
            }),
          })
          
          const apiResult = await response.json()
          
          if (response.ok) {
            console.log('API fallback successful!')
            return { result: apiResult.result, error: null }
          } else {
            console.error('API fallback failed:', apiResult.error)
            return { result: null, error: apiResult }
          }
        } catch (apiError) {
          console.error('API fallback exception:', apiError)
          return { result: null, error }
        }
      }
    }

    return { result, error }
  },

  // Get all signups (admin only)
  async getAllSignups() {
    if (!supabase) {
      return { data: [], error: { message: 'Database not configured' } }
    }
    
    const { data, error } = await supabase
      .from('waitlist_signups')
      .select('*')
      .order('created_at', { ascending: false })

    return { data, error }
  },

  // Update signup status
  async updateSignupStatus(id, status, notes = null) {
    if (!supabase) {
      return { data: null, error: { message: 'Database not configured' } }
    }
    
    const updateData = { status }
    if (notes) updateData.notes = notes

    const { data, error } = await supabase
      .from('waitlist_signups')
      .update(updateData)
      .eq('id', id)
      .select()

    return { data, error }
  },

  // Update a full signup record
  async updateSignup(signupData) {
    if (!supabase) {
      return { data: null, error: { message: 'Database not configured' } };
    }

    const { id, ...updateData } = signupData;
    // Don't try to update created_at or the id itself
    delete updateData.created_at; 

    const { data, error } = await supabase
      .from('waitlist_signups')
      .update(updateData)
      .eq('id', id)
      .select()
      .single(); // Ensure we get a single object back

    return { data, error };
  },

  // Delete a signup
  async deleteSignup(id) {
    if (!supabase) {
      return { error: { message: 'Database not configured' } };
    }

    const { error } = await supabase
      .from('waitlist_signups')
      .delete()
      .eq('id', id);

    return { error };
  },

  // Get signup statistics
  async getStats() {
    if (!supabase) {
      return { stats: { total: 0, pending: 0, approved: 0, rejected: 0, todaySignups: 0 }, error: { message: 'Database not configured' } }
    }
    
    const { data, error } = await supabase
      .from('waitlist_signups')
      .select('status, created_at')

    if (error) return { stats: null, error }

    const stats = {
      total: data.length,
      pending: data.filter(item => item.status === 'pending').length,
      approved: data.filter(item => item.status === 'approved').length,
      rejected: data.filter(item => item.status === 'rejected').length,
      todaySignups: data.filter(item => {
        const today = new Date().toDateString()
        const signupDate = new Date(item.created_at).toDateString()
        return today === signupDate
      }).length
    }

    return { stats, error: null }
  }
} 