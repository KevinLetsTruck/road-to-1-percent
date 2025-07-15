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
    
    // Try to store the data in the user's profile instead
    console.log('Attempting to update user profile with Standout data...')
    const { data, error } = await supabase
      .from('profiles')
      .update({
        // Store Standout data in profile fields (we'll use existing fields)
        first_name: role1, // Temporarily store role1 here
        last_name: role2,  // Temporarily store role2 here
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
    
    console.log('Profile update result:', { data, error })
    
    if (error) {
      console.error('Profile update error:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: `Profile update error: ${error.message}` },
        { status: 500 }
      )
    }
    
    console.log('Success! Standout data stored in profile')
    return NextResponse.json({ 
      success: true, 
      data,
      message: 'Standout assessment completed (data stored in profile)',
      roles: { role1, role2, fitScore },
      note: 'Data temporarily stored in profile fields - will be moved to proper location later'
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 