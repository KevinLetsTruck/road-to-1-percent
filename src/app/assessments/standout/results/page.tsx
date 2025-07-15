'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { Database } from '@/types/database'

type UserProgress = Database['public']['Tables']['user_progress']['Row']

export default function StandoutResultsPage() {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUserProgress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data: progress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (!progress || !progress.standout_completed) {
          router.push('/assessments/standout')
          return
        }

        setUserProgress(progress)
      } catch (error) {
        console.error('Error fetching progress:', error)
        router.push('/assessments/standout')
      } finally {
        setLoading(false)
      }
    }

    getUserProgress()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!userProgress) {
    return null
  }

  const roleDescriptions: Record<string, string> = {
    'Pioneer': 'You are innovative and love to explore new opportunities. You thrive on creating new solutions and pushing boundaries.',
    'Influencer': 'You have a natural ability to inspire and motivate others. You excel at building relationships and creating positive change.',
    'Stimulator': 'You bring energy and enthusiasm to every situation. You help others see possibilities and get excited about new ideas.',
    'Advisor': 'You provide wise counsel and thoughtful guidance. You help others make better decisions through your insights.',
    'Connector': 'You excel at bringing people together and building networks. You create opportunities through your relationships.',
    'Provider': 'You are reliable and take care of others\' needs. You ensure everyone has what they need to succeed.',
    'Equalizer': 'You create balance and fairness in situations. You help resolve conflicts and ensure everyone is heard.',
    'Teacher': 'You love to share knowledge and help others learn. You make complex concepts easy to understand.',
    'Creator': 'You have a unique ability to bring ideas to life. You turn vision into reality through your creative talents.',
    'Other': 'You have unique strengths that don\'t fit neatly into other categories. Your versatility is your superpower.'
  }

  const role1 = userProgress.standout_role_1 || 'Unknown'
  const role2 = userProgress.standout_role_2 || 'Unknown'

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Standout 2.0 Assessment Complete!</h1>
            <p className="text-gray-600">Here are your unique strengths and how to leverage them in your trucking business</p>
          </div>

          {/* Score */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {userProgress.standout_score}/10
              </div>
              <div className="text-blue-800 font-medium">Your Standout Score</div>
            </div>
          </div>

          {/* Top Roles */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Primary Role: {role1}</h3>
                <p className="text-gray-700">{roleDescriptions[role1] || 'This role represents your primary strength and how you naturally approach challenges.'}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Secondary Role: {role2}</h3>
                <p className="text-gray-700">{roleDescriptions[role2] || 'This role represents your secondary strength and complements your primary role.'}</p>
              </div>
            </div>

          {/* How to Leverage in Trucking */}
          <div className="bg-yellow-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">How to Leverage These Strengths in Your Trucking Business</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-yellow-500 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <strong>Business Development:</strong> Use your {role1.toLowerCase()} strengths to identify new opportunities and your {role2.toLowerCase()} abilities to build lasting relationships with clients.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-yellow-500 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <strong>Team Management:</strong> Leverage your natural leadership style to build a strong team that complements your strengths and fills any gaps.
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-yellow-500 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <strong>Problem Solving:</strong> Approach challenges using your unique combination of {role1.toLowerCase()} and {role2.toLowerCase()} perspectives.
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => router.push('/dashboard/progress')}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              View Full Progress
            </button>
          </div>
        </div>
      </main>
    </div>
  )
} 