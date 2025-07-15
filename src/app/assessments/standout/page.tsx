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

// Comprehensive role combination scoring for entrepreneurship
// Based on Standout 2.0 research and entrepreneurship literature
const roleCombinationScores: Record<string, Record<string, number>> = {
  'Pioneer': {
    'Influencer': 9, // Excellent: Innovation + persuasion
    'Stimulator': 8, // Good: Innovation + energy
    'Advisor': 7, // Good: Innovation + wisdom
    'Connector': 8, // Good: Innovation + networking
    'Provider': 6, // Moderate: Innovation + reliability
    'Equalizer': 5, // Challenging: Innovation vs stability
    'Teacher': 7, // Good: Innovation + education
    'Creator': 8, // Good: Innovation + creation
    'Other': 5
  },
  'Influencer': {
    'Pioneer': 9, // Excellent: Persuasion + innovation
    'Stimulator': 8, // Good: Persuasion + energy
    'Advisor': 8, // Good: Persuasion + wisdom
    'Connector': 9, // Excellent: Persuasion + networking
    'Provider': 7, // Good: Persuasion + reliability
    'Equalizer': 6, // Moderate: Persuasion vs balance
    'Teacher': 8, // Good: Persuasion + education
    'Creator': 7, // Good: Persuasion + creation
    'Other': 6
  },
  'Stimulator': {
    'Pioneer': 8, // Good: Energy + innovation
    'Influencer': 8, // Good: Energy + persuasion
    'Advisor': 7, // Good: Energy + wisdom
    'Connector': 8, // Good: Energy + networking
    'Provider': 6, // Moderate: Energy vs reliability
    'Equalizer': 5, // Challenging: Energy vs stability
    'Teacher': 7, // Good: Energy + education
    'Creator': 7, // Good: Energy + creation
    'Other': 5
  },
  'Advisor': {
    'Pioneer': 7, // Good: Wisdom + innovation
    'Influencer': 8, // Good: Wisdom + persuasion
    'Stimulator': 7, // Good: Wisdom + energy
    'Connector': 8, // Good: Wisdom + networking
    'Provider': 8, // Good: Wisdom + reliability
    'Equalizer': 7, // Good: Wisdom + balance
    'Teacher': 8, // Good: Wisdom + education
    'Creator': 7, // Good: Wisdom + creation
    'Other': 6
  },
  'Connector': {
    'Pioneer': 8, // Good: Networking + innovation
    'Influencer': 9, // Excellent: Networking + persuasion
    'Stimulator': 8, // Good: Networking + energy
    'Advisor': 8, // Good: Networking + wisdom
    'Provider': 7, // Good: Networking + reliability
    'Equalizer': 7, // Good: Networking + balance
    'Teacher': 8, // Good: Networking + education
    'Creator': 7, // Good: Networking + creation
    'Other': 6
  },
  'Provider': {
    'Pioneer': 6, // Moderate: Reliability vs innovation
    'Influencer': 7, // Good: Reliability + persuasion
    'Stimulator': 6, // Moderate: Reliability vs energy
    'Advisor': 8, // Good: Reliability + wisdom
    'Connector': 7, // Good: Reliability + networking
    'Equalizer': 7, // Good: Reliability + balance
    'Teacher': 7, // Good: Reliability + education
    'Creator': 6, // Moderate: Reliability vs creativity
    'Other': 5
  },
  'Equalizer': {
    'Pioneer': 5, // Challenging: Balance vs innovation
    'Influencer': 6, // Moderate: Balance vs persuasion
    'Stimulator': 5, // Challenging: Balance vs energy
    'Advisor': 7, // Good: Balance + wisdom
    'Connector': 7, // Good: Balance + networking
    'Provider': 7, // Good: Balance + reliability
    'Teacher': 7, // Good: Balance + education
    'Creator': 6, // Moderate: Balance vs creativity
    'Other': 5
  },
  'Teacher': {
    'Pioneer': 7, // Good: Education + innovation
    'Influencer': 8, // Good: Education + persuasion
    'Stimulator': 7, // Good: Education + energy
    'Advisor': 8, // Good: Education + wisdom
    'Connector': 8, // Good: Education + networking
    'Provider': 7, // Good: Education + reliability
    'Equalizer': 7, // Good: Education + balance
    'Creator': 7, // Good: Education + creation
    'Other': 6
  },
  'Creator': {
    'Pioneer': 8, // Good: Creation + innovation
    'Influencer': 7, // Good: Creation + persuasion
    'Stimulator': 7, // Good: Creation + energy
    'Advisor': 7, // Good: Creation + wisdom
    'Connector': 7, // Good: Creation + networking
    'Provider': 6, // Moderate: Creation vs reliability
    'Equalizer': 6, // Moderate: Creation vs balance
    'Teacher': 7, // Good: Creation + education
    'Other': 5
  },
  'Other': {
    'Pioneer': 5,
    'Influencer': 6,
    'Stimulator': 5,
    'Advisor': 6,
    'Connector': 6,
    'Provider': 5,
    'Equalizer': 5,
    'Teacher': 6,
    'Creator': 5
  }
}

// Role descriptions for entrepreneurship context
const roleDescriptions: Record<string, string> = {
  'Pioneer': 'Innovative risk-taker who explores new opportunities and pushes boundaries. Excellent for identifying new markets and business models.',
  'Influencer': 'Natural persuader who inspires and motivates others. Great for sales, partnerships, and building customer relationships.',
  'Stimulator': 'Energetic motivator who brings enthusiasm and excitement. Perfect for team building and creating positive momentum.',
  'Advisor': 'Wise counselor who provides thoughtful guidance. Excellent for strategic planning and decision-making.',
  'Connector': 'Network builder who brings people together. Great for partnerships, referrals, and business development.',
  'Provider': 'Reliable caretaker who ensures needs are met. Essential for customer service and operational consistency.',
  'Equalizer': 'Balance creator who resolves conflicts and ensures fairness. Important for team harmony and stakeholder management.',
  'Teacher': 'Knowledge sharer who helps others learn and grow. Valuable for training, mentoring, and thought leadership.',
  'Creator': 'Visionary builder who turns ideas into reality. Perfect for product development and innovation.',
  'Other': 'Versatile individual with unique strengths that don\'t fit standard categories. Adaptable to various business needs.'
}

export default function StandoutAssessment() {
  const [role1, setRole1] = useState('')
  const [role2, setRole2] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const calculateEntrepreneurialScore = (role1: string, role2: string): number => {
    if (!role1 || !role2) return 0
    
    // Get the score for this combination
    const score = roleCombinationScores[role1]?.[role2] || 5
    
    return score
  }

  const getScoreDescription = (score: number): string => {
    if (score >= 9) return 'Exceptional entrepreneurial fit'
    if (score >= 8) return 'Strong entrepreneurial potential'
    if (score >= 7) return 'Good entrepreneurial foundation'
    if (score >= 6) return 'Moderate entrepreneurial fit'
    return 'Challenging entrepreneurial fit'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role1 || !role2) {
      alert('Please select your top 2 Standout roles.')
      return
    }
    if (role1 === role2) {
      alert('Please select two different Standout roles.')
      return
    }
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      
      // Calculate entrepreneurial fit score
      const entrepreneurialScore = calculateEntrepreneurialScore(role1, role2)
      
      console.log('Attempting to save Standout assessment for user:', user.id)
      console.log('Data to save:', { role1, role2, entrepreneurialScore })
      
      // Use the generic assessment API route
      const response = await fetch('/api/user-progress/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentType: 'standout',
          score: entrepreneurialScore,
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

  const currentScore = calculateEntrepreneurialScore(role1, role2)
  const scoreDescription = getScoreDescription(currentScore)

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
          
          {/* Score Preview */}
          {role1 && role2 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {currentScore}/10
                </div>
                <div className="text-blue-800 font-medium mb-2">{scoreDescription}</div>
                <div className="text-sm text-blue-700">
                  {role1} + {role2} combination
                </div>
              </div>
            </div>
          )}

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
              {role1 && (
                <p className="mt-2 text-sm text-gray-600">{roleDescriptions[role1]}</p>
              )}
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
                {standoutRoles
                  .filter(role => role !== role1) // Exclude the first role
                  .map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
              </select>
              {role2 && (
                <p className="mt-2 text-sm text-gray-600">{roleDescriptions[role2]}</p>
              )}
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