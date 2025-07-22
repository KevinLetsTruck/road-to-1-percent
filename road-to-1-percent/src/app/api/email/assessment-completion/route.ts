import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SimpleEmailService } from '@/lib/email/simple-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { assessmentName, score, tier } = body

    // Get user profile for name
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    const userName = `${profile.first_name} ${profile.last_name}`

    // Send email
    await SimpleEmailService.sendAssessmentCompletion(user.email!, {
      userName,
      assessmentName,
      score,
      tier
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending assessment completion email:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
} 