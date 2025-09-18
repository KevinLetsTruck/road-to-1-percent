'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Shield, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function VerifyUsersPage() {
  const { user, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    const checkAdminAccess = async () => {
      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (!profile?.is_admin) {
        router.push('/dashboard')
        return
      }

      setIsAdmin(true)
    }

    checkAdminAccess()
  }, [user, authLoading, router, supabase])

  const handleVerifyUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/verify-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`✅ User ${email} verified successfully!`)
        setEmail('')
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className="text-lg text-gray-400">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Navigation */}
      <nav className="bg-gray-900/50 backdrop-blur-sm shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-md hover:bg-gray-800 text-gray-400 hover:text-gray-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Shield className="h-8 w-8 text-orange-500 mr-2" />
              <span className="text-xl font-bold text-gray-100">Admin - Verify Users</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-100 mb-2">Manual User Verification</h1>
            <p className="text-gray-400">
              Use this tool to manually verify users who are having trouble with email confirmation.
              This will allow them to log in immediately.
            </p>
          </div>
          
          <form onSubmit={handleVerifyUser} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                User Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="user@example.com"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Enter the email address of the user who needs verification
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Verifying...' : 'Verify User'}
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-xl text-sm ${
              message.includes('✅') 
                ? 'bg-green-900/20 border border-green-800 text-green-400' 
                : 'bg-red-900/20 border border-red-800 text-red-400'
            }`}>
              <div className="flex items-center">
                {message.includes('✅') ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2" />
                )}
                <span>{message}</span>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-900 rounded-xl border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-2">How it works:</h3>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• This bypasses the email confirmation requirement</li>
              <li>• The user will be able to log in immediately after verification</li>
              <li>• Use this only for users you trust or have verified through other means</li>
              <li>• This action cannot be undone</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
} 