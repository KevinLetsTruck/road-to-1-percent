'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { TrendingUp, ArrowRight, CheckCircle, Award, Target, BarChart3 } from 'lucide-react'
import ShieldLogo from '@/components/ui/ShieldLogo'
import GradientShield from '@/components/ui/GradientShield'

type UserProgress = Database['public']['Tables']['user_progress']['Row']

export default function ProgressPage() {
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

  const assessments = [
    {
      id: 'financial-foundation',
      name: 'Financial Foundation',
      description: 'Strategic Planning, Investment & Financial Management',
      completed: progress?.financial_foundation_completed || false,
      score: progress?.financial_foundation_score || 0,
      path: '/dashboard/assessments/financial-foundation',
      icon: '💰'
    },
    {
      id: 'market-intelligence',
      name: 'Market Intelligence',
      description: 'Industry Knowledge, Market Trends & Competitive Analysis',
      completed: progress?.market_intelligence_completed || false,
      score: progress?.market_intelligence_score || 0,
      path: '/dashboard/assessments/market-intelligence',
      icon: '📊'
    },
    {
      id: 'personal-strengths',
      name: 'Personal Strengths',
      description: 'Leadership, Communication & Personal Development',
      completed: progress?.personal_strengths_completed || false,
      score: progress?.personal_strengths_score || 0,
      path: '/dashboard/assessments/personal-strengths',
      icon: '💪'
    },
    {
      id: 'risk-management',
      name: 'Risk Tolerance',
      description: 'Personal Risk Tolerance & Business Comfort Level',
      completed: progress?.risk_management_completed || false,
      score: progress?.risk_management_score || 0,
      path: '/dashboard/assessments/risk-management',
      icon: '🛡️'
    },
    {
      id: 'support-systems',
      name: 'Support Systems',
      description: 'Customer Service, Networking & Support Infrastructure',
      completed: progress?.support_systems_completed || false,
      score: progress?.support_systems_score || 0,
      path: '/dashboard/assessments/support-systems',
      icon: '🤝'
    }
  ]

  const completedAssessments = assessments.filter(a => a.completed).length
  const totalAssessments = assessments.length
  const progressPercentage = Math.round((completedAssessments / totalAssessments) * 100)

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
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] rounded-lg shadow-lg p-8 text-white">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-8 w-8 mr-3" />
              <h1 className="text-3xl font-bold">Your Progress</h1>
            </div>
            <p className="text-blue-100 mb-6">Track your journey to becoming part of the 1%</p>
            
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{progressPercentage}%</div>
                <div className="text-blue-100 text-sm">Overall Progress</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{completedAssessments}</div>
                <div className="text-blue-100 text-sm">Completed</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{totalAssessments - completedAssessments}</div>
                <div className="text-blue-100 text-sm">Remaining</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{progress?.current_tier || 'Bronze'}</div>
                <div className="text-blue-100 text-sm">Current Tier</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-3 mb-4">
              <div 
                className="bg-[#f59e0b] h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Assessment List */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Assessment Progress</h2>
            <div className="space-y-4">
              {assessments.map((assessment) => (
                <div 
                  key={assessment.id}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    assessment.completed 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 hover:border-[#1e3a8a] hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                                         <div className="flex items-center">
                       <div className="text-2xl mr-3">{assessment.icon}</div>
                       {assessment.completed ? (
                         <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                       ) : (
                         <div className="h-6 w-6 rounded-full border-2 border-gray-300 mr-3"></div>
                       )}
                       <div>
                         <h3 className={`font-semibold ${
                           assessment.completed ? 'text-green-800' : 'text-gray-900'
                         }`}>
                           {assessment.name}
                         </h3>
                         <p className={`text-sm ${
                           assessment.completed ? 'text-green-600' : 'text-gray-600'
                         }`}>
                           {assessment.description}
                         </p>
                         {assessment.completed && assessment.score > 0 && (
                           <div className="mt-1">
                             <div className="flex items-center">
                               <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                 <div 
                                   className="bg-[#f59e0b] h-2 rounded-full"
                                   style={{ width: `${assessment.score}%` }}
                                 ></div>
                               </div>
                               <span className="text-xs text-gray-600">{assessment.score}%</span>
                             </div>
                           </div>
                         )}
                       </div>
                     </div>
                     <div className="flex items-center">
                       {assessment.completed ? (
                         <div className="text-right">
                           <span className="text-green-600 font-medium">Completed</span>
                           {assessment.score > 0 && (
                             <div className="text-sm text-gray-600">Score: {assessment.score}%</div>
                           )}
                         </div>
                       ) : (
                         <button
                           onClick={() => router.push(assessment.path)}
                           className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1e40af] transition-colors flex items-center"
                         >
                           Start
                           <ArrowRight className="h-4 w-4 ml-1" />
                         </button>
                       )}
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next Steps */}
        {completedAssessments > 0 && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center mb-4">
                <Award className="h-8 w-8 mr-3" />
                <h2 className="text-xl font-bold">Next Steps</h2>
              </div>
              <p className="mb-4">Great progress! Keep moving forward to reach the 1%.</p>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-white text-[#f59e0b] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}