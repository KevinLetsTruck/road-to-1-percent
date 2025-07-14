'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Send, Brain, Users, Target, MessageSquare, TrendingUp } from 'lucide-react'

interface Question {
  id: number
  category: string
  question: string
  options: string[]
}

const leadershipQuestions: Question[] = [
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

  // Team/Support Network Management
  {
    id: 7,
    category: 'Support Network Management',
    question: 'How do you motivate the people who help your business (such as vendors, brokers, dispatchers, or mentors)?',
    options: ['Rarely think about motivation', 'Sometimes encourage them', 'Regularly recognize good work or support', 'Create an environment where people are motivated to help you succeed']
  },
  {
    id: 8,
    category: 'Support Network Management',
    question: 'How do you handle disagreements or conflicts with the people who support your business (like vendors, service providers, or advisors)?',
    options: ['Hope they resolve themselves', 'Address them when they become serious', 'Proactively identify and resolve conflicts', 'Use conflicts as opportunities for growth and better relationships']
  },
  {
    id: 9,
    category: 'Support Network Management',
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

export default function LeadershipAssessment() {
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
    if (currentQuestion < leadershipQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < leadershipQuestions.length) {
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
        Communication: 0,
        'Decision Making': 0,
        'Support Network Management': 0,
        'Strategic Thinking': 0,
        'Personal Development': 0
      }

      let totalScore = 0
      let questionsAnswered = 0

      leadershipQuestions.forEach(question => {
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
          leadership_completed: true,
          leadership_score: overallScore,
          leadership_communication: categoryScores.Communication,
          leadership_decision_making: categoryScores['Decision Making'],
          leadership_team_management: categoryScores['Support Network Management'],
          leadership_strategic_thinking: categoryScores['Strategic Thinking'],
          leadership_personal_development: categoryScores['Personal Development'],
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (error) {
        console.error('Error saving assessment:', error)
        alert('There was an error saving your assessment. Please try again.')
        return
      }

      // Redirect to dashboard with success message
      router.push('/dashboard?message=Leadership%20Assessment%20completed%20successfully!')
    } catch (error) {
      console.error('Error:', error)
      alert('There was an error submitting your assessment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const question = leadershipQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / leadershipQuestions.length) * 100
  const answeredCount = Object.keys(answers).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {leadershipQuestions.length}
              </div>
              <div className="text-sm text-gray-600">
                {answeredCount} answered
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Assessment Intro */}
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-900 p-4 mb-8 rounded">
          <p className="font-semibold">Note:</p>
          <p>In this assessment, “team” means <span className="font-semibold">anyone who helps your business succeed</span>—vendors, brokers, dispatchers, mechanics, mentors, coaches, or other partners. If you don’t have employees, answer based on your relationships with these helpers and supporters.</p>
        </div>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Leadership Readiness Assessment</h1>
            <span className="text-sm text-gray-600">{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          {/* Category Header */}
          <div className="flex items-center mb-6">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              {question.category === 'Communication' && <MessageSquare className="h-6 w-6 text-blue-600" />}
              {question.category === 'Decision Making' && <Brain className="h-6 w-6 text-blue-600" />}
              {question.category === 'Support Network Management' && <Users className="h-6 w-6 text-blue-600" />}
              {question.category === 'Strategic Thinking' && <Target className="h-6 w-6 text-blue-600" />}
              {question.category === 'Personal Development' && <TrendingUp className="h-6 w-6 text-blue-600" />}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{question.category}</h2>
              <p className="text-sm text-gray-600">Question {question.id}</p>
            </div>
          </div>

          {/* Question */}
          <h3 className="text-xl font-medium text-gray-900 mb-6">
            {question.question}
          </h3>

          {/* Answer Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  answers[question.id] === index
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    answers[question.id] === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[question.id] === index && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
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
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentQuestion === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>

          {currentQuestion === leadershipQuestions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || answeredCount < leadershipQuestions.length}
              className={`px-8 py-3 rounded-lg font-medium transition-colors flex items-center ${
                isSubmitting || answeredCount < leadershipQuestions.length
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Assessment
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={answers[question.id] === undefined}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                answers[question.id] === undefined
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 