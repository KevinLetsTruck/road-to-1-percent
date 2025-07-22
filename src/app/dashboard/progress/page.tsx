'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { ArrowLeft, TrendingUp, Calendar, Target, BarChart3, LineChart, Activity } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface AssessmentVersion {
  id: number
  version_number: number
  total_spi_score: number
  financial_foundation_score: number
  market_intelligence_score: number
  risk_management_score: number
  support_systems_score: number
  standout_bonus: number
  current_tier: string
  standout_strength_1: string
  standout_strength_2: string
  created_at: string
  is_current: boolean
}

export default function ProgressPage() {
  const [user, setUser] = useState<User | null>(null)
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()
  const { signOut } = useAuth()

  useEffect(() => {
    // Check for dark mode
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }
    checkDarkMode()
    
    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      // Fetch assessment history
      const { data: history, error } = await supabase
        .from('assessment_history')
        .select('*')
        .eq('user_id', user.id)
        .order('version_number', { ascending: true })

      if (!error && history) {
        setAssessmentHistory(history)
        // Set the current version as selected by default
        const currentVersion = history.find(h => h.is_current)
        if (currentVersion) {
          setSelectedVersion(currentVersion.version_number)
        }
      }

      setLoading(false)
    }

    getUser()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    )
  }

  if (!user || assessmentHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">No Assessment History</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Complete your first assessment to start tracking progress.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors shadow-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const chartData = {
    labels: assessmentHistory.map(h => 
      new Date(h.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: '2-digit'
      })
    ),
    datasets: [
      {
        label: 'Total SPI Score',
        data: assessmentHistory.map(h => h.total_spi_score),
        borderColor: isDarkMode ? 'rgb(129, 140, 248)' : 'rgb(99, 102, 241)',
        backgroundColor: isDarkMode ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        borderWidth: 3,
      },
      {
        label: 'Financial Foundation',
        data: assessmentHistory.map(h => h.financial_foundation_score),
        borderColor: isDarkMode ? 'rgb(74, 222, 128)' : 'rgb(34, 197, 94)',
        backgroundColor: isDarkMode ? 'rgba(74, 222, 128, 0.1)' : 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Market Intelligence',
        data: assessmentHistory.map(h => h.market_intelligence_score),
        borderColor: isDarkMode ? 'rgb(96, 165, 250)' : 'rgb(59, 130, 246)',
        backgroundColor: isDarkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Risk Management',
        data: assessmentHistory.map(h => h.risk_management_score),
        borderColor: isDarkMode ? 'rgb(248, 113, 113)' : 'rgb(239, 68, 68)',
        backgroundColor: isDarkMode ? 'rgba(248, 113, 113, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'Support Systems',
        data: assessmentHistory.map(h => h.support_systems_score),
        borderColor: isDarkMode ? 'rgb(251, 191, 36)' : 'rgb(251, 146, 60)',
        backgroundColor: isDarkMode ? 'rgba(251, 191, 36, 0.1)' : 'rgba(251, 146, 60, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      }
    ]
  }

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? '#e5e7eb' : '#374151',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Assessment Score Progress',
        font: {
          size: 18,
          weight: 'bold'
        },
        color: isDarkMode ? '#f3f4f6' : '#111827'
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        titleColor: isDarkMode ? '#f3f4f6' : '#111827',
        bodyColor: isDarkMode ? '#e5e7eb' : '#374151',
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 10,
          color: isDarkMode ? '#9ca3af' : '#6b7280'
        },
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb'
        }
      },
      x: {
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280'
        },
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  }

  const selectedAssessment = selectedVersion 
    ? assessmentHistory.find(h => h.version_number === selectedVersion)
    : null

  // Calculate improvements
  const firstAssessment = assessmentHistory[0]
  const latestAssessment = assessmentHistory[assessmentHistory.length - 1]
  const totalImprovement = latestAssessment.total_spi_score - firstAssessment.total_spi_score
  const percentageImprovement = ((totalImprovement / firstAssessment.total_spi_score) * 100).toFixed(1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Your Progress Journey
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your improvement over {assessmentHistory.length} assessment{assessmentHistory.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {latestAssessment.total_spi_score}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Target className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 backdrop-blur p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Improvement</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  +{totalImprovement}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 backdrop-blur p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">% Improvement</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {percentageImprovement}%
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 backdrop-blur p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Tier</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {latestAssessment.current_tier}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur p-6 rounded-xl shadow-lg mb-8 border border-gray-200 dark:border-gray-700">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Assessment History Timeline */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Assessment History
          </h2>
          
          <div className="space-y-4">
            {assessmentHistory.map((assessment, index) => (
              <div
                key={assessment.id}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedVersion === assessment.version_number
                    ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                }`}
                onClick={() => setSelectedVersion(assessment.version_number)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      Version {assessment.version_number}
                      {assessment.is_current && (
                        <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded-full font-medium">
                          Current
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(assessment.created_at).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {assessment.total_spi_score}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {assessment.current_tier} Tier
                    </p>
                  </div>
                </div>
                
                {selectedVersion === assessment.version_number && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Financial</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{assessment.financial_foundation_score}/35</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Market Intel</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{assessment.market_intelligence_score}/20</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Risk Mgmt</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{assessment.risk_management_score}/15</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Support</p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{assessment.support_systems_score}/10</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Standout Strengths</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {assessment.standout_strength_1} + {assessment.standout_strength_2}
                        <span className="text-sm text-indigo-600 dark:text-indigo-400 ml-2">
                          (+{assessment.standout_bonus} bonus)
                        </span>
                      </p>
                    </div>
                    {index > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Change from previous: 
                          <span className={`ml-2 font-semibold ${
                            assessment.total_spi_score > assessmentHistory[index - 1].total_spi_score
                              ? 'text-green-600 dark:text-green-400'
                              : assessment.total_spi_score < assessmentHistory[index - 1].total_spi_score
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {assessment.total_spi_score > assessmentHistory[index - 1].total_spi_score ? '+' : ''}
                            {assessment.total_spi_score - assessmentHistory[index - 1].total_spi_score}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/dashboard/comprehensive-assessment')}
            className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
          >
            Take New Assessment
          </button>
          <button
            onClick={() => router.push('/dashboard/comprehensive-assessment/results')}
            className="bg-gray-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
          >
            View Current Results
          </button>
        </div>
      </main>
    </div>
  )
}