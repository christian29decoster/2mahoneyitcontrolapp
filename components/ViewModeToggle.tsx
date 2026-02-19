'use client'

import { usePathname } from 'next/navigation'
import { useViewModeStore, type ViewMode } from '@/lib/viewMode.store'
import { useHaptics } from '@/hooks/useHaptics'
import { Smartphone, Monitor } from 'lucide-react'

export default function ViewModeToggle() {
  const pathname = usePathname()
  const { viewMode, setViewMode } = useViewModeStore()
  const h = useHaptics()

  if (pathname?.startsWith('/login')) return null

  const handleSet = (mode: ViewMode) => {
    h.impact('light')
    setViewMode(mode)
  }

  return (
    <div
      className="fixed bottom-6 left-6 z-30 flex rounded-2xl border border-[var(--border)] bg-[var(--surface-elev)] shadow-lg overflow-hidden"
      role="group"
      aria-label="Anzeige: App oder Desktop"
    >
      <button
        type="button"
        onClick={() => handleSet('app')}
        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
          viewMode === 'app'
            ? 'bg-[var(--primary)] text-white'
            : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
        }`}
        aria-pressed={viewMode === 'app'}
        aria-label="Als App (iPhone) anzeigen"
      >
        <Smartphone size={16} />
        App
      </button>
      <button
        type="button"
        onClick={() => handleSet('desktop')}
        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
          viewMode === 'desktop'
            ? 'bg-[var(--primary)] text-white'
            : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
        }`}
        aria-pressed={viewMode === 'desktop'}
        aria-label="Als Desktop (Browser) anzeigen"
      >
        <Monitor size={16} />
        Desktop
      </button>
    </div>
  )
}
