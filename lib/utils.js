// Validation utilities
export const validation = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
  
  required: (value) => {
    return value && value.trim().length > 0
  },
  
  minLength: (value, min) => {
    return value && value.trim().length >= min
  }
}

// Form validation
export const validateWaitlistForm = (data) => {
  const errors = {}
  
  if (!validation.required(data.name)) {
    errors.name = 'Name is required'
  }
  
  if (!validation.email(data.email)) {
    errors.email = 'Valid email is required'
  }
  
  if (!validation.required(data.occupation)) {
    errors.occupation = 'Occupation is required'
  }
  
  // Age validation - must be between 18-25
  if (!data.age || data.age === '') {
    errors.age = 'Age is required'
  } else {
    const age = parseInt(data.age)
    if (isNaN(age) || age < 18 || age > 25) {
      errors.age = 'Age must be between 18-25'
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Data formatting utilities
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const exportToCSV = (data) => {
  const headers = ['Name', 'Email', 'Occupation', 'Age', 'University', 'Cities', 'Status', 'Created At', 'Notes']
  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      `"${row.name}"`,
      `"${row.email}"`,
      `"${row.occupation}"`,
      `"${row.age || ''}"`,
      `"${row.university || ''}"`,
      `"${row.cities || ''}"`,
      `"${row.status}"`,
      `"${formatDate(row.created_at)}"`,
      `"${row.notes || ''}"`
    ].join(','))
  ].join('\n')
  
  return csvContent
}

// UI utilities
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
} 