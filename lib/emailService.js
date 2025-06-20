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
    const subject = 'Convergence Matrix: Position Registered — Locus'
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: 'JetBrains Mono', 'Courier New', monospace; 
            background: #ffffff; 
            color: #000000; 
            margin: 0; 
            padding: 40px;
            line-height: 1.6;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            padding: 40px;
            border: 1px solid #e0e0e0;
          }
          .logo { 
            font-size: 2rem; 
            font-weight: 200; 
            text-align: center; 
            margin-bottom: 20px;
            letter-spacing: 8px;
            color: #000000;
          }
          .coordinates { 
            font-size: 0.7rem; 
            color: #666666; 
            text-align: center;
            margin-bottom: 30px;
          }
          .content-note { 
            font-size: 0.9rem; 
            color: #333333; 
            margin: 20px 0;
            line-height: 1.6;
          }
          .footer { 
            font-size: 0.7rem; 
            color: #666666; 
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="coordinates">LOCUS.NETWORK</div>
          <div class="logo">LOCUS</div>
          
          <div class="content-note">
            ${name},
          </div>
          
          <div class="content-note">
            Your position in the convergence matrix has been plotted.
            ${cities ? ` Movement patterns across ${cities} noted.` : ' Geographic mobility patterns noted.'}
          </div>
          
          <div class="content-note">
            We evaluate each coordinate set against our convergence criteria. Those whose trajectories align with the network's vector field will receive direct communication regarding access protocols.
          </div>
          
          <div class="content-note" style="margin-top: 30px; font-size: 0.8rem; color: #999999;">
            Under evaluation<br>
            — Locus
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

${name},

Your position in the convergence matrix has been plotted.${cities ? ` Movement patterns across ${cities} noted.` : ' Geographic mobility patterns noted.'}

We evaluate each coordinate set against our convergence criteria. Those whose trajectories align with the network's vector field will receive direct communication regarding access protocols.

Under evaluation
— Locus
    `

    return { subject, htmlContent, textContent }
  }
} 