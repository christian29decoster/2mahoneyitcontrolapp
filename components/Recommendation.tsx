'use client'

import { Lightbulb } from 'lucide-react'
import { motion } from 'framer-motion'
import { popIn } from '@/lib/ui/motion'

export function Recommendation() {
  return (
    <motion.div 
      className="bg-[var(--surface-elev)] border border-[var(--border)] rounded-[22px] p-6 shadow-[0_8px_24px_rgba(0,0,0,.35)]"
      variants={popIn}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Lightbulb className="w-6 h-6 text-[var(--success)]" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 text-[var(--text)]">
            Proactive Recommendations
          </h3>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center rounded-full bg-[var(--success)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--success)] border border-[var(--success)]/20">
              Optimized
            </span>
            <p className="text-[var(--muted)]">
              Your setup is fully optimized at the moment. No action required.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
