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
    const { assessmentType, score, additionalData = {} } = body

    // Check if user progress already exists
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', user.id)
      .single()

    // Prepare update data based on assessment type
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    switch (assessmentType) {
      case 'financial_foundation':
        updateData.financial_foundation_completed = true
        updateData.financial_foundation_score = score
        break
      case 'market_intelligence':
        updateData.market_intelligence_completed = true
        updateData.market_intelligence_score = score
        break
      case 'personal_strengths':
        updateData.personal_strengths_completed = true
        updateData.personal_strengths_score = score
        break
      case 'risk_management':
        updateData.risk_management_completed = true
        updateData.risk_management_score = score
        break
      case 'support_systems':
        updateData.support_systems_completed = true
        updateData.support_systems_score = score
        break
      case 'standout':
        updateData.standout_completed = true
        updateData.standout_score = score
        updateData.standout_role_1 = additionalData.role1
        updateData.standout_role_2 = additionalData.role2
        break
      case 'leadership':
        updateData.leadership_completed = true
        updateData.leadership_score = score
        updateData.leadership_communication = additionalData.communication
        updateData.leadership_decision_making = additionalData.decision_making
        updateData.leadership_team_management = additionalData.team_management
        updateData.leadership_strategic_thinking = additionalData.strategic_thinking
        updateData.leadership_personal_development = additionalData.personal_development
        break
      case 'customer_service':
        updateData.customer_service_completed = true
        updateData.customer_service_score = score
        break
      case 'operational':
        updateData.operational_completed = true
        updateData.operational_score = score
        break
      case 'health':
        updateData.health_completed = true
        updateData.health_score = score
        break
      case 'industry_knowledge':
        updateData.industry_knowledge_completed = true
        updateData.industry_knowledge_score = score
        break
      default:
        return NextResponse.json({ error: 'Invalid assessment type' }, { status: 400 })
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
        console.error('Update error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ progress: data })
    } else {
      // Create new progress record
      const { data, error } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          current_tier: '90%',
          spi_completed: false,
          standout_completed: false,
          leadership_completed: false,
          customer_service_completed: false,
          operational_completed: false,
          health_completed: false,
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
        console.error('Insert error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ progress: data })
    }
  } catch (error) {
    console.error('Assessment API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 