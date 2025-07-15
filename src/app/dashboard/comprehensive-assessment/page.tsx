'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { Database } from '@/types/database'
import { DollarSign, Brain, Target, Shield, Users } from 'lucide-react'
import ShieldLogo from '@/components/ui/ShieldLogo'

type UserProgress = Database['public']['Tables']['user_progress']['Row']

export default function ComprehensiveAssessmentPage() {
  const { user, loading: authLoading } = useAuth()
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Financial Foundation
    emergency_fund: '',
    debt_to_income: '',
    credit_score: '',
    insurance_coverage: '',
    retirement_savings: '',
    
    // Market Intelligence
    industry_trends: '',
    competitor_analysis: '',
    market_research: '',
    networking: '',
    
    // Personal Strengths
    leadership_skills: '',
    communication: '',
    problem_solving: '',
    adaptability: '',
    
    // Risk Management
    risk_assessment: '',
    contingency_planning: '',
    legal_compliance: '',
    
    // Support Systems
    mentorship: '',
    professional_network: ''
  })

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    const loadExistingData = async () => {
      try {
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        if (progressData) {
          setUserProgress(progressData)
          // Load existing form data if available
          if (progressData.spi_data) {
            setFormData(progressData.spi_data)
          }
        }
      } catch (error) {
        console.log('No existing progress data found')
      }
      
      setLoading(false)
    }

    loadExistingData()
  }, [user, authLoading, router, supabase])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateScore = () => {
    let totalScore = 0
    let maxScore = 0

    // Financial Foundation (35 points)
    const financialScores = {
      emergency_fund: { '0-3': 5, '3-6': 10, '6-12': 15, '12+': 20 },
      debt_to_income: { '<30%': 5, '30-50%': 3, '>50%': 1 },
      credit_score: { '300-579': 1, '580-669': 3, '670-739': 5, '740-799': 7, '800-850': 10 },
      insurance_coverage: { 'None': 0, 'Basic': 3, 'Comprehensive': 5 },
      retirement_savings: { 'None': 0, 'Some': 3, 'Well-funded': 5 }
    }

    Object.entries(financialScores).forEach(([field, scores]) => {
      const value = formData[field as keyof typeof formData]
      if (value && scores[value as keyof typeof scores]) {
        totalScore += scores[value as keyof typeof scores]
      }
      maxScore += Math.max(...Object.values(scores))
    })

    return { totalScore, maxScore }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { totalScore, maxScore } = calculateScore()
      const spiScore = Math.round((totalScore / maxScore) * 100)
      
      // Determine tier based on score
      let currentTier = 'Beginner'
      if (spiScore >= 80) currentTier = 'Elite'
      else if (spiScore >= 60) currentTier = 'Advanced'
      else if (spiScore >= 40) currentTier = 'Intermediate'

      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user!.id,
          spi_completed: true,
          spi_score: spiScore,
          spi_data: formData,
          current_tier: currentTier,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      // Send completion email
      try {
        await fetch('/api/email/assessment-completion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user!.email,
            score: spiScore,
            tier: currentTier
          })
        })
      } catch (emailError) {
        console.log('Email notification failed:', emailError)
      }

      router.push('/dashboard?message=Assessment completed successfully! Your SPI score is ' + spiScore + '/100')
    } catch (error) {
      console.error('Error saving assessment:', error)
      alert('Error saving assessment. Please try again.')
    } finally {
      setSubmitting(false)
    }
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

  const { totalScore, maxScore } = calculateScore()
  const liveScore = Math.round((totalScore / maxScore) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <ShieldLogo width={120} height={40} className="mr-2" />
                <span className="text-xl font-bold text-[#1e3a8a]">Road to 1%</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user.email}</span>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-[#f59e0b] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#d97706] transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Comprehensive SPI Assessment</h1>
              <p className="text-gray-600 mt-2">Complete this assessment to get your Strategic Performance Index (SPI) score</p>
            </div>

            {/* Live Score Display */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Live SPI Score</h3>
                  <p className="text-blue-700">Your current score based on answers</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{liveScore}/100</div>
                  <div className="text-sm text-blue-600">SPI Score</div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Financial Foundation Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Financial Foundation (35 points)
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How many months of expenses do you have saved in your emergency fund?
                    </label>
                    <select
                      value={formData.emergency_fund}
                      onChange={(e) => handleInputChange('emergency_fund', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select an option</option>
                      <option value="0-3">0-3 months</option>
                      <option value="3-6">3-6 months</option>
                      <option value="6-12">6-12 months</option>
                      <option value="12+">12+ months</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What is your debt-to-income ratio?
                    </label>
                    <select
                      value={formData.debt_to_income}
                      onChange={(e) => handleInputChange('debt_to_income', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select an option</option>
                      <option value="<30%">Less than 30%</option>
                      <option value="30-50%">30-50%</option>
                      <option value=">50%">More than 50%</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Processing...' : 'Complete Assessment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
} 