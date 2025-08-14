'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { popIn } from '@/lib/ui/motion'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  const baseClasses = 'bg-[var(--surface-elev)] border border-[var(--border)] rounded-[22px] p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]'
  
  if (onClick) {
    return (
      <motion.div
        className={`${baseClasses} cursor-pointer ${className}`}
        variants={popIn}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    )
  }
  
  return (
    <motion.div className={`${baseClasses} ${className}`} variants={popIn}>
      {children}
    </motion.div>
  )
}
