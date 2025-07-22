'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Send, Brain, TrendingUp, BarChart3, Target, Globe } from 'lucide-react'

interface Question {
  id: number
  category: string
  question: string
  options: string[]
}

const marketIntelligenceQuestions: Question[] = [
  // Industry Knowledge
  {
    id: 1,
    category: 'Industry Knowledge',
    question: 'How well do you understand current trucking industry regulations and compliance requirements?',
    options: ['Limited knowledge', 'Basic understanding', 'Good grasp of most regulations', 'Expert level knowledge']
  },
  {
    id: 2,
    category: 'Industry Knowledge',
    question: 'How familiar are you with different types of freight and their specific requirements?',
    options: ['Limited experience', 'Know some basics', 'Experienced with most types', 'Expert in all freight types']
  },
  {
    id: 3,
    category: 'Industry Knowledge',
    question: 'How well do you understand the trucking business model and profit drivers?',
    options: ['Basic understanding', 'Know some key factors', 'Good understanding of most aspects', 'Deep expertise in business model']
  },

  // Market Trends
  {
    id: 4,
    category: 'Market Trends',
    question: 'How well do you track and understand current market rates and pricing trends?',
    options: ['Rarely check rates', 'Sometimes monitor trends', 'Regularly track market rates', 'Constantly analyze pricing trends']
  },
  {
    id: 5,
    category: 'Market Trends',
    question: 'How aware are you of seasonal patterns and their impact on freight demand?',
    options: ['Not very aware', 'Know some seasonal patterns', 'Good understanding of seasonality', 'Expert at predicting seasonal trends']
  },
  {
    id: 6,
    category: 'Market Trends',
    question: 'How well do you understand technological trends affecting the trucking industry?',
    options: ['Limited awareness', 'Basic knowledge of some trends', 'Good understanding of key technologies', 'Stay ahead of emerging trends']
  },

  // Competitive Analysis
  {
    id: 7,
    category: 'Competitive Analysis',
    question: 'How well do you understand your competition and their pricing strategies?',
    options: ['Don\'t really track competition', 'Sometimes check competitor rates', 'Regularly monitor competitors', 'Deep competitive intelligence']
  },
  {
    id: 8,
    category: 'Competitive Analysis',
    question: 'How do you differentiate yourself from other trucking businesses?',
    options: ['Don\'t really differentiate', 'Try to offer good service', 'Have clear competitive advantages', 'Strong unique value proposition']
  },
  {
    id: 9,
    category: 'Competitive Analysis',
    question: 'How well do you understand customer needs and preferences in your market?',
    options: ['Basic understanding', 'Know some customer preferences', 'Good understanding of customer needs', 'Deep customer insights']
  },

  // Route Optimization
  {
    id: 10,
    category: 'Route Optimization',
    question: 'How do you plan and optimize your routes for maximum efficiency?',
    options: ['Basic route planning', 'Sometimes optimize routes', 'Regularly optimize for efficiency', 'Advanced route optimization strategies']
  },
  {
    id: 11,
    category: 'Route Optimization',
    question: 'How well do you understand fuel costs and their impact on profitability?',
    options: ['Basic awareness', 'Track fuel costs sometimes', 'Regularly monitor fuel impact', 'Expert fuel cost management']
  },
  {
    id: 12,
    category: 'Route Optimization',
    question: 'How do you handle backhaul opportunities and empty miles?',
    options: ['Often run empty', 'Sometimes find backhauls', 'Regularly minimize empty miles', 'Expert at maximizing backhaul revenue']
  },

  // Market Positioning
  {
    id: 13,
    category: 'Market Positioning',
    question: 'How well do you understand your target market and ideal customers?',
    options: ['Not very clear', 'Have some idea', 'Good understanding of target market', 'Clear market positioning strategy']
  },
  {
    id: 14,
    category: 'Market Positioning',
    question: 'How do you adapt your business strategy based on market changes?',
    options: ['Slow to adapt', 'Sometimes adjust strategy', 'Quick to adapt to changes', 'Proactive strategy adaptation']
  },
  {
    id: 15,
    category: 'Market Positioning',
    question: 'How well do you understand the value you provide to customers?',
    options: ['Not very clear', 'Have some understanding', 'Good understanding of value', 'Clear value proposition']
  }
]

export default function MarketIntelligenceAssessment() {
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
    if (currentQuestion < marketIntelligenceQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < marketIntelligenceQuestions.length) {
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
        'Industry Knowledge': 0,
        'Market Trends': 0,
        'Competitive Analysis': 0,
        'Route Optimization': 0,
        'Market Positioning': 0
      }

      let totalScore = 0
      let questionsAnswered = 0

      marketIntelligenceQuestions.forEach(question => {
        const answer = answers[question.id]
        if (answer !== undefined) {
          const score = answer + 1 // Convert 0-3 to 1-4
          categoryScores[question.category] += score
          totalScore += score
          questionsAnswered++
        }
      })

      // Calculate average scores (20% of total SPI)
      const questionsPerCategory = 3
      Object.keys(categoryScores).forEach(category => {
        categoryScores[category] = Math.round((categoryScores[category] / questionsPerCategory) * 4) // 4 points per category (20% total)
      })

      const overallScore = Math.round((totalScore / questionsAnswered) * 4) // Convert to percentage of 20%

      // Save to database
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          market_intelligence_completed: true,
          market_intelligence_score: overallScore,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      if (error) throw error

      router.push('/dashboard?message=Market Intelligence Assessment completed successfully!')
    } catch (error) {
      console.error('Error submitting assessment:', error)
      alert('There was an error submitting your assessment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentQ = marketIntelligenceQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / marketIntelligenceQuestions.length) * 100

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
              <BarChart3 className="h-8 w-8 text-[#1e3a8a] mr-2" />
              <span className="text-xl font-bold text-gray-900">Market Intelligence Assessment</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Market Intelligence Assessment</h1>
              <p className="text-gray-600">
                This assessment evaluates your understanding of the trucking industry, market trends, competitive landscape, and strategic positioning. It's essential for making informed business decisions.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestion + 1} of {marketIntelligenceQuestions.length}</span>
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

              {currentQuestion === marketIntelligenceQuestions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || Object.keys(answers).length < marketIntelligenceQuestions.length}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center ${
                    isSubmitting || Object.keys(answers).length < marketIntelligenceQuestions.length
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