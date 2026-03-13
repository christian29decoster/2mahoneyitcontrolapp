'use client'

import { motion } from 'framer-motion'
import { stagger } from '@/lib/ui/motion'

export default function MarketplacePage() {
  return (
    <motion.div className="space-y-8" variants={stagger} initial="initial" animate="animate">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold text-[var(--text)]">Marktplatz</h1>
        <p className="text-[var(--muted)]">Inhalt folgt.</p>
      </div>
    </motion.div>
  )
}
