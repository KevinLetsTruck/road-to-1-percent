'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { ArrowLeft, TrendingUp, DollarSign, Brain, Shield, Users, Target, CheckCircle, AlertCircle, Info } from 'lucide-react'

type CurrentSituation = 'Employee Driver' | 'Carrier Authority' | 'Leased O/O' | 'Small Fleet'

interface ComprehensiveAssessmentData {
  // Current Situation
  current_situation: CurrentSituation
  
  // Contextual Questions (for specific situations)
  fleet_size: number | string // For Small Fleet
  load_sources: string[] // For Carrier Authority and Small Fleet
  
  // Standout Assessment Results
  standout_strength_1: string
  standout_strength_2: string
  
  // Financial Foundation (35 points)
  net_worth: number
  monthly_savings: number
  emergency_fund_months: number
  debt_to_income_ratio: number
  business_capital: number
  credit_score: number
  
  // Market Intelligence (20 points)
  rate_understanding: number
  cost_analysis: number
  customer_knowledge: number
  industry_trends: number
  strategic_planning: number
  
  // Personal Strengths (20 points)
  pioneer_strength: number
  creator_strength: number
  innovator_strength: number
  connector_strength: number
  advisor_strength: number
  
  // Risk Management (15 points)
  contingency_planning: number
  business_continuity: number
  risk_assessment: number
  
  // Support Systems (10 points)
  family_alignment: number
  professional_network: number
  mentorship: number
  industry_reputation: number
}

interface AssessmentQuestion {
  id: string
  dimension: string
  question: string
  options: { value: number; label: string; description?: string }[]
  weight: number
  maxPoints: number
}

const getAssessmentQuestions = (currentSituation: CurrentSituation): AssessmentQuestion[] => [
  // Financial Foundation Questions
  {
    id: 'net_worth',
    dimension: 'Financial Foundation',
    question: currentSituation === 'Employee Driver' 
      ? 'What is your current net worth (assets minus liabilities)?'
      : 'What is your current net worth (assets minus liabilities)?',
    options: [
      { value: 0, label: 'Negative $25,000+', description: 'Significant debt burden' },
      { value: 3, label: 'Negative $10,000 to $25,000', description: 'Moderate debt' },
      { value: 6, label: 'Negative $10,000 to $0', description: 'Minor debt' },
      { value: 10, label: '$0 to $10,000', description: 'Breaking even' },
      { value: 12, label: '$10,000 to $50,000', description: 'Positive foundation' },
      { value: 14, label: '$50,000+', description: 'Strong financial base' }
    ],
    weight: 0.4,
    maxPoints: 14
  },
  {
    id: 'monthly_savings',
    dimension: 'Financial Foundation',
    question: 'How much do you save monthly after all expenses?',
    options: [
      { value: 0, label: 'Negative (spending more than earning)', description: 'Living beyond means' },
      { value: 4, label: '$0 to $500', description: 'Breaking even' },
      { value: 7, label: '$500 to $1,000', description: 'Moderate savings' },
      { value: 9, label: '$1,000 to $2,000', description: 'Good savings rate' },
      { value: 10.5, label: '$2,000+', description: 'Excellent savings' }
    ],
    weight: 0.3,
    maxPoints: 10.5
  },
  {
    id: 'emergency_fund_months',
    dimension: 'Financial Foundation',
    question: 'How many months of expenses do you have saved in emergency funds?',
    options: [
      { value: 0, label: '0 months', description: 'No emergency fund' },
      { value: 0.5, label: 'Less than 1 month', description: 'Minimal protection' },
      { value: 3, label: '1-3 months', description: 'Basic protection' },
      { value: 5, label: '3-6 months', description: 'Good protection' },
      { value: 7, label: '6+ months', description: 'Excellent protection' }
    ],
    weight: 0.2,
    maxPoints: 7
  },
  {
    id: 'credit_score',
    dimension: 'Financial Foundation',
    question: 'What is your current credit score?',
    options: [
      { value: 0, label: 'Below 500', description: 'Poor credit' },
      { value: 0.5, label: '500-580', description: 'Fair credit' },
      { value: 1.5, label: '580-670', description: 'Average credit' },
      { value: 2.5, label: '670-740', description: 'Good credit' },
      { value: 3.5, label: '740+', description: 'Excellent credit' }
    ],
    weight: 0.1,
    maxPoints: 3.5
  },
  
  // Market Intelligence Questions
  {
    id: 'rate_understanding',
    dimension: 'Market Intelligence',
    question: currentSituation === 'Employee Driver' 
      ? 'How do you evaluate job opportunities and compensation?'
      : 'How do you evaluate freight rates?',
    options: currentSituation === 'Employee Driver' ? [
      { value: 0, label: 'I accept whatever job is offered', description: 'No evaluation' },
      { value: 1, label: 'I look at the hourly rate or salary', description: 'Basic awareness' },
      { value: 2, label: 'I compare pay to my living expenses', description: 'Cost-conscious' },
      { value: 3, label: 'I analyze benefits, hours, and work conditions', description: 'Strategic thinking' },
      { value: 4, label: 'I evaluate career growth and long-term opportunities', description: 'Career intelligence' }
    ] : [
      { value: 0, label: 'I accept whatever rate is offered', description: 'No evaluation' },
      { value: 1, label: 'I look at total pay for the run', description: 'Basic awareness' },
      { value: 2, label: 'I compare rate per mile to my costs', description: 'Cost-conscious' },
      { value: 3, label: 'I analyze deadhead, loading time, fuel costs', description: 'Strategic thinking' },
      { value: 4, label: 'I evaluate seasonal patterns and market trends', description: 'Market intelligence' }
    ],
    weight: 0.2,
    maxPoints: 4
  },
  {
    id: 'cost_analysis',
    dimension: 'Market Intelligence',
    question: currentSituation === 'Employee Driver' 
      ? 'How well do you understand your personal cost of living and expenses?'
      : 'How well do you understand your cost per mile?',
    options: currentSituation === 'Employee Driver' ? [
      { value: 0, label: 'I don\'t track my expenses', description: 'No awareness' },
      { value: 1, label: 'I know my basic bills', description: 'Basic awareness' },
      { value: 2, label: 'I track major expenses', description: 'Partial tracking' },
      { value: 3, label: 'I calculate my cost of living', description: 'Full cost analysis' },
      { value: 4, label: 'I optimize my spending based on analysis', description: 'Strategic optimization' }
    ] : [
      { value: 0, label: 'I don\'t track costs', description: 'No awareness' },
      { value: 1, label: 'I know fuel and truck payment', description: 'Basic awareness' },
      { value: 2, label: 'I track major expenses', description: 'Partial tracking' },
      { value: 3, label: 'I calculate total cost per mile', description: 'Full cost analysis' },
      { value: 4, label: 'I optimize routes based on cost analysis', description: 'Strategic optimization' }
    ],
    weight: 0.2,
    maxPoints: 4
  },
  {
    id: 'customer_knowledge',
    dimension: 'Market Intelligence',
    question: currentSituation === 'Employee Driver' 
      ? 'How well do you understand your employer\'s business and expectations?'
      : 'How well do you understand your customers and their needs?',
    options: currentSituation === 'Employee Driver' ? [
      { value: 0, label: 'I don\'t understand the business', description: 'No awareness' },
      { value: 1, label: 'I know basic job requirements', description: 'Basic awareness' },
      { value: 2, label: 'I understand delivery expectations', description: 'Service awareness' },
      { value: 3, label: 'I know company policies and procedures', description: 'Business understanding' },
      { value: 4, label: 'I understand company goals and contribute to success', description: 'Strategic partnership' }
    ] : [
      { value: 0, label: 'I don\'t know my customers', description: 'No relationship' },
      { value: 1, label: 'I know customer names and locations', description: 'Basic awareness' },
      { value: 2, label: 'I understand delivery requirements', description: 'Service awareness' },
      { value: 3, label: 'I know customer business cycles', description: 'Business understanding' },
      { value: 4, label: 'I have direct relationships and understand their challenges', description: 'Strategic partnership' }
    ],
    weight: 0.2,
    maxPoints: 4
  },
  {
    id: 'industry_trends',
    dimension: 'Market Intelligence',
    question: currentSituation === 'Employee Driver' 
      ? 'How well do you understand industry trends and job market conditions?'
      : 'How well do you understand industry trends and seasonal patterns?',
    options: currentSituation === 'Employee Driver' ? [
      { value: 0, label: 'I don\'t follow industry news', description: 'No awareness' },
      { value: 1, label: 'I notice when job opportunities change', description: 'Basic awareness' },
      { value: 2, label: 'I understand some industry patterns', description: 'Partial understanding' },
      { value: 3, label: 'I track factors affecting job market', description: 'Comprehensive tracking' },
      { value: 4, label: 'I can predict job market changes based on trends', description: 'Predictive analysis' }
    ] : [
      { value: 0, label: 'I don\'t follow trends', description: 'No awareness' },
      { value: 1, label: 'I notice when rates change', description: 'Basic awareness' },
      { value: 2, label: 'I understand some seasonal patterns', description: 'Partial understanding' },
      { value: 3, label: 'I track multiple factors affecting rates', description: 'Comprehensive tracking' },
      { value: 4, label: 'I can predict rate changes based on trends', description: 'Predictive analysis' }
    ],
    weight: 0.2,
    maxPoints: 4
  },
  {
    id: 'strategic_planning',
    dimension: 'Market Intelligence',
    question: currentSituation === 'Employee Driver' 
      ? 'How do you approach career planning and professional development?'
      : 'How do you approach strategic planning for your business?',
    options: currentSituation === 'Employee Driver' ? [
      { value: 0, label: 'I don\'t plan my career', description: 'No planning' },
      { value: 1, label: 'I think about next week', description: 'Short-term thinking' },
      { value: 2, label: 'I plan for next month', description: 'Monthly planning' },
      { value: 3, label: 'I have quarterly career goals', description: 'Quarterly planning' },
      { value: 4, label: 'I have annual career plans and long-term strategy', description: 'Strategic planning' }
    ] : [
      { value: 0, label: 'I don\'t plan ahead', description: 'No planning' },
      { value: 1, label: 'I think about next week', description: 'Short-term thinking' },
      { value: 2, label: 'I plan for next month', description: 'Monthly planning' },
      { value: 3, label: 'I have quarterly goals', description: 'Quarterly planning' },
      { value: 4, label: 'I have annual business plans and long-term strategy', description: 'Strategic planning' }
    ],
    weight: 0.2,
    maxPoints: 4
  },
  
  // Personal Strengths Questions
  {
    id: 'pioneer_strength',
    dimension: 'Personal Strengths',
    question: 'How do you typically approach new challenges?',
    options: [
      { value: 0, label: 'I avoid new challenges', description: 'Risk-averse' },
      { value: 2, label: 'I follow proven methods', description: 'Conservative' },
      { value: 4, label: 'I research before acting', description: 'Cautious' },
      { value: 6, label: 'I experiment with new approaches', description: 'Innovative' },
      { value: 8, label: 'I seek out new opportunities', description: 'Pioneering' },
      { value: 10, label: 'I create new paths where none exist', description: 'Trailblazing' }
    ],
    weight: 0.5,
    maxPoints: 10
  },
  {
    id: 'creator_strength',
    dimension: 'Personal Strengths',
    question: 'When you see an inefficient system, what\'s your first instinct?',
    options: [
      { value: 0, label: 'Follow it anyway to avoid trouble', description: 'Compliant' },
      { value: 2, label: 'Complain about it to others', description: 'Frustrated' },
      { value: 4, label: 'Accept it as the way things are', description: 'Resigned' },
      { value: 6, label: 'Figure out a better way and test it', description: 'Problem-solver' },
      { value: 8, label: 'Immediately try to change it officially', description: 'Change agent' },
      { value: 10, label: 'Create a completely new system', description: 'Creator' }
    ],
    weight: 0.5,
    maxPoints: 10
  },
  
  // Risk Management Questions
  {
    id: 'contingency_planning',
    dimension: 'Risk Management',
    question: currentSituation === 'Employee Driver' 
      ? 'How many months of expenses could you cover if you lost your job?'
      : 'How many months of expenses could you cover if your truck was down?',
    options: currentSituation === 'Employee Driver' ? [
      { value: 0, label: '0 months', description: 'No contingency' },
      { value: 1, label: '1 month', description: 'Minimal protection' },
      { value: 2, label: '2-3 months', description: 'Basic protection' },
      { value: 3, label: '3-6 months', description: 'Good protection' },
      { value: 4, label: '6+ months', description: 'Excellent protection' },
      { value: 5, label: '12+ months', description: 'Outstanding protection' }
    ] : [
      { value: 0, label: '0 months', description: 'No contingency' },
      { value: 1, label: '1 month', description: 'Minimal protection' },
      { value: 2, label: '2-3 months', description: 'Basic protection' },
      { value: 3, label: '3-6 months', description: 'Good protection' },
      { value: 4, label: '6+ months', description: 'Excellent protection' },
      { value: 5, label: '12+ months', description: 'Outstanding protection' }
    ],
    weight: 0.33,
    maxPoints: 5
  },

  {
    id: 'business_continuity',
    dimension: 'Risk Management',
    question: currentSituation === 'Employee Driver' 
      ? 'What\'s your plan if you were injured and couldn\'t work?'
      : 'What\'s your plan if you were injured and couldn\'t drive?',
    options: currentSituation === 'Employee Driver' ? [
      { value: 0, label: 'No plan', description: 'No preparation' },
      { value: 0.5, label: 'Hope for the best', description: 'Wishful thinking' },
      { value: 1, label: 'Rely on family support', description: 'Dependent' },
      { value: 2, label: 'Use savings temporarily', description: 'Basic preparation' },
      { value: 3, label: 'Have disability insurance and backup plans', description: 'Comprehensive preparation' }
    ] : [
      { value: 0, label: 'No plan', description: 'No preparation' },
      { value: 0.5, label: 'Hope for the best', description: 'Wishful thinking' },
      { value: 1, label: 'Rely on family support', description: 'Dependent' },
      { value: 2, label: 'Use savings temporarily', description: 'Basic preparation' },
      { value: 3, label: 'Have disability insurance and backup plans', description: 'Comprehensive preparation' }
    ],
    weight: 0.2,
    maxPoints: 3
  },
  {
    id: 'risk_assessment',
    dimension: 'Risk Management',
    question: currentSituation === 'Employee Driver' 
      ? 'How do you evaluate and mitigate personal and career risks?'
      : 'How do you evaluate and mitigate business risks?',
    options: currentSituation === 'Employee Driver' ? [
      { value: 0, label: 'I don\'t think about risks', description: 'No awareness' },
      { value: 0.5, label: 'I worry about risks but don\'t plan', description: 'Anxious' },
      { value: 1, label: 'I avoid obvious risks', description: 'Cautious' },
      { value: 2, label: 'I have basic safety measures', description: 'Basic preparation' },
      { value: 3, label: 'I systematically assess and mitigate risks', description: 'Strategic' },
      { value: 4, label: 'I have comprehensive risk management systems', description: 'Expert' }
    ] : [
      { value: 0, label: 'I don\'t think about risks', description: 'No awareness' },
      { value: 0.5, label: 'I worry about risks but don\'t plan', description: 'Anxious' },
      { value: 1, label: 'I avoid obvious risks', description: 'Cautious' },
      { value: 2, label: 'I have basic safety measures', description: 'Basic preparation' },
      { value: 3, label: 'I systematically assess and mitigate risks', description: 'Strategic' },
      { value: 4, label: 'I have comprehensive risk management systems', description: 'Expert' }
    ],
    weight: 0.27,
    maxPoints: 4
  },
  
  // Support Systems Questions
  {
    id: 'family_alignment',
    dimension: 'Support Systems',
    question: currentSituation === 'Employee Driver' 
      ? 'How well does your family understand and support your career goals?'
      : 'How well does your family understand and support your business goals?',
    options: currentSituation === 'Employee Driver' ? [
      { value: 0, label: 'Family opposes my goals', description: 'Active resistance' },
      { value: 0.5, label: 'Family is indifferent', description: 'No support' },
      { value: 1, label: 'Family is supportive but uninvolved', description: 'Passive support' },
      { value: 2, label: 'Family understands and encourages', description: 'Active support' },
      { value: 3, label: 'Family is actively involved in planning', description: 'Partnership' }
    ] : [
      { value: 0, label: 'Family opposes my goals', description: 'Active resistance' },
      { value: 0.5, label: 'Family is indifferent', description: 'No support' },
      { value: 1, label: 'Family is supportive but uninvolved', description: 'Passive support' },
      { value: 2, label: 'Family understands and encourages', description: 'Active support' },
      { value: 3, label: 'Family is actively involved in planning', description: 'Partnership' }
    ],
    weight: 0.3,
    maxPoints: 3
  },
  {
    id: 'professional_network',
    dimension: 'Support Systems',
    question: 'How strong is your professional network in the trucking industry?',
    options: [
      { value: 0, label: 'No professional contacts', description: 'Isolated' },
      { value: 0.5, label: 'A few casual acquaintances', description: 'Minimal network' },
      { value: 1, label: 'Some industry contacts', description: 'Basic network' },
      { value: 2, label: 'Strong relationships with other drivers', description: 'Good network' },
      { value: 3, label: 'Extensive network including mentors and industry leaders', description: 'Excellent network' }
    ],
    weight: 0.3,
    maxPoints: 3
  },
  {
    id: 'mentorship',
    dimension: 'Support Systems',
    question: 'Do you have mentors or advisors in the industry?',
    options: [
      { value: 0, label: 'No mentors', description: 'No guidance' },
      { value: 1, label: 'Informal advice from experienced drivers', description: 'Casual guidance' },
      { value: 2, label: 'One formal mentor', description: 'Structured guidance' },
      { value: 3, label: 'Multiple mentors and advisors', description: 'Comprehensive guidance' },
      { value: 4, label: 'Professional coaching and advisory team', description: 'Expert guidance' }
    ],
    weight: 0.2,
    maxPoints: 2
  },
  {
    id: 'industry_reputation',
    dimension: 'Support Systems',
    question: 'How would you describe your reputation in the driver community?',
    options: [
      { value: 0, label: 'Unknown or negative reputation', description: 'Poor standing' },
      { value: 0.5, label: 'Neutral reputation', description: 'Average standing' },
      { value: 1, label: 'Generally positive reputation', description: 'Good standing' },
      { value: 1.5, label: 'Well-respected in the community', description: 'Strong standing' },
      { value: 2, label: 'Recognized as a leader and resource', description: 'Excellent standing' }
    ],
    weight: 0.2,
    maxPoints: 2
  }
]

export default function ComprehensiveAssessmentPage() {
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<ComprehensiveAssessmentData>({
    current_situation: 'Employee Driver',
    fleet_size: 0,
    load_sources: [],
    standout_strength_1: '',
    standout_strength_2: '',
    net_worth: 0,
    monthly_savings: 0,
    emergency_fund_months: 0,
    debt_to_income_ratio: 0,
    business_capital: 0,
    credit_score: 0,
    rate_understanding: 0,
    cost_analysis: 0,
    customer_knowledge: 0,
    industry_trends: 0,
    strategic_planning: 0,
    pioneer_strength: 0,
    creator_strength: 0,
    innovator_strength: 0,
    connector_strength: 0,
    advisor_strength: 0,
    contingency_planning: 0,
    business_continuity: 0,
    risk_assessment: 0,
    family_alignment: 0,
    professional_network: 0,
    mentorship: 0,
    industry_reputation: 0
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
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
      setLoading(false)
    }
    getUser()
  }, [router, supabase])

  const calculateDimensionScore = (dimension: string) => {
    const assessmentQuestions = getAssessmentQuestions(formData.current_situation)
    const dimensionQuestions = assessmentQuestions.filter(q => q.dimension === dimension)
    let totalScore = 0
    
    dimensionQuestions.forEach(question => {
      const value = formData[question.id as keyof ComprehensiveAssessmentData] as number
      totalScore += value
    })
    
    return Math.round(totalScore)
  }

  const calculateTotalSPIScore = () => {
    const financialScore = calculateDimensionScore('Financial Foundation')
    const marketScore = calculateDimensionScore('Market Intelligence')
    const strengthsScore = calculateDimensionScore('Personal Strengths')
    const riskScore = calculateDimensionScore('Risk Management')
    const supportScore = calculateDimensionScore('Support Systems')
    
    return financialScore + marketScore + strengthsScore + riskScore + supportScore
  }

  const getSPITier = (score: number) => {
    if (score >= 70) return '1%'
    if (score >= 50) return '9%'
    return '90%'
  }

  const getStrengthCombination = () => {
    const pioneer = formData.pioneer_strength
    const creator = formData.creator_strength
    
    if (pioneer >= 8 && creator >= 8) return 'Pioneer + Creator'
    if (pioneer >= 8) return 'Pioneer'
    if (creator >= 8) return 'Creator'
    return 'Balanced'
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

      // Save comprehensive assessment data
      const { error: assessmentError } = await supabase
        .from('comprehensive_assessments')
        .insert({
          user_id: user.id,
          ...formData,
          total_spi_score: totalScore,
          tier,
          strength_combination: strengthCombo,
          assessment_date: new Date().toISOString()
        })

      if (assessmentError) throw assessmentError

      // Update user progress
      const response = await fetch('/api/user-progress/comprehensive-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalScore,
          tier,
          strengthCombo,
          dimensionScores: {
            financial_foundation: calculateDimensionScore('Financial Foundation'),
            market_intelligence: calculateDimensionScore('Market Intelligence'),
            personal_strengths: calculateDimensionScore('Personal Strengths'),
            risk_management: calculateDimensionScore('Risk Management'),
            support_systems: calculateDimensionScore('Support Systems')
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update progress')
      }

      router.push('/dashboard/comprehensive-assessment/results?score=' + totalScore)
    } catch (error: unknown) {
      setError((error as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof ComprehensiveAssessmentData, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSituationChange = (situation: CurrentSituation) => {
    setFormData(prev => ({ ...prev, current_situation: situation }))
  }

  const handleFleetSizeChange = (size: number) => {
    setFormData(prev => ({ ...prev, fleet_size: size }))
  }

  const handleLoadSourceChange = (source: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      load_sources: checked 
        ? [...prev.load_sources, source]
        : prev.load_sources.filter(s => s !== source)
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  const totalScore = calculateTotalSPIScore()
  const tier = getSPITier(totalScore)
  const strengthCombo = getStrengthCombination()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
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
              <span className="text-xl font-bold text-gray-900">Comprehensive SPI Assessment</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Complete SPI Assessment</h1>
              <p className="text-gray-600 mb-4">
                This comprehensive assessment evaluates all five dimensions of your Success Probability Index. 
                Be honest—this assessment is designed to show you exactly where you stand and where to focus your efforts.
              </p>
              
              {/* Current Situation Selector */}
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
                <h3 className="text-xl font-bold text-blue-900 mb-3">🚛 What is your current situation?</h3>
                <p className="text-blue-700 mb-4 font-medium">
                  Please select your current situation so we can provide questions that are relevant to your specific circumstances.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(['Employee Driver', 'Carrier Authority', 'Leased O/O', 'Small Fleet'] as CurrentSituation[]).map((situation) => (
                    <label key={situation} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.current_situation === situation 
                        ? 'border-blue-500 bg-blue-100 shadow-md' 
                        : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                    }`}>
                      <input
                        type="radio"
                        name="current_situation"
                        value={situation}
                        checked={formData.current_situation === situation}
                        onChange={() => handleSituationChange(situation)}
                        className="mr-3 w-4 h-4 text-blue-600"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{situation}</div>
                        <div className="text-sm text-gray-600">
                          {situation === 'Employee Driver' && 'Driving for a company as an employee'}
                          {situation === 'Carrier Authority' && 'Have your own authority and operate independently'}
                          {situation === 'Leased O/O' && 'Lease your truck to a carrier'}
                          {situation === 'Small Fleet' && 'Own multiple trucks and manage drivers'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Selected:</strong> {formData.current_situation} - This will customize your assessment questions.
                  </p>
                </div>
              </div>

              {/* Standout Assessment Section */}
              <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg">
                <h3 className="text-xl font-bold text-purple-900 mb-3">🎯 Standout Assessment</h3>
                <p className="text-purple-700 mb-4 font-medium">
                  Before completing this assessment, please take the Standout 2.0 assessment to discover your unique strengths.
                </p>
                
                <div className="mb-6">
                  <a
                    href="https://www.tmbc.com/standout-assessment/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Take Standout 2.0 Assessment
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-800 mb-2">
                      Your Top Strength #1
                    </label>
                    <select
                      value={formData.standout_strength_1}
                      onChange={(e) => setFormData(prev => ({ ...prev, standout_strength_1: e.target.value }))}
                      className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select your top strength</option>
                      {[
                        'Pioneer',
                        'Influencer',
                        'Stimulator',
                        'Advisor',
                        'Connector',
                        'Provider',
                        'Equalizer',
                        'Teacher',
                        'Creator'
                      ].filter(strength => strength !== formData.standout_strength_2).map((strength) => (
                        <option key={strength} value={strength}>
                          {strength}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-purple-800 mb-2">
                      Your Top Strength #2
                    </label>
                    <select
                      value={formData.standout_strength_2}
                      onChange={(e) => setFormData(prev => ({ ...prev, standout_strength_2: e.target.value }))}
                      className="w-full p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select your second strength</option>
                      {[
                        'Pioneer',
                        'Influencer',
                        'Stimulator',
                        'Advisor',
                        'Connector',
                        'Provider',
                        'Equalizer',
                        'Teacher',
                        'Creator'
                      ].filter(strength => strength !== formData.standout_strength_1).map((strength) => (
                        <option key={strength} value={strength}>
                          {strength}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>Note:</strong> These strengths will be integrated into your SPI assessment results to provide personalized insights.
                  </p>
                </div>
              </div>

              {/* Contextual Questions Based on Situation */}
              {(formData.current_situation === 'Small Fleet' || formData.current_situation === 'Carrier Authority') && (
                <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
                  <h3 className="text-xl font-bold text-green-900 mb-3">📋 Additional Information</h3>
                  
                  {/* Fleet Size Question (Small Fleet only) */}
                  {formData.current_situation === 'Small Fleet' && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-green-800 mb-3">How many trucks do you own?</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[2, 3, 4, 5, 6, 7, 8, 9, 10, '10+'].map((size) => (
                          <label key={size} className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.fleet_size === size 
                              ? 'border-green-500 bg-green-100 shadow-md' 
                              : 'border-gray-300 hover:border-green-300 hover:bg-green-50'
                          }`}>
                            <input
                              type="radio"
                              name="fleet_size"
                              value={size}
                              checked={formData.fleet_size === size}
                              onChange={() => handleFleetSizeChange(size as number)}
                              className="mr-2 w-4 h-4 text-green-600"
                            />
                            <span className="font-medium text-gray-900">{size} {size === 1 ? 'Truck' : 'Trucks'}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Load Sources Question */}
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-green-800 mb-3">Where do you get your loads? (Select all that apply)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Load Boards (DAT, Truckstop, etc.)',
                        'Brokers',
                        'Direct Customers',
                        'Freight Forwarders',
                        'Contract Freight'
                      ].map((source) => (
                        <label key={source} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-green-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.load_sources.includes(source)}
                            onChange={(e) => handleLoadSourceChange(source, e.target.checked)}
                            className="mr-3 w-4 h-4 text-green-600"
                          />
                          <span className="text-gray-900">{source}</span>
                        </label>
                      ))}
                    </div>
                    {formData.load_sources.length > 0 && (
                      <div className="mt-3 p-2 bg-green-100 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Selected sources:</strong> {formData.load_sources.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Assessment Overview</p>
                    <p className="text-sm text-blue-700 mt-1">
                      This assessment contains {getAssessmentQuestions(formData.current_situation).length} questions across five dimensions. 
                      Take your time and answer honestly. Your results will provide a clear roadmap for improvement.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Score Display */}
            <div className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{calculateDimensionScore('Financial Foundation')}</div>
                  <div className="text-indigo-100 text-sm">Financial Foundation</div>
                  <div className="text-xs text-indigo-200">(35 max)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{calculateDimensionScore('Market Intelligence')}</div>
                  <div className="text-indigo-100 text-sm">Market Intelligence</div>
                  <div className="text-xs text-indigo-200">(20 max)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{calculateDimensionScore('Personal Strengths')}</div>
                  <div className="text-indigo-100 text-sm">Personal Strengths</div>
                  <div className="text-xs text-indigo-200">(20 max)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{calculateDimensionScore('Risk Management')}</div>
                  <div className="text-indigo-100 text-sm">Risk Management</div>
                  <div className="text-xs text-indigo-200">(15 max)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{calculateDimensionScore('Support Systems')}</div>
                  <div className="text-indigo-100 text-sm">Support Systems</div>
                  <div className="text-xs text-indigo-200">(10 max)</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-indigo-400">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Total SPI Score: {totalScore}/100</h2>
                    <p className="text-indigo-100">Current Tier: {tier} | Strength: {strengthCombo}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-indigo-200">Success Probability</div>
                    <div className="text-lg font-bold">
                      {tier === '1%' ? '75%+' : tier === '9%' ? '25-75%' : '<25%'}
                    </div>
                  </div>
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
                <p className="text-gray-600 mb-4">
                  Your financial foundation determines your ability to invest in opportunities and weather challenges.
                </p>
                {getAssessmentQuestions(formData.current_situation)
                  .filter(q => q.dimension === 'Financial Foundation')
                  .map((question, index) => (
                    <div key={question.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        {index + 1}. {question.question}
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <label key={option.value} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name={question.id}
                              value={option.value}
                              checked={formData[question.id as keyof ComprehensiveAssessmentData] === option.value}
                              onChange={() => handleInputChange(question.id as keyof ComprehensiveAssessmentData, option.value)}
                              className="mt-1 mr-3"
                            />
                            <div>
                              <div className="font-medium text-gray-900">{option.label}</div>
                              {option.description && (
                                <div className="text-sm text-gray-600">{option.description}</div>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Market Intelligence Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-600" />
                  Market Intelligence (20 points)
                </h3>
                <p className="text-gray-600 mb-4">
                  Understanding the market, rates, and customer needs is crucial for making profitable decisions.
                </p>
                {getAssessmentQuestions(formData.current_situation)
                  .filter(q => q.dimension === 'Market Intelligence')
                  .map((question, index) => (
                    <div key={question.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        {index + 1}. {question.question}
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <label key={option.value} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name={question.id}
                              value={option.value}
                              checked={formData[question.id as keyof ComprehensiveAssessmentData] === option.value}
                              onChange={() => handleInputChange(question.id as keyof ComprehensiveAssessmentData, option.value)}
                              className="mt-1 mr-3"
                            />
                            <div>
                              <div className="font-medium text-gray-900">{option.label}</div>
                              {option.description && (
                                <div className="text-sm text-gray-600">{option.description}</div>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Personal Strengths Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  Personal Strengths (20 points)
                </h3>
                <p className="text-gray-600 mb-4">
                  Your natural strengths determine how you approach challenges and opportunities.
                </p>
                {getAssessmentQuestions(formData.current_situation)
                  .filter(q => q.dimension === 'Personal Strengths')
                  .map((question, index) => (
                    <div key={question.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        {index + 1}. {question.question}
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <label key={option.value} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name={question.id}
                              value={option.value}
                              checked={formData[question.id as keyof ComprehensiveAssessmentData] === option.value}
                              onChange={() => handleInputChange(question.id as keyof ComprehensiveAssessmentData, option.value)}
                              className="mt-1 mr-3"
                            />
                            <div>
                              <div className="font-medium text-gray-900">{option.label}</div>
                              {option.description && (
                                <div className="text-sm text-gray-600">{option.description}</div>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Risk Management Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-red-600" />
                  Risk Management (15 points)
                </h3>
                <p className="text-gray-600 mb-4">
                  How well you prepare for and manage risks determines your business sustainability.
                </p>
                {getAssessmentQuestions(formData.current_situation)
                  .filter(q => q.dimension === 'Risk Management')
                  .map((question, index) => (
                    <div key={question.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        {index + 1}. {question.question}
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <label key={option.value} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name={question.id}
                              value={option.value}
                              checked={formData[question.id as keyof ComprehensiveAssessmentData] === option.value}
                              onChange={() => handleInputChange(question.id as keyof ComprehensiveAssessmentData, option.value)}
                              className="mt-1 mr-3"
                            />
                            <div>
                              <div className="font-medium text-gray-900">{option.label}</div>
                              {option.description && (
                                <div className="text-sm text-gray-600">{option.description}</div>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Support Systems Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-orange-600" />
                  Support Systems (10 points)
                </h3>
                <p className="text-gray-600 mb-4">
                  Your network, family support, and mentorship multiply your individual efforts.
                </p>
                {getAssessmentQuestions(formData.current_situation)
                  .filter(q => q.dimension === 'Support Systems')
                  .map((question, index) => (
                    <div key={question.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        {index + 1}. {question.question}
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <label key={option.value} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name={question.id}
                              value={option.value}
                              checked={formData[question.id as keyof ComprehensiveAssessmentData] === option.value}
                              onChange={() => handleInputChange(question.id as keyof ComprehensiveAssessmentData, option.value)}
                              className="mt-1 mr-3"
                            />
                            <div>
                              <div className="font-medium text-gray-900">{option.label}</div>
                              {option.description && (
                                <div className="text-sm text-gray-600">{option.description}</div>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-red-800">{error}</p>
                  </div>
                </div>
              )}

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