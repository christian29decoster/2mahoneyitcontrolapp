'use client'

import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <motion.div
      className={`bg-[var(--surface)] rounded-[22px] ${className}`}
      animate={{
        background: [
          'linear-gradient(90deg, var(--surface) 0%, var(--surface-elev) 50%, var(--surface) 0%)',
          'linear-gradient(90deg, var(--surface) 0%, var(--surface-elev) 50%, var(--surface) 0%)'
        ]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  )
}
