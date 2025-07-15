import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    console.log('Standout API route called')
    const body = await request.json()
    console.log('Request body:', body)
    
    const { userId, role1, role2, fitScore } = body
    
    if (!userId || !role1 || !role2) {
      console.log('Missing required fields:', { userId, role1, role2 })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Creating Supabase client...')
    const supabase = await createClient()
    console.log('Supabase client created')
    
    // Check if user progress exists, create if it doesn't
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', userId)
      .single()

    let updateData = {
      standout_completed: true,
      standout_role_1: role1,
      standout_role_2: role2,
      standout_score: fitScore,
      updated_at: new Date().toISOString()
    }

    if (existingProgress) {
      // Update existing progress
      console.log('Updating existing user progress...')
      const { data, error } = await supabase
        .from('user_progress')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single()
      
      if (error) {
        console.error('Update error:', error)
        return NextResponse.json(
          { error: `Update error: ${error.message}` },
          { status: 500 }
        )
      }
      
      console.log('Success! Standout data updated in user_progress')
      return NextResponse.json({ 
        success: true, 
        data,
        message: 'Standout assessment completed successfully'
      })
    } else {
      // Create new progress record
      console.log('Creating new user progress record...')
      const { data, error } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          current_tier: '90%',
          spi_completed: false,
          standout_completed: true,
          standout_role_1: role1,
          standout_role_2: role2,
          standout_score: fitScore,
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
        .select()
        .single()

      if (error) {
        console.error('Insert error:', error)
        return NextResponse.json(
          { error: `Insert error: ${error.message}` },
          { status: 500 }
        )
      }
      
      console.log('Success! New user progress created with Standout data')
      return NextResponse.json({ 
        success: true, 
        data,
        message: 'Standout assessment completed successfully'
      })
    }
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 