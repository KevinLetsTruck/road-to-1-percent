'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Bot, User, Sparkles, MessageCircle, X } from 'lucide-react'
import { ChatMessage } from '@/lib/ai/chatContext'

interface AICoachProps {
  isOpen: boolean
  onClose: () => void
  userName?: string
}

interface ChatState {
  messages: ChatMessage[]
  isTyping: boolean
  error: string | null
}

export default function AICoach({ isOpen, onClose, userName }: AICoachProps) {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isTyping: false,
    error: null
  })
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load conversation history when component opens
  useEffect(() => {
    if (isOpen) {
      loadConversationHistory()
      // Focus input after a brief delay to ensure it's rendered
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatState.messages])

  const loadConversationHistory = async () => {
    try {
      const response = await fetch('/api/ai/chat?limit=20')
      if (response.ok) {
        const data = await response.json()
        setChatState(prev => ({
          ...prev,
          messages: data.messages || []
        }))
      }
    } catch (error) {
      console.error('Error loading conversation history:', error)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    }

    // Add user message immediately
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
      error: null
    }))

    const messageToSend = inputMessage.trim()
    setInputMessage('')

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }

      const data = await response.json()

      const aiMessage: ChatMessage = {
        id: data.messageId,
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      }

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isTyping: false
      }))

    } catch (error) {
      console.error('Error sending message:', error)
      setChatState(prev => ({
        ...prev,
        isTyping: false,
        error: error instanceof Error ? error.message : 'Failed to send message'
      }))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearConversation = () => {
    setChatState(prev => ({
      ...prev,
      messages: [],
      error: null
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Business Coach</h3>
              <p className="text-sm text-gray-500">
                {userName ? `Hi ${userName}! ` : ''}Ask me anything about your trucking business
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearConversation}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear conversation"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatState.messages.length === 0 && !chatState.isTyping && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Ready to help!</h4>
              <p className="text-gray-600 mb-4">
                I'm your personal business coach with expertise in owner-operator trucking businesses.
                Ask me anything about growing your business, managing finances, finding loads, or overcoming challenges.
              </p>
              <div className="grid grid-cols-1 gap-2 max-w-md mx-auto text-sm">
                <button
                  onClick={() => setInputMessage("How can I improve my profit margins?")}
                  className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-left text-purple-700 transition-colors"
                >
                  💰 How can I improve my profit margins?
                </button>
                <button
                  onClick={() => setInputMessage("What's the best way to find consistent loads?")}
                  className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-left text-purple-700 transition-colors"
                >
                  🚛 What's the best way to find consistent loads?
                </button>
                <button
                  onClick={() => setInputMessage("How do I create a better work-life balance?")}
                  className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-left text-purple-700 transition-colors"
                >
                  ⚖️ How do I create a better work-life balance?
                </button>
              </div>
            </div>
          )}

          {chatState.messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-purple-600" />
                </div>
              )}
              <div
                className={`max-w-[70%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-purple-200' : 'text-gray-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {chatState.isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-purple-600" />
              </div>
              <div className="bg-gray-100 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">Coach is thinking...</span>
                </div>
              </div>
            </div>
          )}

          {chatState.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{chatState.error}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your trucking business..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              disabled={chatState.isTyping}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || chatState.isTyping}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send • Your conversations are private and secure
          </p>
        </div>
      </div>
    </div>
  )
}
