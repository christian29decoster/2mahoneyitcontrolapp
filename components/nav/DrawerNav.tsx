'use client'

import Link from 'next/link'
import { Home, Shield, Building2, ShoppingBag, FileText, User, FolderOpen, TrendingUp } from 'lucide-react'
import { useHaptics } from '@/hooks/useHaptics'
import LogoutButton from '@/components/auth/LogoutButton'

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
        className="absolute left-0 top-0 bottom-0 w-[80%] max-w-[340px] bg-[var(--surface)] border-r border-[var(--border)] p-4"
      >
        <div className="text-sm font-semibold mb-3 text-[var(--text)]">Menu</div>
        <nav className="grid gap-2">
          {[
            { href: '/', label: 'Dashboard', icon: Home },
            { href: '/devices', label: 'Devices & Staff', icon: Shield },
            { href: '/company', label: 'Company', icon: Building2 },
            { href: '/cloud', label: 'Cloud Security', icon: Shield },
            { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
            { href: '/contracts', label: 'Contracts', icon: FileText },
            { href: '/projects', label: 'Projects', icon: FolderOpen },
            { href: '/profile', label: 'Profile', icon: User },
            { href: '/upselling', label: 'Enhance', icon: TrendingUp },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={handleNavClick}
              className="flex items-center gap-3 px-2 py-2 rounded-xl border border-[var(--border)] hover:border-[rgba(59,130,246,.35)] hover:text-[var(--primary)] transition-colors text-[var(--text)]"
            >
              <Icon size={18} />
              <span className="text-sm">{label}</span>
            </Link>
          ))}
          
          {/* Admin Link - Only visible for admin users */}
          {typeof document !== 'undefined' && (document.cookie.match(/(?:^|;) ?demo_role=([^;]+)/)?.[1]||'').toLowerCase() === 'admin' && (
            <Link
              href="/admin"
              onClick={handleNavClick}
              className="flex items-center gap-3 px-2 py-2 rounded-xl border border-[var(--border)] hover:border-[rgba(59,130,246,.35)] hover:text-[var(--primary)] transition-colors text-[var(--text)]"
            >
              <span className="h-5 w-5 grid place-items-center rounded bg-[var(--surface-2)]">🛠️</span>
              <span className="text-sm">Admin</span>
            </Link>
          )}
        </nav>
        
        {/* Logout Button */}
        <div className="mt-6 pt-4 border-t border-[var(--border)]">
          <LogoutButton />
        </div>
      </aside>
    </div>
  )
}
