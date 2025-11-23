'use client'

interface MetricCardProps {
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  color?: 'green' | 'pink' | 'blue'
  icon?: string
}

export function MetricCard({ label, value, trend, color = 'green', icon }: MetricCardProps) {
  const colorClasses = {
    green: 'border-neon-green text-neon-green',
    pink: 'border-neon-pink text-neon-pink',
    blue: 'border-neon-blue text-neon-blue',
  }

  const trendSymbol = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'

  return (
    <div className={`cyber-card ${colorClasses[color]} transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-2">{label}</p>
          <p className="text-3xl font-bold neon-text">
            {value}
          </p>
        </div>
        {icon && (
          <span className="text-4xl opacity-50">{icon}</span>
        )}
      </div>
      {trend && (
        <div className="mt-2 text-sm">
          <span className={trend === 'up' ? 'text-neon-green' : trend === 'down' ? 'text-neon-pink' : 'text-gray-400'}>
            {trendSymbol} {trend}
          </span>
        </div>
      )}
    </div>
  )
}
