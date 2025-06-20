import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function DebugPage() {
  const [testResult, setTestResult] = useState(null)
  const [testError, setTestError] = useState(null)
  const [loading, setLoading] = useState(false)

  const isSupabaseConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const runTest = async () => {
    setLoading(true)
    setTestResult(null)
    setTestError(null)

    if (!supabase) {
      setTestError({ message: 'Supabase client is not initialized.' })
      setLoading(false)
      return
    }

    const testData = {
      name: `Test User ${new Date().getTime()}`,
      email: `test-${new Date().getTime()}@example.com`,
      occupation: 'Debugger',
    }

    try {
      const { data, error } = await supabase
        .from('waitlist_signups')
        .insert(testData)
        .select()

      if (error) {
        setTestError(error)
      } else {
        setTestResult(data)
      }
    } catch (e) {
      setTestError(e)
    } finally {
      setLoading(false)
    }
  }

  // Production configuration checks
  const productionConfig = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    isProduction: typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  }

  return (
    <div className="admin-container p-8">
      <h1 className="text-2xl mb-4">Supabase Connection Debugger</h1>
      
      {/* Production Configuration Section */}
      <div className="admin-card p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Production Magic Link Configuration</h2>
        <div className="space-y-2 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          <p>
            <span className="text-gray-400">Environment:</span>{' '}
            <span className={productionConfig.isProduction ? 'text-green-400' : 'text-yellow-400'}>
              {productionConfig.isProduction ? '🌐 PRODUCTION' : '🏠 LOCAL'}
            </span>
          </p>
          <p>
            <span className="text-gray-400">Site URL:</span>{' '}
            <span className={productionConfig.siteUrl ? 'text-green-400' : 'text-red-400'}>
              {productionConfig.siteUrl || '❌ NOT SET'}
            </span>
          </p>
          <p>
            <span className="text-gray-400">Supabase URL:</span>{' '}
            <span className={productionConfig.supabaseUrl ? 'text-green-400' : 'text-red-400'}>
              {productionConfig.supabaseUrl || '❌ NOT SET'}
            </span>
          </p>
          <p>
            <span className="text-gray-400">Admin Email:</span>{' '}
            <span className={productionConfig.adminEmail ? 'text-green-400' : 'text-red-400'}>
              {productionConfig.adminEmail || '❌ NOT SET'}
            </span>
          </p>
          {productionConfig.isProduction && productionConfig.siteUrl && (
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-600/30 rounded">
              <p className="text-blue-300 text-xs">
                ✅ Magic links will redirect to: <strong>{productionConfig.siteUrl}/admin</strong>
              </p>
              <p className="text-blue-300 text-xs mt-1">
                Make sure this URL is added to your Supabase Auth settings!
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="admin-card p-6">
        <h2 className="text-lg font-bold mb-2">Environment Status</h2>
        <p style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          Supabase Configured: {isSupabaseConfigured ? <span className="text-green-400">✅ YES</span> : <span className="text-red-400">❌ NO</span>}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          This checks if the required environment variables are present.
        </p>

        <hr className="my-6 border-gray-700" />

        <h2 className="text-lg font-bold mb-2">Database Insert Test</h2>
        <p className="text-xs text-gray-500 mb-4">
          This button attempts to directly insert a new, unique user into the `waitlist_signups` table, bypassing the main application form.
        </p>
        <button onClick={runTest} disabled={loading} className="admin-button">
          {loading ? 'Running Test...' : 'Run Insert Test'}
        </button>

        {testResult && (
          <div className="mt-4">
            <h3 className="text-green-400 font-bold">✅ Test Succeeded</h3>
            <pre className="bg-black p-2 rounded mt-2 text-xs overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}

        {testError && (
          <div className="mt-4">
            <h3 className="text-red-400 font-bold">❌ Test Failed</h3>
            <p className="text-sm">The following error was returned directly from Supabase:</p>
            <pre className="bg-black p-2 rounded mt-2 text-xs overflow-auto">
              {JSON.stringify(testError, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
} 