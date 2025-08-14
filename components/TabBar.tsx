'use client'

import { Home, Monitor, Building, User, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const tabs = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/devices', icon: Monitor, label: 'Devices' },
  { href: '/company', icon: Building, label: 'Company' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/marketplace', icon: ShoppingBag, label: 'Marketplace' }
]

export default function TabBar() {
  const path = usePathname()
  
  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[392px]">
      <div className="backdrop-blur-md bg-[rgba(17,23,42,.6)] border border-[var(--border)] rounded-[24px] px-2 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,.45)]">
        <nav className="grid grid-cols-5">
          {tabs.map(({ href, icon: Icon, label }) => {
            const active = path === href
            return (
              <Link key={href} href={href} className="flex items-center justify-center py-2">
                <div className="relative">
                  {active && (
                    <motion.span
                      layoutId="tab-blob"
                      className="absolute inset-0 rounded-full -z-10"
                      style={{ 
                        background: 'rgba(79,119,255,.18)', 
                        boxShadow: '0 0 0 1px rgba(79,119,255,.25)' 
                      }}
                    />
                  )}
                  <Icon 
                    size={20} 
                    className={active ? 'text-[var(--primary)]' : 'text-[var(--muted)]'} 
                  />
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
