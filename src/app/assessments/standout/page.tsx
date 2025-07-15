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
      
      // First check if user_progress record exists
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', user.id)
        .single()
      
      let error
      if (existingProgress) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('user_progress')
          .update({
            standout_completed: true,
            standout_role_1: role1,
            standout_role_2: role2,
            standout_score: fitScore,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
        error = updateError
      } else {
        // Create new record with all required fields
        const { error: insertError } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            current_tier: '90%',
            // Financial Foundation Assessment
            financial_foundation_completed: false,
            financial_foundation_score: null,
            // Market Intelligence Assessment
            market_intelligence_completed: false,
            market_intelligence_score: null,
            // Personal Strengths Assessment
            personal_strengths_completed: false,
            personal_strengths_score: null,
            // Risk Management Assessment
            risk_management_completed: false,
            risk_management_score: null,
            // Support Systems Assessment
            support_systems_completed: false,
            support_systems_score: null,
            // Legacy fields
            spi_completed: false,
            spi_score: null,
            // Standout Assessment
            standout_completed: true,
            standout_role_1: role1,
            standout_role_2: role2,
            standout_score: fitScore,
            // Legacy assessment fields
            industry_knowledge_completed: false,
            industry_knowledge_score: null,
            leadership_completed: false,
            leadership_score: null,
            customer_service_completed: false,
            customer_service_score: null,
            operational_completed: false,
            operational_score: null,
            health_completed: false,
            health_score: null,
            // Progress tracking
            business_track_progress: 0,
            personal_track_progress: 0,
            health_track_progress: 0,
            milestones_achieved: [],
            program_start_date: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        error = insertError
      }
      
      if (error) {
        console.error('Database error:', error)
        alert('There was an error saving your Standout assessment. Please try again.')
        return
      }
      
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