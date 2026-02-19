/**
 * Mahoney IT Group Admin – Kunden-Onboarding, Umsatz, Onboarding-Themen.
 * Nur für Group-Admins; Sichtbarkeit wird über Backend (SHOW_GROUP_ADMIN) gesteuert.
 */

export type OnboardingTopicId =
  | 'audit-basics'
  | 'it-governance'
  | 'security-basics'
  | 'compliance-frameworks'
  | 'incident-handling'
  | 'contracts-billing'
  | 'partner-portal'
  | 'escalation'

export interface OnboardingTopic {
  id: OnboardingTopicId
  label: string
  description: string
  category: 'Audit & Governance' | 'IT & Security' | 'Vertrieb & Abrechnung' | 'Intern'
  registered: boolean
  completedAt?: string
}

export interface CustomerRevenueMonth {
  month: string // YYYY-MM
  label: string // z. B. "Jan 2025"
  revenueEur: number
  revenueUsd: number
  servicesBreakdown: { name: string; amountEur: number }[]
}

export interface CustomerOnboarding {
  id: string
  companyName: string
  legalForm?: string
  industry: string
  taxId?: string
  vatId?: string
  address: {
    street: string
    postalCode: string
    city: string
    country: string
  }
  primaryContact: {
    name: string
    email: string
    phone: string
    role?: string
  }
  technicalContact?: {
    name: string
    email: string
    phone?: string
  }
  contractStart: string // ISO date
  contractEnd?: string
  planTier: 'Essential' | 'Prime' | 'Elite'
  seats: number
  devices: number
  bookedServices: string[]
  msaSignedAt?: string
  dpaSignedAt?: string
  auditStatus: 'not_scheduled' | 'scheduled' | 'in_progress' | 'completed'
  auditNextDue?: string
  governanceFramework?: string
  onboardingTopics: OnboardingTopicId[]
  revenueLastMonths: CustomerRevenueMonth[]
  internalNotes?: string
  nextSteps?: string
  handoverNotes?: string
  createdAt: string
  updatedAt: string
}

/** Onboarding-Themen zum Anmelden (Demo). */
export const ONBOARDING_TOPICS: OnboardingTopic[] = [
  { id: 'audit-basics', label: 'Audit-Grundlagen', description: 'Vorbereitung und Ablauf von Audits', category: 'Audit & Governance', registered: true, completedAt: '2025-01-15' },
  { id: 'it-governance', label: 'IT-Governance & Compliance', description: 'Rahmenwerke, Kontrollen, Nachweispflicht', category: 'Audit & Governance', registered: true },
  { id: 'security-basics', label: 'Sicherheits-Basics', description: 'Policies, Zugriff, EDR/SIEM', category: 'IT & Security', registered: true },
  { id: 'compliance-frameworks', label: 'Compliance-Frameworks (ISO, BSI)', description: 'ISO 27001, BSI-Grundschutz, Mapping', category: 'Audit & Governance', registered: false },
  { id: 'incident-handling', label: 'Incident-Handling & Eskalation', description: 'Meldewege, MTTR, Eskalation', category: 'IT & Security', registered: false },
  { id: 'contracts-billing', label: 'Verträge & Abrechnung', description: 'Tarife, Zusatzservices, Rechnungsstellung', category: 'Vertrieb & Abrechnung', registered: false },
  { id: 'partner-portal', label: 'Partner-Portal & Kundenübersicht', description: 'Nutzer, Rollen, Kundenwechsel', category: 'Intern', registered: false },
  { id: 'escalation', label: 'Eskalation & Support-Levels', description: 'Support-Levels, SLA, Kontakte', category: 'Intern', registered: false },
]

/** Demo: ein Kunde mit vollständigem Onboarding und Umsatz. */
export const DEMO_GROUP_ADMIN_CUSTOMER: CustomerOnboarding = {
  id: 'cust-demo-001',
  companyName: 'Muster Spedition GmbH',
  legalForm: 'GmbH',
  industry: 'Logistik / Spedition',
  taxId: 'DE123456789',
  vatId: 'DE987654321',
  address: {
    street: 'Industriestr. 42',
    postalCode: '50667',
    city: 'Köln',
    country: 'Deutschland',
  },
  primaryContact: {
    name: 'Anna Schmidt',
    email: 'a.schmidt@muster-spedition.de',
    phone: '+49 221 123456',
    role: 'IT-Leitung',
  },
  technicalContact: {
    name: 'Max Weber',
    email: 'm.weber@muster-spedition.de',
    phone: '+49 221 123457',
  },
  contractStart: '2024-06-01',
  contractEnd: '2026-05-31',
  planTier: 'Prime',
  seats: 45,
  devices: 62,
  bookedServices: ['EDR', 'Backup', 'SOC Basis', 'M365 Standard'],
  msaSignedAt: '2024-05-28',
  dpaSignedAt: '2024-05-28',
  auditStatus: 'scheduled',
  auditNextDue: '2025-09-01',
  governanceFramework: 'ISO 27001',
  onboardingTopics: ['audit-basics', 'it-governance', 'security-basics'],
  revenueLastMonths: [
    { month: '2025-02', label: 'Feb 2025', revenueEur: 12420, revenueUsd: 13450, servicesBreakdown: [{ name: 'Prime', amountEur: 7875 }, { name: 'EDR', amountEur: 2480 }, { name: 'Backup', amountEur: 1240 }, { name: 'SOC', amountEur: 825 }] },
    { month: '2025-01', label: 'Jan 2025', revenueEur: 12420, revenueUsd: 13450, servicesBreakdown: [{ name: 'Prime', amountEur: 7875 }, { name: 'EDR', amountEur: 2480 }, { name: 'Backup', amountEur: 1240 }, { name: 'SOC', amountEur: 825 }] },
    { month: '2024-12', label: 'Dez 2024', revenueEur: 11880, revenueUsd: 12920, servicesBreakdown: [{ name: 'Prime', amountEur: 7875 }, { name: 'EDR', amountEur: 2480 }, { name: 'Backup', amountEur: 1125 }, { name: 'SOC', amountEur: 400 }] },
    { month: '2024-11', label: 'Nov 2024', revenueEur: 11880, revenueUsd: 12920, servicesBreakdown: [{ name: 'Prime', amountEur: 7875 }, { name: 'EDR', amountEur: 2480 }, { name: 'Backup', amountEur: 1125 }, { name: 'SOC', amountEur: 400 }] },
    { month: '2024-10', label: 'Okt 2024', revenueEur: 11500, revenueUsd: 12480, servicesBreakdown: [{ name: 'Prime', amountEur: 7625 }, { name: 'EDR', amountEur: 2480 }, { name: 'Backup', amountEur: 995 }, { name: 'SOC', amountEur: 400 }] },
    { month: '2024-09', label: 'Sep 2024', revenueEur: 11200, revenueUsd: 12150, servicesBreakdown: [{ name: 'Prime', amountEur: 7375 }, { name: 'EDR', amountEur: 2480 }, { name: 'Backup', amountEur: 945 }, { name: 'SOC', amountEur: 400 }] },
  ],
  internalNotes: 'Kunde sehr zufrieden. Nächstes Audit Q3/2025 vorbereiten.',
  nextSteps: 'Compliance-Frameworks-Schulung anbieten; SOC Upgrade besprechen.',
  handoverNotes: 'Ansprechpartner für Eskalation: Anna Schmidt (IT-Leitung).',
  createdAt: '2024-05-20T10:00:00Z',
  updatedAt: '2025-02-18T14:30:00Z',
}

/** Alle Kunden für Group-Admin-Liste (Demo: einer). */
export function getGroupAdminCustomers(): CustomerOnboarding[] {
  return [DEMO_GROUP_ADMIN_CUSTOMER]
}

export function getOnboardingTopic(id: OnboardingTopicId): OnboardingTopic | undefined {
  return ONBOARDING_TOPICS.find((t) => t.id === id)
}
