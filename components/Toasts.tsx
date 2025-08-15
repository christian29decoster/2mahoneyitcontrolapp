'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { useHaptics } from '@/hooks/useHaptics'
import { useState, useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose: () => void
}

export function Toast({ type, title, message, duration = 4000, onClose }: ToastProps) {
  const h = useHaptics()
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)
    
    return () => clearTimeout(timer)
  }, [duration, onClose])
  
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-[var(--success)]" />,
    error: <AlertCircle className="w-5 h-5 text-[var(--danger)]" />,
    info: <Info className="w-5 h-5 text-[var(--primary)]" />,
    warning: <AlertCircle className="w-5 h-5 text-[var(--warning)]" />
  }
  
  const colors = {
    success: 'border-[var(--success)]/20 bg-[var(--success)]/10',
    error: 'border-[var(--danger)]/20 bg-[var(--danger)]/10',
    info: 'border-[var(--primary)]/20 bg-[var(--primary)]/10',
    warning: 'border-[var(--warning)]/20 bg-[var(--warning)]/10'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full mx-4 p-4 rounded-[22px] border ${colors[type]} backdrop-blur-md`}
      onClick={() => {
        h.impact('light')
        onClose()
      }}
    >
      <div className="flex items-start space-x-3">
        {icons[type]}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--text)]">{title}</p>
          {message && (
            <p className="text-sm text-[var(--muted)] mt-1">{message}</p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            h.impact('light')
            onClose()
          }}
          className="flex-shrink-0 p-1 rounded-full hover:bg-[var(--surface)]/50 transition-colors"
        >
          <X className="w-4 h-4 text-[var(--muted)]" />
        </button>
      </div>
    </motion.div>
  )
}

// Toast Manager
interface ToastManagerProps {
  toasts: Array<{ id: string } & ToastProps>
  removeToast: (id: string) => void
}

export function ToastManager({ toasts, removeToast }: ToastManagerProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              {...toast}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
