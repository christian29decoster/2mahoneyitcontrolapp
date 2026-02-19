'use client'

import { useState } from 'react'
import { Menu, Plus } from 'lucide-react'
import { useUIStore } from '@/lib/ui.store'
import DrawerNav from './DrawerNav'
import NotificationBell from '@/components/NotificationBell'
import { useHaptics } from '@/hooks/useHaptics'
import { usePathname } from 'next/navigation'
import { DEMO_APP_VERSION } from '@/lib/version'

export default function TopAppBar() {
  const [open, setOpen] = useState(false)
  const navVisible = useUIStore((s) => s.navVisible)
  const h = useHaptics()
  const pathname = usePathname()
  
  // Hide navigation on login page
  if (pathname.startsWith('/login')) return null

  const handleOpen = () => {
    h.impact('medium')
    setOpen(true)
  }

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-3 h-12 border-b border-[var(--border)] bg-[rgba(15,18,32,.75)] backdrop-blur-md transition-all duration-200 ${
          navVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        {/* Hamburger left */}
        <button
          aria-label="Open menu"
          onClick={handleOpen}
          className="h-9 w-9 grid place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] active:scale-[.98] transition-transform hover:bg-[var(--surface)]"
        >
          <Menu size={18} />
        </button>

        {/* Branding / tagline */}
        <div className="text-[10px] sm:text-xs text-[var(--muted)] text-center max-w-[140px] sm:max-w-none truncate sm:truncate-none">
          Unified Risk, Operations & Growth Control Surface
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Hinzufügen"
            onClick={() => h.impact('medium')}
            className="h-9 w-9 grid place-items-center rounded-xl border border-[var(--border)] bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 transition-colors"
          >
            <Plus size={18} />
          </button>
          <div className="text-[10px] px-2 py-1 rounded-full bg-emerald-600/20 text-emerald-300 border border-emerald-500/30">
            SOC-III-US-Team
          </div>
          <span className="text-[10px] text-[var(--muted)] hidden sm:inline" title="Demo-App-Version">
            {DEMO_APP_VERSION}
          </span>
          <NotificationBell />
        </div>
      </div>

      {/* Drawer */}
      <DrawerNav open={open} onOpenChange={setOpen} />
      <div className="h-12" /> {/* spacer to push content below app bar */}
    </>
  )
}
