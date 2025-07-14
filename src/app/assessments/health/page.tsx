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
    question: 'How often do you get a physical checkup?',
    options: [
      'Never or only when sick',
      'Every 2-3 years',
      'Annually',
      'Every 6 months or more frequently'
    ],
    correct: 2
  },
  {
    id: 2,
    question: 'What\'s your typical sleep pattern?',
    options: [
      'Less than 5 hours per night',
      '5-6 hours per night',
      '7-8 hours per night',
      'More than 9 hours per night'
    ],
    correct: 2
  },
  {
    id: 3,
    question: 'How do you manage stress while on the road?',
    options: [
      'Ignore it and keep working',
      'Use unhealthy coping mechanisms (smoking, overeating)',
      'Practice healthy stress management (exercise, meditation, hobbies)',
      'Complain to others about stress'
    ],
    correct: 2
  },
  {
    id: 4,
    question: 'What\'s your approach to nutrition while driving?',
    options: [
      'Eat whatever is convenient (fast food, gas station food)',
      'Sometimes pack healthy meals',
      'Plan and pack healthy meals most of the time',
      'Only eat when absolutely necessary'
    ],
    correct: 2
  },
  {
    id: 5,
    question: 'How do you stay physically active?',
    options: [
      'Don\'t exercise - too busy driving',
      'Occasionally walk around truck stops',
      'Regular exercise routine (walking, stretching, bodyweight exercises)',
      'Only exercise when not working'
    ],
    correct: 2
  },
  {
    id: 6,
    question: 'How do you maintain mental wellness?',
    options: [
      'Don\'t think about mental health',
      'Talk to family/friends occasionally',
      'Practice mindfulness, stay connected with loved ones, seek support when needed',
      'Only focus on work'
    ],
    correct: 2
  },
  {
    id: 7,
    question: 'What\'s your approach to work-life balance?',
    options: [
      'Work as much as possible to make money',
      'Take breaks only when required by law',
      'Schedule regular downtime and maintain personal relationships',
      'Work until exhausted then rest'
    ],
    correct: 2
  },
  {
    id: 8,
    question: 'How do you handle medical issues while on the road?',
    options: [
      'Ignore them and keep working',
      'Wait until you get home to address them',
      'Address them promptly and have a plan for medical care',
      'Only seek help for serious issues'
    ],
    correct: 2
  },
  {
    id: 9,
    question: 'What\'s your approach to preventive health measures?',
    options: [
      'Don\'t believe in preventive care',
      'Only get required medical exams',
      'Stay up to date on vaccinations, screenings, and health education',
      'Only focus on immediate health concerns'
    ],
    correct: 2
  },
  {
    id: 10,
    question: 'How do you maintain energy and alertness while driving?',
    options: [
      'Use energy drinks and caffeine excessively',
      'Push through fatigue to meet deadlines',
      'Follow proper rest schedules, stay hydrated, and take breaks when needed',
      'Drive through tiredness'
    ],
    correct: 2
  }
]

export default function HealthAssessment() {
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
          health_completed: true,
          health_score: percent,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
      if (error) {
        alert('There was an error saving your assessment. Please try again.')
        return
      }
      router.push('/dashboard?message=Health%20%26%20Wellness%20Assessment%20completed%20successfully!')
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Health & Wellness Assessment</h1>
          <div className="mb-4 text-gray-700">Evaluate your physical health, mental wellness, and lifestyle habits for optimal performance.</div>
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