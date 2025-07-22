'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'
import { TrendingUp, DollarSign, Brain, Target, Shield, Users, ArrowRight, CheckCircle, Clock, Star, Trophy, Calendar } from 'lucide-react'
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

  const getNextAssessment = () => {
    if (!userProgress) return null
    
    if (!userProgress.spi_completed) {
      return {
        title: 'Complete SPI Assessment',
        description: 'Start your journey with our comprehensive evaluation',
        icon: '📊',
        color: 'blue',
        path: '/dashboard/comprehensive-assessment'
      }
    }
    
    // Check if quarterly assessment is due
    if (userProgress.next_quarterly_assessment_date) {
      const nextDue = new Date(userProgress.next_quarterly_assessment_date)
      const today = new Date()
      
      if (today >= nextDue) {
        return {
          title: 'Quarterly Assessment Due',
          description: 'Time for your quarterly progress review',
          icon: '📅',
          color: 'orange',
          path: '/dashboard/quarterly-assessment'
        }
      }
    }
    
    if (!userProgress.financial_foundation_completed) {
      return {
        title: 'Financial Foundation',
        description: 'Evaluate your financial readiness',
        icon: '💰',
        color: 'green',
        path: '/dashboard/assessments/financial-foundation'
      }
    }
    
    if (!userProgress.market_intelligence_completed) {
      return {
        title: 'Market Intelligence',
        description: 'Assess your industry knowledge',
        icon: '🧠',
        color: 'purple',
        path: '/dashboard/assessments/market-intelligence'
      }
    }
    
    return {
      title: 'View Progress',
      description: 'Track your journey to the 1%',
      icon: '📈',
      color: 'indigo',
      path: '/dashboard/progress'
    }
  }

  const getTierProgress = () => {
    if (!userProgress) return { current: '90%', next: '9%', progress: 0 }
    
    const tiers = ['90%', '9%', '1%']
    const currentIndex = tiers.indexOf(userProgress.current_tier)
    const progress = userProgress.spi_score || 0
    
    return {
      current: userProgress.current_tier,
      next: currentIndex < 2 ? tiers[currentIndex + 1] : '1%',
      progress: Math.min(progress, 100)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading your dashboard...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const nextAssessment = getNextAssessment()
  const tierProgress = getTierProgress()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200">
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
              {isAdmin && (
                <button
                  onClick={() => router.push('/admin')}
                  className="text-[#f59e0b] hover:text-[#d97706] transition-colors font-medium"
                >
                  Admin
                </button>
              )}
              <span className="text-sm text-gray-700 hidden sm:block">Welcome, {user.email}</span>
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

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
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
                    View Results
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] rounded-2xl shadow-xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
                <p className="text-blue-100 text-lg">Continue your journey to the 1%</p>
              </div>
              <div className="hidden md:block">
                <GradientShield width={80} height={80} />
              </div>
            </div>
            
            {/* Tier Progress */}
            {userProgress && (
              <div className="mt-6 bg-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Your Progress</h3>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium">{tierProgress.current}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Current Tier</span>
                    <span className="font-semibold">{tierProgress.current}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${tierProgress.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Next Tier</span>
                    <span className="font-semibold">{tierProgress.next}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What would you like to do?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Next Assessment */}
            {nextAssessment && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{nextAssessment.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{nextAssessment.title}</h3>
                    <p className="text-gray-600 text-sm">{nextAssessment.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(nextAssessment.path)}
                  className="w-full bg-[#1e3a8a] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1e40af] transition-colors flex items-center justify-center"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            )}

            {/* Progress Tracking */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">📈</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Track Progress</h3>
                  <p className="text-gray-600 text-sm">View your detailed progress and insights</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/dashboard/progress')}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                View Progress
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>

            {/* Community */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">👥</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Community</h3>
                  <p className="text-gray-600 text-sm">Connect with other drivers on the journey</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/dashboard/community')}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                Join Community
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Assessment Overview */}
        {userProgress && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Assessment Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full mr-3 ${userProgress.spi_completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div>
                  <div className="font-medium text-gray-900">SPI Assessment</div>
                  <div className="text-sm text-gray-600">
                    {userProgress.spi_completed ? `Score: ${userProgress.spi_score}/100` : 'Not completed'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full mr-3 ${userProgress.financial_foundation_completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div>
                  <div className="font-medium text-gray-900">Financial Foundation</div>
                  <div className="text-sm text-gray-600">
                    {userProgress.financial_foundation_completed ? `Score: ${userProgress.financial_foundation_score}/35` : 'Not completed'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full mr-3 ${userProgress.market_intelligence_completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div>
                  <div className="font-medium text-gray-900">Market Intelligence</div>
                  <div className="text-sm text-gray-600">
                    {userProgress.market_intelligence_completed ? `Score: ${userProgress.market_intelligence_score}/20` : 'Not completed'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}