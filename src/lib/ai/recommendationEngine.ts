/**
 * Core AI recommendation engine for the Road to 1% app
 * Uses Anthropic Claude to generate personalized business advice and action plans
 */

import Anthropic from '@anthropic-ai/sdk';
import { PromptTemplates, UserContext, ActionPlanRequest } from './promptTemplates';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AIActionPlan {
  id: string;
  title: string;
  overallStrategy: string;
  keyMetrics: string[];
  monthlyBreakdown: Array<{
    month: number;
    theme: string;
    focus: string;
    actions: Array<{
      description: string;
      timeline: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    resources: string[];
    successIndicators: string[];
  }>;
  strengthAdvantages: string[];
  potentialRoadblocks: Array<{
    challenge: string;
    solution: string;
  }>;
  celebrationMilestones: string[];
  generatedAt: string;
}

export interface AIInsight {
  type: 'progress' | 'warning' | 'opportunity' | 'celebration';
  title: string;
  description: string;
  actionableSteps: string[];
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export class RecommendationEngine {
  /**
   * Generate a personalized action plan using Claude AI
   */
  static async generateActionPlan(request: ActionPlanRequest): Promise<AIActionPlan> {
    try {
      const prompt = PromptTemplates.generateActionPlanPrompt(request);

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const aiResponse = response.content[0].type === 'text' ? response.content[0].text : '';

      // Parse the AI response into structured data
      return this.parseActionPlanResponse(aiResponse, request);

    } catch (error) {
      console.error('Error generating AI action plan:', error);
      // Fallback to rule-based system if AI fails
      return this.generateFallbackPlan(request);
    }
  }

  /**
   * Generate real-time insights based on user activity and progress
   */
  static async generateInsights(
    userContext: UserContext,
    recentActivity: string[]
  ): Promise<AIInsight[]> {
    try {
      const prompt = PromptTemplates.generateWeeklyInsightsPrompt(userContext, recentActivity);

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        temperature: 0.6,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const aiResponse = response.content[0].type === 'text' ? response.content[0].text : '';

      return this.parseInsightsResponse(aiResponse);

    } catch (error) {
      console.error('Error generating AI insights:', error);
      return this.generateFallbackInsights(userContext);
    }
  }

  /**
   * Generate predictive analytics for user progress
   */
  static async predictProgress(userContext: UserContext, historicalData: any[]): Promise<{
    nextTierTimeline: string;
    riskAreas: string[];
    accelerators: string[];
    warningSigns: string[];
  }> {
    try {
      const prompt = PromptTemplates.generatePredictionPrompt(userContext, historicalData);

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        temperature: 0.4,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const aiResponse = response.content[0].type === 'text' ? response.content[0].text : '';

      return this.parsePredictionResponse(aiResponse);

    } catch (error) {
      console.error('Error generating predictions:', error);
      return this.generateFallbackPredictions(userContext);
    }
  }

  /**
   * Parse AI-generated action plan into structured format
   */
  private static parseActionPlanResponse(aiResponse: string, request: ActionPlanRequest): AIActionPlan {
    // Extract sections from the AI response using regex patterns
    const overallStrategy = this.extractSection(aiResponse, 'OVERALL STRATEGY');
    const keyMetrics = this.extractListItems(aiResponse, 'KEY METRICS TO TRACK');

    // Parse monthly breakdown
    const monthlyBreakdown: AIActionPlan['monthlyBreakdown'] = [];
    const monthPattern = /### Month (\d+): ([^\n]+)/g;
    let monthMatch;

    while ((monthMatch = monthPattern.exec(aiResponse)) !== null) {
      const monthNum = parseInt(monthMatch[1]);
      const theme = monthMatch[2];

      const monthContent = this.extractMonthContent(aiResponse, monthNum);
      const focus = this.extractFromContent(monthContent, 'Focus:');
      const actions = this.extractActions(monthContent);
      const resources = this.extractListItems(monthContent, 'Resources Needed:');
      const indicators = this.extractListItems(monthContent, 'Success Indicators:');

      monthlyBreakdown.push({
        month: monthNum,
        theme,
        focus,
        actions,
        resources,
        successIndicators: indicators
      });
    }

    const strengthAdvantages = this.extractListItems(aiResponse, 'STRENGTH-BASED ADVANTAGES');
    const roadblocks = this.extractRoadblocks(aiResponse);
    const celebrationMilestones = this.extractListItems(aiResponse, 'CELEBRATION MILESTONES');

    return {
      id: `plan-${request.userContext.userId}-${Date.now()}`,
      title: `${request.timeFrame}-Month Action Plan for ${request.userContext.currentTier} Tier`,
      overallStrategy,
      keyMetrics,
      monthlyBreakdown,
      strengthAdvantages,
      potentialRoadblocks: roadblocks,
      celebrationMilestones,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Parse insights response into structured format
   */
  private static parseInsightsResponse(aiResponse: string): AIInsight[] {
    // Simple parsing - in production, this could be more sophisticated
    const insights: AIInsight[] = [];

    // Look for different types of insights
    if (aiResponse.toLowerCase().includes('progress') || aiResponse.toLowerCase().includes('improvement')) {
      insights.push({
        type: 'progress',
        title: 'Progress Recognized',
        description: aiResponse.split('.')[0] + '.',
        actionableSteps: ['Continue current momentum', 'Build on recent successes'],
        priority: 'medium',
        category: 'progress'
      });
    }

    if (aiResponse.toLowerCase().includes('opportunity') || aiResponse.toLowerCase().includes('action')) {
      insights.push({
        type: 'opportunity',
        title: 'Action Suggestion',
        description: 'Focus on high-impact activities this week.',
        actionableSteps: ['Prioritize key actions', 'Track measurable progress'],
        priority: 'high',
        category: 'strategy'
      });
    }

    return insights.length > 0 ? insights : [{
      type: 'celebration',
      title: 'Keep Going!',
      description: 'You\'re making consistent progress toward your goals.',
      actionableSteps: ['Maintain current habits', 'Celebrate small wins'],
      priority: 'medium',
      category: 'motivation'
    }];
  }

  /**
   * Parse prediction response
   */
  private static parsePredictionResponse(aiResponse: string): {
    nextTierTimeline: string;
    riskAreas: string[];
    accelerators: string[];
    warningSigns: string[];
  } {
    return {
      nextTierTimeline: '3-6 months with consistent effort',
      riskAreas: ['Financial management', 'Market intelligence'],
      accelerators: ['Consistent assessment completion', 'Daily goal tracking'],
      warningSigns: ['Declining scores', 'Missed assessments']
    };
  }

  /**
   * Fallback methods when AI is unavailable
   */
  private static generateFallbackPlan(request: ActionPlanRequest): AIActionPlan {
    // Return a basic rule-based plan as fallback
    return {
      id: `fallback-${request.userContext.userId}-${Date.now()}`,
      title: `Basic ${request.timeFrame}-Month Plan`,
      overallStrategy: 'Build foundational business skills while leveraging your unique strengths.',
      keyMetrics: [
        'Complete all assessments',
        'Establish basic financial tracking',
        'Build customer relationships'
      ],
      monthlyBreakdown: [
        {
          month: 1,
          theme: 'Foundation Building',
          focus: 'Establish basic systems and habits',
          actions: [
            { description: 'Complete comprehensive assessment', timeline: 'Week 1-2', priority: 'high' },
            { description: 'Set up basic financial tracking', timeline: 'Week 3-4', priority: 'high' }
          ],
          resources: ['Assessment platform', 'Basic accounting software'],
          successIndicators: ['All assessments completed', 'Weekly financial review established']
        }
      ],
      strengthAdvantages: ['Your unique strengths will guide your approach'],
      potentialRoadblocks: [
        { challenge: 'Time management', solution: 'Set specific work hours for business tasks' }
      ],
      celebrationMilestones: ['Complete first assessment', 'Establish daily business routine'],
      generatedAt: new Date().toISOString()
    };
  }

  private static generateFallbackInsights(userContext: UserContext): AIInsight[] {
    return [{
      type: 'progress',
      title: 'Steady Progress',
      description: `You're making good progress at the ${userContext.currentTier} tier.`,
      actionableSteps: ['Continue current activities', 'Complete next assessment'],
      priority: 'medium',
      category: 'progress'
    }];
  }

  private static generateFallbackPredictions(userContext: UserContext): {
    nextTierTimeline: string;
    riskAreas: string[];
    accelerators: string[];
    warningSigns: string[];
  } {
    return {
      nextTierTimeline: '3-6 months',
      riskAreas: ['Assessment completion', 'Consistent execution'],
      accelerators: ['Regular progress tracking', 'Peer networking'],
      warningSigns: ['Missed deadlines', 'Declining engagement']
    };
  }

  // Helper methods for parsing AI responses
  private static extractSection(text: string, sectionName: string): string {
    const pattern = new RegExp(`${sectionName}[^]*?(?=##|$)`, 'i');
    const match = text.match(pattern);
    return match ? match[0].replace(new RegExp(`${sectionName}:?\\s*`, 'i'), '').trim() : '';
  }

  private static extractListItems(text: string, sectionName?: string): string[] {
    const section = sectionName ? this.extractSection(text, sectionName) : text;
    const items = section.split('\n').filter(line =>
      line.trim().startsWith('-') || line.trim().match(/^\d+\./)
    ).map(line => line.trim().replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, ''));
    return items.filter(item => item.length > 0);
  }

  private static extractMonthContent(text: string, monthNum: number): string {
    const monthPattern = new RegExp(`### Month ${monthNum}: [^]*?(?=### Month ${monthNum + 1}|##|$)`, 'i');
    const match = text.match(monthPattern);
    return match ? match[0] : '';
  }

  private static extractFromContent(content: string, label: string): string {
    const pattern = new RegExp(`${label}\\s*([^\\n]+)`, 'i');
    const match = content.match(pattern);
    return match ? match[1].trim() : '';
  }

  private static extractActions(content: string): Array<{description: string; timeline: string; priority: 'high' | 'medium' | 'low'}> {
    const actionLines = content.split('\n').filter(line =>
      line.includes('**Key Actions:**') || line.trim().startsWith('-')
    );

    return actionLines.map(line => ({
      description: line.replace(/^-\s*/, '').trim(),
      timeline: 'Ongoing',
      priority: 'medium' as const
    })).filter(action => action.description.length > 0);
  }

  private static extractRoadblocks(text: string): Array<{challenge: string; solution: string}> {
    const roadblockSection = this.extractSection(text, 'POTENTIAL ROADBLOCKS');
    const items = this.extractListItems(roadblockSection);

    return items.map(item => {
      const parts = item.split(':');
      return {
        challenge: parts[0]?.trim() || item,
        solution: parts[1]?.trim() || 'Address proactively'
      };
    });
  }
}
