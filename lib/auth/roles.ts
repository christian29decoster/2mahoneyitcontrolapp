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

/** Zeile im eigenen Bundle (Mahoney-Produkt oder eigene Leistung z. B. Helpdesk). */
export interface TenantBillingCustomBundleLine {
  type: 'mahoney' | 'own'
  /** Bei type mahoney: z. B. app-essential, soc-core, mitai-Insight. */
  productId?: string
  /** Anzeige (z. B. "Platform Essential" oder "Helpdesk pauschal"). */
  label: string
  /** Partner-Einkaufspreis (nur bei Mahoney). */
  partnerCost?: number
  /** Vom Partner an Kunden verrechneter Verkaufspreis (USD/mo). */
  salePrice: number
}

/** Billing-/Vertragsattribute pro Kundenakte (Partner bucht Zusatzleistungen). */
export interface TenantBilling {
  /** Partner muss Zusatzleistung explizit aktivieren. */
  zusatzleistungEnabled?: boolean
  /** App/Platform Tier (z. B. essential, professional, enterprise). */
  appTierId?: string
  /** SOC Tier (z. B. soc-core, soc-advanced). */
  socTierId?: string
  /** MIT-AI Packet/Tier (z. B. Insight, Intelligence, Command). */
  mitAiTierId?: string
  /** Bundle (z. B. growth, professional, enterprise). */
  bundleId?: string
  /** Kurzbeschreibung, was im Bundle enthalten ist. */
  bundleIncludes?: string
  /** Einmalige Onboarding-Gebühr (z. B. USD). */
  onboardingFee?: number
  /** Revenue-Share in Prozent (z. B. 20). */
  revenueSharePercent?: number
  /** Verkaufspreise des Partners (vorausgefüllt mit Listenpreis). */
  salePriceAppTier?: number
  salePriceSocTier?: number
  salePriceMitAiTier?: number
  salePriceBundle?: number
  /** Eigenes Bundle inkl. eigener Leistungen (z. B. Helpdesk). */
  useCustomBundle?: boolean
  customBundleLines?: TenantBillingCustomBundleLine[]
}

/** AWS/data residency region for tenant or partner. */
export type DataResidencyRegion = 'us' | 'eu' | 'asia'

/** Customer framework (ISO, SOC 2, etc.) for compliance/AI evaluation. */
export interface TenantFramework {
  id: string
  name: string
}

/** Uploaded document reference for AI evaluation (e.g. policy, certificate). */
export interface TenantDocumentUpload {
  id: string
  name: string
  uploadedAtISO: string
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
  /** Billing- und Vertragsattribute (Kundenakte). */
  billing?: TenantBilling
  /** Data residency: AWS region where this tenant's data runs (US, EU/GDPR, Asia). */
  region?: DataResidencyRegion
  /** Frameworks selected for this customer (ISO, SOC 2, etc.) for AI evaluation. */
  frameworks?: TenantFramework[]
  /** Documents uploaded for AI to evaluate (policies, certificates). */
  documentUploads?: TenantDocumentUpload[]
}

/** Partner – hat mehrere Tenants (Kunden). */
export interface Partner {
  id: string
  name: string
  /** Externe Partner-ID (z. B. Sophos Partner-ID) für API-Matching. */
  externalId?: string
  /** Partner-Stufe für Einkaufspreise (Authorized / Advanced / Elite). */
  tier?: PartnerTierId
  active: boolean
  createdAtISO: string
  /** White-Label: Partner kann die App unter eigenem Namen/Logo darstellen. */
  branding?: PartnerBranding
  /** Data residency for partner's own org: AWS region (US, EU, Asia). */
  region?: DataResidencyRegion
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

/** Partner-Tier für Margen (Authorized 20 %, Advanced 30 %, Elite 40 %). */
export type PartnerTierId = 'authorized' | 'advanced' | 'elite'

/** Partner-Branding: App als eigene Marke darstellen (White-Label). */
export interface PartnerBranding {
  /** Anzeigename der App für diesen Partner (z. B. "Acme Control"). */
  appName?: string
  /** Logo als Data-URL (z. B. für Login/Header). */
  logoDataUrl?: string
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
