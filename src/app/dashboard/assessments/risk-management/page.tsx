'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Send, Shield, AlertTriangle, CheckCircle, Settings } from 'lucide-react'

interface Question {
  id: number
  category: string
  question: string
  options: string[]
}

const riskManagementQuestions: Question[] = [
  // Financial Risk Tolerance
  {
    id: 1,
    category: 'Financial Risk Tolerance',
    question: 'How comfortable are you with taking on debt to grow your trucking business?',
    options: ['Very uncomfortable - prefer to grow slowly with cash', 'Somewhat uncomfortable - only for essential purchases', 'Moderately comfortable - for strategic investments', 'Very comfortable - willing to leverage for growth']
  },
  {
    id: 2,
    category: 'Financial Risk Tolerance',
    question: 'How do you feel about investing profits back into your business versus taking them as income?',
    options: ['Prefer to take most profits as income', 'Balance between reinvestment and income', 'Mostly reinvest for growth', 'Aggressively reinvest for maximum growth']
  },
  {
    id: 3,
    category: 'Financial Risk Tolerance',
    question: 'How do you approach business expansion and new opportunities?',
    options: ['Very conservative - stick to what I know works', 'Cautious - research thoroughly before acting', 'Moderate - willing to try new things with planning', 'Aggressive - quick to seize new opportunities']
  },

  // Market Risk Tolerance
  {
    id: 4,
    category: 'Market Risk Tolerance',
    question: 'How do you handle market fluctuations and economic uncertainty?',
    options: ['Very risk-averse - prefer stable, predictable markets', 'Cautious - wait for stability before acting', 'Adaptable - adjust strategies as needed', 'Opportunistic - see uncertainty as opportunity']
  },
  {
    id: 5,
    category: 'Market Risk Tolerance',
    question: 'How do you feel about entering new markets or serving new types of customers?',
    options: ['Prefer to stick with familiar markets', 'Willing to explore with careful research', 'Eager to expand into new markets', 'Actively seek new market opportunities']
  },
  {
    id: 6,
    category: 'Market Risk Tolerance',
    question: 'How do you respond to competitive pressure and changing market conditions?',
    options: ['Maintain current approach and wait it out', 'Make small adjustments as needed', 'Actively adapt strategies', 'Lead market changes and innovations']
  },

  // Operational Risk Tolerance
  {
    id: 7,
    category: 'Operational Risk Tolerance',
    question: 'How do you feel about trying new technologies or business processes?',
    options: ['Prefer proven, traditional methods', 'Adopt new things only when necessary', 'Willing to try new approaches', 'Early adopter of new technologies']
  },
  {
    id: 8,
    category: 'Operational Risk Tolerance',
    question: 'How comfortable are you with delegating important business decisions to others?',
    options: ['Very uncomfortable - prefer to control everything', 'Somewhat uncomfortable - delegate only simple tasks', 'Moderately comfortable - delegate with oversight', 'Very comfortable - empower others to make decisions']
  },
  {
    id: 9,
    category: 'Operational Risk Tolerance',
    question: 'How do you approach business partnerships and collaborations?',
    options: ['Prefer to work independently', 'Cautious about partnerships', 'Open to strategic partnerships', 'Actively seek collaborative opportunities']
  },

  // Personal Risk Tolerance
  {
    id: 10,
    category: 'Personal Risk Tolerance',
    question: 'How do you handle uncertainty and the unknown in your business?',
    options: ['Very uncomfortable - need clear plans and certainty', 'Somewhat uncomfortable - prefer to minimize uncertainty', 'Moderately comfortable - can handle some uncertainty', 'Very comfortable - thrive in uncertain situations']
  },
  {
    id: 11,
    category: 'Personal Risk Tolerance',
    question: 'How do you feel about making decisions with incomplete information?',
    options: ['Very uncomfortable - need complete information', 'Somewhat uncomfortable - prefer more data', 'Moderately comfortable - can decide with key information', 'Very comfortable - make decisions quickly']
  },
  {
    id: 12,
    category: 'Personal Risk Tolerance',
    question: 'How do you handle failure and setbacks in your business?',
    options: ['Very risk-averse - avoid situations that might fail', 'Cautious - learn from failures but avoid repeating', 'Resilient - see failures as learning opportunities', 'Risk-taking - failures are part of growth']
  },

  // Growth Risk Tolerance
  {
    id: 13,
    category: 'Growth Risk Tolerance',
    question: 'How aggressive are you about scaling your business?',
    options: ['Very conservative - slow, steady growth', 'Moderate - balanced growth approach', 'Aggressive - rapid growth when possible', 'Very aggressive - maximum growth potential']
  },
  {
    id: 14,
    category: 'Growth Risk Tolerance',
    question: 'How do you feel about hiring employees and building a team?',
    options: ['Prefer to stay small and independent', 'Cautious about adding overhead', 'Willing to grow team strategically', 'Eager to build a larger organization']
  },
  {
    id: 15,
    category: 'Growth Risk Tolerance',
    question: 'How do you approach long-term business planning and vision?',
    options: ['Focus on short-term stability', 'Plan for moderate, sustainable growth', 'Have ambitious long-term goals', 'Think big and plan for major expansion']
  }
]

export default function RiskManagementAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleNext = () => {
    if (currentQuestion < riskManagementQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < riskManagementQuestions.length) {
      alert('Please answer all questions before submitting.')
      return
    }

    setIsSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Calculate scores by category
      const categoryScores: { [key: string]: number } = {
        'Financial Risk Tolerance': 0,
        'Market Risk Tolerance': 0,
        'Operational Risk Tolerance': 0,
        'Personal Risk Tolerance': 0,
        'Growth Risk Tolerance': 0
      }

      let totalScore = 0
      let questionsAnswered = 0

      riskManagementQuestions.forEach(question => {
        const answer = answers[question.id]
        if (answer !== undefined) {
          const score = answer + 1 // Convert 0-3 to 1-4
          categoryScores[question.category] += score
          totalScore += score
          questionsAnswered++
        }
      })

      // Calculate average scores (15% of total SPI)
      const questionsPerCategory = 3
      Object.keys(categoryScores).forEach(category => {
        categoryScores[category] = Math.round((categoryScores[category] / questionsPerCategory) * 3) // 3 points per category (15% total)
      })

      // Fix scoring to properly scale to 15 points maximum
      // Average score is 4 when all highest options selected, so multiply by 3.75 to get 15
      const overallScore = Math.round((totalScore / questionsAnswered) * 3.75) // Convert to percentage of 15%

      // Save to database
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          risk_management_completed: true,
          risk_management_score: overallScore,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      if (error) throw error

      router.push('/dashboard?message=Risk Tolerance Assessment completed successfully!')
    } catch (error) {
      console.error('Error submitting assessment:', error)
      alert('There was an error submitting your assessment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentQ = riskManagementQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / riskManagementQuestions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-md hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Shield className="h-8 w-8 text-[#1e3a8a] mr-2" />
              <span className="text-xl font-bold text-gray-900">Risk Tolerance Assessment</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Risk Tolerance Assessment</h1>
              <p className="text-gray-600">
                This assessment evaluates your personal risk tolerance across different business areas. Understanding your risk comfort level helps create a business plan that aligns with your personality and strengths, ensuring you feel confident and comfortable with your growth strategy.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestion + 1} of {riskManagementQuestions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#1e3a8a] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <div className="mb-4">
                <span className="inline-block bg-[#1e3a8a] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentQ.category}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {currentQ.question}
              </h2>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(currentQ.id, index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      answers[currentQ.id] === index
                        ? 'border-[#1e3a8a] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        answers[currentQ.id] === index
                          ? 'border-[#1e3a8a] bg-[#1e3a8a]'
                          : 'border-gray-300'
                      }`}>
                        {answers[currentQ.id] === index && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                      <span className="text-gray-900">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  currentQuestion === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                Previous
              </button>

              {currentQuestion === riskManagementQuestions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || Object.keys(answers).length < riskManagementQuestions.length}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center ${
                    isSubmitting || Object.keys(answers).length < riskManagementQuestions.length
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-[#1e3a8a] text-white hover:bg-[#1e40af]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Assessment
                      <Send className="h-4 w-4 ml-2" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={answers[currentQ.id] === undefined}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    answers[currentQ.id] === undefined
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-[#1e3a8a] text-white hover:bg-[#1e40af]'
                  }`}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 