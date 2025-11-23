'use client'

interface Event {
  id: string
  type: 'decision' | 'market' | 'crisis' | 'opportunity' | 'milestone'
  title: string
  description: string
  day: number
}

interface EventLogProps {
  events: Event[]
  maxEvents?: number
}

export function EventLog({ events, maxEvents = 10 }: EventLogProps) {
  const eventColors = {
    decision: 'text-neon-blue',
    market: 'text-gray-400',
    crisis: 'text-red-500',
    opportunity: 'text-neon-green',
    milestone: 'text-neon-pink',
  }

  const eventIcons = {
    decision: '🎯',
    market: '📊',
    crisis: '⚠️',
    opportunity: '✨',
    milestone: '🏆',
  }

  const recentEvents = events.slice(-maxEvents).reverse()

  return (
    <div className="cyber-card">
      <h3 className="text-xl font-bold text-neon-green mb-4">Event Log</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {recentEvents.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No events yet</p>
        ) : (
          recentEvents.map((event) => (
            <div
              key={event.id}
              className="border-l-2 border-cyber-gray pl-4 py-2 hover:border-neon-blue transition-colors"
            >
              <div className="flex items-start gap-2">
                <span className="text-xl">{eventIcons[event.type]}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold ${eventColors[event.type]}`}>
                      {event.title}
                    </p>
                    <span className="text-xs text-gray-500">Day {event.day}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{event.description}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
