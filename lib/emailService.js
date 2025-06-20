// Email service for Locus waitlist confirmations
import { supabase } from './supabase'

export const emailService = {
  // Send welcome email to new waitlist signups
  async sendWelcomeEmail(userData) {
    try {
      // For now, simple fetch to API endpoint
      // In prod, use SendGrid, Resend, etc
      const response = await fetch('/api/send-welcome-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          cities: userData.cities,
        }),
      })

      if (!response.ok) {
        throw new Error(`Email service responded with ${response.status}`)
      }

      const result = await response.json()
      return { success: true, result }
    } catch (error) {
      console.error('Failed to send welcome email:', error)
      return { success: false, error: error.message }
    }
  },

  // Generate the email content with Locus branding
  generateWelcomeEmailContent(name, cities) {
    const subject = 'Welcome to Locus — Your Application is Under Review'
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: 'JetBrains Mono', 'Courier New', monospace; 
            background: #000000; 
            color: #ffffff; 
            margin: 0; 
            padding: 40px;
            line-height: 1.6;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #111111; 
            padding: 40px;
            border: 1px solid #333333;
          }
          .logo { 
            font-size: 2rem; 
            font-weight: 200; 
            text-align: center; 
            margin-bottom: 20px;
            letter-spacing: 8px;
          }
          .coordinates { 
            font-size: 0.7rem; 
            color: #666666; 
            text-align: center;
            margin-bottom: 30px;
          }
          .content-note { 
            font-size: 0.9rem; 
            color: #cccccc; 
            margin: 20px 0;
            line-height: 1.6;
          }
          .footer { 
            font-size: 0.7rem; 
            color: #666666; 
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #333333;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="coordinates">LOCUS.NETWORK</div>
          <div class="logo">LOCUS</div>
          
          <div class="content-note">
            Hey ${name},
          </div>
          
          <div class="content-note">
            Thanks for joining the Locus waitlist. We're building something different — a network for ambitious people who don't want to be tied down to one city.
            ${cities ? ` We see you move between ${cities}, which is exactly the kind of geographic mobility we're designed for.` : ' Your mobile lifestyle is exactly what we are building for.'}
          </div>
          
          <div class="content-note">
            We're carefully curating our initial community to ensure the right mix of ambition, authenticity, and wanderlust. Every application gets reviewed personally by our team.
          </div>
          
          <div class="content-note">
            We'll follow up soon with our decision. In the meantime, feel free to reply with any questions about what we're building.
          </div>
          
          <div class="content-note" style="margin-top: 30px; font-size: 0.8rem; color: #999999;">
            Best,<br>
            The Locus Team<br>
            <em>Building the social infrastructure for the mobile generation</em>
          </div>
          
          <div class="footer">
            This email was sent to ${cities ? `someone who frequents ${cities}` : 'a mobile professional'} who requested access to Locus.<br>
            Reply anytime with questions or thoughts.
          </div>
        </div>
      </body>
      </html>
    `

    const textContent = `
LOCUS

Hey ${name},

Thanks for joining the Locus waitlist. We're building something different — a network for ambitious people who don't want to be tied down to one city.${cities ? ` We see you move between ${cities}, which is exactly the kind of geographic mobility we're designed for.` : ' Your mobile lifestyle is exactly what we are building for.'}

We're carefully curating our initial community to ensure the right mix of ambition, authenticity, and wanderlust. Every application gets reviewed personally by our team.

We'll follow up soon with our decision. In the meantime, feel free to reply with any questions about what we're building.

Best,
The Locus Team
Building the social infrastructure for the mobile generation
    `

    return { subject, htmlContent, textContent }
  }
} 