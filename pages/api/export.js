import { waitlistService } from '../../lib/supabase'
import { exportToCSV } from '../../lib/utils'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { data, error } = await waitlistService.getAllSignups()
    
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch signups' })
    }

    const csvData = exportToCSV(data || [])
    const filename = `locus-waitlist-${new Date().toISOString().split('T')[0]}.csv`
    
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.status(200).send(csvData)
    
  } catch (error) {
    console.error('Export error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 