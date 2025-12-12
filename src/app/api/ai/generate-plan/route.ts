/**
 * AI Action Plan Generation API Endpoint
 * Generates personalized business action plans using Claude AI
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { RecommendationEngine } from '@/lib/ai/recommendationEngine';
import { ChatContextManager } from '@/lib/ai/chatContext';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      focusAreas = ['financial', 'business', 'personal'],
      timeFrame = '3',
      currentChallenges = []
    } = body;

    // Get user's current context and progress
    const { data: userProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const { data: comprehensiveAssessment } = await supabase
      .from('comprehensive_assessments')
      .select('*')
      .eq('user_id', user.id)
      .order('assessment_date', { ascending: false })
      .limit(1)
      .single();

    if (!userProgress) {
      return NextResponse.json(
        { error: 'User progress data not found. Please complete an assessment first.' },
        { status: 400 }
      );
    }

    // Calculate current tier based on SPI score
    const totalScore = (userProgress.financial_foundation_score || 0) +
                      (userProgress.market_intelligence_score || 0) +
                      (userProgress.personal_strengths_score || 0) +
                      (userProgress.risk_management_score || 0) +
                      (userProgress.support_systems_score || 0);

    let currentTier = '90%';
    if (totalScore >= 70) currentTier = '9%';
    if (totalScore >= 85) currentTier = '1%';

    // Build user context for AI
    const userContext = {
      userId: user.id,
      currentTier,
      spiScore: totalScore,
      financialFoundationScore: userProgress.financial_foundation_score || 0,
      marketIntelligenceScore: userProgress.market_intelligence_score || 0,
      personalStrengthsScore: userProgress.personal_strengths_score || 0,
      riskManagementScore: userProgress.risk_management_score || 0,
      supportSystemsScore: userProgress.support_systems_score || 0,
      standoutStrength1: comprehensiveAssessment?.standout_strength_1 || undefined,
      standoutStrength2: comprehensiveAssessment?.standout_strength_2 || undefined,
      recentProgress: [], // Would be populated from recent activity
      challenges: currentChallenges
    };

    // Generate AI-powered action plan
    const actionPlanRequest = {
      userContext,
      focusAreas,
      tier: currentTier,
      timeFrame: `${timeFrame}`,
      currentChallenges
    };

    const aiActionPlan = await RecommendationEngine.generateActionPlan(actionPlanRequest);

    // Save the generated plan to database for future reference
    try {
      await supabase.from('ai_insights').insert({
        user_id: user.id,
        type: 'action_plan',
        content: aiActionPlan,
        generated_at: new Date().toISOString(),
        focus_areas: focusAreas,
        time_frame: timeFrame
      });
    } catch (dbError) {
      console.error('Error saving AI action plan to database:', dbError);
      // Don't fail the request if database save fails
    }

    return NextResponse.json({
      success: true,
      actionPlan: aiActionPlan,
      userContext
    });

  } catch (error) {
    console.error('Error generating AI action plan:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate action plan',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's recent AI-generated action plans
    const { data: recentPlans, error: plansError } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'action_plan')
      .order('generated_at', { ascending: false })
      .limit(5);

    if (plansError) {
      console.error('Error fetching recent plans:', plansError);
      return NextResponse.json(
        { error: 'Failed to fetch recent plans' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      recentPlans: recentPlans || []
    });

  } catch (error) {
    console.error('Error fetching AI action plans:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch action plans',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
