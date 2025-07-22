'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, TrendingUp, Target, Calendar, Trophy, Star, CheckCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import SPIProgressChart from '@/components/charts/SPIProgressChart'

interface ProgressData {
  currentTier: string
  spiScore: number
  overallProgress: number
  assessmentsCompleted: number
  totalAssessments: number
  daysInProgram: number
  nextMilestone: string
  recentAchievements: string[]
}

export default function ProgressPage() {
  const { user, loading: authLoading } = useAuth()
  const [progressData, setProgressData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'3m' | '6m' | '1y'>('3m')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    const loadProgressData = async () => {
      try {
        const { data: userProgress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (userProgress) {
          const assessmentsCompleted = [
            userProgress.spi_completed,
            userProgress.financial_foundation_completed,
            userProgress.market_intelligence_completed,
            userProgress.personal_strengths_completed,
            userProgress.risk_management_completed,
            userProgress.support_systems_completed
          ].filter(Boolean).length

          const totalAssessments = 6
          const overallProgress = Math.round((assessmentsCompleted / totalAssessments) * 100)
          
          const startDate = new Date(userProgress.program_start_date)
          const today = new Date()
          const daysInProgram = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

          const nextMilestone = getNextMilestone(userProgress.current_tier, userProgress.spi_score || 0)

          const recentAchievements = getRecentAchievements(userProgress)

          setProgressData({
            currentTier: userProgress.current_tier,
            spiScore: userProgress.spi_score || 0,
            overallProgress,
            assessmentsCompleted,
            totalAssessments,
            daysInProgram,
            nextMilestone,
            recentAchievements
          })
        }

        setLoading(false)
      } catch (error) {
        console.error('Error loading progress data:', error)
        setLoading(false)
      }
    }

    loadProgressData()
  }, [user, authLoading, router, supabase])

  const getNextMilestone = (currentTier: string, spiScore: number): string => {
    if (currentTier === '90%') {
      if (spiScore < 70) return 'Complete comprehensive assessment'
      if (spiScore < 85) return 'Reach 85 SPI score'
      return 'Advance to 9% tier'
    } else if (currentTier === '9%') {
      if (spiScore < 85) return 'Reach 85 SPI score'
      if (spiScore < 95) return 'Reach 95 SPI score'
      return 'Advance to 1% tier'
    } else {
      return 'Maintain 1% status'
    }
  }

  const getRecentAchievements = (userProgress: any): string[] => {
    const achievements = []
    
    if (userProgress.spi_completed) {
      achievements.push('Completed comprehensive SPI assessment')
    }
    if (userProgress.financial_foundation_completed) {
      achievements.push('Completed financial foundation assessment')
    }
    if (userProgress.market_intelligence_completed) {
      achievements.push('Completed market intelligence assessment')
    }
    if (userProgress.personal_strengths_completed) {
      achievements.push('Completed personal strengths assessment')
    }
    if (userProgress.risk_management_completed) {
      achievements.push('Completed risk management assessment')
    }
    if (userProgress.support_systems_completed) {
      achievements.push('Completed support systems assessment')
    }

    return achievements.slice(-3) // Return last 3 achievements
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case '1%': return 'text-purple-600 bg-purple-50'
      case '9%': return 'text-blue-600 bg-blue-50'
      case '90%': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600'
    if (progress >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading your progress...</div>
        </div>
      </div>
    )
  }

  if (!progressData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">No progress data found. Complete your first assessment to get started.</div>
          <button
            onClick={() => router.push('/dashboard/comprehensive-assessment')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Start Assessment
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-md hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <TrendingUp className="h-8 w-8 text-indigo-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Progress Tracking</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h1>
          <p className="text-gray-600">
            Track your journey to the 1% and celebrate your achievements along the way.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(progressData.currentTier)}`}>
                {progressData.currentTier}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">Current Tier</div>
            <div className="text-sm text-gray-600">Your current level</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-blue-500" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProgressColor(progressData.spiScore)}`}>
                {progressData.spiScore}/100
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">SPI Score</div>
            <div className="text-sm text-gray-600">Success Probability Index</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                {progressData.assessmentsCompleted}/{progressData.totalAssessments}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">Assessments</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-purple-500" />
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600">
                {progressData.daysInProgram}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">Days</div>
            <div className="text-sm text-gray-600">In program</div>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Progress Over Time</h2>
            <div className="flex space-x-2">
              {(['3m', '6m', '1y'] as const).map(timeframe => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedTimeframe === timeframe
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <SPIProgressChart timeframe={selectedTimeframe} />
          </div>
        </div>

        {/* Next Milestone */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-sm p-6 mb-8 text-white">
          <div className="flex items-center mb-4">
            <Star className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-bold">Next Milestone</h2>
          </div>
          <p className="text-lg mb-2">{progressData.nextMilestone}</p>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressData.spiScore, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-blue-100 mt-2">
            {progressData.spiScore < 100 ? `${100 - progressData.spiScore} points to go` : 'Milestone achieved!'}
          </p>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Achievements</h2>
          {progressData.recentAchievements.length > 0 ? (
            <div className="space-y-3">
              {progressData.recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-green-800">{achievement}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Complete your first assessment to see achievements here.</p>
              <button
                onClick={() => router.push('/dashboard/comprehensive-assessment')}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Start Assessment
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Continue Your Journey</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard/comprehensive-assessment')}
                className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="font-medium text-blue-900">Take Comprehensive Assessment</div>
                <div className="text-sm text-blue-700">Complete your full SPI evaluation</div>
              </button>
              <button
                onClick={() => router.push('/dashboard/quarterly-assessment')}
                className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="font-medium text-green-900">Quarterly Review</div>
                <div className="text-sm text-green-700">Track your quarterly progress</div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Resources</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard/community')}
                className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="font-medium text-purple-900">Join Community</div>
                <div className="text-sm text-purple-700">Connect with other drivers</div>
              </button>
              <button
                onClick={() => router.push('/dashboard/insights')}
                className="w-full text-left p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <div className="font-medium text-orange-900">View Insights</div>
                <div className="text-sm text-orange-700">Get personalized recommendations</div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}