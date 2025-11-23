'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { BoardMeetingMessage } from '@/lib/ai/BoardMeeting'

interface BoardMeetingViewProps {
  messages: BoardMeetingMessage[]
  isLoading?: boolean
}

export function BoardMeetingView({ messages, isLoading }: BoardMeetingViewProps) {
  return (
    <div className="cyber-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neon-green">Board Meeting</h2>
          <p className="text-gray-400 text-sm">
            {messages.length > 0 ? `${messages.length} messages` : 'No messages yet'}
          </p>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-neon-blue">
            <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
            Meeting in progress...
          </div>
        )}
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg border ${
              message.persona === 'moderator'
                ? 'bg-cyber-dark border-neon-pink/30'
                : 'bg-cyber-gray border-neon-blue/30'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{message.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-neon-green">{message.name}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-gray-200 text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="p-4 rounded-lg border border-neon-blue/30 bg-cyber-gray">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-neon-blue rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-neon-blue rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-3 h-3 bg-neon-blue rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-gray-400">Advisors are discussing...</span>
            </div>
          </div>
        )}
      </div>

      {messages.length === 0 && !isLoading && (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-2">No board meeting in progress</p>
          <p className="text-sm">Start a meeting to get advice from all your advisors at once</p>
        </div>
      )}
    </div>
  )
}

interface BoardMeetingLauncherProps {
  onStartMeeting: (topic: string, description: string) => void
  isLoading?: boolean
}

export function BoardMeetingLauncher({ onStartMeeting, isLoading }: BoardMeetingLauncherProps) {
  const [topic, setTopic] = useState('')
  const [description, setDescription] = useState('')

  const quickTopics = [
    {
      title: 'Monthly Review',
      description: 'Review our monthly performance and plan for next month',
    },
    {
      title: 'Fundraising Strategy',
      description: 'Should we raise money? How much and from whom?',
    },
    {
      title: 'Pivot Discussion',
      description: 'Our current strategy isn\'t working. Should we pivot?',
    },
    {
      title: 'Hiring Plan',
      description: 'Who should we hire next and why?',
    },
  ]

  const handleQuickTopic = (quick: { title: string; description: string }) => {
    setTopic(quick.title)
    setDescription(quick.description)
    onStartMeeting(quick.title, quick.description)
  }

  const handleCustomTopic = () => {
    if (topic.trim() && description.trim()) {
      onStartMeeting(topic, description)
      setTopic('')
      setDescription('')
    }
  }

  return (
    <div className="cyber-card">
      <h3 className="text-xl font-bold text-neon-blue mb-4">Start Board Meeting</h3>

      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-3">Quick Topics:</p>
        <div className="grid grid-cols-2 gap-3">
          {quickTopics.map((quick) => (
            <button
              key={quick.title}
              onClick={() => handleQuickTopic(quick)}
              disabled={isLoading}
              className="p-3 bg-cyber-dark border border-neon-blue/30 rounded text-left hover:border-neon-blue transition-colors disabled:opacity-50"
            >
              <p className="text-sm font-semibold text-neon-blue">{quick.title}</p>
              <p className="text-xs text-gray-500 mt-1">{quick.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-cyber-gray pt-6">
        <p className="text-sm text-gray-400 mb-3">Or create a custom topic:</p>
        <div className="space-y-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Meeting topic..."
            className="w-full bg-cyber-darker border border-neon-blue/30 rounded px-4 py-2 text-white focus:outline-none focus:border-neon-blue transition-colors"
            disabled={isLoading}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description and context..."
            rows={3}
            className="w-full bg-cyber-darker border border-neon-blue/30 rounded px-4 py-2 text-white focus:outline-none focus:border-neon-blue transition-colors resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleCustomTopic}
            disabled={!topic.trim() || !description.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? 'Meeting in Progress...' : 'Start Meeting'}
          </Button>
        </div>
      </div>
    </div>
  )
}
