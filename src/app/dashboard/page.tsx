'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { TrendingUp, ArrowRight, CheckCircle } from 'lucide-react'

type UserProgress = Database['public']['Tables']['user_progress']['Row']

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check for a message in the URL
    const params = new URLSearchParams(window.location.search);
    const message = params.get('message');
    if (message) {
      setSuccessMessage(decodeURIComponent(message));
      // Optionally, remove the message from the URL after showing it
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }
      
      setUser(user)
      
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      setProgress(progressData)
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

  if (!user || !progress) {
    return null
  }

  // Define assessments by track
  const businessExcellence = [
    { name: 'SPI Financial Assessment', completed: progress.spi_completed, route: '/assessments/spi', description: 'Evaluates financial health and stability', time: '30 min' },
    { name: 'Customer Service Excellence', completed: progress.customer_service_completed, route: '/assessments/customer-service', description: 'Assess communication and service quality', time: '25 min' },
    { name: 'Operational Efficiency', completed: progress.operational_completed, route: '/assessments/operational', description: 'Measure route planning and process optimization', time: '30 min' },
  ]
  const personalDevelopment = [
    { name: 'Leadership Readiness', completed: progress.leadership_completed, route: '/assessments/leadership', description: 'Evaluate self-management and influence potential', time: '30 min' },
    { name: 'Standout 2.0 Assessment', completed: progress.standout_completed, route: '/assessments/standout', description: 'Measures entrepreneurial fit and self-awareness', time: '15 min' },
  ]
  const healthOptimization = [
    { name: 'Health & Wellness', completed: progress.health_completed, route: '/assessments/health', description: 'Baseline physical and mental health evaluation', time: '20 min' },
  ]

  // Calculate progress using all assessments
  const allAssessments = [
    ...businessExcellence,
    ...personalDevelopment,
    ...healthOptimization,
  ]
  const completedCount = allAssessments.filter(a => a.completed).length
  const totalAssessments = allAssessments.length
  const progressPercentage = (completedCount / totalAssessments) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-indigo-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Road to 1%</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 text-white mb-8">
            <h1 className="text-3xl font-bold">Welcome to Road to 1%!</h1>
            <p className="mt-2 text-indigo-100">You're on your journey to the 1%</p>
          </div>

          {/* Results & Recommendations Button */}
          <div className="mb-8 flex justify-end">
            <button
              onClick={() => router.push('/results')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-lg shadow"
            >
              View Results & Recommendations
            </button>
          </div>

          {/* Progress Overview */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
              <span className="text-lg font-semibold text-indigo-600">
                {completedCount} of {totalAssessments} completed
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            <p className="text-gray-600">
              {progressPercentage === 100 
                ? "🎉 Congratulations! You&apos;ve completed all assessments!" 
                : `Keep going! You&apos;re ${Math.round(progressPercentage)}% of the way there.`
              }
            </p>
          </div>

          {/* Assessments List by Track */}
          <div className="space-y-10 mt-8">
            {/* Business Excellence */}
            <div>
              <h2 className="text-xl font-bold text-indigo-700 mb-4">Business Excellence</h2>
              <div className="space-y-4">
                {businessExcellence.map((assessment, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      assessment.completed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div>
                      <h3 className={`font-semibold ${assessment.completed ? 'text-green-800' : 'text-gray-900'}`}>{assessment.name}</h3>
                      <p className="text-sm text-gray-600">{assessment.description}</p>
                      <span className="text-xs text-gray-400">Estimated time: {assessment.time}</span>
                    </div>
                    {assessment.completed ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">Done</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => router.push(assessment.route)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Take Assessment
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Personal Development */}
            <div>
              <h2 className="text-xl font-bold text-purple-700 mb-4">Personal Development</h2>
              <div className="space-y-4">
                {personalDevelopment.map((assessment, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      assessment.completed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div>
                      <h3 className={`font-semibold ${assessment.completed ? 'text-green-800' : 'text-gray-900'}`}>{assessment.name}</h3>
                      <p className="text-sm text-gray-600">{assessment.description}</p>
                      <span className="text-xs text-gray-400">Estimated time: {assessment.time}</span>
                    </div>
                    {assessment.completed ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">Done</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => router.push(assessment.route)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Take Assessment
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Health Optimization */}
            <div>
              <h2 className="text-xl font-bold text-green-700 mb-4">Health Optimization</h2>
              <div className="space-y-4">
                {healthOptimization.map((assessment, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      assessment.completed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div>
                      <h3 className={`font-semibold ${assessment.completed ? 'text-green-800' : 'text-gray-900'}`}>{assessment.name}</h3>
                      <p className="text-sm text-gray-600">{assessment.description}</p>
                      <span className="text-xs text-gray-400">Estimated time: {assessment.time}</span>
                    </div>
                    {assessment.completed ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">Done</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => router.push(assessment.route)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Take Assessment
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}