'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { ArrowLeft, TrendingUp, DollarSign, Brain, Shield, Users, Target, BarChart3, Lightbulb, Calendar, Users2 } from 'lucide-react'

interface DimensionBreakdown {
  name: string
  score: number
  maxScore: number
  percentage: number
  color: string
  icon: React.ReactNode
  description: string
  quickWins: string[]
  longTermGoals: string[]
}

function ComprehensiveAssessmentResultsContent() {
  const [user, setUser] = useState<User | null>(null)
  const [userProgress, setUserProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
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
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      setUserProgress(progress)
      setLoading(false)
      
      // Check if user just completed assessment (has score in URL)
      const urlParams = new URLSearchParams(window.location.search)
      const score = urlParams.get('score')
      if (score) {
        setShowSuccessMessage(true)
        // Clear the URL parameter
        window.history.replaceState({}, '', '/dashboard/comprehensive-assessment/results')
      }
    }
    getUser()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!userProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">No assessment results found</div>
      </div>
    )
  }

  const totalScore = userProgress.spi_score || 0
  const tier = userProgress.current_tier || '90%'
  const strengthCombo = userProgress.strength_combination || 'Balanced'

  const getSPITierDescription = (tier: string) => {
    switch (tier) {
      case '1%':
        return 'High probability of success. You have strong foundations across all dimensions.'
      case '9%':
        return 'Moderate probability of success. Focus on your weakest dimensions for rapid improvement.'
      default:
        return 'Low probability of success. Systematic improvement needed across all dimensions.'
    }
  }

  const getStrengthDescription = (combo: string) => {
    // Handle combination strengths
    if (combo.includes(' + ')) {
      return 'This unique combination of strengths provides you with exceptional capabilities. Focus on leveraging both strengths to maximize your potential.'
    }
    
    // Handle individual strengths
    const strengthDescriptions: Record<string, string> = {
      'Pioneer': 'Natural innovator who sees opportunities others miss. Focus on building systematic foundations.',
      'Influencer': 'Natural leader who inspires and motivates others. Use this to build strong networks and partnerships.',
      'Stimulator': 'Energizes and excites others about possibilities. Channel this enthusiasm into concrete action plans.',
      'Advisor': 'Trusted counselor who provides valuable guidance. Your insights help others make better decisions.',
      'Connector': 'Builds bridges between people and ideas. Your networking abilities create valuable opportunities.',
      'Provider': 'Reliable supporter who ensures others have what they need. Your consistency builds trust and loyalty.',
      'Equalizer': 'Creates fairness and balance in all situations. Your sense of justice helps build sustainable systems.',
      'Teacher': 'Natural educator who helps others grow. Your ability to explain complex ideas simply is invaluable.',
      'Creator': 'Innovative problem-solver who builds new solutions. Your creativity drives progress and improvement.'
    }
    
    return strengthDescriptions[combo] || 'Balanced strengths across multiple areas. Good foundation for steady improvement.'
  }

  const dimensionBreakdowns: DimensionBreakdown[] = [
    {
      name: 'Financial Foundation',
      score: userProgress.financial_foundation_score || 0,
      maxScore: 35,
      percentage: Math.round(((userProgress.financial_foundation_score || 0) / 35) * 100),
      color: 'green',
      icon: <DollarSign className="w-5 h-5" />,
      description: 'Your financial foundation determines your ability to invest in opportunities and weather challenges.',
      quickWins: [
        'Track all expenses for one week',
        'Cancel unused subscriptions',
        'Review insurance policies for better rates',
        'Start emergency fund with $500'
      ],
      longTermGoals: [
        'Build 6-month emergency fund',
        'Improve credit score to 700+',
        'Create business capital fund',
        'Develop passive income streams'
      ]
    },
    {
      name: 'Market Intelligence',
      score: userProgress.market_intelligence_score || 0,
      maxScore: 20,
      percentage: Math.round(((userProgress.market_intelligence_score || 0) / 20) * 100),
      color: 'blue',
      icon: <Brain className="w-5 h-5" />,
      description: 'Understanding the market, rates, and customer needs is crucial for making profitable decisions.',
      quickWins: [
        'Calculate your true cost per mile',
        'Research seasonal rate patterns',
        'Build relationships with 3 customers',
        'Join industry forums and groups'
      ],
      longTermGoals: [
        'Develop direct customer relationships',
        'Create rate optimization system',
        'Build market prediction models',
        'Establish industry reputation'
      ]
    },
    {
      name: 'Personal Strengths',
      score: userProgress.personal_strengths_score || 0,
      maxScore: 20,
      percentage: Math.round(((userProgress.personal_strengths_score || 0) / 20) * 100),
      color: 'purple',
      icon: <Target className="w-5 h-5" />,
      description: 'Your natural strengths determine how you approach challenges and opportunities.',
      quickWins: [
        'Identify your top 3 strengths',
        'Find accountability partner with complementary strengths',
        'Document innovative ideas in opportunity journal',
        'Practice strength-based problem solving'
      ],
      longTermGoals: [
        'Develop systematic approach to innovation',
        'Build team around complementary strengths',
        'Create strength-based business model',
        'Become mentor for others with similar strengths'
      ]
    },
    {
      name: 'Risk Management',
      score: userProgress.risk_management_score || 0,
      maxScore: 15,
      percentage: Math.round(((userProgress.risk_management_score || 0) / 15) * 100),
      color: 'red',
      icon: <Shield className="w-5 h-5" />,
      description: 'How well you prepare for and manage risks determines your business sustainability.',
      quickWins: [
        'Review and optimize insurance coverage',
        'Create basic contingency plans',
        'Document emergency procedures',
        'Identify top 3 business risks'
      ],
      longTermGoals: [
        'Build comprehensive risk management system',
        'Develop business continuity plan',
        'Create multiple income streams',
        'Establish professional advisory team'
      ]
    },
    {
      name: 'Support Systems',
      score: userProgress.support_systems_score || 0,
      maxScore: 10,
      percentage: Math.round(((userProgress.support_systems_score || 0) / 10) * 100),
      color: 'orange',
      icon: <Users className="w-5 h-5" />,
      description: 'Your network, family support, and mentorship multiply your individual efforts.',
      quickWins: [
        'Join industry networking groups',
        'Connect with 3 successful operators',
        'Involve family in business planning',
        'Find accountability partner'
      ],
      longTermGoals: [
        'Build extensive professional network',
        'Develop mentor relationships',
        'Create family business culture',
        'Establish industry leadership position'
      ]
    }
  ]

  const getImprovementTimeline = (score: number) => {
    if (score >= 70) return 'Maintenance mode - focus on optimization'
    if (score >= 50) return '6-12 months to reach 1% tier'
    if (score >= 30) return '12-18 months to reach 9% tier'
    return '18-24 months to reach 9% tier'
  }

  const getNextSteps = () => {
    const lowestDimension = dimensionBreakdowns.reduce((lowest, current) => 
      current.percentage < lowest.percentage ? current : lowest
    )
    
    return {
      priority: lowestDimension.name,
      focus: `Focus on ${lowestDimension.name} for maximum impact`,
      quickWins: lowestDimension.quickWins.slice(0, 2),
      timeline: getImprovementTimeline(totalScore)
    }
  }

  const nextSteps = getNextSteps()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="mr-4 p-2 rounded-md hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <TrendingUp className="h-8 w-8 text-indigo-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Assessment Results</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Assessment Completed Successfully!
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    Your comprehensive SPI assessment has been saved. Here are your detailed results and personalized action plan.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Overall Score Card */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 text-white mb-8">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold mb-2">Your SPI Score: {totalScore}/100</h1>
              <p className="text-xl text-indigo-100 mb-4">Current Tier: {tier}</p>
              <p className="text-indigo-100">{getSPITierDescription(tier)}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{strengthCombo}</div>
                <div className="text-indigo-100 text-sm">Strength Combination</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{nextSteps.timeline}</div>
                <div className="text-indigo-100 text-sm">Improvement Timeline</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{nextSteps.priority}</div>
                <div className="text-indigo-100 text-sm">Priority Focus</div>
              </div>
            </div>
          </div>

          {/* Strength Combination Details */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2 text-yellow-600" />
              Your Strength Profile
            </h2>
            <p className="text-gray-600 mb-4">{getStrengthDescription(strengthCombo)}</p>
            {strengthCombo.includes(' + ') && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Special Note:</strong> Your {strengthCombo} combination is unique and powerful. 
                  This dual strength gives you exceptional versatility in approaching challenges and opportunities.
                </p>
              </div>
            )}
          </div>

          {/* Dimension Breakdown */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-indigo-600" />
              Dimension Breakdown
            </h2>
            
            <div className="space-y-6">
              {dimensionBreakdowns.map((dimension) => (
                <div key={dimension.name} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 bg-${dimension.color}-100`}>
                        <div className={`text-${dimension.color}-600`}>
                          {dimension.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{dimension.name}</h3>
                        <p className="text-sm text-gray-600">{dimension.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{dimension.score}/{dimension.maxScore}</div>
                      <div className="text-sm text-gray-600">{dimension.percentage}%</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className={`bg-${dimension.color}-600 h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${dimension.percentage}%` }}
                    ></div>
                  </div>
                  
                  {/* Quick Wins and Long Term Goals */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Target className="w-4 h-4 mr-1 text-green-600" />
                        Quick Wins (This Week)
                      </h4>
                      <ul className="space-y-1">
                        {dimension.quickWins.map((win, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {win}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-blue-600" />
                        Long Term Goals (3-12 Months)
                      </h4>
                      <ul className="space-y-1">
                        {dimension.longTermGoals.map((goal, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Target className="w-6 h-6 mr-2 text-green-600" />
              Your Action Plan
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Immediate Focus</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium mb-2">{nextSteps.focus}</p>
                  <ul className="space-y-1">
                    {nextSteps.quickWins.map((win, index) => (
                      <li key={index} className="text-sm text-green-700 flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {win}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium mb-2">{nextSteps.timeline}</p>
                  <p className="text-sm text-blue-700">
                    Focus on gaining 1 point per week through systematic improvement in your weakest dimensions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Community and Support */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Users2 className="w-6 h-6 mr-2 text-purple-600" />
              Community & Support
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="#" className="text-center p-4 border border-gray-200 rounded-lg hover:border-indigo-500 transition-colors cursor-pointer">
                <div className="text-2xl mb-2">📚</div>
                <h3 className="font-semibold text-gray-900 mb-2">Road Scholar</h3>
                <p className="text-sm text-gray-600">Join our 52 week Program</p>
              </a>
              <a href="https://letstrucktribe.com" target="_blank" rel="noopener noreferrer" className="text-center p-4 border border-gray-200 rounded-lg hover:border-indigo-500 transition-colors cursor-pointer">
                <div className="text-2xl mb-2">💬</div>
                <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
                <p className="text-sm text-gray-600">Connect with other drivers on similar journeys</p>
              </a>
              <a href="#" className="text-center p-4 border border-gray-200 rounded-lg hover:border-indigo-500 transition-colors cursor-pointer">
                <div className="text-2xl mb-2">👥</div>
                <h3 className="font-semibold text-gray-900 mb-2">Apply to be a Mentor / Find a Mentor</h3>
                <p className="text-sm text-gray-600">Get guidance from successful operators</p>
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => router.push('/dashboard/progress')}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Track Progress
            </button>
            <button
              onClick={() => router.push('/dashboard/insights')}
              className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              View Insights
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ComprehensiveAssessmentResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ComprehensiveAssessmentResultsContent />
    </Suspense>
  )
} 