/**
 * Chat context management for the AI Coach
 * Maintains conversation history and user context for personalized interactions
 */

import { UserContext } from './promptTemplates';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    contextUsed?: boolean;
    assessmentReferenced?: string;
    actionSuggested?: string;
  };
}

export interface ConversationSession {
  id: string;
  userId: string;
  startedAt: string;
  lastActivity: string;
  messageCount: number;
  topicsDiscussed: string[];
  contextSummary: string;
}

export class ChatContextManager {
  private static readonly MAX_HISTORY_LENGTH = 20;
  private static readonly CONTEXT_SUMMARY_INTERVAL = 10; // Summarize every 10 messages

  /**
   * Get conversation history for a user
   */
  static async getConversationHistory(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    try {
      // In a real implementation, this would fetch from database
      // For now, return empty array - we'll implement persistence later
      return [];
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      return [];
    }
  }

  /**
   * Save a new message to conversation history
   */
  static async saveMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
    const chatMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    try {
      // In a real implementation, save to database
      console.log('Saving message:', chatMessage);
      return chatMessage;
    } catch (error) {
      console.error('Error saving message:', error);
      return chatMessage;
    }
  }

  /**
   * Get recent conversation context for AI processing
   */
  static async getRecentContext(userId: string, maxMessages: number = 10): Promise<{
    messages: ChatMessage[];
    contextSummary?: string;
    userContext: UserContext;
  }> {
    const messages = await this.getConversationHistory(userId, maxMessages);

    // Get user context (this would come from your existing user data)
    const userContext = await this.getUserContext(userId);

    // Generate context summary if we have enough messages
    const contextSummary = messages.length >= this.CONTEXT_SUMMARY_INTERVAL
      ? await this.generateContextSummary(messages)
      : undefined;

    return {
      messages,
      contextSummary,
      userContext
    };
  }

  /**
   * Get user context for AI personalization
   */
  static async getUserContext(userId: string): Promise<UserContext> {
    try {
      // This would integrate with your existing user progress system
      // For now, return a basic structure
      return {
        userId,
        currentTier: '90%',
        spiScore: 65,
        financialFoundationScore: 25,
        marketIntelligenceScore: 12,
        personalStrengthsScore: 15,
        riskManagementScore: 8,
        supportSystemsScore: 5,
        standoutStrength1: 'Pioneer',
        standoutStrength2: 'Connector'
      };
    } catch (error) {
      console.error('Error getting user context:', error);
      return this.getDefaultUserContext(userId);
    }
  }

  /**
   * Generate a summary of conversation context for AI
   */
  static async generateContextSummary(messages: ChatMessage[]): Promise<string> {
    const topics = this.extractTopics(messages);
    const userConcerns = this.extractUserConcerns(messages);
    const progress = this.extractProgressIndicators(messages);

    return `Conversation Summary:
- Main topics: ${topics.join(', ')}
- User concerns: ${userConcerns.join(', ')}
- Progress indicators: ${progress.join(', ')}
- Conversation length: ${messages.length} messages
- Most recent focus: ${messages[messages.length - 1]?.content.substring(0, 100)}...`;
  }

  /**
   * Extract main topics from conversation
   */
  private static extractTopics(messages: ChatMessage[]): string[] {
    const topics = new Set<string>();
    const topicKeywords = {
      financial: ['money', 'finance', 'profit', 'revenue', 'expense', 'budget', 'cash', 'debt'],
      business: ['customer', 'market', 'competition', 'growth', 'strategy', 'plan'],
      operations: ['truck', 'route', 'load', 'dispatch', 'maintenance', 'fuel'],
      personal: ['time', 'stress', 'balance', 'motivation', 'goal', 'strength']
    };

    messages.forEach(message => {
      const content = message.content.toLowerCase();
      Object.entries(topicKeywords).forEach(([topic, keywords]) => {
        if (keywords.some(keyword => content.includes(keyword))) {
          topics.add(topic);
        }
      });
    });

    return Array.from(topics);
  }

  /**
   * Extract user concerns and challenges
   */
  private static extractUserConcerns(messages: ChatMessage[]): string[] {
    const concerns: string[] = [];
    const concernPatterns = [
      /worried about/i,
      /struggling with/i,
      /having trouble/i,
      /not sure how/i,
      /difficult/i,
      /challenge/i,
      /problem/i
    ];

    messages.filter(msg => msg.role === 'user').forEach(message => {
      concernPatterns.forEach(pattern => {
        if (pattern.test(message.content)) {
          concerns.push(message.content.substring(0, 100) + '...');
        }
      });
    });

    return concerns.slice(0, 3); // Limit to 3 most recent
  }

  /**
   * Extract progress indicators from conversation
   */
  private static extractProgressIndicators(messages: ChatMessage[]): string[] {
    const indicators: string[] = [];
    const progressPatterns = [
      /completed/i,
      /finished/i,
      /achieved/i,
      /improved/i,
      /learned/i,
      /success/i
    ];

    messages.forEach(message => {
      progressPatterns.forEach(pattern => {
        if (pattern.test(message.content)) {
          indicators.push(message.content.substring(0, 80) + '...');
        }
      });
    });

    return indicators.slice(0, 2); // Limit to most recent
  }

  /**
   * Get default user context when data is unavailable
   */
  private static getDefaultUserContext(userId: string): UserContext {
    return {
      userId,
      currentTier: '90%',
      spiScore: 50,
      financialFoundationScore: 20,
      marketIntelligenceScore: 10,
      personalStrengthsScore: 10,
      riskManagementScore: 5,
      supportSystemsScore: 5
    };
  }

  /**
   * Clean up old conversation history (for maintenance)
   */
  static async cleanupOldConversations(daysOld: number = 90): Promise<void> {
    try {
      // Implementation would delete conversations older than specified days
      console.log(`Cleaning up conversations older than ${daysOld} days`);
    } catch (error) {
      console.error('Error cleaning up old conversations:', error);
    }
  }
}
