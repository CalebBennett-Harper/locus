import { emailService } from '../../lib/emailService'
import { Resend } from 'resend'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, email, cities } = req.body

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' })
    }

    // Generate email content
    const { subject, htmlContent, textContent } = emailService.generateWelcomeEmailContent(name, cities)

    // In development, just log the email
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 EMAIL WOULD BE SENT (Dev Mode):')
      console.log('To:', email)
      console.log('Subject:', subject)
      console.log('Content:', textContent)
      
      return res.status(200).json({ 
        success: true, 
        message: 'Email logged to console (development mode)',
        email: { to: email, subject }
      })
    }

    // Production: Use Resend to actually send the email
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return res.status(500).json({ error: 'Email service not configured' })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const emailResult = await resend.emails.send({
      from: 'Locus <hello@locus.fyi>', // Using your domain for better deliverability
      to: email,
      subject: subject,
      html: htmlContent,
      text: textContent,
      headers: {
        'X-Entity-ID': 'locus-waitlist-confirmation',
        'X-Priority': '3',
        'Reply-To': 'hello@locus.fyi'
      }
    })

    console.log('✅ Email sent successfully:', emailResult)

    return res.status(200).json({ 
      success: true, 
      message: 'Welcome email sent successfully',
      email: {
        to: email,
        subject: subject,
        id: emailResult.data?.id
      }
    })

  } catch (error) {
    console.error('❌ Email sending error:', error)
    return res.status(500).json({ 
      error: 'Failed to send welcome email',
      details: error.message 
    })
  }
} 