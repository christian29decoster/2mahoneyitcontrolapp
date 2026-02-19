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
  Scale,
  DollarSign,
  PinOff,
  Pin,
  UsersRound,
} from 'lucide-react'
import { useHaptics } from '@/hooks/useHaptics'
import { useViewModeStore } from '@/lib/viewMode.store'
import { useGroupAdminFeature } from '@/hooks/useGroupAdminFeature'
import LogoutButton from '@/components/auth/LogoutButton'

export const SIDEBAR_WIDTH_PX = 260

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
  const viewMode = useViewModeStore((s) => s.viewMode)
  const menuPinned = useViewModeStore((s) => s.menuPinned)
  const setMenuPinned = useViewModeStore((s) => s.setMenuPinned)
  const { showGroupAdmin } = useGroupAdminFeature()

  const isPinnedSidebar = viewMode === 'desktop' && menuPinned
  const showDrawer = open && !isPinnedSidebar

  const handleNavClick = () => {
    h.impact('light')
    if (!isPinnedSidebar) onOpenChange(false)
  }

  const handleUnpin = () => {
    h.impact('light')
    setMenuPinned(false)
  }

  const handlePin = () => {
    h.impact('light')
    setMenuPinned(true)
    onOpenChange(false)
  }

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-sm font-semibold text-[var(--text)]">Menu</span>
        {isPinnedSidebar ? (
          <button
            type="button"
            onClick={handleUnpin}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
            aria-label="Menü loslösen"
          >
            <PinOff size={14} />
            Unpin
          </button>
        ) : (
          viewMode === 'desktop' && (
            <button
              type="button"
              onClick={handlePin}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-[var(--muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10"
              aria-label="Menü anpinnen"
            >
              <Pin size={14} />
              Pin
            </button>
          )
        )}
      </div>
      <nav className="grid gap-1">
          <SectionTitle>Operations (Technik)</SectionTitle>
          <NavLink href="/" label="Dashboard" icon={Home} onClick={handleNavClick} />
          <NavLink href="/devices" label="Devices & Staff" icon={Shield} onClick={handleNavClick} />
          <NavLink href="/company" label="Company" icon={Building2} onClick={handleNavClick} />
          <NavLink href="/cloud" label="Cloud Security" icon={Cloud} onClick={handleNavClick} />
          <NavLink href="/governance" label="Governance" icon={Scale} onClick={handleNavClick} />
          <NavLink href="/financials" label="Financials" icon={DollarSign} onClick={handleNavClick} />
          <NavLink href="/contracts" label="Contracts" icon={FileText} onClick={handleNavClick} />
          <NavLink href="/projects" label="Projects" icon={FolderOpen} onClick={handleNavClick} />

          <SectionTitle>AI & Growth</SectionTitle>
          <NavLink href="/mahoney-grow" label="AI Growth & Risk Intelligence" icon={LineChart} onClick={handleNavClick} />

          <SectionTitle>Marktplatz (Einkauf)</SectionTitle>
          <NavLink href="/marketplace" label="Marketplace" icon={ShoppingBag} onClick={handleNavClick} />
          <NavLink href="/upselling" label="Enhance / Upgrades" icon={TrendingUp} onClick={handleNavClick} />

          <SectionTitle>Settings</SectionTitle>
          <NavLink href="/settings" label="Settings" icon={Settings} onClick={handleNavClick} />
          <NavLink href="/profile" label="Profile" icon={User} onClick={handleNavClick} />

          {showGroupAdmin && (
            <>
              <SectionTitle>Mahoney IT Group</SectionTitle>
              <NavLink href="/group-admin" label="Group Admin (Onboarding)" icon={UsersRound} onClick={handleNavClick} />
            </>
          )}

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
    </>
  )

  if (isPinnedSidebar) {
    return (
      <aside
        className="fixed left-0 top-12 bottom-0 z-30 w-[260px] bg-[var(--surface)] border-r border-[var(--border)] p-4 overflow-y-auto"
        style={{ width: SIDEBAR_WIDTH_PX }}
      >
        {sidebarContent}
      </aside>
    )
  }

  if (!showDrawer) return null

  return (
    <div className="fixed inset-0 z-50" onClick={() => onOpenChange(false)}>
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" />
      <aside
        onClick={(e) => e.stopPropagation()}
        className="absolute left-0 top-0 bottom-0 w-[80%] max-w-[340px] bg-[var(--surface)] border-r border-[var(--border)] p-4 overflow-y-auto"
      >
        {sidebarContent}
      </aside>
    </div>
  )
}
