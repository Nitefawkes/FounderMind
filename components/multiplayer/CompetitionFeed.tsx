'use client'

interface CompetitionFeedProps {
  events: Array<{
    id: string
    type: string
    message: string
    timestamp: number
    data?: any
    playerId?: string
  }>
  maxEvents?: number
}

export function CompetitionFeed({ events, maxEvents = 20 }: CompetitionFeedProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'player_joined':
        return '👋'
      case 'player_action':
        return '⚡'
      case 'market_event':
        return '📊'
      case 'player_eliminated':
        return '💀'
      case 'winner_declared':
        return '🏆'
      default:
        return '📢'
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'player_joined':
        return 'text-neon-green'
      case 'player_action':
        return 'text-neon-blue'
      case 'market_event':
        return 'text-gray-400'
      case 'player_eliminated':
        return 'text-red-500'
      case 'winner_declared':
        return 'text-yellow-400'
      default:
        return 'text-white'
    }
  }

  const recentEvents = events.slice(-maxEvents).reverse()

  return (
    <div className="cyber-card h-[600px] flex flex-col">
      <h3 className="text-xl font-bold text-neon-pink mb-4">📡 Live Feed</h3>

      <div className="flex-1 overflow-y-auto space-y-2">
        {recentEvents.map((event) => (
          <div
            key={event.id}
            className="p-3 bg-cyber-dark border border-neon-blue/20 rounded-lg hover:border-neon-blue/40 transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{getEventIcon(event.type)}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${getEventColor(event.type)}`}>
                  {event.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {recentEvents.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Waiting for action...</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-cyber-gray text-xs text-gray-500 text-center">
        {events.length} total events
      </div>
    </div>
  )
}
