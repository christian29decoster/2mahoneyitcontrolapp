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
    locations: [
      { name: 'HQ Frankfurt', address: 'Mainzer Landstr. 1, 60329 Frankfurt', lat: 50.1109, lng: 8.6821 },
      { name: 'NYC Office', address: '200 Varick St, New York, NY', lat: 40.7128, lng: -74.006 },
      { name: 'Austin Office', address: 'Congress Ave, Austin, TX', lat: 30.2672, lng: -97.7431 },
    ],
    certificates: [
      { id: 'ISO-27001-ACME-2025-001', name: 'ISO 27001' },
      { id: 'SOC2-II-ACME-2025-014', name: 'SOC 2 Type II' },
    ],
  },
  {
    id: 'tenant-2',
    name: 'Contoso Ltd.',
    partnerId: undefined,
    connectors: {},
    active: true,
    createdAtISO: new Date().toISOString(),
    locations: [
      { name: 'London HQ', address: '1 Canary Wharf, London E14', lat: 51.5054, lng: -0.0235 },
      { name: 'Manchester', address: 'King Street, Manchester', lat: 53.4808, lng: -2.2426 },
    ],
    certificates: [
      { id: 'CONTOSO-GDPR-2024', name: 'GDPR Compliance' },
    ],
  },
  {
    id: 'tenant-3',
    name: 'Fabrikam Solutions',
    partnerId: undefined,
    connectors: {},
    active: true,
    createdAtISO: new Date().toISOString(),
    locations: [
      { name: 'Seattle HQ', address: '400 Broad St, Seattle, WA', lat: 47.6062, lng: -122.3321 },
    ],
    certificates: [
      { id: 'FAB-SOC2-2024', name: 'SOC 2 Type II' },
      { id: 'FAB-HIPAA-2024', name: 'HIPAA' },
    ],
  },
  {
    id: 'tenant-partner-1',
    name: 'Partner-Kunde A',
    partnerId: 'partner-1',
    connectors: {},
    active: true,
    createdAtISO: new Date().toISOString(),
    locations: [
      { name: 'Miami Office', address: 'Brickell Ave, Miami, FL', lat: 25.7617, lng: -80.1918 },
    ],
    certificates: [],
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

/** Findet Tenant, der bereits mit dieser Autotask-Company-ID verknüpft ist. */
export function getTenantByAutotaskCompanyId(companyId: string | number): Tenant | undefined {
  const id = String(companyId)
  return store.find((t) => t.connectors?.autotask?.companyId === id)
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
