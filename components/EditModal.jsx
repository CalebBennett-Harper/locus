import { useState, useEffect } from 'react'

export default function EditModal({ signup, onClose, onSave }) {
  const [formData, setFormData] = useState(signup)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFormData(signup)
  }, [signup])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    await onSave(formData)
    setLoading(false)
    onClose()
  }

  if (!signup) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="admin-card p-6 w-full max-w-lg">
        <h2 className="text-xl mb-4">Edit Signup: {signup.name}</h2>
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
            <InputField label="Age" name="age" value={formData.age} onChange={handleChange} type="number" min="18" max="25" />
            <InputField label="Email" name="email" value={formData.email} onChange={handleChange} />
            <InputField label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} />
            <InputField label="Cities" name="cities" value={formData.cities} onChange={handleChange} />
            <InputField label="LinkedIn URL" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} />
            <InputField label="University" name="university" value={formData.university} onChange={handleChange} />
          </div>
          <div className="mt-4">
            <label className="text-gray-400 text-sm">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="admin-input w-full mt-1">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="mt-4">
            <InputField label="Notes" name="notes" value={formData.notes} onChange={handleChange} isTextarea />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="admin-button">Cancel</button>
            <button type="submit" disabled={loading} className="admin-button">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const InputField = ({ label, name, value, onChange, isTextarea = false, type = "text", min, max }) => (
  <div>
    <label className="text-gray-400 text-sm">{label}</label>
    {isTextarea ? (
      <textarea
        name={name}
        value={value || ''}
        onChange={onChange}
        className="admin-input w-full mt-1"
        rows="3"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        className="admin-input w-full mt-1"
        min={min}
        max={max}
      />
    )}
  </div>
) 