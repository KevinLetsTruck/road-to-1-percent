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
    
    if (!assessmentType || score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: assessmentType and score' },
        { status: 400 }
      )
    }

    console.log(`Processing ${assessmentType} assessment for user ${user.id}`)
    
    // Check if user progress exists
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', user.id)
      .single()

    // Prepare update data based on assessment type
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    }

    switch (assessmentType) {
      case 'financial_foundation':
        updateData.financial_foundation_completed = true
        updateData.financial_foundation_score = score
        break
      case 'standout':
        updateData.standout_completed = true
        updateData.standout_role_1 = additionalData.role1
        updateData.standout_role_2 = additionalData.role2
        updateData.standout_score = score
        break
      case 'leadership':
        updateData.leadership_completed = true
        updateData.leadership_score = score
        if (additionalData.categoryScores) {
          updateData.leadership_communication = additionalData.categoryScores.Communication
          updateData.leadership_decision_making = additionalData.categoryScores['Decision Making']
          updateData.leadership_team_management = additionalData.categoryScores['Support Network Management']
          updateData.leadership_strategic_thinking = additionalData.categoryScores['Strategic Thinking']
          updateData.leadership_personal_development = additionalData.categoryScores['Personal Development']
        }
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
        return NextResponse.json(
          { error: `Unknown assessment type: ${assessmentType}` },
          { status: 400 }
        )
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

      return NextResponse.json({ 
        success: true, 
        progress: data,
        message: `${assessmentType.replace('_', ' ')} assessment completed successfully`
      })
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
          industry_knowledge_completed: false,
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

      return NextResponse.json({ 
        success: true, 
        progress: data,
        message: `${assessmentType.replace('_', ' ')} assessment completed successfully`
      })
    }
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 