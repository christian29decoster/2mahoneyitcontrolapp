'use client'

import { useEffect, useState } from 'react'

/** Partner / MSP-style financials: P&L table visibility. */
export function useFinancialsPartnerAccess() {
  const [role, setRole] = useState<string>('demo')

  useEffect(() => {
    const m = typeof document !== 'undefined' ? document.cookie.match(/(?:^|;) ?demo_role=([^;]+)/) : null
    setRole((m?.[1] ?? 'demo').toLowerCase())
  }, [])

  const showPartnerPnL =
    role === 'partner' ||
    role === 'msp-admin' ||
    role === 'msp_admin' ||
    role === 'admin' ||
    role === 'superadmin' ||
    role === 'sales'

  return { role, showPartnerPnL }
}
