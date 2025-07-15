import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Get user by email
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers()
    
    if (userError) {
      return NextResponse.json({ error: 'Failed to get users' }, { status: 500 })
    }

    const user = users.find(u => u.email === email)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user to confirmed
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    )

    if (updateError) {
      return NextResponse.json({ error: 'Failed to verify user' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'User verified successfully',
      user: { id: user.id, email: user.email }
    })

  } catch (error) {
    console.error('Error verifying user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 