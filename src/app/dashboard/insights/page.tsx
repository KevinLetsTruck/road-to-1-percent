'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { BarChart3, Target, TrendingUp, Calendar } from 'lucide-react'
import ShieldLogo from '@/components/ui/ShieldLogo'
import SPIRadarChart from '@/components/charts/SPIRadarChart'
import ProgressTimeline from '@/components/charts/ProgressTimeline'
import ActionPlanGenerator from '@/components/planning/ActionPlanGenerator'

type UserProgress = Database['public']['Tables']['user_progress']['Row']

export default function InsightsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
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
          setProgress(progressData)
        }
      } catch (error) {
        console.log('No progress data found, user may be new')
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

  // Calculate current SPI scores
  const currentScores = {
    financial_foundation: progress?.financial_foundation_score || 0,
    market_intelligence: progress?.market_intelligence_score || 0,
    personal_strengths: progress?.personal_strengths_score || 0,
    risk_management: progress?.risk_management_score || 0,
    support_systems: progress?.support_systems_score || 0
  }

  // Calculate target scores (example: 80% of max for each dimension)
  const targetScores = {
    financial_foundation: 28, // 80% of 35
    market_intelligence: 16,  // 80% of 20
    personal_strengths: 16,   // 80% of 20
    risk_management: 12,      // 80% of 15
    support_systems: 8        // 80% of 10
  }

  // Calculate completed assessments
  const assessments = [
    { completed: progress?.financial_foundation_completed || false },
    { completed: progress?.market_intelligence_completed || false },
    { completed: progress?.personal_strengths_completed || false },
    { completed: progress?.risk_management_completed || false },
    { completed: progress?.support_systems_completed || false }
  ]
  const completedAssessments = assessments.filter(a => a.completed).length
  const totalAssessments = assessments.length

  // Determine current tier based on progress
  const getCurrentTier = (): '90%' | '9%' | '1%' => {
    if (completedAssessments === 0) return '90%'
    if (completedAssessments < 3) return '90%'
    if (completedAssessments < 5) return '9%'
    return '1%'
  }

  const currentTier = getCurrentTier()

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
                onClick={() => router.push('/dashboard')}
                className="text-[#1e3a8a] hover:text-[#1e40af] transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push('/dashboard/progress')}
                className="text-[#1e3a8a] hover:text-[#1e40af] transition-colors"
              >
                Progress
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
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] rounded-lg shadow-lg p-8 text-white">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-8 w-8 mr-3" />
              <h1 className="text-3xl font-bold">Your Insights & Action Plan</h1>
            </div>
            <p className="text-blue-100">
              Visualize your progress and get personalized recommendations to accelerate your journey to 1%
            </p>
          </div>
        </div>

        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SPI Radar Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <Target className="h-6 w-6 text-[#1e3a8a] mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Your SPI Profile</h2>
              </div>
              <div className="flex justify-center">
                <SPIRadarChart 
                  currentScores={currentScores}
                  targetScores={targetScores}
                  size={350}
                />
              </div>
              <div className="mt-6 text-center text-sm text-gray-600">
                <p>This radar chart shows your current scores (blue) vs. target scores (orange)</p>
                <p className="mt-2">Focus on areas where you're furthest from your targets</p>
              </div>
            </div>

            {/* Progress Timeline */}
            <div>
              <ProgressTimeline
                currentTier={currentTier}
                completedAssessments={completedAssessments}
                totalAssessments={totalAssessments}
              />
            </div>
          </div>

          {/* Action Plan Generator */}
          <div className="mt-8">
            <ActionPlanGenerator 
              assessmentScores={{
                financial: currentScores.financial_foundation,
                business: currentScores.market_intelligence,
                personal: currentScores.personal_strengths,
                health: currentScores.risk_management,
                overall: Math.round((currentScores.financial_foundation + currentScores.market_intelligence + currentScores.personal_strengths + currentScores.risk_management + currentScores.support_systems) / 5)
              }}
              userTier={currentTier}
              onGeneratePlan={(plans) => {
                console.log('Action plan generated:', plans)
                // Here you could save the plan to the database
              }}
            />
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-[#1e3a8a]">
                {Math.round((currentScores.financial_foundation / 35) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Financial Foundation</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-[#1e40af]">
                {Math.round((currentScores.market_intelligence / 20) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Market Intelligence</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-[#3b82f6]">
                {Math.round((currentScores.personal_strengths / 20) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Personal Strengths</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-[#6366f1]">
                {Math.round((currentScores.risk_management / 15) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Risk Management</div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-8 bg-gradient-to-r from-[#f59e0b] to-[#d97706] rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-8 w-8 mr-3" />
              <h2 className="text-xl font-bold">Next Steps</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Complete Missing Assessments</h3>
                <p className="text-yellow-100 text-sm">
                  {completedAssessments < totalAssessments 
                    ? `You have ${totalAssessments - completedAssessments} assessments remaining`
                    : 'All assessments completed! Focus on your action plan.'
                  }
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Track Your Progress</h3>
                <p className="text-yellow-100 text-sm">
                  Revisit this page weekly to see your improvement and adjust your action plan
                </p>
              </div>
            </div>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => router.push('/dashboard/progress')}
                className="bg-white text-[#f59e0b] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Progress
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-white/20 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 