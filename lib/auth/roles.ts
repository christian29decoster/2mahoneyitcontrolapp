/**
 * Multitenant-Berechtigungen – Rollen und Kontext.
 * Siehe docs/BERECHTIGUNGSKONZEPT-MULTITENANT.md
 */

export const ROLES = [
  'superadmin',
  'admin',
  'partner',
  'tenant_user',
] as const

export type Role = (typeof ROLES)[number]

/** Session-Kontext nach Login (wird später durch echte Auth ersetzt). */
export interface AuthSession {
  userId: string
  username: string
  role: Role
  /** Nur bei role === 'partner' – Partner-ID, um Tenants zu filtern. */
  partnerId?: string
  /** Nur bei role === 'tenant_user' – Mandant, dessen Daten sichtbar sind. */
  tenantId?: string
}

/** Standort pro Tenant (Company-Seite). */
export interface TenantLocation {
  name: string
  address: string
  lat: number
  lng: number
}

/** Zertifikat pro Tenant (Company-Seite). */
export interface TenantCertificate {
  id: string
  name: string
}

/** Tenant (Mandant) – von Mahoney oder Partner verwaltet. */
export interface Tenant {
  id: string
  name: string
  /** Partner, dem der Tenant zugeordnet ist (optional = direkt Mahoney). */
  partnerId?: string
  /** Konnektor-Mappings: externe IDs für API-Zuordnung. */
  connectors: TenantConnectors
  active: boolean
  createdAtISO: string
  /** Standorte (Company-Seite); leer = Fallback auf Demo. */
  locations?: TenantLocation[]
  /** Zertifikate (Company-Seite); leer = Fallback auf Demo. */
  certificates?: TenantCertificate[]
}

/** Pro Tenant: Zuordnung zu RMM, Sophos, Autotask und weiteren APIs. */
export interface TenantConnectors {
  /** Datto RMM – Account/Seite oder Tenant-ID, falls RMM multi-tenant. */
  rmm?: { apiUrl?: string; tenantId?: string; label?: string }
  /** Sophos – Tenant-/Partner-ID aus Sophos Central. */
  sophos?: { tenantId?: string; partnerId?: string; label?: string }
  /** Autotask PSA – Company-ID für Ticket-/Unternehmenszuordnung. */
  autotask?: { companyId?: string; label?: string }
  /** Erweiterbar für weitere APIs (z. B. backup, siem). */
  [key: string]: { tenantId?: string; partnerId?: string; apiUrl?: string; label?: string; companyId?: string } | undefined
}

/** Partner – hat mehrere Tenants (Kunden). */
export interface Partner {
  id: string
  name: string
  /** Externe Partner-ID (z. B. Sophos Partner-ID) für API-Matching. */
  externalId?: string
  active: boolean
  createdAtISO: string
}

/** Governance-Dokument (Handbuch, Richtlinie) – von Admin gepflegt, von KI prüfbar. */
export interface GovernanceDocument {
  id: string
  tenantId?: string
  /** global = für alle; tenant = nur für einen Mandanten. */
  scope: 'global' | 'tenant'
  title: string
  type: 'handbook' | 'policy' | 'other'
  contentRef?: string
  updatedAtISO: string
}

/** Prüft, ob Rolle A die Rolle B „beherrscht“ (z. B. SuperAdmin > Admin). */
export function roleHierarchy(higher: Role, lower: Role): boolean {
  const order: Record<Role, number> = {
    superadmin: 4,
    admin: 3,
    partner: 2,
    tenant_user: 1,
  }
  return order[higher] > order[lower]
}

/** SuperAdmin darf von anderen nicht bearbeitet/gelöscht werden. */
export const SUPERADMIN_PROTECTED = true

export function isSuperAdminRole(role: Role): boolean {
  return role === 'superadmin'
}

/** Darf dieser Benutzer den Ziel-User bearbeiten/löschen? (SuperAdmin-Schutz.) */
export function canModifyUser(actorRole: Role, targetIsSuperAdmin: boolean): boolean {
  if (!targetIsSuperAdmin) return true
  return isSuperAdminRole(actorRole)
}
