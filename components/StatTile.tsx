'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { motion } from 'framer-motion'
import { popIn } from '@/lib/ui/motion'

interface StatTileProps {
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
}

export function StatTile({ label, value, change, trend }: StatTileProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-[var(--success)]" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-[var(--danger)]" />
      default:
        return <Minus className="w-4 h-4 text-[var(--muted)]" />
    }
  }

  const getChangeColor = () => {
    switch (trend) {
      case 'up':
        return 'text-[var(--success)]'
      case 'down':
        return 'text-[var(--danger)]'
      default:
        return 'text-[var(--muted)]'
    }
  }

  return (
    <motion.div 
      className="bg-[var(--surface-elev)] border border-[var(--border)] rounded-[22px] p-4 shadow-[0_8px_24px_rgba(0,0,0,.35)]"
      variants={popIn}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
          <p className="text-2xl font-bold text-[var(--text)]">{value}</p>
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
    </motion.div>
  )
}
