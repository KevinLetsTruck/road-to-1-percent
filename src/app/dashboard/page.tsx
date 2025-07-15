'use client'
// Force redeploy and fix navigation issues
export const dynamic = "force-dynamic";
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { TrendingUp } from 'lucide-react'
import ShieldLogo from '@/components/ui/ShieldLogo'
import GradientShield from '@/components/ui/GradientShield'

type UserProgress = Database['public']['Tables']['user_progress']['Row']

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      
      // Get user progress
      try {
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        if (progressData) {
          setUserProgress(progressData)
        }
      } catch (error) {
        console.log('No progress data found, user may be new')
      }
      
      // Check for success message in URL
      const urlParams = new URLSearchParams(window.location.search)
      const message = urlParams.get('message')
      if (message) {
        setSuccessMessage(message)
        // Clear the URL parameter
        window.history.replaceState({}, '', '/dashboard')
      }
      
      setLoading(false)
    }
    getUser()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/')}
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <ShieldLogo width={120} height={40} className="mr-2" />
                <span className="text-xl font-bold text-[#1e3a8a]">Road to 1%</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard/progress')}
                className="text-[#1e3a8a] hover:text-[#1e40af] transition-colors"
              >
                Progress
              </button>
              <button
                onClick={() => router.push('/dashboard/insights')}
                className="text-[#1e3a8a] hover:text-[#1e40af] transition-colors"
              >
                Insights
              </button>
              <span className="text-sm text-gray-700">Welcome, {user.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-[#f59e0b] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#d97706] transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Success Message */}
        {successMessage && (
          <div className="px-4 py-6 sm:px-0 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <GradientShield width={24} height={24} />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800 font-medium">{successMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="px-4 py-6 sm:px-0">
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] rounded-lg shadow-lg p-8 text-white">
            <h1 className="text-3xl font-bold">Welcome to Road to 1%!</h1>
            <p className="mt-2 text-blue-100">You're on your journey to the 1%</p>
            
            {/* Show progress if available */}
            {userProgress && (
              <div className="mt-6 bg-white/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Your Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{userProgress.current_tier}</div>
                    <div className="text-indigo-100 text-sm">Current Tier</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {userProgress.financial_foundation_score || 0}/35
                    </div>
                    <div className="text-blue-100 text-sm">Financial Score</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      {userProgress.financial_foundation_completed ? (
                        <GradientShield width={32} height={32} />
                      ) : (
                        <div className="text-2xl">💰</div>
                      )}
                    </div>
                    <div className="text-blue-100 text-sm">Financial Foundation</div>
                  </div>
                                   <div className="text-center">
                   <div className="text-2xl font-bold">
                     {userProgress.business_track_progress}%
                   </div>
                   <div className="text-blue-100 text-sm">Business Track</div>
                 </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Show different content based on progress */}
        <div className="px-4 py-6 sm:px-0">
          {userProgress?.financial_foundation_completed ? (
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <GradientShield width={40} height={40} className="mr-3" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Great job! You've completed the Financial Foundation Assessment</h2>
                    <p className="text-gray-600">Your financial foundation is set. Here's what's next:</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => router.push('/dashboard/assessments/market-intelligence')}
                    className="bg-[#1e3a8a] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors"
                  >
                    Take Market Intelligence Assessment
                  </button>
                  <button
                    onClick={() => router.push('/dashboard/progress')}
                    className="bg-[#f59e0b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#d97706] transition-colors"
                  >
                    View Your Progress
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={() => router.push('/dashboard/assessments/financial-foundation')}
                className="bg-[#1e3a8a] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors text-lg"
              >
                Take Financial Foundation Assessment
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}