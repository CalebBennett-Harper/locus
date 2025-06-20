import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { waitlistService } from '../lib/supabase'
import { validateWaitlistForm } from '../lib/utils'
import { supabase } from '../lib/supabase'
import { emailService } from '../lib/emailService'

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    occupation: '',
    university: '',
    cities: '',
    linkedin: '',
    age: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validation = validateWaitlistForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsSubmitting(true)
    
    try {
      console.log('Submitting data:', formData);
      
      // Debug: Check current session
      const { data: session } = await supabase.auth.getSession();
      console.log('Current session:', session);
      console.log('User role:', session?.session?.user ? 'authenticated' : 'anon');
      
      const { result, error } = await waitlistService.addSignup(formData)
      
      if (error) {
        console.error('Supabase signup error:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        if (error.code === '23505') {
          toast.error('This email is already registered')
        } else {
          toast.error(`Request failed: ${error.message}`)
        }
      } else {
        // Successfully added to waitlist, now send welcome email
        try {
          console.log('Attempting to send welcome email to:', formData.email)
          const emailResult = await emailService.sendWelcomeEmail(formData)
          console.log('Email result:', emailResult)
          if (!emailResult.success) {
            console.warn('Welcome email failed to send:', emailResult.error)
            // Don't show error to user since signup was successful
          } else {
            console.log('Welcome email sent successfully!')
          }
        } catch (emailError) {
          console.error('Welcome email error:', emailError)
          // Don't show error to user since signup was successful
        }
        
        setIsSubmitted(true)
      }
    } catch (err) {
      console.error('Form submission network error:', err)
      toast.error('Network error. Check connection.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <>
        <div className="convergence-animation">
          <div className="convergence-line" style={{ '--rotation': '45deg' }}></div>
          <div className="convergence-line" style={{ '--rotation': '-30deg' }}></div>
          <div className="convergence-line" style={{ '--rotation': '70deg' }}></div>
        </div>
        
        <div className="locus-container">
          <div className="coordinates">Coordinates Registered</div>
          <div className="locus-logo">LOCUS</div>
          <div className="definition">
            /ˈloʊkəs/ noun<br />
            a particular position, point, or place where something occurs or is situated
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 400, lineHeight: 1.4, marginBottom: '32px', color: '#cccccc', letterSpacing: '-0.2px' }}>
            Your position in the convergence matrix has been plotted.
          </div>
          <div className="mathematical-note">
            We evaluate each coordinate set against our convergence criteria. Those whose trajectories align with the network's vector field will receive direct communication regarding access protocols.
          </div>
          <div className="mathematical-note" style={{ marginTop: '24px', fontSize: '0.9rem', color: '#999999' }}>
            Expected resolution timeframe: finite, optimized for signal clarity over noise reduction.
          </div>
          <div className="footer-note">
            Status: Under evaluation<br />
            Next action: Algorithmic assessment of convergence potential
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="convergence-animation">
        <div className="convergence-line" style={{ '--rotation': '45deg' }}></div>
        <div className="convergence-line" style={{ '--rotation': '-30deg' }}></div>
        <div className="convergence-line" style={{ '--rotation': '70deg' }}></div>
      </div>
      
      <div className="locus-container fade-in-sequence">
        <div className="coordinates">40.7056° N, 74.0134° W</div>
        
        <div className="locus-logo">LOCUS</div>
        
        <div className="definition">
          /ˈloʊkəs/ noun<br />
          a particular position, point, or place where something occurs or is situated
        </div>
        
        <div style={{ fontSize: '1.1rem', fontWeight: 400, lineHeight: 1.4, marginBottom: '32px', color: '#cccccc', letterSpacing: '-0.2px' }}>
          The point where ambitious paths converge.
        </div>
        
        <div className="mathematical-note">
          In mathematics, a locus is a set of all points satisfying particular conditions. Here, those conditions involve ambition, mobility, and the pursuit of authentic connection.
        </div>
        
        <div className="access-info">
          <div className="access-title">Access Parameters</div>
          <div style={{ fontSize: '0.9rem', color: '#bbbbbb', lineHeight: 1.5, marginBottom: '20px' }}>
            Curated social infrastructure for those who move between coordinates. Physical spaces. Digital community. Global network.
          </div>
          
          <ul className="criteria">
            <li>Age ∈ [18,25]</li>
            <li>Geographic mobility &gt; 0</li>
            <li>Ambition coefficient: high</li>
            <li>Social media detox attempts ≥ 1</li>
          </ul>
        </div>
        
        <div className="locus-form">
          <div className="form-title">Request Coordinates - Join Waitlist</div>
          <form onSubmit={handleSubmit}>
            {/* Core Identity */}
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleInputChange}
              className={`locus-input ${errors.name ? 'error' : ''}`}
              required
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
            
            <input
              type="number"
              name="age"
              placeholder="Age (18-25)"
              value={formData.age}
              onChange={handleInputChange}
              className={`locus-input ${errors.age ? 'error' : ''}`}
              min="18"
              max="25"
              required
            />
            {errors.age && <div className="error-text">{errors.age}</div>}
            
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              className={`locus-input ${errors.email ? 'error' : ''}`}
              required
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
            
            {/* Professional Context */}
            <input
              type="text"
              name="occupation"
              placeholder="Current role/occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              className={`locus-input ${errors.occupation ? 'error' : ''}`}
              required
            />
            {errors.occupation && <div className="error-text">{errors.occupation}</div>}
            
            <input
              type="text"
              name="university"
              placeholder="University/School (optional)"
              value={formData.university}
              onChange={handleInputChange}
              className="locus-input"
            />
            
            {/* Geographic Mobility */}
            <input
              type="text"
              name="cities"
              placeholder="Frequented cities (e.g. NYC, SF, London)"
              value={formData.cities}
              onChange={handleInputChange}
              className="locus-input"
            />
            
            {/* Professional Network */}
            <input
              type="url"
              name="linkedin"
              placeholder="LinkedIn profile URL (optional)"
              value={formData.linkedin}
              onChange={handleInputChange}
              className="locus-input"
            />
            
            <button 
              type="submit" 
              className="locus-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Request Initializing...' : 'Join Waitlist'}
            </button>
          </form>
        </div>
        
        <div className="footer-note">
          Selected candidates will receive access details<br />
          and convergence point information directly
        </div>

        <div className="admin-footer-link">
          <a href="/admin/login">System Access</a>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', opacity: 0.4 }}>
          <a 
            href="https://www.linkedin.com/company/locus-fyi/about/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: '#666666', 
              textDecoration: 'none',
              fontSize: '14px',
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '1px',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '0.4'}
          >
            [linkedin]
          </a>
        </div>
      </div>
    </>
  )
} 