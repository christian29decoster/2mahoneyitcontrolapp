'use client'

import TopAppBar from './nav/TopAppBar'
import { useViewModeStore } from '@/lib/viewMode.store'
import { SIDEBAR_WIDTH_PX } from './nav/DrawerNav'
import Copilot from './ai/Copilot'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const viewMode = useViewModeStore((s) => s.viewMode)
  const menuPinned = useViewModeStore((s) => s.menuPinned)
  const sidebarOffset = viewMode === 'desktop' && menuPinned ? SIDEBAR_WIDTH_PX : 0

  return (
    <div className="relative min-h-[100dvh]">
      <TopAppBar />
      <div className="pt-12 transition-[margin] duration-200" style={{ marginLeft: sidebarOffset }}>
        {children}
      </div>
      <Copilot />
    </div>
  )
}
