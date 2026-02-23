/**
 * Tenants – In-Memory (später DB ersetzen).
 * Siehe docs/DATENMODELL-UND-APIS-MULTITENANT.md
 */

import type { Tenant, TenantConnectors } from '@/lib/auth/roles'

const store: Tenant[] = [
  {
    id: 'O-25-001',
    name: 'Acme Engineering Inc.',
    partnerId: undefined,
    connectors: {},
    active: true,
    createdAtISO: new Date().toISOString(),
  },
  {
    id: 'tenant-2',
    name: 'Contoso Ltd.',
    partnerId: undefined,
    connectors: {},
    active: true,
    createdAtISO: new Date().toISOString(),
  },
  {
    id: 'tenant-3',
    name: 'Fabrikam Solutions',
    partnerId: undefined,
    connectors: {},
    active: true,
    createdAtISO: new Date().toISOString(),
  },
  {
    id: 'tenant-partner-1',
    name: 'Partner-Kunde A',
    partnerId: 'partner-1',
    connectors: {},
    active: true,
    createdAtISO: new Date().toISOString(),
  },
]

export function listTenants(partnerId?: string): Tenant[] {
  let list = store.slice()
  if (partnerId != null) list = list.filter((t) => t.partnerId === partnerId)
  return list
}

export function getTenantById(id: string): Tenant | undefined {
  return store.find((t) => t.id === id)
}

export function createTenant(data: Omit<Tenant, 'createdAtISO'>): Tenant {
  const tenant: Tenant = {
    ...data,
    connectors: data.connectors ?? {},
    createdAtISO: new Date().toISOString(),
  }
  store.push(tenant)
  return tenant
}

export function updateTenant(
  id: string,
  data: Partial<Omit<Tenant, 'id' | 'createdAtISO'>> & { connectors?: Partial<TenantConnectors> }
): Tenant | undefined {
  const i = store.findIndex((t) => t.id === id)
  if (i < 0) return undefined
  if (data.connectors != null) {
    store[i].connectors = { ...store[i].connectors, ...data.connectors }
    delete (data as { connectors?: unknown }).connectors
  }
  Object.assign(store[i], data)
  return store[i]
}
