'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { copy } from '@/lib/copy'

const navItems = [
  { href: '/', label: copy.nav.dashboard },
  { href: '/devices', label: copy.nav.devices },
  { href: '/company', label: copy.nav.company },
  { href: '/profile', label: copy.nav.profile },
  { href: '/marketplace', label: copy.nav.marketplace },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-primary">
              Mahoney Control
            </Link>
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">JS</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
