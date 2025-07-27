import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: adminProfile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profileError || !adminProfile?.is_admin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    // Get the user ID to toggle
    const { userId, isTestUser } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Toggle the test user status
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_test_user: isTestUser })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error toggling test user status:', error)
      return NextResponse.json(
        { error: 'Failed to update user status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      user: data,
      message: `User ${isTestUser ? 'excluded from' : 'included in'} statistics`
    })
  } catch (error) {
    console.error('Error in toggle-test-user route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 