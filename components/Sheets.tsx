'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useHaptics } from '@/hooks/useHaptics'
import { ReactNode } from 'react'

interface SheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  maxHeight?: string
}

export function Sheet({ isOpen, onClose, title, children, maxHeight = '85vh' }: SheetProps) {
  const h = useHaptics()
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => {
              h.impact('light')
              onClose()
            }}
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface-elev)] rounded-t-[24px] border-t border-[var(--border)] shadow-[0_-20px_60px_rgba(0,0,0,.45)]"
            style={{ maxHeight }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-[var(--border)] rounded-full" />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4">
              <h2 className="text-lg font-semibold text-[var(--text)]">{title}</h2>
              <button
                onClick={() => {
                  h.impact('light')
                  onClose()
                }}
                className="p-2 rounded-full hover:bg-[var(--surface)]/50 transition-colors"
              >
                <X className="w-5 h-5 text-[var(--muted)]" />
              </button>
            </div>
            
            {/* Content */}
            <div className="px-6 pb-6 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Form Sheet with submit button
interface FormSheetProps extends SheetProps {
  onSubmit: () => void
  submitLabel?: string
  submitDisabled?: boolean
}

export function FormSheet({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onSubmit, 
  submitLabel = "Save", 
  submitDisabled = false 
}: FormSheetProps) {
  const h = useHaptics()
  
  return (
    <Sheet isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        {children}
        
        <div className="flex space-x-3 pt-4">
          <button
            onClick={() => {
              h.impact('light')
              onClose()
            }}
            className="flex-1 px-4 py-3 rounded-[16px] bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              h.impact('medium')
              onSubmit()
            }}
            disabled={submitDisabled}
            className="flex-1 px-4 py-3 rounded-[16px] bg-[var(--primary)] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </Sheet>
  )
}
