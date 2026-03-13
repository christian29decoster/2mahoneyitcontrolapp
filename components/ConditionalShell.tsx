'use client'

import { usePathname } from 'next/navigation'
import AppShell from './AppShell'

/** Renders children without AppShell on /nexus routes; with AppShell elsewhere. */
export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isNexus = pathname?.startsWith('/nexus') ?? false
  if (isNexus) return <>{children}</>
  return <AppShell>{children}</AppShell>
}
