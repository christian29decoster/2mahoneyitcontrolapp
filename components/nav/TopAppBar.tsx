'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { useUIStore } from '@/lib/ui.store'
import DrawerNav from './DrawerNav'
import { useHaptics } from '@/hooks/useHaptics'
import { usePathname } from 'next/navigation'

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

        {/* Branding / SOC */}
        <div className="text-xs text-[var(--muted)]">Secured by Mahoney IT Group</div>
        <div className="text-[10px] px-2 py-1 rounded-full bg-emerald-600/20 text-emerald-300 border border-emerald-500/30">
          SOC-III-US-Team
        </div>
      </div>

      {/* Drawer */}
      <DrawerNav open={open} onOpenChange={setOpen} />
      <div className="h-12" /> {/* spacer to push content below app bar */}
    </>
  )
}
