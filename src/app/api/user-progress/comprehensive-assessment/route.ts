import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { totalScore, tier, strengthCombo, dimensionScores } = body

    // Check if user progress already exists
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', user.id)
      .single()

    const updateData = {
      current_tier: tier,
      // Update all dimension scores and completion status
      financial_foundation_completed: true,
      financial_foundation_score: dimensionScores.financial_foundation,
      market_intelligence_completed: true,
      market_intelligence_score: dimensionScores.market_intelligence,
      personal_strengths_completed: true,
      personal_strengths_score: dimensionScores.personal_strengths,
      risk_management_completed: true,
      risk_management_score: dimensionScores.risk_management,
      support_systems_completed: true,
      support_systems_score: dimensionScores.support_systems,
      // Legacy SPI fields for backward compatibility
      spi_completed: true,
      spi_score: totalScore,
      // Add strength combination if available
      strength_combination: strengthCombo,
      updated_at: new Date().toISOString()
    }

    if (existingProgress) {
      // Update existing progress
      const { data, error } = await supabase
        .from('user_progress')
        .update(updateData)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ progress: data })
    } else {
      // Create new progress record
      const { data, error } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          business_track_progress: 0,
          personal_track_progress: 0,
          health_track_progress: 0,
          milestones_achieved: [],
          program_start_date: new Date().toISOString(),
          ...updateData
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ progress: data })
    }
  } catch (error) {
    console.error('Comprehensive assessment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 