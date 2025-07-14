'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Send } from 'lucide-react'

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
}

const questions: Question[] = [
  {
    id: 1,
    question: 'How do you typically handle a customer complaint about a delayed delivery?',
    options: [
      'Ignore it and focus on other tasks',
      'Blame the customer for unrealistic expectations',
      'Listen actively, apologize, and provide solutions',
      'Tell them to contact someone else'
    ],
    correct: 2
  },
  {
    id: 2,
    question: 'What\'s the best approach when communicating with a shipper about a potential delay?',
    options: [
      'Wait until the last minute to inform them',
      'Communicate proactively with clear updates and alternatives',
      'Avoid communication to prevent complaints',
      'Send a generic message without details'
    ],
    correct: 1
  },
  {
    id: 3,
    question: 'How do you ensure clear communication with customers?',
    options: [
      'Use technical jargon to sound professional',
      'Speak quickly to save time',
      'Use simple, clear language and confirm understanding',
      'Let them figure things out on their own'
    ],
    correct: 2
  },
  {
    id: 4,
    question: 'What\'s your approach to following up after a delivery?',
    options: [
      'Never follow up - job is done',
      'Only follow up if there\'s a problem',
      'Always follow up to ensure satisfaction and ask for feedback',
      'Wait for the customer to contact you'
    ],
    correct: 2
  },
  {
    id: 5,
    question: 'How do you handle a situation where you can\'t meet a customer\'s request?',
    options: [
      'Say no immediately without explanation',
      'Explain the situation clearly and offer alternatives',
      'Promise to do it anyway and hope for the best',
      'Avoid the customer until they forget'
    ],
    correct: 1
  },
  {
    id: 6,
    question: 'What\'s the most important aspect of customer service in trucking?',
    options: [
      'Getting the highest rate possible',
      'Completing deliveries as quickly as possible',
      'Building trust through reliability and communication',
      'Minimizing costs at all times'
    ],
    correct: 2
  },
  {
    id: 7,
    question: 'How do you handle difficult or demanding customers?',
    options: [
      'Argue with them to prove you\'re right',
      'Stay calm, listen, and find common ground',
      'Avoid them completely',
      'Complain about them to others'
    ],
    correct: 1
  },
  {
    id: 8,
    question: 'What\'s your approach to asking for customer feedback?',
    options: [
      'Never ask - it might be negative',
      'Ask only when you know it will be positive',
      'Regularly ask for feedback to improve service',
      'Let customers volunteer feedback if they want'
    ],
    correct: 2
  },
  {
    id: 9,
    question: 'How do you handle a customer who is upset about a mistake you made?',
    options: [
      'Defend yourself and explain why it wasn\'t your fault',
      'Take responsibility, apologize, and fix the issue',
      'Ignore them and hope they calm down',
      'Blame someone else for the mistake'
    ],
    correct: 1
  },
  {
    id: 10,
    question: 'What\'s the best way to build long-term customer relationships?',
    options: [
      'Focus only on getting the highest rates',
      'Provide consistent, reliable service and clear communication',
      'Only work with easy customers',
      'Avoid personal relationships with customers'
    ],
    correct: 1
  }
]

export default function CustomerServiceAssessment() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleAnswer = (index: number) => {
    setAnswers(prev => ({ ...prev, [current]: index }))
  }

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent(current + 1)
  }

  const handlePrevious = () => {
    if (current > 0) setCurrent(current - 1)
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
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
      let score = 0
      questions.forEach((q, i) => {
        if (answers[i] === q.correct) score++
      })
      const percent = Math.round((score / questions.length) * 100)
      const { error } = await supabase
        .from('user_progress')
        .update({
          customer_service_completed: true,
          customer_service_score: percent,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
      if (error) {
        alert('There was an error saving your assessment. Please try again.')
        return
      }
      router.push('/dashboard?message=Customer%20Service%20Assessment%20completed%20successfully!')
    } catch (error) {
      alert('There was an error submitting your assessment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const q = questions[current]
  const progress = ((current + 1) / questions.length) * 100
  const answeredCount = Object.keys(answers).length

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Customer Service Excellence Assessment</h1>
          <div className="mb-4 text-gray-700">Evaluate your communication skills, problem-solving abilities, and service quality in customer interactions.</div>
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-2">Question {current + 1} of {questions.length}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="text-sm text-gray-500">Answered: {answeredCount}/{questions.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{q.question}</h2>
            <div className="space-y-4">
              {q.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answers[current] === index
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={current === 0}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {current === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || answeredCount < questions.length}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
                disabled={answers[current] === undefined}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 