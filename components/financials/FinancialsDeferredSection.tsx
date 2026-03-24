'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { FinancialsSectionSkeleton } from '@/components/financials/FinancialsSectionSkeleton'

export function FinancialsDeferredSection({
  children,
  rows = 5,
  delayMs = 140,
}: {
  children: ReactNode
  rows?: number
  delayMs?: number
}) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), delayMs)
    return () => clearTimeout(t)
  }, [delayMs])
  if (!ready) return <FinancialsSectionSkeleton rows={rows} />
  return <>{children}</>
}
