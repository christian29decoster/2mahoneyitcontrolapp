'use client'

import { useViewModeStore } from '@/lib/viewMode.store'

export default function ViewModeWrapper({ children }: { children: React.ReactNode }) {
  const viewMode = useViewModeStore((s) => s.viewMode)
  return (
    <div
      className={viewMode === 'app' ? 'iphone-frame' : 'desktop-frame'}
      data-view={viewMode}
    >
      {children}
    </div>
  )
}
