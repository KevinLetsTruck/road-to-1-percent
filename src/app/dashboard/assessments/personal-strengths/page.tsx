'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Send, Brain, Users, Target, MessageSquare, TrendingUp, Zap } from 'lucide-react'

interface Question {
  id: number
  category: string
  question: string
  options: string[]
}

const personalStrengthsQuestions: Question[] = [
  // Communication Skills
  {
    id: 1,
    category: 'Communication',
    question: 'How effectively do you communicate your vision and goals to the people who help your business (such as vendors, brokers, dispatchers, or mentors)?',
    options: ['Rarely communicate clearly', 'Sometimes get my point across', 'Usually communicate well', 'Always communicate clearly and inspire others']
  },
  {
    id: 2,
    category: 'Communication',
    question: 'How do you handle difficult conversations with the people who support your business (like vendors, service providers, or advisors)?',
    options: ['Avoid them when possible', 'Address them but feel uncomfortable', 'Handle them professionally', 'Welcome them as opportunities for growth']
  },
  {
    id: 3,
    category: 'Communication',
    question: 'How do you provide feedback to the people who help your business succeed?',
    options: ['Rarely give feedback', 'Give feedback occasionally', 'Provide regular constructive feedback', 'Give balanced, timely feedback that motivates']
  },

  // Decision Making
  {
    id: 4,
    category: 'Decision Making',
    question: 'How do you approach important decisions for your business?',
    options: ['Make quick decisions without much thought', 'Consider some factors before deciding', 'Gather relevant information and analyze', 'Systematically evaluate all options and consequences']
  },
  {
    id: 5,
    category: 'Decision Making',
    question: 'How do you handle pressure when making critical business decisions?',
    options: ['Often feel overwhelmed', 'Sometimes struggle under pressure', 'Usually stay calm and focused', 'Thrive under pressure and make better decisions']
  },
  {
    id: 6,
    category: 'Decision Making',
    question: 'How do you involve your helpers (vendors, partners, advisors) in decision-making for your business?',
    options: ['Make decisions alone', 'Sometimes ask for input', 'Often seek input from helpers', 'Empower helpers to make decisions when appropriate']
  },

  // Leadership
  {
    id: 7,
    category: 'Leadership',
    question: 'How do you motivate the people who help your business (such as vendors, brokers, dispatchers, or mentors)?',
    options: ['Rarely think about motivation', 'Sometimes encourage them', 'Regularly recognize good work or support', 'Create an environment where people are motivated to help you succeed']
  },
  {
    id: 8,
    category: 'Leadership',
    question: 'How do you handle disagreements or conflicts with the people who support your business (like vendors, service providers, or advisors)?',
    options: ['Hope they resolve themselves', 'Address them when they become serious', 'Proactively identify and resolve conflicts', 'Use conflicts as opportunities for growth and better relationships']
  },
  {
    id: 9,
    category: 'Leadership',
    question: 'How do you help the people who support your business (vendors, partners, or helpers) grow and improve in their roles?',
    options: ['Focus on getting the work done', 'Occasionally provide learning opportunities', 'Regularly share resources or advice', 'Actively help them develop and succeed']
  },

  // Strategic Thinking
  {
    id: 10,
    category: 'Strategic Thinking',
    question: 'How do you plan for the future of your business and support network?',
    options: ['Focus on day-to-day operations', 'Think about next month or quarter', 'Plan 6-12 months ahead', 'Develop long-term strategic vision and execute it']
  },
  {
    id: 11,
    category: 'Strategic Thinking',
    question: 'How do you identify and seize opportunities for your business?',
    options: ['Rarely notice opportunities', 'Sometimes see opportunities but don\'t act', 'Often identify and pursue opportunities', 'Proactively create opportunities for growth']
  },
  {
    id: 12,
    category: 'Strategic Thinking',
    question: 'How do you adapt to changing circumstances in your business or support network?',
    options: ['Resist change and prefer stability', 'Adapt when forced to', 'Quickly adjust plans when needed', 'Anticipate changes and prepare multiple strategies']
  },

  // Personal Development
  {
    id: 13,
    category: 'Personal Development',
    question: 'How do you continue learning and growing as a business owner and leader?',
    options: ['Rarely seek new knowledge', 'Sometimes read or take courses', 'Regularly invest in learning', 'Constantly seek feedback and actively develop new skills']
  },
  {
    id: 14,
    category: 'Personal Development',
    question: 'How do you handle your own mistakes and failures in your business journey?',
    options: ['Try to hide or ignore them', 'Learn from them but feel bad', 'Accept them and learn lessons', 'Embrace them as valuable learning opportunities']
  },
  {
    id: 15,
    category: 'Personal Development',
    question: 'How do you maintain work-life balance while running your business?',
    options: ['Often sacrifice personal time for work', 'Sometimes struggle with balance', 'Usually maintain good boundaries', 'Model healthy balance and encourage it in others']
  }
]

export default function PersonalStrengthsAssessment() {
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
    if (currentQuestion < personalStrengthsQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < personalStrengthsQuestions.length) {
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
        'Communication': 0,
        'Decision Making': 0,
        'Leadership': 0,
        'Strategic Thinking': 0,
        'Personal Development': 0
      }

      let totalScore = 0
      let questionsAnswered = 0

      personalStrengthsQuestions.forEach(question => {
        const answer = answers[question.id]
        if (answer !== undefined) {
          const score = answer + 1 // Convert 0-3 to 1-4
          categoryScores[question.category] += score
          totalScore += score
          questionsAnswered++
        }
      })

      // Calculate average scores
      const questionsPerCategory = 3
      Object.keys(categoryScores).forEach(category => {
        categoryScores[category] = Math.round((categoryScores[category] / questionsPerCategory) * 25) // Convert to percentage
      })

      const overallScore = Math.round((totalScore / questionsAnswered) * 25) // Convert to percentage

      // Save to database
      const { error } = await supabase
        .from('user_progress')
        .update({
          personal_strengths_completed: true,
          personal_strengths_score: overallScore,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (error) throw error

      router.push('/dashboard?message=Personal Strengths Assessment completed successfully!')
    } catch (error) {
      console.error('Error submitting assessment:', error)
      alert('There was an error submitting your assessment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentQ = personalStrengthsQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / personalStrengthsQuestions.length) * 100

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
              <Zap className="h-8 w-8 text-[#1e3a8a] mr-2" />
              <span className="text-xl font-bold text-gray-900">Personal Strengths Assessment</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Personal Strengths Assessment</h1>
              <p className="text-gray-600">
                This assessment evaluates your leadership abilities, communication skills, decision-making process, strategic thinking, and personal development. These strengths are crucial for building a successful trucking business.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentQuestion + 1} of {personalStrengthsQuestions.length}</span>
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

              {currentQuestion === personalStrengthsQuestions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || Object.keys(answers).length < personalStrengthsQuestions.length}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center ${
                    isSubmitting || Object.keys(answers).length < personalStrengthsQuestions.length
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