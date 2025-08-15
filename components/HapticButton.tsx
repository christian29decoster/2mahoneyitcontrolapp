'use client'

import { motion } from 'framer-motion'
import { useHaptics } from '@/hooks/useHaptics'
import { clsx } from 'clsx'

export function HapticButton({
  label,
  onClick,
  variant = 'primary',
  className = ''
}: {
  label: string
  onClick?: () => void
  variant?: 'primary' | 'surface' | 'danger'
  className?: string
}) {
  const h = useHaptics()
  const base = 'px-4 py-3 rounded-2xl text-sm font-medium select-none'
  const styles = {
    primary: 'bg-[var(--primary)] text-white shadow-[0_6px_16px_rgba(79,119,255,.35)]',
    surface: 'bg-[var(--surface-elev)] text-[var(--text)] border border-[var(--border)]',
    danger: 'bg-[var(--danger)] text-white'
  }[variant]

  return (
    <motion.button
      className={clsx(base, styles, 'active:brightness-95', className)}
      whileTap={{ scale: 0.96 }}
      onClick={() => {
        h.impact('light')
        onClick?.()
      }}
    >
      {label}
    </motion.button>
  )
}
