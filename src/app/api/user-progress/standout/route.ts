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
    
    // Try to get the current schema by querying the table
    console.log('Checking table schema...')
    const { data: schemaCheck, error: schemaError } = await supabase
      .from('user_progress')
      .select('*')
      .limit(1)
    
    console.log('Schema check result:', { schemaCheck, schemaError })
    
    if (schemaError) {
      console.error('Schema error:', schemaError)
      return NextResponse.json(
        { error: `Schema error: ${schemaError.message}` },
        { status: 500 }
      )
    }
    
    // Try a minimal upsert with only the most basic fields
    console.log('Attempting minimal upsert...')
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
    
    console.log('Minimal upsert result:', { data, error })
    
    if (error) {
      console.error('Database error details:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }
    
    console.log('Success!')
    return NextResponse.json({ 
      success: true, 
      data,
      message: 'Standout assessment completed (basic record created)',
      roles: { role1, role2, fitScore }
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 