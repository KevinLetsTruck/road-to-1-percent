'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { ArrowLeft, TrendingUp, DollarSign, Brain, Shield, Users, Target, BarChart3, Lightbulb, Calendar, Users2, LogOut, Settings, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { calculateStandoutScore, getStandoutTier } from '@/lib/standoutScoring'

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
  const [isAdmin, setIsAdmin] = useState(false)

  const router = useRouter()
  const supabase = createClient()
  const { signOut } = useAuth()
  
  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }


  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      
      // Check if user is admin from database
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()
      
      setIsAdmin(profile?.is_admin || false)
      
      // Get user progress
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      setUserProgress(progress)
      
      // Get comprehensive assessment for standout strengths
      const { data: assessment } = await supabase
        .from('comprehensive_assessments')
        .select('standout_strength_1, standout_strength_2')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (assessment) {
        setUserProgress((prev: any) => ({ 
          ...prev, 
          standout_strength_1: assessment.standout_strength_1,
          standout_strength_2: assessment.standout_strength_2
        }))
      }
      
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
  
  // Calculate standout score
  const standoutResult = calculateStandoutScore(
    userProgress.standout_strength_1 || '', 
    userProgress.standout_strength_2 || ''
  )
  const standoutScore = standoutResult.score
  const standoutDescription = standoutResult.description
  const standoutTier = getStandoutTier(standoutScore)
  
  // Base score is total minus standout bonus
  const baseScore = Math.max(0, totalScore - standoutScore)

  const getSPITierDescription = (tier: string) => {
    switch (tier) {
      case '1%':
        return 'Elite Performer - Top 1%'
      case '9%':
        return 'High Achiever - Top 9%'
      case '90%':
        return 'Building Foundation - Bottom 90%'
      default:
        return 'Building Foundation'
    }
  }

  const getStrengthDescription = (combo: string) => {
    // This is now replaced by getStrengthInsights below
    return ''
  }

  const getStrengthInsights = (combo: string) => {
    const insights: Record<string, {
      title: string
      description: string
      strengths: string[]
      watchOuts: string[]
      leverageTips: string[]
      successProfile: string
    }> = {
      'Pioneer': {
        title: 'The Trailblazer',
        description: 'You see opportunities where others see obstacles. Your innovative mindset is perfect for finding new lanes, untapped markets, and creative solutions in the trucking industry.',
        strengths: [
          'First to spot emerging market trends',
          'Creates new revenue streams',
          'Innovates operational processes',
          'Takes calculated risks others avoid'
        ],
        watchOuts: [
          'May overlook proven traditional methods',
          'Could move too fast for partners/employees',
          'Might neglect necessary but boring tasks'
        ],
        leverageTips: [
          'Focus on specialized or niche freight markets',
          'Be the first in your area to adopt new technologies',
          'Create unique service offerings competitors don\'t have',
          'Document your innovations to build systematic processes'
        ],
        successProfile: 'Pioneers succeed by finding blue ocean opportunities - new routes, underserved markets, or innovative service models that set them apart.'
      },
      'Influencer': {
        title: 'The Leader',
        description: 'Your natural charisma and leadership abilities help you build strong relationships with shippers, brokers, and drivers. People trust and want to work with you.',
        strengths: [
          'Builds loyal customer relationships',
          'Attracts and retains quality drivers',
          'Negotiates favorable rates',
          'Creates positive company culture'
        ],
        watchOuts: [
          'May over-promise to please others',
          'Could focus too much on relationships over numbers',
          'Might avoid difficult conversations'
        ],
        leverageTips: [
          'Use your influence to secure dedicated lanes',
          'Build a reputation that attracts owner-operators',
          'Create content/videos to establish industry authority',
          'Leverage relationships for better freight rates'
        ],
        successProfile: 'Influencers thrive by becoming the preferred carrier through relationship strength, often commanding premium rates due to trust and reliability.'
      },
      'Stimulator': {
        title: 'The Energizer',
        description: 'Your enthusiasm is contagious. You excel at motivating others and creating excitement around goals, making you great at rallying teams and pushing through challenges.',
        strengths: [
          'Motivates drivers during tough times',
          'Creates energy around company vision',
          'Pushes through obstacles with optimism',
          'Inspires others to exceed expectations'
        ],
        watchOuts: [
          'May underestimate real challenges',
          'Could burn out from constant high energy',
          'Might frustrate detail-oriented team members'
        ],
        leverageTips: [
          'Channel enthusiasm into driver retention programs',
          'Create exciting incentive structures',
          'Use energy to push through slow seasons',
          'Build a positive, can-do company culture'
        ],
        successProfile: 'Stimulators build successful companies by maintaining high morale and momentum, especially valuable during industry downturns.'
      },
      'Advisor': {
        title: 'The Strategist',
        description: 'Your analytical mind and wisdom help you make calculated decisions. You excel at seeing the big picture and guiding others through complex situations.',
        strengths: [
          'Makes data-driven decisions',
          'Provides valuable guidance to others',
          'Sees problems before they occur',
          'Builds trust through expertise'
        ],
        watchOuts: [
          'May over-analyze and delay decisions',
          'Could seem detached or overly logical',
          'Might struggle with quick pivots'
        ],
        leverageTips: [
          'Become the go-to expert in your niche',
          'Offer consulting to other owner-operators',
          'Use analysis to find most profitable lanes',
          'Build systems based on your insights'
        ],
        successProfile: 'Advisors succeed through careful planning and risk management, often achieving the best profit margins through strategic decision-making.'
      },
      'Connector': {
        title: 'The Network Builder',
        description: 'You naturally bring people together and see connections others miss. Your networking abilities open doors and create opportunities in the relationship-driven trucking industry.',
        strengths: [
          'Builds extensive industry networks',
          'Connects shippers with solutions',
          'Creates win-win partnerships',
          'Finds resources through relationships'
        ],
        watchOuts: [
          'May spread yourself too thin',
          'Could rely too heavily on others',
          'Might struggle working in isolation'
        ],
        leverageTips: [
          'Build a network of reliable freight sources',
          'Create partnerships with other carriers',
          'Connect shippers to build dedicated routes',
          'Use connections to find best deals on equipment/fuel'
        ],
        successProfile: 'Connectors thrive by becoming the hub of their local trucking ecosystem, often handling overflow freight and building carrier networks.'
      },
      'Provider': {
        title: 'The Reliable One',
        description: 'Your commitment to taking care of others makes you a trusted partner. You excel at ensuring everyone has what they need to succeed.',
        strengths: [
          'Builds unshakeable customer loyalty',
          'Takes care of drivers like family',
          'Always delivers on promises',
          'Creates stable, long-term relationships'
        ],
        watchOuts: [
          'May sacrifice profits to help others',
          'Could neglect own needs',
          'Might be taken advantage of'
        ],
        leverageTips: [
          'Build reputation as most reliable carrier',
          'Focus on consistent, repeat customers',
          'Create driver-first policies for retention',
          'Develop backup plans for everything'
        ],
        successProfile: 'Providers succeed through consistency and reliability, often becoming the carrier of choice for shippers who value dependability over price.'
      },
      'Equalizer': {
        title: 'The Fair Dealer',
        description: 'Your strong sense of fairness and justice helps you build trust with everyone. You create win-win situations and ensure everyone gets a fair deal.',
        strengths: [
          'Negotiates fair deals for all parties',
          'Resolves conflicts effectively',
          'Builds trust through transparency',
          'Creates sustainable partnerships'
        ],
        watchOuts: [
          'May spend too much time on fairness',
          'Could miss opportunities while deliberating',
          'Might struggle with tough business decisions'
        ],
        leverageTips: [
          'Become known for honest, fair dealings',
          'Mediate between shippers and carriers',
          'Build transparent pricing models',
          'Create fair driver compensation plans'
        ],
        successProfile: 'Equalizers build lasting success through reputation, often becoming the preferred partner for companies tired of unfair practices.'
      },
      'Teacher': {
        title: 'The Mentor',
        description: 'Your ability to explain and educate makes you valuable in an industry full of complexity. You help others understand and succeed.',
        strengths: [
          'Trains drivers to excellence',
          'Educates customers on logistics',
          'Builds knowledgeable teams',
          'Simplifies complex regulations'
        ],
        watchOuts: [
          'May over-explain simple things',
          'Could create dependent relationships',
          'Might focus too much on teaching vs doing'
        ],
        leverageTips: [
          'Create training programs for new drivers',
          'Educate shippers to build partnerships',
          'Develop SOPs and documentation',
          'Mentor other owner-operators for additional income'
        ],
        successProfile: 'Teachers succeed by building the most capable teams and educated partners, often commanding premium rates for superior service quality.'
      },
      'Creator': {
        title: 'The Innovator',
        description: 'Your creative problem-solving abilities help you find unique solutions. You excel at building new systems and improving existing ones.',
        strengths: [
          'Develops innovative solutions',
          'Improves operational efficiency',
          'Creates unique service offerings',
          'Solves problems others can\'t'
        ],
        watchOuts: [
          'May over-engineer simple solutions',
          'Could get distracted by new ideas',
          'Might struggle with routine tasks'
        ],
        leverageTips: [
          'Create proprietary logistics solutions',
          'Develop apps or tools for efficiency',
          'Design unique service packages',
          'Patent innovative equipment modifications'
        ],
        successProfile: 'Creators succeed by solving industry problems in new ways, often developing solutions that become industry standards.'
      }
    }

    // Handle combinations
    if (combo && combo.includes(' + ')) {
      const parts = combo.split(' + ')
      if (parts.length === 2) {
        const [first, second] = parts
        const firstInsights = insights[first.trim()]
        const secondInsights = insights[second.trim()]
        
        if (firstInsights && secondInsights) {
          // Safely extract description parts
          const firstDesc = firstInsights.description?.split('.')[0]?.toLowerCase() || 'excel in your primary area'
          const secondDesc = secondInsights.description?.split('.')[0]?.toLowerCase() || 'bring additional strengths'
          
          // Safely extract success profile parts
          const firstSuccess = firstInsights.successProfile?.split(' by ')[1]?.split('.')[0] || 'leveraging your primary strength'
          const secondSuccess = secondInsights.successProfile?.split(' by ')[1]?.split('.')[0] || 'utilizing your secondary strength'
          
          return {
            title: `${firstInsights.title} + ${secondInsights.title}`,
            description: `You possess a rare combination: ${firstDesc} while also ${secondDesc}. This dual strength creates unique opportunities in trucking.`,
            strengths: [
              ...(firstInsights.strengths?.slice(0, 2) || []),
              ...(secondInsights.strengths?.slice(0, 2) || [])
            ],
            watchOuts: [
              ...(firstInsights.watchOuts?.slice(0, 2) || []),
              ...(secondInsights.watchOuts?.slice(0, 1) || [])
            ],
            leverageTips: [
              `Combine ${first} and ${second} strengths for maximum impact`,
              ...(firstInsights.leverageTips?.slice(0, 2) || []),
              ...(secondInsights.leverageTips?.slice(0, 2) || [])
            ],
            successProfile: `This powerful combination allows you to ${firstSuccess} while ${secondSuccess}, creating a unique competitive advantage.`
          }
        }
      }
    }
    
    // Return specific insights or default
    return insights[combo] || insights['Pioneer'] || {
      title: 'Balanced Leader',
      description: 'You have a balanced approach to business ownership with strengths across multiple areas.',
      strengths: ['Adaptable to various situations', 'Well-rounded skill set', 'Flexible approach', 'Steady progress'],
      watchOuts: ['May lack specialized expertise', 'Could be overlooked for specific roles', 'Need to develop signature strength'],
      leverageTips: ['Identify your strongest area to specialize', 'Build a team with complementary strengths', 'Focus on consistency', 'Develop systems for all areas'],
      successProfile: 'Balanced leaders succeed through consistency and adaptability, building stable businesses that weather market changes.'
    }
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

  // Calculate probability of success based on SPI score
  const getProbabilityData = (score: number) => {
    let probability = 0
    let tier = ''
    let color = ''
    let message = ''
    let icon = ''
    
    if (score >= 85) {
      // Score 85-100 → Probability 85-100%
      probability = 85 + Math.floor((score - 85) / 15 * 15)
      tier = '85-100%'
      color = 'green'
      icon = '🚀'
      message = 'Elite Performance - You\'re in the top 1% with exceptional foundation'
    } else if (score >= 70) {
      // Score 70-84 → Probability 70-84%
      probability = 70 + Math.floor((score - 70) / 15 * 15)
      tier = '70-84%'
      color = 'blue'
      icon = '📈'
      message = 'High Performance - Top 9% with strong success indicators'
    } else if (score >= 50) {
      // Score 50-69 → Probability 50-69%
      probability = 50 + Math.floor((score - 50) / 20 * 20)
      tier = '50-69%'
      color = 'yellow'
      icon = '⚡'
      message = 'Above Average - Building strong foundation with growth potential'
    } else if (score >= 30) {
      // Score 30-49 → Probability 30-49%
      probability = 30 + Math.floor((score - 30) / 20 * 20)
      tier = '30-49%'
      color = 'orange'
      icon = '🎯'
      message = 'Developing - Building foundation with focused improvement needed'
    } else {
      // Score 0-29 → Probability 10-29%
      probability = 10 + Math.floor(score / 30 * 20)
      tier = '10-29%'
      color = 'red'
      icon = '🔧'
      message = 'Foundation Phase - Significant improvements needed across multiple areas'
    }
    
    return { probability, tier, color, message, icon }
  }

  const probabilityData = getProbabilityData(totalScore)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-2" />
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Your SPI Assessment Results</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">{user?.email}</span>
              {isAdmin && (
                <button
                  onClick={() => router.push('/admin/dashboard')}
                  className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Admin</span>
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                    Assessment Completed Successfully!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Your comprehensive SPI assessment has been saved. Here are your detailed results and personalized action plan.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* New Stunning Score and Probability Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* SPI Score Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 dark:from-indigo-600/20 dark:to-purple-600/20 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">SPI Total Score</h2>
                <div className="flex items-baseline mb-2">
                  <span className="text-6xl font-bold text-gray-900 dark:text-gray-100">{totalScore}</span>
                  <span className="text-2xl text-gray-500 dark:text-gray-300 ml-2">/100</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <div>Assessment Score: {Math.round(baseScore * 0.8)}/80</div>
                  <div>Standout Bonus: +{Math.round(standoutScore * 2)}/20</div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${totalScore}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Tier: {tier}</span>
                                      <span className="text-sm text-gray-500 dark:text-gray-300">{getSPITierDescription(tier)}</span>
                </div>
              </div>
            </div>

            {/* Probability of Success Card */}
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 relative overflow-hidden border-2 ${
              probabilityData.color === 'green' ? 'border-green-500' :
              probabilityData.color === 'blue' ? 'border-blue-500' :
              probabilityData.color === 'yellow' ? 'border-yellow-500' :
              probabilityData.color === 'orange' ? 'border-orange-500' :
              'border-red-500'
            }`}>
              <div className={`absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl ${
                probabilityData.color === 'green' ? 'bg-green-400/20 dark:bg-green-600/20' :
                probabilityData.color === 'blue' ? 'bg-blue-400/20 dark:bg-blue-600/20' :
                probabilityData.color === 'yellow' ? 'bg-yellow-400/20 dark:bg-yellow-600/20' :
                probabilityData.color === 'orange' ? 'bg-orange-400/20 dark:bg-orange-600/20' :
                'bg-red-400/20 dark:bg-red-600/20'
              }`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Success Probability</h2>
                  <span className="text-3xl">{probabilityData.icon}</span>
                </div>
                <div className="flex items-baseline mb-4">
                  <span className={`text-6xl font-bold ${
                    probabilityData.color === 'green' ? 'text-green-600 dark:text-green-400' :
                    probabilityData.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    probabilityData.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                    probabilityData.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>{probabilityData.probability}%</span>
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                  probabilityData.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  probabilityData.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  probabilityData.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  probabilityData.color === 'orange' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {probabilityData.tier} Probability Range
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {probabilityData.message}
                </p>
                
                {/* Probability Meter */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-300 mb-1">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                  <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="absolute inset-0 flex">
                      <div className="w-1/5 bg-red-200 dark:bg-red-900/50"></div>
                      <div className="w-1/5 bg-orange-200 dark:bg-orange-900/50"></div>
                      <div className="w-1/5 bg-yellow-200 dark:bg-yellow-900/50"></div>
                      <div className="w-1/5 bg-blue-200 dark:bg-blue-900/50"></div>
                      <div className="w-1/5 bg-green-200 dark:bg-green-900/50"></div>
                    </div>
                    <div 
                      className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${
                        probabilityData.color === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                        probabilityData.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                        probabilityData.color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                        probabilityData.color === 'orange' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                        'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: `${probabilityData.probability}%` }}
                    ></div>
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-1 h-5 bg-gray-900 dark:bg-gray-100 transition-all duration-1000 ease-out"
                      style={{ left: `${probabilityData.probability}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Score Card - Updated Design */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 text-white mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2">Performance Summary</h2>
              <p className="text-indigo-100">Your comprehensive assessment results and next steps</p>
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

          {/* Enhanced Strength Profile Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2 text-yellow-600 dark:text-yellow-400" />
                Your Standout Strength Profile
              </h2>
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-300">Bonus Points</div>
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">+{Math.round(standoutScore * 2)}</div>
              </div>
            </div>
            
            {(() => {
              const insights = getStrengthInsights(strengthCombo)
              return (
                <>
                  {/* Title and Type Badge */}
                  <div className="mb-6">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{insights.title}</h3>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        standoutTier === 'Power Combination' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        standoutTier === 'Strong Combination' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        standoutTier === 'Supportive Combination' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {standoutTier}
                      </span>
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{insights.description}</p>
                  </div>

                  {/* Success Profile Card */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                    <div className="flex items-start">
                      <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">Your Success Profile</h4>
                        <p className="text-sm text-indigo-800 dark:text-indigo-300">{insights.successProfile}</p>
                      </div>
                    </div>
                  </div>

                  {/* Three Column Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Your Strengths */}
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                        Your Strengths
                      </h4>
                      <ul className="space-y-2">
                        {insights.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-green-800 dark:text-green-200 flex items-start">
                            <span className="text-green-500 dark:text-green-400 mr-2">✓</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Watch Out For */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                      <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-3 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2 text-amber-600 dark:text-amber-400" />
                        Watch Out For
                      </h4>
                      <ul className="space-y-2">
                        {insights.watchOuts.map((watchOut, index) => (
                          <li key={index} className="text-sm text-amber-800 dark:text-amber-200 flex items-start">
                            <span className="text-amber-500 dark:text-amber-400 mr-2">!</span>
                            {watchOut}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* How to Leverage */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        How to Leverage
                      </h4>
                      <ul className="space-y-2">
                        {insights.leverageTips.map((tip, index) => (
                          <li key={index} className="text-sm text-blue-800 dark:text-blue-200 flex items-start">
                            <span className="text-blue-500 dark:text-blue-400 mr-2">→</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Combination Special Note */}
                  {strengthCombo.includes(' + ') && (
                    <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                      <p className="text-sm text-purple-800 dark:text-purple-200">
                        <strong>Dual Strength Advantage:</strong> Your combination of {strengthCombo} is rare and powerful. 
                        Less than 15% of successful owner-operators have this dual strength profile. Use both strengths strategically to create unique competitive advantages.
                      </p>
                    </div>
                  )}
                </>
              )
            })()}
          </div>

          {/* Dimension Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
              Dimension Breakdown
            </h2>
            
            <div className="space-y-6">
              {dimensionBreakdowns.map((dimension) => (
                <div key={dimension.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 bg-${dimension.color}-100 dark:bg-${dimension.color}-900`}>
                        <div className={`text-${dimension.color}-600 dark:text-${dimension.color}-400`}>
                          {dimension.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{dimension.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{dimension.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{dimension.score}/{dimension.maxScore}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{dimension.percentage}%</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                    <div 
                      className={`bg-${dimension.color}-600 dark:bg-${dimension.color}-400 h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${dimension.percentage}%` }}
                    ></div>
                  </div>
                  
                  {/* Quick Wins and Long Term Goals */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                        <Target className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" />
                        Quick Wins (This Week)
                      </h4>
                      <ul className="space-y-1">
                        {dimension.quickWins.map((win, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                            <span className="text-green-500 dark:text-green-400 mr-2">•</span>
                            {win}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-400" />
                        Long Term Goals (3-12 Months)
                      </h4>
                      <ul className="space-y-1">
                        {dimension.longTermGoals.map((goal, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                            <span className="text-blue-500 dark:text-blue-400 mr-2">•</span>
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Target className="w-6 h-6 mr-2 text-green-600 dark:text-green-400" />
              Your Action Plan
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Immediate Focus</h3>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-800 dark:text-green-200 font-medium mb-2">{nextSteps.focus}</p>
                  <ul className="space-y-1">
                    {nextSteps.quickWins.map((win, index) => (
                      <li key={index} className="text-sm text-green-700 dark:text-green-300 flex items-start">
                        <span className="text-green-500 dark:text-green-400 mr-2">•</span>
                        {win}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Timeline</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-blue-800 dark:text-blue-200 font-medium mb-2">{nextSteps.timeline}</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Focus on gaining 1 point per week through systematic improvement in your weakest dimensions.
                  </p>
                </div>
              </div>
            </div>
          </div>

                  {/* Update Assessment Button */}
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={() => router.push('/dashboard/comprehensive-assessment')}
            className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-lg"
          >
            Update Your Assessment
          </button>
          
          {/* Link to Dashboard View */}
          <button
            onClick={() => router.push('/dashboard/comprehensive-assessment/results-dashboard')}
            className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
          >
            🚛 Try the Truck Dashboard View
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