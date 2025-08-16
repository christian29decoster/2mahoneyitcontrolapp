"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Home, Shield, Building2, ShoppingBag, User, FileText, FolderOpen, TrendingUp } from "lucide-react"
import { useHaptics } from "@/hooks/useHaptics"
import { useUIStore } from "@/lib/ui.store"
import { usePathname } from "next/navigation"

export default function HamburgerNav() {
  const [open, setOpen] = useState(false)
  const h = useHaptics()
  const navVisible = useUIStore((s) => s.navVisible)
  const pathname = usePathname()
  
  // Hide navigation on login page
  if (pathname.startsWith('/login')) return null

  const handleOpen = () => {
    h.impact('medium')
    setOpen(true)
  }

  const handleClose = () => {
    h.impact('light')
    setOpen(false)
  }

  const handleNavClick = () => {
    h.impact('light')
    setOpen(false)
  }

  return (
    <>
      {/* small FAB, right-bottom */}
      <button
        onClick={handleOpen}
        className={`fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+12px)] z-30 h-11 w-11 rounded-2xl grid place-items-center bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] shadow-[0_10px_28px_rgba(0,0,0,.45)] active:scale-[.98] transition-all duration-200 ${
          navVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Bottom sheet */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-end" onClick={handleClose}>
          <div
            className="w-full max-w-[520px] mx-auto rounded-t-3xl bg-[var(--surface)] border-t border-[var(--border)] max-h-[80dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="text-lg font-semibold mb-2 text-[var(--text)]">Menu</div>
              <ul className="grid grid-cols-3 gap-8 py-2">
                {[
                  { href: "/", icon: Home, label: "Dashboard" },
                  { href: "/devices", icon: Shield, label: "Devices" },
                  { href: "/company", icon: Building2, label: "Company" },
                  { href: "/marketplace", icon: ShoppingBag, label: "Marketplace" },
                  { href: "/contracts", icon: FileText, label: "Contracts" },
                  { href: "/projects", icon: FolderOpen, label: "Projects" },
                  { href: "/profile", icon: User, label: "Profile" },
                  { href: "/upselling", icon: TrendingUp, label: "Enhance" },
                ].map(({ href, icon: Icon, label }) => (
                  <li key={href} className="flex flex-col items-center">
                    <Link
                      href={href}
                      onClick={handleNavClick}
                      className="h-12 w-12 grid place-items-center rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] hover:border-[rgba(59,130,246,.35)] hover:text-[var(--primary)] transition-colors"
                      aria-label={label}
                    >
                      <Icon size={20} />
                    </Link>
                    <span className="text-[11px] mt-1 text-[var(--muted)]">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
