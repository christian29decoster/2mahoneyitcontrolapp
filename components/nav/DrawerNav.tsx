'use client'

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  Home,
  Shield,
  Building2,
  ShoppingBag,
  FileText,
  User,
  FolderOpen,
  TrendingUp,
  LineChart,
  Settings,
  Cloud,
  Wrench,
} from 'lucide-react'
import { useHaptics } from '@/hooks/useHaptics'
import LogoutButton from '@/components/auth/LogoutButton'

const linkClass =
  'flex items-center gap-3 px-2 py-2 rounded-xl border border-[var(--border)] hover:border-[rgba(59,130,246,.35)] hover:text-[var(--primary)] transition-colors text-[var(--text)]'

function NavLink({
  href,
  label,
  icon: Icon,
  onClick,
}: {
  href: string
  label: string
  icon: LucideIcon
  onClick: () => void
}) {
  return (
    <Link href={href} onClick={onClick} className={linkClass}>
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </Link>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] mt-4 mb-1.5 first:mt-0">
      {children}
    </div>
  )
}

export default function DrawerNav({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const h = useHaptics()

  if (!open) return null

  const handleNavClick = () => {
    h.impact('light')
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 z-50" onClick={() => onOpenChange(false)}>
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" />
      <aside
        onClick={(e) => e.stopPropagation()}
        className="absolute left-0 top-0 bottom-0 w-[80%] max-w-[340px] bg-[var(--surface)] border-r border-[var(--border)] p-4 overflow-y-auto"
      >
        <div className="text-sm font-semibold mb-1 text-[var(--text)]">Menu</div>
        <nav className="grid gap-1">
          <SectionTitle>Operations (Technik)</SectionTitle>
          <NavLink href="/" label="Dashboard" icon={Home} onClick={handleNavClick} />
          <NavLink href="/devices" label="Devices & Staff" icon={Shield} onClick={handleNavClick} />
          <NavLink href="/company" label="Company" icon={Building2} onClick={handleNavClick} />
          <NavLink href="/cloud" label="Cloud Security" icon={Cloud} onClick={handleNavClick} />
          <NavLink href="/contracts" label="Contracts" icon={FileText} onClick={handleNavClick} />
          <NavLink href="/projects" label="Projects" icon={FolderOpen} onClick={handleNavClick} />

          <SectionTitle>Grow</SectionTitle>
          <NavLink href="/mahoney-grow" label="Mahoney Grow" icon={LineChart} onClick={handleNavClick} />

          <SectionTitle>Marktplatz (Einkauf)</SectionTitle>
          <NavLink href="/marketplace" label="Marketplace" icon={ShoppingBag} onClick={handleNavClick} />
          <NavLink href="/upselling" label="Enhance / Upgrades" icon={TrendingUp} onClick={handleNavClick} />

          <SectionTitle>Settings</SectionTitle>
          <NavLink href="/settings" label="Settings" icon={Settings} onClick={handleNavClick} />
          <NavLink href="/profile" label="Profile" icon={User} onClick={handleNavClick} />

          {typeof document !== 'undefined' &&
            (document.cookie.match(/(?:^|;) ?demo_role=([^;]+)/)?.[1] || '').toLowerCase() === 'admin' && (
              <>
                <SectionTitle>Admin</SectionTitle>
                <Link href="/admin" onClick={handleNavClick} className={linkClass}>
                  <Wrench size={18} />
                  <span className="text-sm">Admin</span>
                </Link>
              </>
            )}
        </nav>

        <div className="mt-6 pt-4 border-t border-[var(--border)]">
          <LogoutButton />
        </div>
      </aside>
    </div>
  )
}
