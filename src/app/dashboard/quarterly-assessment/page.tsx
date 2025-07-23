'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, TrendingUp, DollarSign, Users, Target, Heart, Calendar, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface QuarterlyAssessmentData {
  // Financial Metrics
  current_net_worth: number
  net_worth_change: number
  monthly_revenue: number
  monthly_expenses: number
  profit_margin: number
  emergency_fund_months: number
  
  // Business Metrics
  active_customers: number
  customer_retention_rate: number
  average_rate_per_mile: number
  miles_per_month: number
  equipment_utilization: number
  
  // Personal Development
  skills_improved: string[]
  certifications_earned: string[]
  networking_events_attended: number
  mentorship_sessions: number
  
  // Health & Wellness
  health_score: number
  stress_level: number
  work_life_balance: number
  sleep_quality: number
  
  // Goals & Planning
  goals_achieved: string[]
  goals_set_for_next_quarter: string[]
  challenges_faced: string[]
  lessons_learned: string[]
  
  // Overall Assessment
  overall_satisfaction: number
  confidence_level: number
  readiness_for_next_tier: number
}

export default function QuarterlyAssessmentPage() {
  const { user, loading: authLoading } = useAuth()
  const [formData, setFormData] = useState<QuarterlyAssessmentData>({
    current_net_worth: 0,
    net_worth_change: 0,
    monthly_revenue: 0,
    monthly_expenses: 0,
    profit_margin: 0,
    emergency_fund_months: 0,
    active_customers: 0,
    customer_retention_rate: 0,
    average_rate_per_mile: 0,
    miles_per_month: 0,
    equipment_utilization: 0,
    skills_improved: [],
    certifications_earned: [],
    networking_events_attended: 0,
    mentorship_sessions: 0,
    health_score: 0,
    stress_level: 0,
    work_life_balance: 0,
    sleep_quality: 0,
    goals_achieved: [],
    goals_set_for_next_quarter: [],
    challenges_faced: [],
    lessons_learned: [],
    overall_satisfaction: 0,
    confidence_level: 0,
    readiness_for_next_tier: 0
  })
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [currentSection, setCurrentSection] = useState(0)
  const [userProgress, setUserProgress] = useState<any>(null)
  const [supabaseAvailable, setSupabaseAvailable] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const sections = [
    {
      title: 'Financial Metrics',
      icon: DollarSign,
      description: 'Track your financial progress and business performance'
    },
    {
      title: 'Business Metrics',
      icon: Users,
      description: 'Evaluate your business operations and customer relationships'
    },
    {
      title: 'Personal Development',
      icon: Target,
      description: 'Assess your skills growth and professional development'
    },
    {
      title: 'Health & Wellness',
      icon: Heart,
      description: 'Monitor your physical and mental well-being'
    },
    {
      title: 'Goals & Planning',
      icon: Calendar,
      description: 'Review achievements and set goals for the next quarter'
    },
    {
      title: 'Overall Assessment',
      icon: TrendingUp,
      description: 'Evaluate your overall satisfaction and readiness'
    }
  ]

  useEffect(() => {
    // Check if Supabase is configured
    const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    setSupabaseAvailable(!!isSupabaseConfigured)

    if (authLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    const loadUserData = async () => {
      try {
        if (isSupabaseConfigured) {
          // Get user progress
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .single()
          
          if (progressData) {
            setUserProgress(progressData)
          }

          // Check if quarterly assessment is due
          if (progressData?.next_quarterly_assessment_date) {
            const nextDue = new Date(progressData.next_quarterly_assessment_date)
            const today = new Date()
            
            if (today < nextDue) {
              const daysUntilDue = Math.ceil((nextDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
              setError(`Your next quarterly assessment is due in ${daysUntilDue} days. You can complete it early if you'd like.`)
            }
          }
        } else {
          // Mock data for testing without Supabase
          setUserProgress({
            user_id: user.id,
            current_tier: '90%',
            spi_completed: false,
            next_quarterly_assessment_date: null
          })
          setError('⚠️ Supabase not configured - running in demo mode. Your data will not be saved.')
        }

        setLoading(false)
      } catch (error) {
        console.error('Error loading user data:', error)
        setLoading(false)
      }
    }

    loadUserData()
  }, [user, authLoading, router, supabase])

  const handleInputChange = (field: keyof QuarterlyAssessmentData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayInputChange = (field: keyof QuarterlyAssessmentData, value: string) => {
    const currentArray = formData[field] as string[]
    if (value.trim()) {
      setFormData(prev => ({ 
        ...prev, 
        [field]: [...currentArray, value.trim()] 
      }))
    }
  }

  const removeArrayItem = (field: keyof QuarterlyAssessmentData, index: number) => {
    const currentArray = formData[field] as string[]
    setFormData(prev => ({ 
      ...prev, 
      [field]: currentArray.filter((_, i) => i !== index) 
    }))
  }

  const calculateTotalScore = () => {
    const financialScore = (
      (formData.profit_margin / 100) * 25 +
      (Math.min(formData.emergency_fund_months / 6, 1)) * 25 +
      (Math.min(formData.current_net_worth / 100000, 1)) * 25 +
      (Math.min(formData.net_worth_change / 10000, 1)) * 25
    ) / 4

    const businessScore = (
      (Math.min(formData.active_customers / 10, 1)) * 25 +
      (formData.customer_retention_rate / 100) * 25 +
      (Math.min(formData.average_rate_per_mile / 3, 1)) * 25 +
      (formData.equipment_utilization / 100) * 25
    ) / 4

    const personalScore = (
      (Math.min(formData.skills_improved.length / 3, 1)) * 25 +
      (Math.min(formData.certifications_earned.length / 2, 1)) * 25 +
      (Math.min(formData.networking_events_attended / 5, 1)) * 25 +
      (Math.min(formData.mentorship_sessions / 3, 1)) * 25
    ) / 4

    const healthScore = (
      (formData.health_score / 100) * 25 +
      ((100 - formData.stress_level) / 100) * 25 +
      (formData.work_life_balance / 100) * 25 +
      (formData.sleep_quality / 100) * 25
    ) / 4

    const overallScore = (
      financialScore * 0.3 +
      businessScore * 0.3 +
      personalScore * 0.2 +
      healthScore * 0.2
    )

    return Math.round(overallScore)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      if (!user) throw new Error('User not authenticated')

      const totalScore = calculateTotalScore()
      const currentDate = new Date()
      const quarter = Math.ceil((currentDate.getMonth() + 1) / 3)
      const year = currentDate.getFullYear()

      if (supabaseAvailable) {
        // Save quarterly assessment
        const { error: assessmentError } = await supabase
          .from('quarterly_assessments')
          .insert({
            user_id: user.id,
            assessment_period: `Q${quarter}` as any,
            year,
            ...formData,
            total_score: totalScore,
            tier_progress: totalScore,
            assessment_date: currentDate.toISOString()
          })

        if (assessmentError) throw assessmentError

        // Update user progress
        const { error: progressError } = await supabase
          .from('user_progress')
          .update({
            last_assessment_date: currentDate.toISOString(),
            next_quarterly_assessment_date: new Date(currentDate.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)

        if (progressError) throw progressError

        router.push('/dashboard?message=Quarterly assessment completed successfully!')
      } else {
        // Demo mode - just show success message
        alert(`Demo Mode: Assessment completed!\n\nTo save your data permanently, please set up Supabase by creating a .env.local file with your Supabase credentials.`)
        router.push('/dashboard?message=Demo: Quarterly assessment completed! (Data not saved - Supabase not configured)')
      }
    } catch (error: unknown) {
      setError((error as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const renderSection = () => {
    switch (currentSection) {
      case 0: // Financial Metrics
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Financial Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Net Worth ($)
                </label>
                <input
                  type="number"
                  value={formData.current_net_worth}
                  onChange={(e) => handleInputChange('current_net_worth', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Net Worth Change This Quarter ($)
                </label>
                <input
                  type="number"
                  value={formData.net_worth_change}
                  onChange={(e) => handleInputChange('net_worth_change', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Revenue ($)
                </label>
                <input
                  type="number"
                  value={formData.monthly_revenue}
                  onChange={(e) => handleInputChange('monthly_revenue', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Expenses ($)
                </label>
                <input
                  type="number"
                  value={formData.monthly_expenses}
                  onChange={(e) => handleInputChange('monthly_expenses', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profit Margin (%)
                </label>
                <input
                  type="number"
                  value={formData.profit_margin}
                  onChange={(e) => handleInputChange('profit_margin', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Fund (months of expenses)
                </label>
                <input
                  type="number"
                  value={formData.emergency_fund_months}
                  onChange={(e) => handleInputChange('emergency_fund_months', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>
        )

      case 1: // Business Metrics
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Business Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Active Customers
                </label>
                <input
                  type="number"
                  value={formData.active_customers}
                  onChange={(e) => handleInputChange('active_customers', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Retention Rate (%)
                </label>
                <input
                  type="number"
                  value={formData.customer_retention_rate}
                  onChange={(e) => handleInputChange('customer_retention_rate', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Average Rate per Mile ($)
                </label>
                <input
                  type="number"
                  value={formData.average_rate_per_mile}
                  onChange={(e) => handleInputChange('average_rate_per_mile', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Miles per Month
                </label>
                <input
                  type="number"
                  value={formData.miles_per_month}
                  onChange={(e) => handleInputChange('miles_per_month', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Utilization (%)
                </label>
                <input
                  type="number"
                  value={formData.equipment_utilization}
                  onChange={(e) => handleInputChange('equipment_utilization', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>
        )

      case 2: // Personal Development
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Personal Development</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills Improved
                </label>
                <div className="space-y-2">
                  {formData.skills_improved.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="flex-1 px-3 py-2 bg-gray-100 rounded-lg">{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('skills_improved', index)}
                        className="px-2 py-1 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a skill"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleArrayInputChange('skills_improved', e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        handleArrayInputChange('skills_improved', input.value)
                        input.value = ''
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications Earned
                </label>
                <div className="space-y-2">
                  {formData.certifications_earned.map((cert, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="flex-1 px-3 py-2 bg-gray-100 rounded-lg">{cert}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('certifications_earned', index)}
                        className="px-2 py-1 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a certification"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleArrayInputChange('certifications_earned', e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        handleArrayInputChange('certifications_earned', input.value)
                        input.value = ''
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Networking Events Attended
                  </label>
                  <input
                    type="number"
                    value={formData.networking_events_attended}
                    onChange={(e) => handleInputChange('networking_events_attended', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mentorship Sessions
                  </label>
                  <input
                    type="number"
                    value={formData.mentorship_sessions}
                    onChange={(e) => handleInputChange('mentorship_sessions', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3: // Health & Wellness
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Health & Wellness</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Health Score (1-100)
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={formData.health_score}
                  onChange={(e) => handleInputChange('health_score', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">{formData.health_score}/100</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stress Level (1-100)
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={formData.stress_level}
                  onChange={(e) => handleInputChange('stress_level', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">{formData.stress_level}/100</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work-Life Balance (1-100)
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={formData.work_life_balance}
                  onChange={(e) => handleInputChange('work_life_balance', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">{formData.work_life_balance}/100</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sleep Quality (1-100)
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={formData.sleep_quality}
                  onChange={(e) => handleInputChange('sleep_quality', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">{formData.sleep_quality}/100</div>
              </div>
            </div>
          </div>
        )

      case 4: // Goals & Planning
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Goals & Planning</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goals Achieved This Quarter
                </label>
                <div className="space-y-2">
                  {formData.goals_achieved.map((goal, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="flex-1 px-3 py-2 bg-green-50 rounded-lg">{goal}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('goals_achieved', index)}
                        className="px-2 py-1 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add an achieved goal"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleArrayInputChange('goals_achieved', e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        handleArrayInputChange('goals_achieved', input.value)
                        input.value = ''
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goals for Next Quarter
                </label>
                <div className="space-y-2">
                  {formData.goals_set_for_next_quarter.map((goal, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-blue-500" />
                      <span className="flex-1 px-3 py-2 bg-blue-50 rounded-lg">{goal}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('goals_set_for_next_quarter', index)}
                        className="px-2 py-1 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a goal for next quarter"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleArrayInputChange('goals_set_for_next_quarter', e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        handleArrayInputChange('goals_set_for_next_quarter', input.value)
                        input.value = ''
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Challenges Faced
                </label>
                <textarea
                  value={formData.challenges_faced.join('\n')}
                  onChange={(e) => handleInputChange('challenges_faced', e.target.value.split('\n').filter(line => line.trim()))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the main challenges you faced this quarter..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lessons Learned
                </label>
                <textarea
                  value={formData.lessons_learned.join('\n')}
                  onChange={(e) => handleInputChange('lessons_learned', e.target.value.split('\n').filter(line => line.trim()))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What key lessons did you learn this quarter?"
                />
              </div>
            </div>
          </div>
        )

      case 5: // Overall Assessment
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Overall Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Satisfaction (1-100)
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={formData.overall_satisfaction}
                  onChange={(e) => handleInputChange('overall_satisfaction', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">{formData.overall_satisfaction}/100</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confidence Level (1-100)
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={formData.confidence_level}
                  onChange={(e) => handleInputChange('confidence_level', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">{formData.confidence_level}/100</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Readiness for Next Tier (1-100)
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={formData.readiness_for_next_tier}
                  onChange={(e) => handleInputChange('readiness_for_next_tier', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">{formData.readiness_for_next_tier}/100</div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Your Quarterly Score</h4>
              <div className="text-2xl font-bold text-blue-600">{calculateTotalScore()}/100</div>
              <p className="text-sm text-blue-700 mt-1">
                This score reflects your overall progress across all dimensions this quarter.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading quarterly assessment...</div>
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
              <span className="text-xl font-bold text-gray-900">Quarterly Assessment</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quarterly Progress Review</h1>
          <p className="text-gray-600">
            Track your progress and set goals for the next quarter. This assessment helps you stay on track toward the 1%.
          </p>
          
          {error && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-sm text-yellow-800">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Progress</h2>
            <span className="text-sm text-gray-600">{currentSection + 1} of {sections.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <button
                  key={index}
                  onClick={() => setCurrentSection(index)}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    currentSection === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-xs font-medium">{section.title}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {renderSection()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentSection < sections.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentSection(currentSection + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Assessment
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  )
} 