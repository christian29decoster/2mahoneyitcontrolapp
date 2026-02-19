'use client'

import TopAppBar from './nav/TopAppBar'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useHaptics } from '@/hooks/useHaptics'
import { useViewModeStore } from '@/lib/viewMode.store'
import { SIDEBAR_WIDTH_PX } from './nav/DrawerNav'
import Copilot from './ai/Copilot'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const h = useHaptics()
  const viewMode = useViewModeStore((s) => s.viewMode)
  const menuPinned = useViewModeStore((s) => s.menuPinned)
  const sidebarOffset = viewMode === 'desktop' && menuPinned ? SIDEBAR_WIDTH_PX : 0

  return (
    <div className="relative min-h-[100dvh]">
      <TopAppBar />
      <div className="pt-12 transition-[margin] duration-200" style={{ marginLeft: sidebarOffset }}>
        {children}
      </div>
      <motion.button
        aria-label="Add Device"
        onClick={() => h.impact('medium')}
        className="fixed bottom-20 right-6 rounded-2xl px-4 py-3 bg-[var(--primary)] text-white shadow-[0_12px_28px_rgba(79,119,255,.35)]"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileTap={{ scale: 0.96 }}
      >
        <Plus size={18} />
      </motion.button>
      <Copilot />
    </div>
  )
}
