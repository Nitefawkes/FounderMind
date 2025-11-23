'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import type { AdvisorPersona } from '@/lib/types/database.types'
import type { PersonaConfig } from '@/lib/ai/PersonaEngine'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface AdvisorChatProps {
  persona: PersonaConfig
  onSendMessage: (message: string) => Promise<string>
  initialMessages?: Message[]
}

export function AdvisorChat({ persona, onSendMessage, initialMessages = [] }: AdvisorChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await onSendMessage(userMessage.content)

      const assistantMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to get response:', error)
      const errorMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again.",
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="cyber-card flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-cyber-gray">
        <div className="text-3xl">{persona.avatar}</div>
        <div>
          <h3 className="text-lg font-bold text-neon-green">{persona.name}</h3>
          <p className="text-sm text-gray-400">{persona.title}</p>
        </div>
        <div className="ml-auto">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
            Available
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p className="mb-2">👋 Start a conversation with {persona.name}</p>
            <p className="text-sm text-gray-600">Ask about: {persona.when_to_ask[0]}</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-neon-blue/20 border border-neon-blue/30 text-white'
                  : 'bg-cyber-gray border border-neon-green/30 text-gray-200'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{persona.avatar}</span>
                  <span className="text-xs text-neon-green font-semibold">{persona.name}</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-cyber-gray border border-neon-green/30 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <span>{persona.avatar}</span>
                <span className="text-neon-green">Thinking</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-cyber-gray">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask ${persona.name} for advice...`}
            className="flex-1 bg-cyber-darker border border-neon-blue/30 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors resize-none"
            rows={2}
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
            Send
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
