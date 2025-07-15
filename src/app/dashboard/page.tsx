'use client'
// Force redeploy and fix navigation issues
export const dynamic = "force-dynamic";
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'
import { TrendingUp, DollarSign, Brain, Target, Shield, Users } from 'lucide-react'
import ShieldLogo from '@/components/ui/ShieldLogo'
import GradientShield from '@/components/ui/GradientShield'
import { useAuth } from '@/contexts/AuthContext'

type UserProgress = Database['public']['Tables']['user_progress']['Row']

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Check admin status
  useEffect(() => {
    if (!user || authLoading) return

    const checkAdminStatus = async () => {
      try {
        const { data: userData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (userData?.is_admin === true) {
          setIsAdmin(true)
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
      }
    }

    checkAdminStatus()
  }, [user, authLoading, supabase])

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    const getUserProgress = async () => {
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

    getUserProgress()
  }, [user, authLoading, router, supabase])

  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  if (authLoading || loading) {
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
              {isAdmin && (
                <button
                  onClick={() => router.push('/admin')}
                  className="text-[#f59e0b] hover:text-[#d97706] transition-colors font-medium"
                >
                  Admin
                </button>
              )}
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
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <GradientShield width={24} height={24} />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800 font-medium">{successMessage}</p>
                  </div>
                </div>
                {userProgress?.spi_completed && (
                  <button
                    onClick={() => router.push('/dashboard/comprehensive-assessment/results')}
                    className="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    View Detailed Results
                  </button>
                )}
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

        {/* Comprehensive Assessment Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className={`rounded-lg shadow-lg p-6 ${userProgress?.spi_completed ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' : 'bg-white'}`}>
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">{userProgress?.spi_completed ? '🎉' : '📊'}</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Complete SPI Assessment</h2>
                <p className="text-gray-600">Get your comprehensive evaluation across all five dimensions</p>
              </div>
            </div>
            
            {userProgress?.spi_completed ? (
              <div className="mb-4 p-4 bg-green-100 rounded-lg border border-green-300">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Assessment Completed! 🎯
                    </h3>
                    <p className="text-sm text-green-700 mt-1">
                      Your SPI Score: <strong>{userProgress.spi_score}/100</strong> | Current Tier: <strong>{userProgress.current_tier}</strong>
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${userProgress?.spi_completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">
                    {userProgress?.spi_completed ? 'Completed' : 'Not Started'}
                  </span>
                </div>
                {userProgress?.spi_completed && (
                  <div className="text-sm text-gray-600">
                    Score: {userProgress.spi_score}/100 | Tier: {userProgress.current_tier}
                  </div>
                )}
              </div>
              <button
                onClick={() => router.push(userProgress?.spi_completed ? '/dashboard/comprehensive-assessment/results' : '/dashboard/comprehensive-assessment')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  userProgress?.spi_completed 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-[#1e3a8a] text-white hover:bg-[#1e40af]'
                }`}
              >
                {userProgress?.spi_completed ? 'View Detailed Results' : 'Take Complete Assessment'}
              </button>
            </div>
          </div>
        </div>

        {/* Individual Assessment Sections */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Individual Dimension Assessments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="font-semibold">Financial Foundation</h3>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {userProgress?.financial_foundation_completed ? 'Completed' : 'Not Started'}
                  </span>
                  {userProgress?.financial_foundation_score && (
                    <span className="text-sm font-medium">{userProgress.financial_foundation_score}/35</span>
                  )}
                </div>
                <button
                  onClick={() => router.push('/dashboard/assessments/financial-foundation')}
                  className="w-full bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  {userProgress?.financial_foundation_completed ? 'Retake' : 'Start'}
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Brain className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold">Market Intelligence</h3>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {userProgress?.market_intelligence_completed ? 'Completed' : 'Not Started'}
                  </span>
                  {userProgress?.market_intelligence_score && (
                    <span className="text-sm font-medium">{userProgress.market_intelligence_score}/20</span>
                  )}
                </div>
                <button
                  onClick={() => router.push('/dashboard/assessments/market-intelligence')}
                  className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  {userProgress?.market_intelligence_completed ? 'Retake' : 'Start'}
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Target className="w-5 h-5 text-purple-600 mr-2" />
                  <h3 className="font-semibold">Personal Strengths</h3>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {userProgress?.personal_strengths_completed ? 'Completed' : 'Not Started'}
                  </span>
                  {userProgress?.personal_strengths_score && (
                    <span className="text-sm font-medium">{userProgress.personal_strengths_score}/20</span>
                  )}
                </div>
                <button
                  onClick={() => router.push('/dashboard/assessments/personal-strengths')}
                  className="w-full bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 transition-colors"
                >
                  {userProgress?.personal_strengths_completed ? 'Retake' : 'Start'}
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Shield className="w-5 h-5 text-red-600 mr-2" />
                  <h3 className="font-semibold">Risk Management</h3>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {userProgress?.risk_management_completed ? 'Completed' : 'Not Started'}
                  </span>
                  {userProgress?.risk_management_score && (
                    <span className="text-sm font-medium">{userProgress.risk_management_score}/15</span>
                  )}
                </div>
                <button
                  onClick={() => router.push('/dashboard/assessments/risk-management')}
                  className="w-full bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  {userProgress?.risk_management_completed ? 'Retake' : 'Start'}
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 text-orange-600 mr-2" />
                  <h3 className="font-semibold">Support Systems</h3>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {userProgress?.support_systems_completed ? 'Completed' : 'Not Started'}
                  </span>
                  {userProgress?.support_systems_score && (
                    <span className="text-sm font-medium">{userProgress.support_systems_score}/10</span>
                  )}
                </div>
                <button
                  onClick={() => router.push('/dashboard/assessments/support-systems')}
                  className="w-full bg-orange-600 text-white px-3 py-2 rounded text-sm hover:bg-orange-700 transition-colors"
                >
                  {userProgress?.support_systems_completed ? 'Retake' : 'Start'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Standout Assessment Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">🎯</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Standout 2.0 Assessment</h2>
                <p className="text-gray-600">Discover your unique strengths and how to leverage them in your trucking business</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-2 ${userProgress?.standout_completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">
                    {userProgress?.standout_completed ? 'Completed' : 'Not Started'}
                  </span>
                </div>
                {userProgress?.standout_completed && (
                  <div className="text-sm text-gray-600">
                    Top Roles: {userProgress.standout_role_1} & {userProgress.standout_role_2}
                  </div>
                )}
              </div>
              <button
                onClick={() => router.push(userProgress?.standout_completed ? '/assessments/standout/results' : '/assessments/standout')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  userProgress?.standout_completed 
                    ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' 
                    : 'bg-[#f59e0b] text-white hover:bg-[#d97706]'
                }`}
              >
                {userProgress?.standout_completed ? 'Review Results' : 'Take Assessment'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}