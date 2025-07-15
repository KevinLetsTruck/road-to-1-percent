import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, role1, role2, fitScore } = await request.json()
    
    if (!userId || !role1 || !role2) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // First check if user_progress record exists
    const { data: existingProgress, error: checkError } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', userId)
      .single()
    
    console.log('Check result:', { existingProgress, checkError })
    
    let error
    if (existingProgress) {
      console.log('Updating existing record for user:', userId)
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
        .eq('user_id', userId)
      error = updateError
      console.log('Update error:', updateError)
    } else {
      console.log('Creating new record for user:', userId)
      // Create new record with all required fields
      const { error: insertError } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          current_tier: '90%',
          financial_foundation_completed: false,
          market_intelligence_completed: false,
          personal_strengths_completed: false,
          risk_management_completed: false,
          support_systems_completed: false,
          spi_completed: false,
          standout_completed: true,
          standout_role_1: role1,
          standout_role_2: role2,
          standout_score: fitScore,
          industry_knowledge_completed: false,
          leadership_completed: false,
          customer_service_completed: false,
          operational_completed: false,
          health_completed: false,
          business_track_progress: 0,
          personal_track_progress: 0,
          health_track_progress: 0,
          milestones_achieved: [],
          program_start_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      error = insertError
      console.log('Insert error:', insertError)
    }
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save assessment data' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 