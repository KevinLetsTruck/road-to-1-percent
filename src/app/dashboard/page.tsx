'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    const checkAssessmentStatus = async () => {
      try {
        // Check if user has completed the comprehensive assessment
        const { data: assessmentData } = await supabase
          .from('comprehensive_assessments')
          .select('id, assessment_date')
          .eq('user_id', user.id)
          .order('assessment_date', { ascending: false })
          .limit(1)
          .single()

        if (assessmentData) {
          // User has completed assessment, redirect to results
          router.push('/dashboard/comprehensive-assessment/results')
        } else {
          // User hasn't completed assessment, redirect to assessment
          router.push('/dashboard/comprehensive-assessment')
        }
      } catch (error) {
        // No assessment found, redirect to take assessment
        router.push('/dashboard/comprehensive-assessment')
      }
    }

    checkAssessmentStatus()
  }, [user, authLoading, router, supabase])

  // Show loading state while checking
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your assessment status...</p>
      </div>
    </div>
  )
}