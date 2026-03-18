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
  /** Name/Bezeichnung des Custom-Bundles (vom Partner eingebbar). */
  customBundleName?: string
  /** Einmalige Onboarding-Gebühr (z. B. USD). */
  onboardingFee?: number
  /** Verkaufspreise des Partners (vorausgefüllt mit Listenpreis). */
  salePriceAppTier?: number
  salePriceSocTier?: number
  salePriceMitAiTier?: number
  salePriceBundle?: number
  /** Eigenes Bundle inkl. eigener Leistungen (z. B. Helpdesk). */
  useCustomBundle?: boolean
  customBundleLines?: TenantBillingCustomBundleLine[]
  /** QuickBooks: Billing-Daten an QuickBooks übertragen (API/Sync). */
  quickbooks?: {
    /** Sync aktiviert: Rechnungen/Positionen können an QuickBooks gesendet werden. */
    syncEnabled?: boolean
    /** QuickBooks Customer ID – Zuordnung zum Kunden in QuickBooks für Rechnungen. */
    customerId?: string
  }
  /** MDU budget (USD) per tenant/partner. Min $1000. When reached, no further MDU processing until next period or budget increase. */
  mduBudgetUsd?: number
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

/** One row: framework selection + optional document upload for AI evaluation. */
export interface TenantFrameworkDocumentEntry {
  id: string
  frameworkId: string
  frameworkName: string
  documentId?: string
  documentName?: string
  uploadedAtISO?: string
  /** Set when AI has evaluated this document. */
  aiEvaluated?: boolean
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
  /** Framework + document rows: each entry = one framework dropdown + upload, with optional AI-evaluated status. */
  frameworkDocuments?: TenantFrameworkDocumentEntry[]
  /** User sync: pull users from LDAP, Azure, or AWS; hybrid protocol. */
  userSync?: TenantUserSync
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

/** Pro Tenant: dynamische API/Connector-Zuordnung (Plus → Parameter abfragen). */
export interface TenantConnectors {
  /** Beliebige Connector-IDs; Wert = Parameter für diese API (label, apiUrl, apiKey, tenantId, …). */
  [key: string]: { label?: string; [paramKey: string]: string | undefined } | undefined
}

/** User-Sync pro Tenant: Nutzer aus LDAP, Azure oder AWS ziehen; Hybrid-Protokoll. */
export interface TenantUserSync {
  provider?: 'ldap' | 'azure' | 'aws'
  /** Protokoll des Anbieters (z. B. LDAP, SAML, OIDC). */
  protocol?: string
  /** Anbieter-spezifische Config (Server-URL, Tenant ID, …). */
  config?: Record<string, string>
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
