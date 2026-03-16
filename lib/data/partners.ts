/**
 * Partner – In-Memory (später DB ersetzen).
 * Siehe docs/DATENMODELL-UND-APIS-MULTITENANT.md
 */

import type { Partner } from '@/lib/auth/roles'

const store: Partner[] = [
  { id: 'partner-1', name: 'SCC-IB-US-Team', externalId: undefined, tier: 'advanced', active: true, createdAtISO: new Date().toISOString(), region: 'us' },
  { id: 'partner-2', name: 'SecureNet EMEA', externalId: undefined, tier: 'elite', active: true, createdAtISO: new Date().toISOString() },
  { id: 'partner-3', name: 'CloudGuard MSP', externalId: undefined, tier: 'authorized', active: true, createdAtISO: new Date().toISOString() },
  { id: 'partner-4', name: 'TechPartners DACH', externalId: undefined, tier: 'advanced', active: true, createdAtISO: new Date().toISOString() },
  { id: 'partner-5', name: 'NorthGate Solutions', externalId: undefined, tier: 'advanced', active: true, createdAtISO: new Date().toISOString() },
]

export function listPartners(): Partner[] {
  return store.slice()
}

export function getPartnerById(id: string): Partner | undefined {
  return store.find((p) => p.id === id)
}

export function createPartner(data: Omit<Partner, 'createdAtISO'>): Partner {
  const partner: Partner = {
    ...data,
    createdAtISO: new Date().toISOString(),
  }
  store.push(partner)
  return partner
}

export function updatePartner(id: string, data: Partial<Omit<Partner, 'id' | 'createdAtISO'>>): Partner | undefined {
  const i = store.findIndex((p) => p.id === id)
  if (i < 0) return undefined
  const updates = { ...data }
  if (updates.branding && Object.keys(updates.branding).length === 0) updates.branding = undefined
  Object.assign(store[i], updates)
  return store[i]
}
