'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TrendingUp, Target, Calendar, BarChart3 } from 'lucide-react'

interface ProgressEntry {
  date: string
  totalScore: number
  financialScore: number
  marketScore: number
  strengthsScore: number
  riskScore: number
  supportScore: number
}

interface SPIProgressChartProps {
  userId: string
}

export default function SPIProgressChart({ userId }: SPIProgressChartProps) {
  const [progressData, setProgressData] = useState<ProgressEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [currentScore, setCurrentScore] = useState(0)
  const [targetScore, setTargetScore] = useState(72)
  const [weeksToTarget, setWeeksToTarget] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // Get current user progress
        const { data: userProgress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (userProgress) {
          const current = userProgress.spi_score || 0
          setCurrentScore(current)
          
          // Calculate weeks to target (assuming 1 point per week)
          const pointsNeeded = targetScore - current
          setWeeksToTarget(Math.max(0, pointsNeeded))

          // Create sample progress data (in real app, this would come from progress tracking)
          const sampleData: ProgressEntry[] = [
            {
              date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              totalScore: Math.max(0, current - 4),
              financialScore: userProgress.financial_foundation_score || 0,
              marketScore: userProgress.market_intelligence_score || 0,
              strengthsScore: userProgress.personal_strengths_score || 0,
              riskScore: userProgress.risk_management_score || 0,
              supportScore: userProgress.support_systems_score || 0
            },
            {
              date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              totalScore: Math.max(0, current - 3),
              financialScore: userProgress.financial_foundation_score || 0,
              marketScore: userProgress.market_intelligence_score || 0,
              strengthsScore: userProgress.personal_strengths_score || 0,
              riskScore: userProgress.risk_management_score || 0,
              supportScore: userProgress.support_systems_score || 0
            },
            {
              date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              totalScore: Math.max(0, current - 2),
              financialScore: userProgress.financial_foundation_score || 0,
              marketScore: userProgress.market_intelligence_score || 0,
              strengthsScore: userProgress.personal_strengths_score || 0,
              riskScore: userProgress.risk_management_score || 0,
              supportScore: userProgress.support_systems_score || 0
            },
            {
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              totalScore: Math.max(0, current - 1),
              financialScore: userProgress.financial_foundation_score || 0,
              marketScore: userProgress.market_intelligence_score || 0,
              strengthsScore: userProgress.personal_strengths_score || 0,
              riskScore: userProgress.risk_management_score || 0,
              supportScore: userProgress.support_systems_score || 0
            },
            {
              date: new Date().toISOString().split('T')[0],
              totalScore: current,
              financialScore: userProgress.financial_foundation_score || 0,
              marketScore: userProgress.market_intelligence_score || 0,
              strengthsScore: userProgress.personal_strengths_score || 0,
              riskScore: userProgress.risk_management_score || 0,
              supportScore: userProgress.support_systems_score || 0
            }
          ]
          
          setProgressData(sampleData)
        }
      } catch (error) {
        console.error('Error fetching progress:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [userId, targetScore, supabase])

  const getTierColor = (score: number) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 50) return 'text-blue-600'
    return 'text-red-600'
  }

  const getTierLabel = (score: number) => {
    if (score >= 70) return '1%'
    if (score >= 50) return '9%'
    return '90%'
  }

  const getWeeklyGoal = () => {
    if (currentScore >= targetScore) return 0
    return Math.ceil((targetScore - currentScore) / Math.max(1, weeksToTarget))
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
          SPI Progress Tracker
        </h2>
        <div className="text-right">
          <div className="text-sm text-gray-600">Target Score</div>
          <div className="text-lg font-bold text-indigo-600">{targetScore}/100</div>
        </div>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="text-2xl font-bold">{currentScore}</div>
          <div className="text-indigo-100 text-sm">Current Score</div>
          <div className="text-xs text-indigo-200 mt-1">{getTierLabel(currentScore)} Tier</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{targetScore - currentScore}</div>
          <div className="text-green-800 text-sm">Points to Target</div>
          <div className="text-xs text-green-600 mt-1">Goal: {targetScore}</div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{weeksToTarget}</div>
          <div className="text-blue-800 text-sm">Weeks to Target</div>
          <div className="text-xs text-blue-600 mt-1">At 1 pt/week</div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{getWeeklyGoal()}</div>
          <div className="text-purple-800 text-sm">Weekly Goal</div>
          <div className="text-xs text-purple-600 mt-1">Points needed</div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-gray-600" />
          4-Week Progress Trend
        </h3>
        
        <div className="space-y-3">
          {progressData.map((entry, index) => (
            <div key={entry.date} className="flex items-center space-x-4">
              <div className="w-20 text-sm text-gray-600">
                {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(entry.totalScore / 100) * 100}%` }}
                ></div>
              </div>
              
              <div className="w-16 text-right">
                <div className={`text-sm font-semibold ${getTierColor(entry.totalScore)}`}>
                  {entry.totalScore}
                </div>
                <div className="text-xs text-gray-500">{getTierLabel(entry.totalScore)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dimension Breakdown */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-gray-600" />
          Dimension Scores
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {progressData[progressData.length - 1]?.financialScore || 0}/35
            </div>
            <div className="text-xs text-gray-600">Financial</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {progressData[progressData.length - 1]?.marketScore || 0}/20
            </div>
            <div className="text-xs text-gray-600">Market</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {progressData[progressData.length - 1]?.strengthsScore || 0}/20
            </div>
            <div className="text-xs text-gray-600">Strengths</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">
              {progressData[progressData.length - 1]?.riskScore || 0}/15
            </div>
            <div className="text-xs text-gray-600">Risk</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">
              {progressData[progressData.length - 1]?.supportScore || 0}/10
            </div>
            <div className="text-xs text-gray-600">Support</div>
          </div>
        </div>
      </div>

      {/* Weekly Goals */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-gray-600" />
          This Week's Goals
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Target Score Increase:</span>
            <span className="font-semibold text-indigo-600">+{getWeeklyGoal()} points</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Focus Area:</span>
            <span className="font-semibold text-green-600">Financial Foundation</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Quick Wins:</span>
            <span className="font-semibold text-blue-600">Track expenses, review insurance</span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
          <p className="text-sm text-indigo-800">
            <strong>Tip:</strong> Focus on your weakest dimension for maximum impact. 
            Each point gained in Financial Foundation (35% weight) has the biggest effect on your total score.
          </p>
        </div>
      </div>
    </div>
  )
} 