/**
 * Liest die aktuelle Demo-Session aus Request-Cookies (bis echte Auth aktiv ist).
 */

import type { NextRequest } from 'next/server'

type DemoRole = 'superadmin' | 'admin' | 'partner' | 'tenant_user' | 'sales' | 'demo'

export function getActorRole(req: NextRequest): DemoRole | null {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/demo_role=([^;]+)/)
  const role = match?.[1] as DemoRole | undefined
  if (role && ['superadmin', 'admin', 'sales', 'partner', 'tenant_user', 'demo'].includes(role)) return role
  return null
}

export function getActorPartnerId(req: NextRequest): string | null {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/demo_partner_id=([^;]+)/)
  return match?.[1] ?? null
}

export function getActorTenantId(req: NextRequest): string | null {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/demo_tenant_id=([^;]+)/)
  return match?.[1] ?? null
}

/** Admin oder SuperAdmin dürfen Partner/Tenant-Verwaltung. Partner nur eigene Ressourcen. */
export function canManagePartners(role: DemoRole | null): boolean {
  return role === 'superadmin' || role === 'admin'
}

export function canManageTenants(role: DemoRole | null): boolean {
  return role === 'superadmin' || role === 'admin' || role === 'partner'
}
