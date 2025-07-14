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
    question: 'When freight demand is high and truck capacity is low, what usually happens to rates?',
    options: ['Rates go down', 'Rates stay the same', 'Rates go up', 'Rates are unaffected by demand'],
    correct: 2
  },
  {
    id: 2,
    question: 'What is the main role of a freight broker?',
    options: ['Drive the truck', 'Connect shippers with carriers', 'Set government regulations', 'Own the freight'],
    correct: 1
  },
  {
    id: 3,
    question: 'What is a key benefit of working directly with shippers (direct customers) instead of through brokers?',
    options: ['More paperwork', 'Lower rates', 'More control and potentially higher profit', 'Less communication'],
    correct: 2
  },
  {
    id: 4,
    question: 'What is a “lane” in trucking?',
    options: ['A type of truck', 'A route between two points', 'A government agency', 'A type of freight'],
    correct: 1
  },
  {
    id: 5,
    question: 'Which season typically sees the highest freight volumes in the U.S.?',
    options: ['Spring', 'Summer', 'Fall', 'Winter'],
    correct: 2
  },
  {
    id: 6,
    question: 'What is the FMCSA responsible for?',
    options: ['Setting fuel prices', 'Regulating commercial vehicle safety', 'Building highways', 'Issuing driver’s licenses'],
    correct: 1
  },
  {
    id: 7,
    question: 'Which of the following is a fixed cost for a trucking business?',
    options: ['Fuel', 'Maintenance', 'Truck payment', 'Tolls'],
    correct: 2
  },
  {
    id: 8,
    question: 'What does “deadhead” mean?',
    options: ['Driving with a loaded trailer', 'Driving with an empty trailer', 'Driving off-road', 'Driving at night'],
    correct: 1
  },
  {
    id: 9,
    question: 'What is “seasonality” in the trucking industry?',
    options: ['Changes in weather', 'Fluctuations in freight volume throughout the year', 'Truck maintenance schedules', 'Driver vacation time'],
    correct: 1
  },
  {
    id: 10,
    question: 'Which is a common way to find direct customers?',
    options: ['Load boards', 'Cold calling shippers', 'Relying only on brokers', 'Ignoring networking'],
    correct: 1
  }
]

export default function IndustryKnowledgeAssessment() {
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
          industry_knowledge_completed: true,
          industry_knowledge_score: percent,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
      if (error) {
        alert('There was an error saving your assessment. Please try again.')
        return
      }
      router.push('/dashboard?message=Industry%20Knowledge%20Assessment%20completed%20successfully!')
    } catch {
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Industry Knowledge Assessment</h1>
          <div className="mb-4 text-gray-700">Test your knowledge of the trucking business, supply and demand, broker-carrier relationships, direct customers, rates, lanes, seasonality, and more.</div>
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-2">Question {current + 1} of {questions.length}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{q.question}</h2>
            <div className="space-y-3">
              {q.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    answers[current] === idx
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">{option}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={current === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                current === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            {current === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || answeredCount < questions.length}
                className={`px-8 py-3 rounded-lg font-medium transition-colors flex items-center ${
                  isSubmitting || answeredCount < questions.length
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
                disabled={answers[current] === undefined}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  answers[current] === undefined
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`