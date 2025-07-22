'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { ArrowLeft, TrendingUp, DollarSign, Brain, Shield, Users, Target, CheckCircle, AlertCircle, Info, X, Calculator } from 'lucide-react'
import { calculateStandoutScore } from '@/lib/standoutScoring'
import CalculatorModal from '@/components/CalculatorModal'
import NetWorthCalculator from '@/components/calculators/NetWorthCalculator'
import MonthlySavingsCalculator from '@/components/calculators/MonthlySavingsCalculator'

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
      { value: -1, label: '🧮 Open Net Worth Calculator', description: 'Click to calculate your exact net worth' },
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
      { value: -1, label: '💰 Open Monthly Savings Calculator', description: 'Click to calculate your exact monthly savings' },
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
      { value: 0.5, label: 'Informal advice from experienced drivers', description: 'Casual guidance' },
      { value: 1, label: 'One formal mentor', description: 'Structured guidance' },
      { value: 1.5, label: 'Multiple mentors and advisors', description: 'Comprehensive guidance' },
      { value: 2, label: 'Professional coaching and advisory team', description: 'Expert guidance' }
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
  const [assets, setAssets] = useState({
    cash: 0,
    savings: 0,
    investments: 0,
    realEstate: 0,
    vehicles: 0,
    businessAssets: 0,
    otherAssets: 0
  })
  const [liabilities, setLiabilities] = useState({
    creditCards: 0,
    personalLoans: 0,
    carLoans: 0,
    mortgage: 0,
    businessLoans: 0,
    otherDebts: 0
  })

  const totalAssets = Object.values(assets).reduce((sum, value) => sum + value, 0)
  const totalLiabilities = Object.values(liabilities).reduce((sum, value) => sum + value, 0)
  const netWorth = totalAssets - totalLiabilities

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-blue-800">Calculate Your Net Worth</h4>
        <button onClick={onCancel} className="text-blue-600 hover:text-blue-800">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assets */}
        <div className="space-y-4">
          <h5 className="font-semibold text-blue-700">Assets (What you own)</h5>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cash & Checking</label>
              <input
                type="number"
                value={assets.cash}
                onChange={(e) => setAssets(prev => ({ ...prev, cash: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Savings Accounts</label>
              <input
                type="number"
                value={assets.savings}
                onChange={(e) => setAssets(prev => ({ ...prev, savings: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Investments (401k, IRA, etc.)</label>
              <input
                type="number"
                value={assets.investments}
                onChange={(e) => setAssets(prev => ({ ...prev, investments: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Real Estate Value</label>
              <input
                type="number"
                value={assets.realEstate}
                onChange={(e) => setAssets(prev => ({ ...prev, realEstate: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicles Value</label>
              <input
                type="number"
                value={assets.vehicles}
                onChange={(e) => setAssets(prev => ({ ...prev, vehicles: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Assets</label>
              <input
                type="number"
                value={assets.businessAssets}
                onChange={(e) => setAssets(prev => ({ ...prev, businessAssets: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Other Assets</label>
              <input
                type="number"
                value={assets.otherAssets}
                onChange={(e) => setAssets(prev => ({ ...prev, otherAssets: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Liabilities */}
        <div className="space-y-4">
          <h5 className="font-semibold text-red-700">Liabilities (What you owe)</h5>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credit Card Debt</label>
              <input
                type="number"
                value={liabilities.creditCards}
                onChange={(e) => setLiabilities(prev => ({ ...prev, creditCards: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Personal Loans</label>
              <input
                type="number"
                value={liabilities.personalLoans}
                onChange={(e) => setLiabilities(prev => ({ ...prev, personalLoans: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Car Loans</label>
              <input
                type="number"
                value={liabilities.carLoans}
                onChange={(e) => setLiabilities(prev => ({ ...prev, carLoans: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mortgage</label>
              <input
                type="number"
                value={liabilities.mortgage}
                onChange={(e) => setLiabilities(prev => ({ ...prev, mortgage: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Loans</label>
              <input
                type="number"
                value={liabilities.businessLoans}
                onChange={(e) => setLiabilities(prev => ({ ...prev, businessLoans: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Other Debts</label>
              <input
                type="number"
                value={liabilities.otherDebts}
                onChange={(e) => setLiabilities(prev => ({ ...prev, otherDebts: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600">Total Assets</div>
            <div className="text-lg font-bold text-green-600">${totalAssets.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Total Liabilities</div>
            <div className="text-lg font-bold text-red-600">${totalLiabilities.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Net Worth</div>
            <div className={`text-lg font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netWorth.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => onCalculate(netWorth)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Use This Net Worth
        </button>
      </div>
    </div>
  )
}

// Monthly Savings Calculator Component
function MonthlySavingsCalculator({ onCalculate, onCancel }: { onCalculate: (monthlySavings: number) => void; onCancel: () => void }) {
  const [income, setIncome] = useState({
    salary: 0,
    bonuses: 0,
    sideIncome: 0,
    otherIncome: 0
  })
  const [expenses, setExpenses] = useState({
    housing: 0,
    utilities: 0,
    food: 0,
    transportation: 0,
    insurance: 0,
    entertainment: 0,
    debtPayments: 0,
    otherExpenses: 0
  })

  const totalIncome = Object.values(income).reduce((sum, value) => sum + value, 0)
  const totalExpenses = Object.values(expenses).reduce((sum, value) => sum + value, 0)
  const monthlySavings = totalIncome - totalExpenses

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-green-800">Calculate Your Monthly Savings</h4>
        <button onClick={onCancel} className="text-green-600 hover:text-green-800">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income */}
        <div className="space-y-4">
          <h5 className="font-semibold text-green-700">Monthly Income</h5>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary/Wages</label>
              <input
                type="number"
                value={income.salary}
                onChange={(e) => setIncome(prev => ({ ...prev, salary: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bonuses/Commissions</label>
              <input
                type="number"
                value={income.bonuses}
                onChange={(e) => setIncome(prev => ({ ...prev, bonuses: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Side Income</label>
              <input
                type="number"
                value={income.sideIncome}
                onChange={(e) => setIncome(prev => ({ ...prev, sideIncome: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Other Income</label>
              <input
                type="number"
                value={income.otherIncome}
                onChange={(e) => setIncome(prev => ({ ...prev, otherIncome: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div className="space-y-4">
          <h5 className="font-semibold text-red-700">Monthly Expenses</h5>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Housing (Rent/Mortgage)</label>
              <input
                type="number"
                value={expenses.housing}
                onChange={(e) => setExpenses(prev => ({ ...prev, housing: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Utilities</label>
              <input
                type="number"
                value={expenses.utilities}
                onChange={(e) => setExpenses(prev => ({ ...prev, utilities: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Food & Groceries</label>
              <input
                type="number"
                value={expenses.food}
                onChange={(e) => setExpenses(prev => ({ ...prev, food: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transportation</label>
              <input
                type="number"
                value={expenses.transportation}
                onChange={(e) => setExpenses(prev => ({ ...prev, transportation: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Insurance</label>
              <input
                type="number"
                value={expenses.insurance}
                onChange={(e) => setExpenses(prev => ({ ...prev, insurance: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entertainment</label>
              <input
                type="number"
                value={expenses.entertainment}
                onChange={(e) => setExpenses(prev => ({ ...prev, entertainment: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Debt Payments</label>
              <input
                type="number"
                value={expenses.debtPayments}
                onChange={(e) => setExpenses(prev => ({ ...prev, debtPayments: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Other Expenses</label>
              <input
                type="number"
                value={expenses.otherExpenses}
                onChange={(e) => setExpenses(prev => ({ ...prev, otherExpenses: Number(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600">Total Income</div>
            <div className="text-lg font-bold text-green-600">${totalIncome.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Total Expenses</div>
            <div className="text-lg font-bold text-red-600">${totalExpenses.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Monthly Savings</div>
            <div className={`text-lg font-bold ${monthlySavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${monthlySavings.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => onCalculate(monthlySavings)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Use This Monthly Savings
        </button>
      </div>
    </div>
  )
}

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
  const [showNetWorthCalculator, setShowNetWorthCalculator] = useState(false)
  const [showSavingsCalculator, setShowSavingsCalculator] = useState(false)
  const [calculatorResults, setCalculatorResults] = useState<{ netWorth?: number; monthlySavings?: number }>({})
  const [hasExistingData, setHasExistingData] = useState(false)
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
      
      // Load existing assessment data if available
      try {
        const { data: existingAssessment } = await supabase
          .from('comprehensive_assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
        
        if (existingAssessment) {
          // Load the existing data into the form for updating
          setFormData({
            current_situation: existingAssessment.current_situation || 'Employee Driver',
            fleet_size: existingAssessment.fleet_size || 0,
            load_sources: existingAssessment.load_sources || [],
            standout_strength_1: existingAssessment.standout_strength_1 || '',
            standout_strength_2: existingAssessment.standout_strength_2 || '',
            net_worth: existingAssessment.net_worth || 0,
            monthly_savings: existingAssessment.monthly_savings || 0,
            emergency_fund_months: existingAssessment.emergency_fund_months || 0,
            debt_to_income_ratio: existingAssessment.debt_to_income_ratio || 0,
            business_capital: existingAssessment.business_capital || 0,
            credit_score: existingAssessment.credit_score || 0,
            rate_understanding: existingAssessment.rate_understanding || 0,
            cost_analysis: existingAssessment.cost_analysis || 0,
            customer_knowledge: existingAssessment.customer_knowledge || 0,
            industry_trends: existingAssessment.industry_trends || 0,
            strategic_planning: existingAssessment.strategic_planning || 0,

            contingency_planning: existingAssessment.contingency_planning || 0,
            business_continuity: existingAssessment.business_continuity || 0,
            risk_assessment: existingAssessment.risk_assessment || 0,
            family_alignment: existingAssessment.family_alignment || 0,
            professional_network: existingAssessment.professional_network || 0,
            mentorship: existingAssessment.mentorship || 0,
            industry_reputation: existingAssessment.industry_reputation || 0
          })
          setHasExistingData(true)
        }
      } catch (error) {
        console.log('No existing assessment found, starting fresh')
      }
      
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
    const riskScore = calculateDimensionScore('Risk Management')
    const supportScore = calculateDimensionScore('Support Systems')
    
    // Calculate base score from 4 dimensions (out of 90)
    // Financial: 35, Market: 20, Risk: 15, Support: 10 = 80 points
    const baseScore = financialScore + marketScore + riskScore + supportScore
    
    // Add standout strength bonus (up to 10 points)
    const standoutBonus = calculateStandoutScore(formData.standout_strength_1, formData.standout_strength_2).score
    
    // Scale to ensure max is 100
    // Base (80) + Standout (10) = 90, so we scale by 100/90
    const scaledScore = Math.round((baseScore + standoutBonus) * (100/90))
    
    // Ensure score doesn't exceed 100
    return Math.min(scaledScore, 100)
  }

  const getSPITier = (score: number) => {
    if (score >= 85) return '1%'  // Top 1% - Exceptional performers
    if (score >= 70) return '9%'  // Top 9% - High performers
    return '90%' // Bottom 90% - Building foundation
  }

  const getStrengthCombination = () => {
    const strength1 = formData.standout_strength_1
    const strength2 = formData.standout_strength_2
    
    if (strength1 && strength2) {
      // Sort alphabetically for consistent combination naming
      const strengths = [strength1, strength2].sort()
      return `${strengths[0]} + ${strengths[1]}`
    } else if (strength1) {
      return strength1
    } else if (strength2) {
      return strength2
    }
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

      // Save or update comprehensive assessment data
      if (hasExistingData) {
        // Update existing assessment
        const { error: assessmentError } = await supabase
          .from('comprehensive_assessments')
          .update({
            ...formData,
            total_spi_score: totalScore,
            tier,
            strength_combination: strengthCombo,
            assessment_date: new Date().toISOString()
          })
          .eq('user_id', user.id)
        
        if (assessmentError) throw assessmentError
      } else {
        // Insert new assessment
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
        
      }

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
    
            risk_management: calculateDimensionScore('Risk Management'),
            support_systems: calculateDimensionScore('Support Systems')
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update progress')
      }

      // Send assessment completion email
      try {
        await fetch('/api/email/assessment-completion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            assessmentName: 'Comprehensive SPI Assessment',
            score: totalScore,
            tier
          })
        })
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError)
        // Don't fail the assessment submission if email fails
      }

      router.push('/dashboard/comprehensive-assessment/results')
    } catch (error: unknown) {
      setError((error as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof ComprehensiveAssessmentData, value: number) => {
    if (value === -1) {
      // Handle calculator selections
      if (field === 'net_worth') {
        setShowNetWorthCalculator(true)
        setShowSavingsCalculator(false)
        setFormData(prev => ({ ...prev, [field]: value }))
      } else if (field === 'monthly_savings') {
        setShowSavingsCalculator(true)
        setShowNetWorthCalculator(false)
        setFormData(prev => ({ ...prev, [field]: value }))
      }
      return
    }
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Helper function to render option with special styling for calculators
  const renderOption = (option: any, question: any) => {
    const isCalculatorOption = option.value === -1
    const isSelected = formData[question.id as keyof ComprehensiveAssessmentData] === option.value
    
    return (
      <label 
        key={option.value} 
        className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${
          isCalculatorOption 
            ? 'border-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30' 
            : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
        } ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
      >
        <input
          type="radio"
          name={question.id}
          value={option.value}
          checked={isSelected}
          onChange={() => handleInputChange(question.id as keyof ComprehensiveAssessmentData, option.value)}
          className="mt-1 mr-3"
        />
        <div>
          <div className={`font-medium ${isCalculatorOption ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-900 dark:text-gray-100'}`}>
            {option.label}
          </div>
          {option.description && (
            <div className={`text-sm ${isCalculatorOption ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400'}`}>
              {option.description}
            </div>
          )}
        </div>
      </label>
    )
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-2" />
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Comprehensive SPI Assessment</span>
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
              
              {/* Existing Data Banner */}
              {hasExistingData && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Previous Assessment Data Loaded
                      </h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Your previous assessment responses have been loaded. You can review and modify them as needed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
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
                  Before completing this assessment, please take the Standout 2.0 assessment to discover your unique strengths. OR if you know your top two strengths you can enter them below now.
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{calculateDimensionScore('Financial Foundation')}</div>
                  <div className="text-indigo-100 text-sm">Financial Foundation</div>
                  <div className="text-xs text-indigo-200">(35 points)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{calculateDimensionScore('Market Intelligence')}</div>
                  <div className="text-indigo-100 text-sm">Market Intelligence</div>
                  <div className="text-xs text-indigo-200">(20 points)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{calculateDimensionScore('Risk Management')}</div>
                  <div className="text-indigo-100 text-sm">Risk Management</div>
                  <div className="text-xs text-indigo-200">(15 points)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{calculateDimensionScore('Support Systems')}</div>
                  <div className="text-indigo-100 text-sm">Support Systems</div>
                  <div className="text-xs text-indigo-200">(10 points)</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/10 rounded-lg">
                  <div className="text-lg font-semibold">Standout Strengths</div>
                  <div className="text-2xl font-bold">{strengthCombo}</div>
                  <div className="text-xs text-indigo-200">+{Math.round(calculateStandoutScore(formData.standout_strength_1, formData.standout_strength_2).score * 2)} bonus points</div>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-lg">
                  <div className="text-lg font-semibold">Total Assessment Score</div>
                  <div className="text-3xl font-bold">{calculateDimensionScore('Financial Foundation') + calculateDimensionScore('Market Intelligence') + calculateDimensionScore('Risk Management') + calculateDimensionScore('Support Systems')}/80</div>
                  <div className="text-xs text-indigo-200">Base score before standout bonus</div>
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
                        {question.options.map((option) => renderOption(option, question))}
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
                  {submitting ? 'Processing...' : hasExistingData ? 'Update Assessment' : 'Complete Assessment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Calculator Modals */}
      <CalculatorModal
        isOpen={showNetWorthCalculator}
        onClose={() => setShowNetWorthCalculator(false)}
        title="Net Worth Calculator"
        icon={<Calculator className="w-6 h-6 text-blue-600" />}
      >
        <NetWorthCalculator 
          onCalculate={(netWorth) => {
            setCalculatorResults(prev => ({ ...prev, netWorth }))
            setShowNetWorthCalculator(false)
            // Auto-select the appropriate range based on calculated value
            let selectedValue = 0
            if (netWorth < -25000) selectedValue = 0
            else if (netWorth < -10000) selectedValue = 3
            else if (netWorth < 0) selectedValue = 6
            else if (netWorth < 10000) selectedValue = 10
            else if (netWorth < 50000) selectedValue = 12
            else selectedValue = 14
            setFormData(prev => ({ ...prev, net_worth: selectedValue }))
          }}
          onCancel={() => setShowNetWorthCalculator(false)}
        />
      </CalculatorModal>

      <CalculatorModal
        isOpen={showSavingsCalculator}
        onClose={() => setShowSavingsCalculator(false)}
        title="Monthly Savings Calculator"
        icon={<DollarSign className="w-6 h-6 text-green-600" />}
      >
        <MonthlySavingsCalculator 
          onCalculate={(monthlySavings) => {
            setCalculatorResults(prev => ({ ...prev, monthlySavings }))
            setShowSavingsCalculator(false)
            // Auto-select the appropriate range based on calculated value
            let selectedValue = 0
            if (monthlySavings < 0) selectedValue = 0
            else if (monthlySavings < 500) selectedValue = 4
            else if (monthlySavings < 1000) selectedValue = 7
            else if (monthlySavings < 2000) selectedValue = 9
            else selectedValue = 10.5
            setFormData(prev => ({ ...prev, monthly_savings: selectedValue }))
          }}
          onCancel={() => setShowSavingsCalculator(false)}
        />
      </CalculatorModal>
    </div>
  )
} 