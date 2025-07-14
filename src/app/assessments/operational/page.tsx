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
    question: 'How do you typically plan your routes to maximize efficiency?',
    options: [
      'Take whatever loads are available without planning',
      'Use route planning software to optimize fuel and time',
      'Always take the shortest distance regardless of other factors',
      'Let the broker decide the route'
    ],
    correct: 1
  },
  {
    id: 2,
    question: 'What\'s your approach to tracking operational costs?',
    options: [
      'Don\'t track costs - too time consuming',
      'Track only fuel costs',
      'Track all costs including fuel, maintenance, insurance, and overhead',
      'Only track costs when there\'s a problem'
    ],
    correct: 2
  },
  {
    id: 3,
    question: 'How do you handle preventive maintenance?',
    options: [
      'Wait until something breaks',
      'Follow manufacturer recommendations and keep detailed records',
      'Only do oil changes when convenient',
      'Let the shop decide what needs maintenance'
    ],
    correct: 1
  },
  {
    id: 4,
    question: 'What\'s your strategy for fuel efficiency?',
    options: [
      'Drive as fast as possible to get there quicker',
      'Use cruise control, maintain proper tire pressure, and plan fuel stops',
      'Fill up wherever is closest',
      'Don\'t worry about fuel efficiency'
    ],
    correct: 1
  },
  {
    id: 5,
    question: 'How do you manage your time to maximize productivity?',
    options: [
      'Work as many hours as possible',
      'Plan rest periods, optimize loading/unloading times, and use technology',
      'Take breaks whenever you feel like it',
      'Let the schedule happen naturally'
    ],
    correct: 1
  },
  {
    id: 6,
    question: 'What\'s your approach to technology and tools?',
    options: [
      'Avoid technology - it\'s too complicated',
      'Use basic tools like GPS and basic tracking',
      'Embrace technology for route optimization, expense tracking, and communication',
      'Only use technology when required'
    ],
    correct: 2
  },
  {
    id: 7,
    question: 'How do you handle unexpected delays or breakdowns?',
    options: [
      'Panic and call everyone',
      'Have backup plans, emergency contacts, and contingency funds',
      'Wait for someone else to solve the problem',
      'Give up and go home'
    ],
    correct: 1
  },
  {
    id: 8,
    question: 'What\'s your strategy for reducing empty miles?',
    options: [
      'Don\'t worry about empty miles',
      'Accept any load to avoid empty miles',
      'Plan routes strategically and build relationships for backhaul opportunities',
      'Always return to home base empty'
    ],
    correct: 2
  },
  {
    id: 9,
    question: 'How do you optimize your loading and unloading processes?',
    options: [
      'Show up whenever and hope for the best',
      'Communicate arrival times, prepare paperwork, and optimize dock time',
      'Always arrive early and wait',
      'Let the warehouse handle everything'
    ],
    correct: 1
  },
  {
    id: 10,
    question: 'What\'s your approach to continuous improvement?',
    options: [
      'If it works, don\'t change it',
      'Regularly review performance, identify inefficiencies, and implement improvements',
      'Only improve when forced to',
      'Let others tell you what to improve'
    ],
    correct: 1
  }
]

export default function OperationalAssessment() {
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
          operational_completed: true,
          operational_score: percent,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
      if (error) {
        alert('There was an error saving your assessment. Please try again.')
        return
      }
      router.push('/dashboard?message=Operational%20Efficiency%20Assessment%20completed%20successfully!')
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Operational Efficiency Assessment</h1>
          <div className="mb-4 text-gray-700">Evaluate your route planning, cost management, and process optimization skills.</div>
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