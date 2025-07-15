import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    console.log('API route called')
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
    
    // Try a simple upsert operation with only essential fields
    console.log('Attempting upsert operation...')
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        current_tier: '90%',
        standout_completed: true,
        standout_role_1: role1,
        standout_role_2: role2,
        standout_score: fitScore,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
    
    console.log('Upsert result:', { data, error })
    
    if (error) {
      console.error('Database error details:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }
    
    console.log('Success!')
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 