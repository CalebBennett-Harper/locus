import { createClient } from '@supabase/supabase-js'

// Use service role key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, email, occupation, age, university, cities, linkedin } = req.body

    if (!name || !email || !occupation || !age) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Insert using service role (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('waitlist_signups')
      .insert([
        {
          name,
          email,
          occupation,
          age: parseInt(age),
          university: university || null,
          cities: cities || null,
          linkedin_url: linkedin || null,
        }
      ])
      .select()

    if (error) {
      console.error('Signup API error:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ result: data, error: null })

  } catch (err) {
    console.error('Signup API exception:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
} 