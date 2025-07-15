'use client'

import { useState } from 'react'
import { CheckCircle, Target, Calendar, TrendingUp, BookOpen, Users, DollarSign, Shield } from 'lucide-react'

interface AssessmentScores {
  financial_foundation: number
  market_intelligence: number
  personal_strengths: number
  risk_management: number
  support_systems: number
}

interface ActionPlanGeneratorProps {
  scores: AssessmentScores
  onSavePlan?: (plan: ActionItem[]) => void
}

interface ActionItem {
  id: string
  category: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  timeline: '30 days' | '60 days' | '90 days'
  completed: boolean
  resources?: string[]
}

export default function ActionPlanGenerator({ scores, onSavePlan }: ActionPlanGeneratorProps) {
  const [actionPlan, setActionPlan] = useState<ActionItem[]>([])
  const [generated, setGenerated] = useState(false)

  const generateActionPlan = () => {
    const plan: ActionItem[] = []

    // Financial Foundation Actions
    if (scores.financial_foundation < 20) {
      plan.push({
        id: 'fin-1',
        category: 'Financial Foundation',
        title: 'Build Emergency Fund',
        description: 'Save 3-6 months of expenses to create financial security',
        priority: 'high',
        timeline: '90 days',
        completed: false,
        resources: ['Budget tracking app', 'High-yield savings account']
      })
    }

    if (scores.financial_foundation < 25) {
      plan.push({
        id: 'fin-2',
        category: 'Financial Foundation',
        title: 'Reduce High-Interest Debt',
        description: 'Focus on paying off credit cards and high-interest loans first',
        priority: 'high',
        timeline: '60 days',
        completed: false,
        resources: ['Debt snowball calculator', 'Credit counseling service']
      })
    }

    // Market Intelligence Actions
    if (scores.market_intelligence < 12) {
      plan.push({
        id: 'market-1',
        category: 'Market Intelligence',
        title: 'Research Local Markets',
        description: 'Study freight patterns and rates in your target areas',
        priority: 'medium',
        timeline: '30 days',
        completed: false,
        resources: ['DAT RateView', 'FreightWaves', 'Local trucking associations']
      })
    }

    if (scores.market_intelligence < 15) {
      plan.push({
        id: 'market-2',
        category: 'Market Intelligence',
        title: 'Network with Other Drivers',
        description: 'Join online forums and attend industry events',
        priority: 'medium',
        timeline: '60 days',
        completed: false,
        resources: ['Trucking forums', 'Industry conferences', 'Local meetups']
      })
    }

    // Personal Strengths Actions
    if (scores.personal_strengths < 12) {
      plan.push({
        id: 'personal-1',
        category: 'Personal Strengths',
        title: 'Develop Communication Skills',
        description: 'Practice clear communication with dispatchers and customers',
        priority: 'medium',
        timeline: '30 days',
        completed: false,
        resources: ['Communication course', 'Practice scenarios', 'Feedback from peers']
      })
    }

    if (scores.personal_strengths < 15) {
      plan.push({
        id: 'personal-2',
        category: 'Personal Strengths',
        title: 'Build Leadership Confidence',
        description: 'Take on small leadership roles in your current position',
        priority: 'low',
        timeline: '90 days',
        completed: false,
        resources: ['Leadership books', 'Mentorship program', 'Volunteer opportunities']
      })
    }

    // Risk Management Actions
    if (scores.risk_management < 10) {
      plan.push({
        id: 'risk-1',
        category: 'Risk Management',
        title: 'Assess Personal Risk Tolerance',
        description: 'Understand your comfort level with business decisions',
        priority: 'medium',
        timeline: '30 days',
        completed: false,
        resources: ['Risk assessment tools', 'Financial advisor consultation']
      })
    }

    if (scores.risk_management < 12) {
      plan.push({
        id: 'risk-2',
        category: 'Risk Management',
        title: 'Create Business Contingency Plan',
        description: 'Develop backup plans for common business challenges',
        priority: 'low',
        timeline: '90 days',
        completed: false,
        resources: ['Business planning templates', 'Insurance consultation']
      })
    }

    // Support Systems Actions
    if (scores.support_systems < 6) {
      plan.push({
        id: 'support-1',
        category: 'Support Systems',
        title: 'Involve Family in Planning',
        description: 'Discuss your business goals with family members',
        priority: 'high',
        timeline: '30 days',
        completed: false,
        resources: ['Family meeting agenda', 'Goal-setting worksheets']
      })
    }

    if (scores.support_systems < 8) {
      plan.push({
        id: 'support-2',
        category: 'Support Systems',
        title: 'Build Customer Service Skills',
        description: 'Develop relationships with shippers and receivers',
        priority: 'medium',
        timeline: '60 days',
        completed: false,
        resources: ['Customer service training', 'Relationship building tips']
      })
    }

    setActionPlan(plan)
    setGenerated(true)
    onSavePlan?.(plan)
  }

  const toggleActionComplete = (id: string) => {
    setActionPlan(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTimelineColor = (timeline: string) => {
    switch (timeline) {
      case '30 days': return 'text-blue-600 bg-blue-50'
      case '60 days': return 'text-purple-600 bg-purple-50'
      case '90 days': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Financial Foundation': return <DollarSign className="h-4 w-4" />
      case 'Market Intelligence': return <TrendingUp className="h-4 w-4" />
      case 'Personal Strengths': return <Target className="h-4 w-4" />
      case 'Risk Management': return <Shield className="h-4 w-4" />
      case 'Support Systems': return <Users className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Target className="h-6 w-6 text-[#1e3a8a] mr-3" />
        <h2 className="text-xl font-bold text-gray-900">Your Action Plan</h2>
      </div>

      {!generated ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Generate a personalized action plan based on your assessment results
          </p>
          <button
            onClick={generateActionPlan}
            className="bg-[#1e3a8a] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1e40af] transition-colors"
          >
            Generate Action Plan
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {actionPlan.map((action) => (
            <div
              key={action.id}
              className={`border rounded-lg p-4 transition-all duration-200 ${
                action.completed 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 hover:border-[#1e3a8a] hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {getCategoryIcon(action.category)}
                    <span className="ml-2 text-sm font-medium text-gray-600">
                      {action.category}
                    </span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(action.priority)}`}>
                      {action.priority} priority
                    </span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getTimelineColor(action.timeline)}`}>
                      {action.timeline}
                    </span>
                  </div>
                  
                  <div className="flex items-start">
                    <button
                      onClick={() => toggleActionComplete(action.id)}
                      className={`mt-1 mr-3 flex-shrink-0 ${
                        action.completed ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        action.completed ? 'text-green-800 line-through' : 'text-gray-900'
                      }`}>
                        {action.title}
                      </h3>
                      <p className={`text-sm mt-1 ${
                        action.completed ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {action.description}
                      </p>
                      
                      {action.resources && action.resources.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-500 mb-1">Resources:</p>
                          <div className="flex flex-wrap gap-1">
                            {action.resources.map((resource, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                              >
                                {resource}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-6 text-center">
            <button
              onClick={() => setGenerated(false)}
              className="text-[#1e3a8a] hover:text-[#1e40af] text-sm font-medium"
            >
              Regenerate Plan
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 