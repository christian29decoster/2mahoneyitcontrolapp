'use client'

import { motion } from 'framer-motion'
import { Badge } from './Badge'
import { useHaptics } from '@/hooks/useHaptics'
import { popIn } from '@/lib/ui/motion'

interface AlertItemProps {
  alert: {
    id: string
    title: string
    source: string
    severity: string
    time: string
  }
  onClick: () => void
}

export function AlertItem({ alert, onClick }: AlertItemProps) {
  const h = useHaptics()
  
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'secondary'
      case 'low':
        return 'accent'
      default:
        return 'secondary'
    }
  }
  
  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }
  
  return (
    <motion.div
      variants={popIn}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        h.impact('light')
        onClick()
      }}
      className="flex items-center justify-between p-4 bg-[var(--surface)]/50 rounded-[16px] cursor-pointer hover:bg-[var(--surface)]/70 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <p className="font-medium text-[var(--text)] truncate">{alert.title}</p>
          <Badge variant={getSeverityColor(alert.severity) as any}>
            {alert.severity}
          </Badge>
        </div>
        <p className="text-sm text-[var(--muted)] mb-1">{alert.source}</p>
        <p className="text-xs text-[var(--muted)]">{formatTime(alert.time)}</p>
      </div>
    </motion.div>
  )
}
