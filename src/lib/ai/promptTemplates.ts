/**
 * Structured prompt templates for consistent AI outputs across the Road to 1% app
 * These templates ensure Claude provides contextually relevant and actionable responses
 */

export interface UserContext {
  userId: string;
  currentTier: string;
  spiScore: number;
  financialFoundationScore: number;
  marketIntelligenceScore: number;
  personalStrengthsScore: number;
  riskManagementScore: number;
  supportSystemsScore: number;
  standoutStrength1?: string;
  standoutStrength2?: string;
  recentProgress?: string[];
  challenges?: string[];
}

export interface ActionPlanRequest {
  userContext: UserContext;
  focusAreas: string[];
  tier: string;
  timeFrame: string;
  currentChallenges?: string[];
}

export interface ChatContext {
  userContext: UserContext;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  currentQuery: string;
}

export class PromptTemplates {
  /**
   * Generate a personalized action plan based on user's assessment results
   */
  static generateActionPlanPrompt(request: ActionPlanRequest): string {
    const { userContext, focusAreas, tier, timeFrame, currentChallenges } = request;

    return `You are an expert business coach specializing in owner-operator trucking businesses. Your task is to create a highly personalized, actionable ${timeFrame}-month action plan for a trucking entrepreneur who is currently at the "${tier}" tier with the following profile:

USER PROFILE:
- Current Tier: ${tier}
- Overall SPI Score: ${userContext.spiScore}/100
- Financial Foundation: ${userContext.financialFoundationScore}/35 points
- Market Intelligence: ${userContext.marketIntelligenceScore}/20 points
- Personal Strengths: ${userContext.personalStrengthsScore}/20 points
- Risk Management: ${userContext.riskManagementScore}/15 points
- Support Systems: ${userContext.supportSystemsScore}/10 points

STRENGTHS (from StandOut Assessment):
- Primary: ${userContext.standoutStrength1 || 'Not assessed yet'}
- Secondary: ${userContext.standoutStrength2 || 'Not assessed yet'}

${currentChallenges && currentChallenges.length > 0 ? `CURRENT CHALLENGES:
${currentChallenges.map(challenge => `- ${challenge}`).join('\n')}` : ''}

FOCUS AREAS REQUESTED:
${focusAreas.map(area => `- ${area}`).join('\n')}

INSTRUCTIONS:
Create a detailed, realistic action plan that leverages their unique strengths while addressing their specific gaps. The plan should be:

1. **Highly Specific**: Include exact steps, tools, and metrics to track progress
2. **Leverage Strengths**: Use their StandOut strengths (${userContext.standoutStrength1}, ${userContext.standoutStrength2}) as the foundation for their strategy
3. **Tier-Appropriate**: Tailored for someone at the "${tier}" level - not too advanced, not too basic
4. **Time-Bound**: Designed for ${timeFrame} months with clear milestones
5. **Measurable**: Include specific KPIs and success metrics
6. **Realistic**: Based on actual trucking industry practices and owner-operator realities
7. **Motivational**: Include encouragement and progress celebration points

STRUCTURE YOUR RESPONSE AS FOLLOWS:

## 🎯 OVERALL STRATEGY
[2-3 sentences describing the high-level approach that leverages their strengths]

## 📊 KEY METRICS TO TRACK
[Bullet points of 3-5 measurable outcomes they should aim for]

## 🏗️ MONTH-BY-MONTH BREAKDOWN

### Month 1: [Theme]
**Focus:** [What to accomplish]
**Key Actions:**
- [Specific, actionable step with timeline]
- [Another specific step]
**Resources Needed:**
- [Tools, contacts, or materials required]
**Success Indicators:**
- [How they'll know they're on track]

[Repeat for each month]

## 💪 STRENGTH-BASED ADVANTAGES
[How their specific strengths (${userContext.standoutStrength1}, ${userContext.standoutStrength2}) give them an edge in implementing this plan]

## ⚠️ POTENTIAL ROADBLOCKS & SOLUTIONS
[2-3 common challenges for someone in their situation and how to overcome them]

## 🎉 CELEBRATION MILESTONES
[Specific points where they should acknowledge progress and reward themselves]

Remember: This should feel like advice from an experienced mentor who truly understands trucking business ownership, not generic business advice.`;
  }

  /**
   * Generate contextual AI chat responses for the coach interface
   */
  static generateChatPrompt(context: ChatContext): string {
    const { userContext, conversationHistory, currentQuery } = context;

    const recentHistory = conversationHistory.slice(-5).map(msg =>
      `${msg.role === 'user' ? 'User' : 'Coach'}: ${msg.content}`
    ).join('\n');

    return `You are "Coach AI", an expert business coach specializing in owner-operator trucking businesses. You have deep knowledge of the trucking industry, business management, and personal development.

USER CONTEXT:
- Current Tier: ${userContext.currentTier}
- SPI Score: ${userContext.spiScore}/100
- StandOut Strengths: ${userContext.standoutStrength1 || 'Unknown'}, ${userContext.standoutStrength2 || 'Unknown'}
- Key Scores: Financial ${userContext.financialFoundationScore}/35, Market ${userContext.marketIntelligenceScore}/20, Personal ${userContext.personalStrengthsScore}/20

RECENT CONVERSATION:
${recentHistory}

CURRENT USER QUESTION: "${currentQuery}"

INSTRUCTIONS:
- Be conversational, supportive, and encouraging like an experienced mentor
- Reference their specific scores and strengths when relevant
- Provide practical, trucking-specific advice
- Keep responses focused and actionable
- If they ask about complex topics, break it down into simple steps
- Always acknowledge their current situation and tier level
- Use trucking industry terminology appropriately
- End with a question to continue the conversation if appropriate

Respond naturally as a knowledgeable coach would, not as an AI system.`;
  }

  /**
   * Generate weekly progress insights and summaries
   */
  static generateWeeklyInsightsPrompt(userContext: UserContext, recentActivity: string[]): string {
    return `You are an expert business analyst for owner-operator trucking businesses. Analyze this entrepreneur's recent activity and provide a concise, actionable weekly insight summary.

USER PROFILE:
- Current Tier: ${userContext.currentTier}
- SPI Score: ${userContext.spiScore}/100
- StandOut Strengths: ${userContext.standoutStrength1}, ${userContext.standoutStrength2}

RECENT ACTIVITY (Last 7 days):
${recentActivity.map(activity => `- ${activity}`).join('\n')}

INSTRUCTIONS:
Provide a brief, encouraging weekly summary that includes:
1. **Progress Recognition**: What they've accomplished well
2. **Key Insight**: One important pattern or opportunity you notice
3. **Action Suggestion**: One specific, high-impact action for next week
4. **Encouragement**: A motivating note leveraging their strengths

Keep the total response under 200 words. Focus on trucking-specific insights.`;
  }

  /**
   * Generate predictive analytics and early warnings
   */
  static generatePredictionPrompt(userContext: UserContext, historicalData: any[]): string {
    return `You are a business forecasting expert for owner-operator trucking companies. Analyze this entrepreneur's trajectory and provide predictive insights.

USER DATA:
- Current Tier: ${userContext.currentTier}
- SPI Score: ${userContext.spiScore}/100
- Assessment History: ${historicalData.length} assessments
- StandOut Strengths: ${userContext.standoutStrength1}, ${userContext.standoutStrength2}

INSTRUCTIONS:
Based on their current trajectory and typical owner-operator progress patterns, predict:
1. **Next Tier Timeline**: When they might reach the next tier (realistic estimate)
2. **Risk Areas**: Which areas need immediate attention to avoid setbacks
3. **Success Accelerators**: What could speed up their progress
4. **Warning Signs**: Red flags to watch for in the coming weeks

Be data-driven but encouraging. Focus on actionable insights, not generic advice.`;
  }
}
