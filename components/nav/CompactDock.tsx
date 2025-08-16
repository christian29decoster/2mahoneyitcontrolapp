"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Shield, Building2 } from "lucide-react"

const TABS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/devices", icon: Shield, label: "Devices" },
  { href: "/company", icon: Building2, label: "Company" },
]

export default function CompactDock() {
  const path = usePathname()

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+12px)] left-1/2 -translate-x-1/2 z-50 w-auto">
      <nav className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl border border-[var(--border)] bg-[rgba(21,26,44,.68)] backdrop-blur-md shadow-[0_10px_28px_rgba(0,0,0,.45)]">
        {TABS.map(({ href, icon: Icon, label }) => {
          const active = path === href
          return (
            <Link
              key={href}
              href={href}
              className={`grid place-items-center h-11 w-11 rounded-xl border transition ${
                active
                  ? "text-[var(--primary)] border-[rgba(59,130,246,.38)] bg-[rgba(59,130,246,.12)]"
                  : "text-[var(--muted)] border-[var(--border)] hover:text-[var(--text)]"
              }`}
              aria-label={label}
            >
              <Icon size={20} />
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
