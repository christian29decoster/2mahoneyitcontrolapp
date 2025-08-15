'use client'

import { Home, Monitor, Building, User, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuditStore } from '@/lib/store'

const tabs = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/devices', icon: Monitor, label: 'Devices' },
  { href: '/company', icon: Building, label: 'Company' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/marketplace', icon: ShoppingBag, label: 'Marketplace' }
]

export default function TabBar() {
  const path = usePathname()
  const { unprotected, stale, quarantined } = useAuditStore(s => s.auditCounts);

  const dangerCount = unprotected + quarantined;
  const warnCount   = stale;
  const total       = dangerCount + warnCount;

  // Farbe bestimmen
  const badgeColor = dangerCount > 0 ? 'bg-red-500'
                   : warnCount   > 0 ? 'bg-yellow-500'
                   : null;
  
  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[392px]">
      <div className="backdrop-blur-md bg-[rgba(17,23,42,.6)] border border-[var(--border)] rounded-[24px] px-2 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,.45)]">
        <nav className="grid grid-cols-5">
          {tabs.map(({ href, icon: Icon }) => {
            const active = path === href
            const isDevices = href === '/devices';
            const isDashboard = href === '/';
            const allOk = total === 0;

            return (
              <Link key={href} href={href} className="relative flex items-center justify-center py-2">
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

                  {/* Badge nur am Devices-Tab */}
                  {isDevices && total > 0 && badgeColor && (
                    <motion.span
                      initial={{ scale:0, opacity:0 }}
                      animate={{ scale:1, opacity:1 }}
                      transition={{ type:'spring', stiffness:420, damping:22 }}
                      className={`absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full ${badgeColor} text-white text-[10px] leading-[18px] text-center shadow-[0_0_0_1px_rgba(255,255,255,.15)]`}
                    >
                      {total > 99 ? '99+' : total}
                    </motion.span>
                  )}

                  {/* Grüner Status-Punkt am Dashboard-Tab */}
                  {isDashboard && allOk && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--success)] shadow-[0_0_0_1px_rgba(255,255,255,.15)]" />
                  )}
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
