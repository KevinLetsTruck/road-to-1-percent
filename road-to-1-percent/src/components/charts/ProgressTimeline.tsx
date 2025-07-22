'use client'

import { CheckCircle, Circle, Target, TrendingUp } from 'lucide-react'

interface ProgressTimelineProps {
  currentTier: '90%' | '9%' | '1%'
  completedAssessments: number
  totalAssessments: number
  daysInProgram?: number
}

export default function ProgressTimeline({ 
  currentTier, 
  completedAssessments, 
  totalAssessments,
  daysInProgram = 0 
}: ProgressTimelineProps) {
  const tiers = [
    { 
      name: '90%', 
      title: 'Struggling', 
      description: 'Drivers and O/Os struggling with income and control',
      color: 'bg-gray-400',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-300'
    },
    { 
      name: '9%', 
      title: 'Building Success', 
      description: 'Building business and gaining control',
      color: 'bg-[#f59e0b]',
      textColor: 'text-[#d97706]',
      borderColor: 'border-[#f59e0b]'
    },
    { 
      name: '1%', 
      title: 'Elite Professional', 
      description: 'Thriving with multiple income streams',
      color: 'bg-[#1e3a8a]',
      textColor: 'text-[#1e40af]',
      borderColor: 'border-[#1e3a8a]'
    }
  ]

  const getCurrentTierIndex = () => {
    switch (currentTier) {
      case '90%': return 0
      case '9%': return 1
      case '1%': return 2
      default: return 0
    }
  }

  const currentIndex = getCurrentTierIndex()
  const progressPercentage = Math.round((completedAssessments / totalAssessments) * 100)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <TrendingUp className="h-6 w-6 text-[#1e3a8a] mr-3" />
        <h2 className="text-xl font-bold text-gray-900">Your Journey to 1%</h2>
      </div>

      {/* Timeline */}
      <div className="relative mb-8">
        <div className="flex items-center justify-between">
          {tiers.map((tier, index) => {
            const isCompleted = index < currentIndex
            const isCurrent = index === currentIndex
            const isFuture = index > currentIndex

            return (
              <div key={tier.name} className="flex flex-col items-center relative z-10">
                {/* Tier Circle */}
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-3
                  ${isCompleted ? tier.color : isCurrent ? tier.color : 'bg-gray-200'}
                  ${isCompleted ? 'text-white' : isCurrent ? 'text-white' : 'text-gray-400'}
                  border-2 ${tier.borderColor}
                `}>
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : isCurrent ? (
                    <Target className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </div>

                {/* Tier Info */}
                <div className="text-center max-w-32">
                  <div className={`font-bold text-sm ${tier.textColor}`}>
                    {tier.name}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    {tier.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {tier.description}
                  </div>
                </div>

                {/* Progress indicator for current tier */}
                {isCurrent && (
                  <div className="mt-3 text-center">
                    <div className="text-sm font-semibold text-[#1e3a8a]">
                      {progressPercentage}% Complete
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-[#1e3a8a] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Connection Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
      </div>

      {/* Current Status */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Current Status</h3>
            <p className="text-blue-100 text-sm">
              {currentTier === '90%' && 'Building your foundation'}
              {currentTier === '9%' && 'Growing your business'}
              {currentTier === '1%' && 'Leading the industry'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{completedAssessments}/{totalAssessments}</div>
            <div className="text-blue-100 text-sm">Assessments Complete</div>
          </div>
        </div>
      </div>

      {/* Next Milestone */}
      {currentTier !== '1%' && (
        <div className="mt-4 bg-[#f59e0b] rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Next Milestone</h3>
              <p className="text-yellow-100 text-sm">
                {currentTier === '90%' && 'Complete all assessments to start building success'}
                {currentTier === '9%' && 'Master business skills to reach elite status'}
              </p>
            </div>
            <Target className="h-8 w-8 text-yellow-100" />
          </div>
        </div>
      )}

      {/* Time in Program */}
      {daysInProgram > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          <span className="font-medium">{daysInProgram} days</span> in your journey to 1%
        </div>
      )}
    </div>
  )
} 