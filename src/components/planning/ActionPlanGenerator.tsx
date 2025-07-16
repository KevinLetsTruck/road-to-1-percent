'use client'

import { useState } from 'react'
import { Target, Calendar, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react'

interface ActionPlan {
  id: string
  title: string
  description: string
  category: 'financial' | 'business' | 'personal' | 'health'
  priority: 'low' | 'medium' | 'high'
  goal: string
  targetValue?: number
  currentValue?: number
  unit?: string
  actions: string[]
  timeline: string
  resources: string[]
}

interface ActionPlanGeneratorProps {
  assessmentScores: {
    financial?: number
    business?: number
    personal?: number
    health?: number
    overall?: number
  }
  userTier: string
  onGeneratePlan: (plans: ActionPlan[]) => void
}

export default function ActionPlanGenerator({ 
  assessmentScores, 
  userTier, 
  onGeneratePlan 
}: ActionPlanGeneratorProps) {
  const [generating, setGenerating] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['financial', 'business', 'personal'])

  const generateActionPlans = async () => {
    setGenerating(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const plans: ActionPlan[] = []
    
    // Financial Action Plans
    if (selectedCategories.includes('financial') && assessmentScores.financial !== undefined) {
      if (assessmentScores.financial < 70) {
        plans.push({
          id: 'financial-1',
          title: 'Build Emergency Fund',
          description: 'Establish a solid financial foundation with emergency savings',
          category: 'financial',
          priority: 'high',
          goal: 'Save 6 months of expenses',
          targetValue: 6,
          currentValue: Math.max(0, assessmentScores.financial / 16.67), // Rough estimate
          unit: 'months',
          actions: [
            'Calculate your monthly expenses',
            'Set up automatic savings transfers',
            'Open a high-yield savings account',
            'Reduce non-essential expenses by 20%',
            'Track your progress monthly'
          ],
          timeline: '6 months',
          resources: [
            'Budget tracking app',
            'High-yield savings account',
            'Financial advisor consultation'
          ]
        })
      }
      
      if (assessmentScores.financial < 85) {
        plans.push({
          id: 'financial-2',
          title: 'Optimize Business Finances',
          description: 'Improve profit margins and cash flow management',
          category: 'financial',
          priority: 'medium',
          goal: 'Increase profit margin by 15%',
          targetValue: 15,
          currentValue: assessmentScores.financial,
          unit: 'percentage',
          actions: [
            'Analyze current expenses and identify savings opportunities',
            'Negotiate better rates with suppliers',
            'Implement fuel efficiency strategies',
            'Review insurance policies for better rates',
            'Set up separate business and personal accounts'
          ],
          timeline: '3 months',
          resources: [
            'Accounting software',
            'Fuel card programs',
            'Business banking services'
          ]
        })
      }
    }
    
    // Business Action Plans
    if (selectedCategories.includes('business') && assessmentScores.business !== undefined) {
      if (assessmentScores.business < 75) {
        plans.push({
          id: 'business-1',
          title: 'Expand Customer Base',
          description: 'Develop new customer relationships and improve retention',
          category: 'business',
          priority: 'high',
          goal: 'Add 5 new regular customers',
          targetValue: 5,
          currentValue: Math.max(0, assessmentScores.business / 20),
          unit: 'customers',
          actions: [
            'Create a professional business card and portfolio',
            'Join industry networking groups',
            'Ask current customers for referrals',
            'Develop a customer service excellence program',
            'Attend industry trade shows and events'
          ],
          timeline: '4 months',
          resources: [
            'Professional networking platforms',
            'Customer relationship management tools',
            'Industry association memberships'
          ]
        })
      }
    }
    
    // Personal Development Plans
    if (selectedCategories.includes('personal') && assessmentScores.personal !== undefined) {
      if (assessmentScores.personal < 80) {
        plans.push({
          id: 'personal-1',
          title: 'Enhance Professional Skills',
          description: 'Develop leadership and business management capabilities',
          category: 'personal',
          priority: 'medium',
          goal: 'Complete 3 professional development courses',
          targetValue: 3,
          currentValue: Math.max(0, assessmentScores.personal / 33.33),
          unit: 'courses',
          actions: [
            'Research relevant online courses in business management',
            'Enroll in a leadership development program',
            'Join a professional mentorship program',
            'Attend industry workshops and seminars',
            'Practice new skills in real business situations'
          ],
          timeline: '6 months',
          resources: [
            'Online learning platforms',
            'Professional development courses',
            'Mentorship programs'
          ]
        })
      }
    }
    
    // Health & Wellness Plans
    if (selectedCategories.includes('health') && assessmentScores.health !== undefined) {
      if (assessmentScores.health < 75) {
        plans.push({
          id: 'health-1',
          title: 'Improve Health & Wellness',
          description: 'Enhance physical and mental well-being for optimal performance',
          category: 'health',
          priority: 'medium',
          goal: 'Achieve consistent 7+ hours of quality sleep',
          targetValue: 7,
          currentValue: Math.max(0, assessmentScores.health / 14.29),
          unit: 'hours',
          actions: [
            'Establish a consistent sleep schedule',
            'Create a relaxing bedtime routine',
            'Optimize your sleeping environment',
            'Limit screen time before bed',
            'Practice stress management techniques'
          ],
          timeline: '3 months',
          resources: [
            'Sleep tracking app',
            'Meditation and relaxation apps',
            'Health and wellness resources'
          ]
        })
      }
    }
    
    // Tier-specific plans
    if (userTier === '90%') {
      plans.push({
        id: 'tier-1',
        title: 'Foundation Building',
        description: 'Focus on establishing solid fundamentals for business success',
        category: 'business',
        priority: 'high',
        goal: 'Complete all foundational assessments',
        targetValue: 100,
        currentValue: assessmentScores.overall || 0,
        unit: 'percentage',
        actions: [
          'Complete the comprehensive SPI assessment',
          'Establish emergency fund',
          'Build basic business systems',
          'Develop customer service processes',
          'Create a business plan'
        ],
        timeline: '6 months',
        resources: [
          'Business planning templates',
          'Financial planning tools',
          'Customer service training'
        ]
      })
    } else if (userTier === '9%') {
      plans.push({
        id: 'tier-2',
        title: 'Scale and Optimize',
        description: 'Focus on scaling operations and optimizing for growth',
        category: 'business',
        priority: 'high',
        goal: 'Increase revenue by 25%',
        targetValue: 25,
        currentValue: 0,
        unit: 'percentage',
        actions: [
          'Analyze current operations for efficiency gains',
          'Develop new revenue streams',
          'Optimize pricing strategies',
          'Expand customer base strategically',
          'Invest in technology and automation'
        ],
        timeline: '12 months',
        resources: [
          'Business analytics tools',
          'Automation software',
          'Strategic planning resources'
        ]
      })
    }
    
    setGenerating(false)
    onGeneratePlan(plans)
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial': return 'text-green-600 bg-green-50'
      case 'business': return 'text-blue-600 bg-blue-50'
      case 'personal': return 'text-purple-600 bg-purple-50'
      case 'health': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Generate Action Plan</h3>
        <p className="text-gray-600">
          Based on your assessment results, we'll create personalized action plans to help you reach the next tier.
        </p>
      </div>

      {/* Category Selection */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Select Focus Areas</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { key: 'financial', label: 'Financial', icon: '💰' },
            { key: 'business', label: 'Business', icon: '🏢' },
            { key: 'personal', label: 'Personal', icon: '🎯' },
            { key: 'health', label: 'Health', icon: '❤️' }
          ].map(category => (
            <button
              key={category.key}
              onClick={() => toggleCategory(category.key)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedCategories.includes(category.key)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{category.icon}</div>
              <div className="text-sm font-medium text-gray-900">{category.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Current Status */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Current Status</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(assessmentScores).map(([category, score]) => (
            <div key={category} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{score || 0}</div>
              <div className="text-sm text-gray-600 capitalize">{category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateActionPlans}
        disabled={generating || selectedCategories.length === 0}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {generating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Generating Plans...
          </>
        ) : (
          <>
            <Target className="w-4 h-4 mr-2" />
            Generate Action Plans
          </>
        )}
      </button>

      {selectedCategories.length === 0 && (
        <p className="text-sm text-gray-500 text-center mt-2">
          Please select at least one focus area to generate action plans.
        </p>
      )}
    </div>
  )
} 