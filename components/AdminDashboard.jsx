import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { waitlistService } from '../lib/supabase'
import { formatDate, exportToCSV } from '../lib/utils'
import useAdminAuth from '../lib/useAdminAuth'
import EditModal from './EditModal'

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading, router } = useAdminAuth()
  const [signups, setSignups] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [updating, setUpdating] = useState({})
  const [editingSignup, setEditingSignup] = useState(null)

  useEffect(() => {
    if (authLoading) return // Wait for authentication to complete
    if (isAdmin) {
      loadData()
    } else {
      setLoading(false)
    }
  }, [isAdmin, authLoading])

  const loadData = async () => {
    setLoading(true)
    try {
      const [signupsResult, statsResult] = await Promise.all([
        waitlistService.getAllSignups(),
        waitlistService.getStats()
      ])

      if (signupsResult.error) {
        toast.error('Failed to load signups')
      } else {
        setSignups(signupsResult.data || [])
      }

      if (statsResult.error) {
        toast.error('Failed to load statistics')
      } else {
        setStats(statsResult.stats)
      }
    } catch (error) {
      toast.error('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    setUpdating(prev => ({ ...prev, [id]: true }))
    
    try {
      const { error } = await waitlistService.updateSignupStatus(id, status)
      
      if (error) {
        toast.error('Failed to update status')
      } else {
        setSignups(prev => prev.map(signup => 
          signup.id === id ? { ...signup, status } : signup
        ))
        setStats(prev => ({
          ...prev,
          pending: prev.pending + (status === 'pending' ? 1 : -1),
          approved: prev.approved + (status === 'approved' ? 1 : -1),
          rejected: prev.rejected + (status === 'rejected' ? 1 : -1)
        }))
        toast.success(`Status updated to ${status}`)
      }
    } catch (error) {
      toast.error('Network error occurred')
    } finally {
      setUpdating(prev => ({ ...prev, [id]: false }))
    }
  }

  const handleUpdateSignup = async (updatedSignup) => {
    try {
      const { data: result, error } = await waitlistService.updateSignup(updatedSignup)

      if (error) {
        toast.error('Failed to update signup: ' + error.message)
        return
      }

      setSignups(prev => prev.map(signup =>
        signup.id === result.id ? result : signup
      ))
      
      // Reload stats in case status changed
      await loadData()
      
      toast.success('Signup updated successfully!')
    } catch (error) {
      toast.error('An error occurred while updating.')
    }
  }

  const handleDelete = async (signupToDelete) => {
    if (window.confirm(`Are you sure you want to delete the entry for ${signupToDelete.name}? This action cannot be undone.`)) {
      setUpdating(prev => ({ ...prev, [signupToDelete.id]: true }))
      try {
        const { error } = await waitlistService.deleteSignup(signupToDelete.id)

        if (error) {
          toast.error('Failed to delete signup: ' + error.message)
        } else {
          setSignups(prev => prev.filter(s => s.id !== signupToDelete.id))
          // We need to decrement the correct stat counter
          setStats(prev => {
            const newStats = { ...prev };
            newStats.total--;
            if (newStats[signupToDelete.status] > 0) {
              newStats[signupToDelete.status]--;
            }
            return newStats;
          });
          toast.success('Signup deleted successfully!')
        }
      } catch (error) {
        toast.error('An error occurred during deletion.')
      } finally {
        setUpdating(prev => ({ ...prev, [signupToDelete.id]: false }))
      }
    }
  }

  const handleExport = () => {
    const csvData = exportToCSV(filteredSignups)
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `locus-waitlist-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Waitlist exported successfully!')
  }

  const filteredSignups = signups.filter(signup => {
    const matchesSearch = 
      signup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      signup.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      signup.occupation.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || signup.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const effectiveLoading = authLoading || loading;

  if (effectiveLoading) {
    return (
      <div className="admin-container flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4 opacity-30"></div>
          <p className="text-gray-500" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>
            Initializing dashboard...
          </p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="admin-container flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="admin-card p-8">
            <h1 className="text-2xl font-weight-200 text-white mb-2" style={{ letterSpacing: '-1px' }}>
              Access Denied
            </h1>
            <p className="text-gray-400 mb-6" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>
              Authentication required for this resource.
            </p>
            <button
              onClick={() => router.push('/admin/login')}
              className="admin-button"
            >
              Go to Admin Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div style={{ fontSize: '0.75rem', color: '#333333', marginBottom: '20px', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '1px' }}>
            ADMIN.LOCUS.SYSTEM
          </div>
          <h1 className="text-3xl font-weight-200 text-white mb-2" style={{ letterSpacing: '-1px' }}>
            Administrative Interface
          </h1>
          <p className="text-gray-400" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>
            Waitlist management and convergence tracking
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="admin-card p-4">
              <div className="flex items-center">
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: '#ffffff', marginRight: '12px' }}>∑</span>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                  <p className="text-gray-400 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Total Requests</p>
                </div>
              </div>
            </div>
            
            <div className="admin-card p-4">
              <div className="flex items-center">
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: '#ffaa00', marginRight: '12px' }}>⧖</span>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.pending}</p>
                  <p className="text-gray-400 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Pending</p>
                </div>
              </div>
            </div>
            
            <div className="admin-card p-4">
              <div className="flex items-center">
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: '#00ff88', marginRight: '12px' }}>✓</span>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.approved}</p>
                  <p className="text-gray-400 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Approved</p>
                </div>
              </div>
            </div>
            
            <div className="admin-card p-4">
              <div className="flex items-center">
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: '#ff4444', marginRight: '12px' }}>✗</span>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.rejected}</p>
                  <p className="text-gray-400 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Rejected</p>
                </div>
              </div>
            </div>
            
            <div className="admin-card p-4">
              <div className="flex items-center">
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', color: '#6666ff', marginRight: '12px' }}>Δ</span>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.todaySignups}</p>
                  <p className="text-gray-400 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Today</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="admin-card p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="admin-input px-4 py-2"
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="admin-input px-4 py-2"
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <button onClick={handleExport} className="admin-button">
              <span style={{ marginRight: '8px' }}>⤓</span>
              Export Data
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="admin-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Name</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Age</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Occupation</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Cities</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>LinkedIn</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>University</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSignups.map((signup) => (
                  <tr key={signup.id} className="border-b border-gray-800">
                    <td className="py-3 px-4 text-white">{signup.name}</td>
                    <td className="py-3 px-4 text-yellow-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{signup.age || '-'}</td>
                    <td className="py-3 px-4 text-white">{signup.email}</td>
                    <td className="py-3 px-4 text-gray-300">{signup.occupation}</td>
                    <td className="py-3 px-4 text-gray-300">{signup.cities || '-'}</td>
                    <td className="py-3 px-4 text-gray-300">
                      {signup.linkedin_url ? (
                        <a href={signup.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">
                          View Profile
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-300">{signup.university || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium ${signup.status === 'approved' ? 'status-approved' : signup.status === 'rejected' ? 'status-rejected' : 'status-pending'}`} style={{ fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {signup.status === 'approved' && '✓ '}
                        {signup.status === 'rejected' && '✗ '}
                        {signup.status === 'pending' && '⧖ '}
                        {signup.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{formatDate(signup.created_at)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 items-center">
                        {signup.status !== 'approved' && (
                          <button
                            onClick={() => updateStatus(signup.id, 'approved')}
                            disabled={updating[signup.id]}
                            className="text-green-400 hover:text-green-300 p-1 rounded"
                            style={{ fontFamily: 'JetBrains Mono, monospace' }}
                            title="Approve"
                          >
                            ✓
                          </button>
                        )}
                        {signup.status !== 'rejected' && (
                          <button
                            onClick={() => updateStatus(signup.id, 'rejected')}
                            disabled={updating[signup.id]}
                            className="text-red-400 hover:text-red-300 p-1 rounded"
                            style={{ fontFamily: 'JetBrains Mono, monospace' }}
                            title="Reject"
                          >
                            ✗
                          </button>
                        )}
                        {signup.status !== 'pending' && (
                          <button
                            onClick={() => updateStatus(signup.id, 'pending')}
                            disabled={updating[signup.id]}
                            className="text-yellow-400 hover:text-yellow-300 p-1 rounded"
                            style={{ fontFamily: 'JetBrains Mono, monospace' }}
                            title="Reset to pending"
                          >
                            ⧖
                          </button>
                        )}
                        <button
                          onClick={() => setEditingSignup(signup)}
                          disabled={updating[signup.id]}
                          className="text-blue-400 hover:text-blue-300 p-1 rounded"
                          style={{ fontFamily: 'JetBrains Mono, monospace' }}
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDelete(signup)}
                          disabled={updating[signup.id]}
                          className="text-red-500 hover:text-red-400 p-1 rounded"
                          style={{ fontFamily: 'JetBrains Mono, monospace' }}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {editingSignup && (
        <EditModal 
          signup={editingSignup}
          onClose={() => setEditingSignup(null)}
          onSave={handleUpdateSignup}
        />
      )}
    </div>
  )
} 