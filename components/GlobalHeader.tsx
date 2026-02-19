'use client'

import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { DEMO_APP_VERSION } from '@/lib/version'

interface GlobalHeaderProps {
  socStatus?: 'online' | 'warning' | 'offline'
}

export function GlobalHeader({ socStatus = 'online' }: GlobalHeaderProps) {
  const getStatusColor = () => {
    switch (socStatus) {
      case 'online': return 'bg-[var(--success)]'
      case 'warning': return 'bg-[var(--warning)]'
      case 'offline': return 'bg-[var(--danger)]'
      default: return 'bg-[var(--success)]'
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)]/50"
    >
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-[var(--primary)]" />
          <span className="text-xs text-[var(--muted)]">Secured by Mahoney IT Group</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-[var(--muted)]">{DEMO_APP_VERSION}</span>
          <div className="flex items-center space-x-1 px-2 py-1 bg-[var(--surface)]/50 rounded-[8px]">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
            <span className="text-xs text-[var(--text)]">SOC-III-US-Team</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
