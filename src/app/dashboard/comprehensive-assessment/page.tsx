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
    // Standout Assessment
    standout_role_1: '',
    standout_role_2: '',
    
    // Net Worth Calculator
    net_worth: 0,
    
    // Budget Calculator
    monthly_income: 0,
    monthly_expenses: 0,
    monthly_savings: 0,
    
    // Financial Foundation
    financial_emergency_fund: 0,
    financial_budget_tracking: 0,
    financial_debt_management: 0,
    financial_investment_strategy: 0,
    financial_insurance_coverage: 0,
    
    // Market Intelligence
    market_industry_trends: 0,
    market_competitor_analysis: 0,
    market_customer_research: 0,
    market_technology_adoption: 0,
    
    // Personal Strengths
    personal_leadership_skills: 0,
    personal_communication_abilities: 0,
    personal_problem_solving: 0,
    personal_adaptability: 0,
    
    // Risk Management
    risk_identification: 0,
    risk_mitigation_strategies: 0,
    risk_insurance_planning: 0,
    
    // Support Systems
    support_mentorship: 0,
    support_networking: 0
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    const loadUserProgress = async () => {
      try {
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        if (progressData) {
          setUserProgress(progressData)
          // Load existing form data if available
          if (progressData.standout_role_1) {
            setFormData(prev => ({
              ...prev,
              standout_role_1: progressData.standout_role_1 || '',
              standout_role_2: progressData.standout_role_2 || '',
              net_worth: progressData.net_worth || 0,
              monthly_income: progressData.monthly_income || 0,
              monthly_expenses: progressData.monthly_expenses || 0,
              monthly_savings: progressData.monthly_savings || 0
            }))
          }
        }
      } catch (error) {
        console.log('No progress data found, user may be new')
      }
      
      setLoading(false)
    }

    loadUserProgress()
  }, [user, authLoading, router, supabase])

  const calculateTotalSPIScore = () => {
    const financialScore = 
      formData.financial_emergency_fund +
      formData.financial_budget_tracking +
      formData.financial_debt_management +
      formData.financial_investment_strategy +
      formData.financial_insurance_coverage

    const marketScore = 
      formData.market_industry_trends +
      formData.market_competitor_analysis +
      formData.market_customer_research +
      formData.market_technology_adoption

    const personalScore = 
      formData.personal_leadership_skills +
      formData.personal_communication_abilities +
      formData.personal_problem_solving +
      formData.personal_adaptability

    const riskScore = 
      formData.risk_identification +
      formData.risk_mitigation_strategies +
      formData.risk_insurance_planning

    const supportScore = 
      formData.support_mentorship +
      formData.support_networking

    return financialScore + marketScore + personalScore + riskScore + supportScore
  }

  const getSPITier = (score: number) => {
    if (score >= 80) return 'Elite'
    if (score >= 60) return 'Advanced'
    if (score >= 40) return 'Intermediate'
    if (score >= 20) return 'Beginner'
    return 'Novice'
  }

  const getStrengthCombination = () => {
    if (formData.standout_role_1 && formData.standout_role_2) {
      return `${formData.standout_role_1} + ${formData.standout_role_2}`
    }
    return formData.standout_role_1 || 'Not specified'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      if (!user) throw new Error('User not authenticated')

      const totalScore = calculateTotalSPIScore()
      const tier = getSPITier(totalScore)
      const strengthCombo = getStrengthCombination()

      // Save to user_progress table (this should work even if some columns don't exist yet)
      const { error: progressError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          standout_role_1: formData.standout_role_1,
          standout_role_2: formData.standout_role_2,
          net_worth: formData.net_worth,
          monthly_income: formData.monthly_income,
          monthly_expenses: formData.monthly_expenses,
          monthly_savings: formData.monthly_savings,
          spi_completed: true,
          spi_score: totalScore,
          current_tier: tier,
          standout_completed: true,
          updated_at: new Date().toISOString()
        })

      if (progressError) {
        console.error('Progress save error:', progressError)
        // Continue anyway - the main functionality should still work
      }

      // Try to save detailed assessment data (optional)
      try {
        await supabase
          .from('comprehensive_assessments')
          .insert({
            user_id: user.id,
            ...formData,
            total_score: totalScore,
            current_tier: tier,
            assessment_date: new Date().toISOString()
          })
      } catch (assessmentError) {
        console.log('Detailed assessment save failed (table may not exist yet):', assessmentError)
      }

      // Send completion email
      try {
        await fetch('/api/email/assessment-completion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            spiScore: totalScore,
            tier,
            strengthCombination: strengthCombo
          })
        })
      } catch (emailError) {
        console.log('Email send failed:', emailError)
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard?message=Assessment completed successfully! Your SPI score has been calculated.')
      }, 2000)

    } catch (error) {
      console.error('Submit error:', error)
      setError('Failed to submit assessment. Please try again.')
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

  const currentScore = calculateTotalSPIScore()

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
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="text-3xl mr-3">📊</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Comprehensive SPI Assessment</h1>
                <p className="text-gray-600">Complete evaluation across all five dimensions</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800">Assessment completed successfully! Redirecting to dashboard...</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Standout Assessment Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 Standout 2.0 Assessment</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 mb-2">
                    <strong>Step 1:</strong> Take the Standout 2.0 assessment to discover your unique strengths.
                  </p>
                  <a
                    href="https://standout.tmbc.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Take Standout Assessment →
                  </a>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Top Strength (Role 1)
                    </label>
                    <select
                      value={formData.standout_role_1}
                      onChange={(e) => setFormData(prev => ({ ...prev, standout_role_1: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select your top strength</option>
                      <option value="Advisor">Advisor</option>
                      <option value="Connector">Connector</option>
                      <option value="Creator">Creator</option>
                      <option value="Equalizer">Equalizer</option>
                      <option value="Influencer">Influencer</option>
                      <option value="Pioneer">Pioneer</option>
                      <option value="Provider">Provider</option>
                      <option value="Stimulator">Stimulator</option>
                      <option value="Teacher">Teacher</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Second Strength (Role 2)
                    </label>
                    <select
                      value={formData.standout_role_2}
                      onChange={(e) => setFormData(prev => ({ ...prev, standout_role_2: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select your second strength</option>
                      <option value="Advisor">Advisor</option>
                      <option value="Connector">Connector</option>
                      <option value="Creator">Creator</option>
                      <option value="Equalizer">Equalizer</option>
                      <option value="Influencer">Influencer</option>
                      <option value="Pioneer">Pioneer</option>
                      <option value="Provider">Provider</option>
                      <option value="Stimulator">Stimulator</option>
                      <option value="Teacher">Teacher</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Net Worth Calculator */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Net Worth Calculator
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Net Worth ($)
                      </label>
                      <input
                        type="number"
                        value={formData.net_worth}
                        onChange={(e) => setFormData(prev => ({ ...prev, net_worth: parseInt(e.target.value) || 0 }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter your net worth"
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="text-lg font-semibold text-gray-900">
                        Net Worth: ${formData.net_worth.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget Calculator */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                  Monthly Budget Calculator
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Income ($)
                      </label>
                      <input
                        type="number"
                        value={formData.monthly_income}
                        onChange={(e) => {
                          const income = parseInt(e.target.value) || 0
                          const expenses = formData.monthly_expenses
                          setFormData(prev => ({ 
                            ...prev, 
                            monthly_income: income,
                            monthly_savings: income - expenses
                          }))
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter monthly income"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Expenses ($)
                      </label>
                      <input
                        type="number"
                        value={formData.monthly_expenses}
                        onChange={(e) => {
                          const expenses = parseInt(e.target.value) || 0
                          const income = formData.monthly_income
                          setFormData(prev => ({ 
                            ...prev, 
                            monthly_expenses: expenses,
                            monthly_savings: income - expenses
                          }))
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter monthly expenses"
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="text-lg font-semibold text-gray-900">
                        Monthly Savings: ${formData.monthly_savings.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Foundation Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Financial Foundation (35 points)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Fund: How many months of expenses do you have saved?
                    </label>
                    <select
                      value={formData.financial_emergency_fund}
                      onChange={(e) => setFormData(prev => ({ ...prev, financial_emergency_fund: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value={0}>0-1 months (0 points)</option>
                      <option value={5}>2-3 months (5 points)</option>
                      <option value={10}>4-6 months (10 points)</option>
                      <option value={15}>7-12 months (15 points)</option>
                      <option value={20}>12+ months (20 points)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Tracking: How do you track your expenses?
                    </label>
                    <select
                      value={formData.financial_budget_tracking}
                      onChange={(e) => setFormData(prev => ({ ...prev, financial_budget_tracking: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value={0}>No tracking (0 points)</option>
                      <option value={3}>Basic tracking (3 points)</option>
                      <option value={7}>Regular tracking (7 points)</option>
                      <option value={10}>Detailed tracking (10 points)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Debt Management: What's your debt-to-income ratio?
                    </label>
                    <select
                      value={formData.financial_debt_management}
                      onChange={(e) => setFormData(prev => ({ ...prev, financial_debt_management: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value={0}>Above 50% (0 points)</option>
                      <option value={3}>30-50% (3 points)</option>
                      <option value={7}>15-30% (7 points)</option>
                      <option value={10}>Below 15% (10 points)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Strategy: Do you have an investment plan?
                    </label>
                    <select
                      value={formData.financial_investment_strategy}
                      onChange={(e) => setFormData(prev => ({ ...prev, financial_investment_strategy: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value={0}>No plan (0 points)</option>
                      <option value={3}>Basic plan (3 points)</option>
                      <option value={7}>Diversified plan (7 points)</option>
                      <option value={10}>Comprehensive plan (10 points)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Insurance Coverage: What insurance do you have?
                    </label>
                    <select
                      value={formData.financial_insurance_coverage}
                      onChange={(e) => setFormData(prev => ({ ...prev, financial_insurance_coverage: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value={0}>No insurance (0 points)</option>
                      <option value={3}>Basic coverage (3 points)</option>
                      <option value={7}>Comprehensive coverage (7 points)</option>
                      <option value={10}>Full protection (10 points)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Market Intelligence Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-600" />
                  Market Intelligence (20 points)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry Trends: How well do you track industry trends?
                    </label>
                    <select
                      value={formData.market_industry_trends}
                      onChange={(e) => setFormData(prev => ({ ...prev, market_industry_trends: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={0}>Not tracking (0 points)</option>
                      <option value={3}>Basic awareness (3 points)</option>
                      <option value={7}>Regular monitoring (7 points)</option>
                      <option value={10}>Deep analysis (10 points)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Competitor Analysis: How do you analyze competitors?
                    </label>
                    <select
                      value={formData.market_competitor_analysis}
                      onChange={(e) => setFormData(prev => ({ ...prev, market_competitor_analysis: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={0}>No analysis (0 points)</option>
                      <option value={3}>Basic awareness (3 points)</option>
                      <option value={7}>Regular analysis (7 points)</option>
                      <option value={10}>Comprehensive analysis (10 points)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Research: How do you understand your customers?
                    </label>
                    <select
                      value={formData.market_customer_research}
                      onChange={(e) => setFormData(prev => ({ ...prev, market_customer_research: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={0}>No research (0 points)</option>
                      <option value={3}>Basic understanding (3 points)</option>
                      <option value={7}>Regular research (7 points)</option>
                      <option value={10}>Deep insights (10 points)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Technology Adoption: How do you adopt new technology?
                    </label>
                    <select
                      value={formData.market_technology_adoption}
                      onChange={(e) => setFormData(prev => ({ ...prev, market_technology_adoption: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={0}>Resistant to change (0 points)</option>
                      <option value={3}>Slow adoption (3 points)</option>
                      <option value={7}>Proactive adoption (7 points)</option>
                      <option value={10}>Early adopter (10 points)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Personal Strengths Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  Personal Strengths (20 points)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Leadership Skills: How would you rate your leadership abilities?
                    </label>
                    <select
                      value={formData.personal_leadership_skills}
                      onChange={(e) => setFormData(prev => ({ ...prev, personal_leadership_skills: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value={0}>Beginner (0 points)</option>
                      <option value={3}>Developing (3 points)</option>
                      <option value={7}>Proficient (7 points)</option>
                      <option value={10}>Expert (10 points)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Communication: How effective is your communication?
                    </label>
                    <select
                      value={formData.personal_communication_abilities}
                      onChange={(e) => setFormData(prev => ({ ...prev, personal_communication_abilities: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value={0}>Poor (0 points)</option>
                      <option value={3}>Fair (3 points)</option>
                      <option value={7}>Good (7 points)</option>
                      <option value={10}>Excellent (10 points)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Problem Solving: How do you approach challenges?
                    </label>
                    <select
                      value={formData.personal_problem_solving}
                      onChange={(e) => setFormData(prev => ({ ...prev, personal_problem_solving: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value={0}>Avoid challenges (0 points)</option>
                      <option value={3}>React to problems (3 points)</option>
                      <option value={7}>Proactive approach (7 points)</option>
                      <option value={10}>Strategic problem solver (10 points)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adaptability: How well do you adapt to change?
                    </label>
                    <select
                      value={formData.personal_adaptability}
                      onChange={(e) => setFormData(prev => ({ ...prev, personal_adaptability: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value={0}>Resistant to change (0 points)</option>
                      <option value={3}>Slow to adapt (3 points)</option>
                      <option value={7}>Quick to adapt (7 points)</option>
                      <option value={10}>Embrace change (10 points)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Risk Management Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-red-600" />
                  Risk Management (15 points)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Risk Identification: How do you identify potential risks?
                    </label>
                    <select
                      value={formData.risk_identification}
                      onChange={(e) => setFormData(prev => ({ ...prev, risk_identification: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value={0}>No risk assessment (0 points)</option>
                      <option value={3}>Basic awareness (3 points)</option>
                      <option value={7}>Regular assessment (7 points)</option>
                      <option value={10}>Comprehensive analysis (10 points)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mitigation Strategies: How do you manage risks?
                    </label>
                    <select
                      value={formData.risk_mitigation_strategies}
                      onChange={(e) => setFormData(prev => ({ ...prev, risk_mitigation_strategies: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value={0}>No strategies (0 points)</option>
                      <option value={3}>Basic strategies (3 points)</option>
                      <option value={7}>Comprehensive strategies (7 points)</option>
                      <option value={10}>Advanced risk management (10 points)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Insurance Planning: What insurance coverage do you have?
                    </label>
                    <select
                      value={formData.risk_insurance_planning}
                      onChange={(e) => setFormData(prev => ({ ...prev, risk_insurance_planning: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value={0}>No insurance (0 points)</option>
                      <option value={3}>Basic coverage (3 points)</option>
                      <option value={7}>Comprehensive coverage (7 points)</option>
                      <option value={10}>Full protection (10 points)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Support Systems Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-orange-600" />
                  Support Systems (10 points)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mentorship: Do you have mentors or advisors?
                    </label>
                    <select
                      value={formData.support_mentorship}
                      onChange={(e) => setFormData(prev => ({ ...prev, support_mentorship: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value={0}>No mentors (0 points)</option>
                      <option value={3}>Informal advisors (3 points)</option>
                      <option value={7}>Formal mentors (7 points)</option>
                      <option value={10}>Multiple expert advisors (10 points)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Networking: How active is your professional network?
                    </label>
                    <select
                      value={formData.support_networking}
                      onChange={(e) => setFormData(prev => ({ ...prev, support_networking: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value={0}>No network (0 points)</option>
                      <option value={3}>Small network (3 points)</option>
                      <option value={7}>Active network (7 points)</option>
                      <option value={10}>Extensive network (10 points)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Live Score Display */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Live SPI Score</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{currentScore}</div>
                    <div className="text-sm text-gray-600">Total Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{getSPITier(currentScore)}</div>
                    <div className="text-sm text-gray-600">Current Tier</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{getStrengthCombination()}</div>
                    <div className="text-sm text-gray-600">Strength Combination</div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
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