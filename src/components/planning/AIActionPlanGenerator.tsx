'use client'

import { useState } from 'react'
import { AlertCircle, Sparkles, Brain } from 'lucide-react'
import { AIActionPlan } from '@/lib/ai/recommendationEngine'

interface AIActionPlanGeneratorProps {
  assessmentScores: {
    financial?: number
    business?: number
    personal?: number
    health?: number
    overall?: number
  }
  onGeneratePlan: (plan: AIActionPlan) => void
}

export default function AIActionPlanGenerator({
  assessmentScores,
  onGeneratePlan
}: AIActionPlanGeneratorProps) {
  const [generating, setGenerating] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['financial', 'business', 'personal'])
  const [timeFrame, setTimeFrame] = useState<string>('3')
  const [currentChallenges, setCurrentChallenges] = useState<string>('')
  const [error, setError] = useState<string>('')

  const generateAIActionPlan = async () => {
    setGenerating(true)
    setError('')

    try {
      const challenges = currentChallenges
        .split('\n')
        .map(c => c.trim())
        .filter(c => c.length > 0)

      const response = await fetch('/api/ai/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          focusAreas: selectedCategories,
          timeFrame,
          currentChallenges: challenges
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate action plan')
      }

      const data = await response.json()
      onGeneratePlan(data.actionPlan)

    } catch (err) {
      console.error('Error generating AI action plan:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate action plan')
    } finally {
      setGenerating(false)
    }
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
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-900">AI Action Plan Generator</h3>
          <Sparkles className="w-5 h-5 text-purple-500" />
        </div>
        <p className="text-gray-600">
          Our AI coach will analyze your assessment results and create a personalized, comprehensive action plan tailored to your unique strengths and challenges.
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
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{category.icon}</div>
              <div className="text-sm font-medium text-gray-900">{category.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Frame Selection */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Time Frame</h4>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: '1', label: '1 Month' },
            { value: '3', label: '3 Months' },
            { value: '6', label: '6 Months' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setTimeFrame(option.value)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                timeFrame === option.value
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-sm font-medium text-gray-900">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Current Challenges */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Current Challenges (Optional)</h4>
        <textarea
          value={currentChallenges}
          onChange={(e) => setCurrentChallenges(e.target.value)}
          placeholder="Describe any specific challenges you're facing (one per line):&#10;&#10;Example:&#10;Difficulty finding consistent loads&#10;Cash flow management&#10;Time management"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
          rows={4}
        />
        <p className="text-sm text-gray-500 mt-2">
          Adding your specific challenges helps our AI create more targeted recommendations.
        </p>
      </div>

      {/* Current Status */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Current Assessment Scores</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(assessmentScores).map(([category, score]) => (
            <div key={category} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{score || 0}</div>
              <div className="text-sm text-gray-600 capitalize">{category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={generateAIActionPlan}
        disabled={generating || selectedCategories.length === 0}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
      >
        {generating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            AI is crafting your personalized plan...
          </>
        ) : (
          <>
            <Brain className="w-4 h-4 mr-2" />
            Generate AI Action Plan
          </>
        )}
      </button>

      {selectedCategories.length === 0 && (
        <p className="text-sm text-gray-500 text-center mt-2">
          Please select at least one focus area to generate your AI action plan.
        </p>
      )}

      {/* AI Feature Highlights */}
      <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <h5 className="font-semibold text-purple-900 mb-1">AI-Powered Personalization</h5>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Analyzes your unique strengths and challenges</li>
              <li>• Creates month-by-month actionable steps</li>
              <li>• Learns from your progress for future recommendations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
