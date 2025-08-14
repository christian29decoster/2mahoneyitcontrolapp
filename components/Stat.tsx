import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatProps {
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
}

export function Stat({ label, value, change, trend }: StatProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-accent" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-destructive" />
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getChangeColor = () => {
    switch (trend) {
      case 'up':
        return 'text-accent'
      case 'down':
        return 'text-destructive'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {change && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getChangeColor()}`}>
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
