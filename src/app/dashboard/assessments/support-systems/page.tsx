'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Send, Users, MessageSquare, Heart, Network, Phone } from 'lucide-react'

interface Question {
  id: number
  category: string
  question: string
  options: string[]
}

const supportSystemsQuestions: Question[] = [
  // Family & Spousal Support
  {
    id: 1,
    category: 'Family & Spousal Support',
    question: 'How involved is your spouse/family in understanding and supporting your trucking business?',
    options: ['Not very involved', 'Somewhat involved', 'Actively involved and supportive', 'Fully engaged partner in the business']
  },
  {
    id: 2,
    category: 'Family & Spousal Support',
    question: 'How do you communicate with your family about business decisions and financial matters?',
    options: ['Keep business separate from family', 'Share basic information when needed', 'Regular family discussions about business', 'Full transparency and family involvement in decisions']
  },
  {
    id: 3,
    category: 'Family & Spousal Support',
    question: 'How does your family support your business goals and growth plans?',
    options: ['Family has concerns about business risks', 'Family is neutral about business decisions', 'Family is supportive of business goals', 'Family actively participates in business planning']
  },

  // Customer Service
  {
    id: 4,
    category: 'Customer Service',
    question: 'How do you handle customer complaints and service issues?',
    options: ['React when problems arise', 'Address issues promptly', 'Proactively prevent problems', 'Exceed expectations and delight customers']
  },
  {
    id: 5,
    category: 'Customer Service',
    question: 'How do you communicate with customers about their shipments and deliveries?',
    options: ['Minimal communication', 'Basic updates when needed', 'Regular proactive communication', 'Comprehensive communication and transparency']
  },
  {
    id: 6,
    category: 'Customer Service',
    question: 'How do you build and maintain relationships with your customers?',
    options: ['Focus on transactions', 'Provide good service', 'Build trust and rapport', 'Create long-term partnerships']
  },

  // Networking & Relationships
  {
    id: 7,
    category: 'Networking & Relationships',
    question: 'How do you build relationships with other trucking professionals and industry contacts?',
    options: ['Work independently', 'Basic networking when needed', 'Regular networking and relationship building', 'Active industry leader and connector']
  },
  {
    id: 8,
    category: 'Networking & Relationships',
    question: 'How do you leverage your network for business opportunities and support?',
    options: ['Rarely use network', 'Sometimes ask for help', 'Regularly tap into network', 'Actively create opportunities through network']
  },
  {
    id: 9,
    category: 'Networking & Relationships',
    question: 'How do you give back to your network and support other professionals?',
    options: ['Focus on my own business', 'Help when asked', 'Regularly support others', 'Actively mentor and support community']
  },

  // Vendor & Partner Relationships
  {
    id: 10,
    category: 'Vendor & Partner Relationships',
    question: 'How do you manage relationships with vendors, suppliers, and service providers?',
    options: ['Basic transactional relationships', 'Maintain good working relationships', 'Build strategic partnerships', 'Create collaborative business relationships']
  },
  {
    id: 11,
    category: 'Vendor & Partner Relationships',
    question: 'How do you negotiate and work with brokers and dispatchers?',
    options: ['Accept what\'s offered', 'Basic negotiation', 'Strategic negotiation and relationship building', 'Create win-win partnerships']
  },
  {
    id: 12,
    category: 'Vendor & Partner Relationships',
    question: 'How do you handle conflicts or disagreements with business partners?',
    options: ['Avoid conflicts', 'Address issues when necessary', 'Proactively resolve conflicts', 'Use conflicts to strengthen relationships']
  },

  // Support Infrastructure
  {
    id: 13,
    category: 'Support Infrastructure',
    question: 'How do you ensure you have reliable backup and support systems in place?',
    options: ['Handle problems as they come', 'Have basic backup plans', 'Maintain comprehensive support systems', 'Build robust infrastructure and contingency plans']
  },
  {
    id: 14,
    category: 'Support Infrastructure',
    question: 'How do you manage communication and coordination with your support team?',
    options: ['Minimal coordination needed', 'Basic communication systems', 'Regular coordination and updates', 'Advanced communication and collaboration systems']
  },
  {
    id: 15,
    category: 'Support Infrastructure',
    question: 'How do you ensure quality control and consistency in your service delivery?',
    options: ['Basic quality standards', 'Regular quality checks', 'Comprehensive quality management', 'Continuous improvement and excellence']
  }
]

export default function SupportSystemsAssessment() {
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
    if (currentQuestion < supportSystemsQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < supportSystemsQuestions.length) {
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
        'Family & Spousal Support': 0,
        'Customer Service': 0,
        'Networking & Relationships': 0,
        'Vendor & Partner Relationships': 0,
        'Support Infrastructure': 0
      }

      let totalScore = 0
      let questionsAnswered = 0

      supportSystemsQuestions.forEach(question => {
        const answer = answers[question.id]
        if (answer !== undefined) {
          const score = answer + 1 // Convert 0-3 to 1-4
          categoryScores[question.category] += score
          totalScore += score
          questionsAnswered++
        }
      })

      // Calculate average scores (10% of total SPI)
      const questionsPerCategory = 3
      Object.keys(categoryScores).forEach(category => {
        categoryScores[category] = Math.round((categoryScores[category] / questionsPerCategory) * 2) // 2 points per category (10% total)
      })

      const overallScore = Math.round((totalScore / questionsAnswered) * 2) // Convert to percentage of 10%

      // Save to database
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          support_systems_completed: true,
          support_systems_score: overallScore,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      if (error) throw error

      router.push('/dashboard?message=Support Systems Assessment completed successfully!')
    } catch (error) {
      console.error('Error submitting assessment:', error)
      alert('There was an error submitting your assessment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentQ = supportSystemsQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / supportSystemsQuestions.length) * 100

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
              <Users className="h-8 w-8 text-[#1e3a8a] mr-2" />
              <span className="text-xl font-bold text-gray-900">Support Systems Assessment</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Support Systems Assessment</h1>
              <p className="text-gray-600">
                This assessment evaluates your family and spousal support, customer service approach, networking abilities, relationship management, and support infrastructure. Strong support systems, especially family involvement, are crucial for sustainable business growth and success.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestion + 1} of {supportSystemsQuestions.length}</span>
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

              {currentQuestion === supportSystemsQuestions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || Object.keys(answers).length < supportSystemsQuestions.length}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center ${
                    isSubmitting || Object.keys(answers).length < supportSystemsQuestions.length
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