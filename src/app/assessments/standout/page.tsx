'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft } from 'lucide-react'

const standoutRoles = [
  'Pioneer',
  'Influencer',
  'Stimulator',
  'Advisor',
  'Connector',
  'Provider',
  'Equalizer',
  'Teacher',
  'Creator',
  'Other'
]

const roleFitScore: Record<string, number> = {
  'Pioneer': 10,
  'Influencer': 9,
  'Stimulator': 8,
  'Advisor': 8,
  'Connector': 8,
  'Provider': 7,
  'Equalizer': 7,
  'Teacher': 6,
  'Creator': 6,
  'Other': 5
}

export default function StandoutAssessment() {
  const [role1, setRole1] = useState('')
  const [role2, setRole2] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role1 || !role2) {
      alert('Please select your top 2 Standout roles.')
      return
    }
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      
      // Calculate fit score
      const fitScore = Math.round((roleFitScore[role1] + roleFitScore[role2]) / 2)
      
      console.log('Attempting to save Standout assessment for user:', user.id)
      console.log('Data to save:', { role1, role2, fitScore })
      
      // Use the generic assessment API route
      const response = await fetch('/api/user-progress/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentType: 'standout',
          score: fitScore,
          additionalData: {
            role1,
            role2
          }
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        console.log('API error:', errorData)
        throw new Error(errorData.error || 'Failed to save assessment')
      }
      
      const result = await response.json()
      console.log('API success:', result)
      
      router.push('/dashboard?message=Standout%202.0%20Assessment%20completed%20successfully!')
    } catch (error) {
      console.error('Submission error:', error)
      alert('There was an error submitting your assessment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Standout 2.0 Assessment</h1>
          <p className="mb-4 text-gray-700">
            To complete this step, please take the official Standout 2.0 assessment at <a href="https://www.tmbc.com/standout-assessment/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">tmbc.com/standout-assessment</a>.<br />
            After you finish, enter your top 2 Standout roles below.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Top Standout Role</label>
              <select
                value={role1}
                onChange={e => setRole1(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                required
              >
                <option value="">Select your top role</option>
                {standoutRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Second Standout Role</label>
              <select
                value={role2}
                onChange={e => setRole2(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                required
              >
                <option value="">Select your second role</option>
                {standoutRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors text-white ${isSubmitting ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isSubmitting ? 'Submitting...' : 'Save Standout Roles'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 