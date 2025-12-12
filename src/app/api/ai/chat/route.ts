/**
 * AI Chat API Endpoint
 * Provides conversational AI coaching using Claude
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';
import { ChatContextManager, ChatMessage } from '@/lib/ai/chatContext';
import { PromptTemplates } from '@/lib/ai/promptTemplates';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
    const { message, conversationId } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Save user message to conversation history
    const userMessage = await ChatContextManager.saveMessage({
      role: 'user',
      content: message.trim(),
      metadata: {
        contextUsed: true
      }
    });

    // Get conversation context
    const context = await ChatContextManager.getRecentContext(user.id);

    // Build chat prompt
    const chatPrompt = PromptTemplates.generateChatPrompt({
      userContext: context.userContext,
      conversationHistory: context.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      })),
      currentQuery: message
    });

    // Generate AI response
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: chatPrompt
        }
      ]
    });

    const aiResponse = response.content[0].type === 'text' ? response.content[0].text : '';

    // Save AI response to conversation history
    const assistantMessage = await ChatContextManager.saveMessage({
      role: 'assistant',
      content: aiResponse,
      metadata: {
        contextUsed: true
      }
    });

    // Save conversation to database for analytics
    try {
      await supabase.from('ai_conversations').insert({
        user_id: user.id,
        conversation_id: conversationId || `conv-${Date.now()}`,
        user_message: message,
        ai_response: aiResponse,
        created_at: new Date().toISOString()
      });
    } catch (dbError) {
      console.error('Error saving conversation to database:', dbError);
      // Don't fail the request if database save fails
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
      messageId: assistantMessage.id,
      conversationId: conversationId || `conv-${Date.now()}`
    });

  } catch (error) {
    console.error('Error in AI chat:', error);

    return NextResponse.json(
      {
        error: 'Failed to process chat message',
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

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (conversationId) {
      query = query.eq('conversation_id', conversationId);
    }

    const { data: conversations, error: convError } = await query;

    if (convError) {
      console.error('Error fetching conversations:', convError);
      return NextResponse.json(
        { error: 'Failed to fetch conversation history' },
        { status: 500 }
      );
    }

    // Transform database records to chat message format
    const messages: ChatMessage[] = [];
    conversations?.forEach(conv => {
      messages.push({
        id: `user-${conv.id}`,
        role: 'user',
        content: conv.user_message,
        timestamp: conv.created_at
      });
      messages.push({
        id: `assistant-${conv.id}`,
        role: 'assistant',
        content: conv.ai_response,
        timestamp: conv.created_at
      });
    });

    // Sort by timestamp
    messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return NextResponse.json({
      success: true,
      messages,
      conversationId
    });

  } catch (error) {
    console.error('Error fetching chat history:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch chat history',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
