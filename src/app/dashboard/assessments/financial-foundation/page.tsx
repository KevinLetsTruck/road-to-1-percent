'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { ArrowLeft, TrendingUp, DollarSign, Briefcase, CreditCard, AlertCircle } from 'lucide-react'

interface SPIFormData {
  cash_checking: number
  savings: number
  investments: number
  retirement: number
  real_estate: number
  vehicles: number
  equipment: number
  other_assets: number
  credit_cards: number
  auto_loans: number
  mortgage: number
  equipment_loans: number
  personal_loans: number
  other_debts: number
  monthly_income: number
  monthly_expenses: number
  emergency_fund_months: number
}

export default function SPIAssessmentPage() {
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<SPIFormData>({
    cash_checking: 0,
    savings: 0,
    investments: 0,
    retirement: 0,
    real_estate: 0,
    vehicles: 0,
    equipment: 0,
    other_assets: 0,
    credit_cards: 0,
    auto_loans: 0,
    mortgage: 0,
    equipment_loans: 0,
    personal_loans: 0,
    other_debts: 0,
    monthly_income: 0,
    monthly_expenses: 0,
    emergency_fund_months: 0
  })
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
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

  const calculateSPIScore = (data: SPIFormData) => {
    const totalAssets = data.cash_checking + data.savings + data.investments + data.retirement + 
                       data.real_estate + data.vehicles + data.equipment + data.other_assets
    
    const totalDebts = data.credit_cards + data.auto_loans + data.mortgage + 
                      data.equipment_loans + data.personal_loans + data.other_debts
    
    const netWorth = totalAssets - totalDebts
    const monthlySavings = data.monthly_income - data.monthly_expenses
    const emergencyFund = data.monthly_expenses * data.emergency_fund_months
    
    // Financial Foundation scoring based on Tom Peterson's SPI system (35% of total SPI)
    let financialScore = 0
    
    // Net worth component (40% of Financial Foundation score)
    if (netWorth > 50000) financialScore += 14
    else if (netWorth > 10000) financialScore += 12
    else if (netWorth > 0) financialScore += 10
    else if (netWorth > -10000) financialScore += 6
    else if (netWorth > -25000) financialScore += 3
    else financialScore += 0
    
    // Monthly savings component (30% of Financial Foundation score)
    if (monthlySavings > 2000) financialScore += 10.5
    else if (monthlySavings > 1000) financialScore += 9
    else if (monthlySavings > 500) financialScore += 7
    else if (monthlySavings > 0) financialScore += 4
    else financialScore += 0
    
    // Emergency fund component (20% of Financial Foundation score)
    if (emergencyFund >= data.monthly_expenses * 6) financialScore += 7
    else if (emergencyFund >= data.monthly_expenses * 3) financialScore += 5
    else if (emergencyFund >= data.monthly_expenses) financialScore += 3
    else financialScore += 0
    
    // Debt-to-income ratio component (10% of Financial Foundation score)
    const debtToIncome = totalDebts / (data.monthly_income * 12)
    if (debtToIncome < 0.2) financialScore += 3.5
    else if (debtToIncome < 0.3) financialScore += 2.5
    else if (debtToIncome < 0.5) financialScore += 1.5
    else financialScore += 0
    
    // Convert to percentage (35% of total SPI)
    return Math.min(35, Math.max(0, Math.round(financialScore)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      if (!user) throw new Error('User not authenticated')

      const financialScore = calculateSPIScore(formData)
      const category = financialScore >= 28 ? 'Excellent' : financialScore >= 21 ? 'Good' : financialScore >= 14 ? 'Fair' : 'Needs Improvement'

      // Save assessment data
      const { error: assessmentError } = await supabase
        .from('spi_assessments')
        .insert({
          user_id: user.id,
          ...formData,
          overall_spi_score: financialScore,
          category,
          assessment_date: new Date().toISOString()
        })

      if (assessmentError) throw assessmentError

      // Update user progress
      const { error: progressError } = await supabase
        .from('user_progress')
        .update({ 
          financial_foundation_completed: true,
          financial_foundation_score: financialScore
        })
        .eq('user_id', user.id)

      if (progressError) throw progressError

      router.push('/dashboard?message=Financial Foundation Assessment completed successfully!')
    } catch (error: unknown) {
      setError((error as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof SPIFormData, value: string) => {
    const numValue = parseFloat(value) || 0
    setFormData(prev => ({ ...prev, [field]: numValue }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  const financialScore = calculateSPIScore(formData)

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
              <span className="text-xl font-bold text-gray-900">Financial Foundation Assessment</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Financial Foundation Assessment</h1>
              <p className="text-gray-600">
                This assessment evaluates your financial foundation including assets, liabilities, income, expenses, and emergency preparedness. It's the first step in building your path to the 1%.
              </p>
            </div>

            {/* Live SPI Score Display */}
            <div className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Your Financial Foundation Score</h2>
                  <p className="text-indigo-100">Updated in real-time as you fill the form</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{financialScore}</div>
                  <div className="text-indigo-100">out of 35</div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Assets Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Assets
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cash & Checking</label>
                    <input
                      type="number"
                      value={formData.cash_checking || ''}
                      onChange={(e) => handleInputChange('cash_checking', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Savings</label>
                    <input
                      type="number"
                      value={formData.savings || ''}
                      onChange={(e) => handleInputChange('savings', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Investments</label>
                    <input
                      type="number"
                      value={formData.investments || ''}
                      onChange={(e) => handleInputChange('investments', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Retirement</label>
                    <input
                      type="number"
                      value={formData.retirement || ''}
                      onChange={(e) => handleInputChange('retirement', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Real Estate</label>
                    <input
                      type="number"
                      value={formData.real_estate || ''}
                      onChange={(e) => handleInputChange('real_estate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicles</label>
                    <input
                      type="number"
                      value={formData.vehicles || ''}
                      onChange={(e) => handleInputChange('vehicles', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Debts Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-red-600" />
                  Debts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Credit Cards</label>
                    <input
                      type="number"
                      value={formData.credit_cards || ''}
                      onChange={(e) => handleInputChange('credit_cards', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Auto Loans</label>
                    <input
                      type="number"
                      value={formData.auto_loans || ''}
                      onChange={(e) => handleInputChange('auto_loans', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mortgage</label>
                    <input
                      type="number"
                      value={formData.mortgage || ''}
                      onChange={(e) => handleInputChange('mortgage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Personal Loans</label>
                    <input
                      type="number"
                      value={formData.personal_loans || ''}
                      onChange={(e) => handleInputChange('personal_loans', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Income & Expenses Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                  Monthly Income & Expenses
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income</label>
                    <input
                      type="number"
                      value={formData.monthly_income || ''}
                      onChange={(e) => handleInputChange('monthly_income', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Expenses</label>
                    <input
                      type="number"
                      value={formData.monthly_expenses || ''}
                      onChange={(e) => handleInputChange('monthly_expenses', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Fund (months of expenses)</label>
                    <input
                      type="number"
                      value={formData.emergency_fund_months || ''}
                      onChange={(e) => handleInputChange('emergency_fund_months', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="0"
                      min="0"
                      max="24"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Submitting...' : 'Complete Assessment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
} 