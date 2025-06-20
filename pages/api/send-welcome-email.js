import { emailService } from '../../lib/emailService'

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

    // For dev, log the email content
    // In prod, integrate with an email service like Resend, SendGrid, etc
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 EMAIL WOULD BE SENT:')
      console.log('To:', email)
      console.log('Subject:', subject)
      console.log('Content:', textContent)
      
      return res.status(200).json({ 
        success: true, 
        message: 'Email logged to console (development mode)',
        email: { to: email, subject }
      })
    }

    // Production email sending (uncomment and configure when ready)
    /*
    // Example with Resend (install: npm install resend)
    const { Resend } = require('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const emailResult = await resend.emails.send({
      from: 'convergence@locus.app', // Your verified domain
      to: email,
      subject: subject,
      html: htmlContent,
      text: textContent,
    })
    
    return res.status(200).json({ 
      success: true, 
      message: 'Welcome email sent successfully',
      emailId: emailResult.id 
    })
    */

    // For now, return success without actually sending
    return res.status(200).json({ 
      success: true, 
      message: 'Email service not configured for production yet',
      email: { to: email, subject }
    })

  } catch (error) {
    console.error('Error sending welcome email:', error)
    return res.status(500).json({ 
      error: 'Failed to send welcome email',
      details: error.message 
    })
  }
} 