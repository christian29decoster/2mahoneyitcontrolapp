/**
 * Marketplace – Kategorien und Tiers ohne Preise.
 * Struktur bleibt; neue Preise und Strukturen werden separat ergänzt.
 */

export type PricingUnit = 'flat' | 'user' | 'device' | 'gb' | 'hour'

export interface MarketplaceTier {
  id: string
  name: string
  /** Anzeige (z. B. "Preis auf Anfrage" oder später konkreter Preis) */
  priceMonthlyDisplay: string
  /** Numerisch für Berechnungen – 0 = nur Anfrage */
  priceMonthlyUSD: number
  /** Jahrespreis-Anzeige, optional */
  priceAnnualDisplay?: string
  unit?: PricingUnit
  unitPriceUSD?: number
  minimumDisplay?: string
  minimumMonthlyUSD?: number
  bullets: string[]
  mostPopular?: boolean
  recommendedFor?: string
  scheduleStrategyCall?: boolean
  billedAnnually?: boolean
}

export interface MarketplaceCategory {
  id: string
  name: string
  description?: string
  tiers: MarketplaceTier[]
}

export interface MarketplaceBundle {
  id: string
  name: string
  priceMonthlyDisplay: string
  priceMonthlyUSD: number
  mostPopular?: boolean
  bullets: string[]
  recommendedFor?: string
  scheduleStrategyCall?: boolean
}

const PLACEHOLDER_PRICE = 'Preis auf Anfrage'

// ─── vCISO ───────────────────────────────────────────────────────────────────
export const vCISOCategory: MarketplaceCategory = {
  id: 'vciso',
  name: 'Virtual CISO Advisory',
  description: 'Governance und strategische Sicherheitsführung',
  tiers: [
    {
      id: 'vciso-board',
      name: 'Board-Level Governance',
      priceMonthlyDisplay: PLACEHOLDER_PRICE,
      priceMonthlyUSD: 0,
      bullets: [
        'Dedizierter fractional CISO',
        'Board-Teilnahme (quartalsweise)',
        'Regulatorik (ISO/NIS2/SOC2)',
        'Enterprise-Risikomodellierung',
        'Vendor- und Lieferketten-Risiko',
        'Krisen-Governance',
        'Executive Cyber Financial Modeling',
      ],
      recommendedFor: 'Regulierte und board-getriebene Organisationen',
      scheduleStrategyCall: true,
    },
    {
      id: 'vciso-strategic',
      name: 'Strategic Governance Partner',
      priceMonthlyDisplay: PLACEHOLDER_PRICE,
      priceMonthlyUSD: 0,
      bullets: [
        'Monatliche Executive-Session',
        'Compliance-Oversight',
        'Risk-Index-Reporting',
        'Policy- und Governance-Review',
        'Executive-Reporting',
      ],
      mostPopular: true,
      recommendedFor: 'Mid-Market und Wachstumsunternehmen',
    },
    {
      id: 'vciso-advisory',
      name: 'Advisory Essentials',
      priceMonthlyDisplay: PLACEHOLDER_PRICE,
      priceMonthlyUSD: 0,
      bullets: [
        'Quartalsweise Beratung',
        'Risiko-Posture-Review',
        'Policy-Updates',
        'Security-Roadmap',
      ],
      recommendedFor: 'SMBs mit Fokus auf Governance-Grundlage',
    },
    {
      id: 'vciso-ondemand',
      name: 'On-Demand Executive Consulting',
      priceMonthlyDisplay: PLACEHOLDER_PRICE,
      priceMonthlyUSD: 0,
      unit: 'hour',
      bullets: ['Executive Advisory', 'Projektbasierte Engagements'],
      recommendedFor: 'Konkrete Initiativen oder Assessments',
    },
  ],
}

// ─── SOCaaS ─────────────────────────────────────────────────────────────────
export const SOCaaSCategory: MarketplaceCategory = {
  id: 'soc',
  name: 'SOCaaS',
  description: 'Security Operations Center as a Service',
  tiers: [
    {
      id: 'soc-enterprise',
      name: 'Enterprise Threat Operations',
      priceMonthlyDisplay: PLACEHOLDER_PRICE,
      priceMonthlyUSD: 0,
      bullets: [
        'Dediziertes SOC-Pod',
        'Advanced Threat Hunting',
        'SLA-basierter Incident Response',
        'Executive War-Room-Support',
        'Compliance-Integration',
      ],
      recommendedFor: 'Große Unternehmen und regulierte Branchen',
      scheduleStrategyCall: true,
    },
    {
      id: 'soc-advanced',
      name: 'Advanced SOC Protection',
      priceMonthlyDisplay: PLACEHOLDER_PRICE,
      priceMonthlyUSD: 0,
      unit: 'user',
      bullets: [
        '24/7 Monitoring',
        'Incident-Priorisierung',
        'Threat Intelligence',
        'Compliance-Reporting',
      ],
      mostPopular: true,
      recommendedFor: 'Mid-Market mit Compliance-Bedarf',
    },
    {
      id: 'soc-core',
      name: 'Core Monitoring',
      priceMonthlyDisplay: PLACEHOLDER_PRICE,
      priceMonthlyUSD: 0,
      unit: 'user',
      bullets: ['Monitoring', 'Alert-Triage', 'Monatliches Reporting'],
      recommendedFor: 'SMBs und Einstieg SOC',
    },
  ],
}

// ─── Managed Endpoint ──────────────────────────────────────────────────────
export const endpointCategory: MarketplaceCategory = {
  id: 'endpoint',
  name: 'Managed Endpoint',
  description: 'Geräteschutz und -verwaltung',
  tiers: [
    {
      id: 'endpoint-elite',
      name: 'Elite Endpoint Protection',
      priceMonthlyDisplay: PLACEHOLDER_PRICE,
      priceMonthlyUSD: 0,
      unit: 'device',
      bullets: ['Full-Stack EDR', 'MDR-Integration', 'Priority Support'],
      recommendedFor: 'High-Value-Assets und regulierte Umgebungen',
    },
    {
      id: 'endpoint-advanced',
      name: 'Advanced Endpoint',
      priceMonthlyDisplay: PLACEHOLDER_PRICE,
      priceMonthlyUSD: 0,
      unit: 'device',
      mostPopular: true,
      bullets: ['EDR', 'Patch & Policy', '24/7 Monitoring'],
      recommendedFor: 'Die meisten Organisationen',
    },
    {
      id: 'endpoint-essential',
      name: 'Essential Endpoint',
      priceMonthlyDisplay: PLACEHOLDER_PRICE,
      priceMonthlyUSD: 0,
      unit: 'device',
      bullets: ['AV/EPP', 'Patch-Management', 'Reporting'],
      recommendedFor: 'Kostenbewusste SMBs',
    },
  ],
}

// ─── Backup ─────────────────────────────────────────────────────────────────
export const backupCategory: MarketplaceCategory = {
  id: 'backup',
  name: 'Backup & Recovery',
  description: 'Datenschutz und Disaster Recovery',
  tiers: [
    {
      id: 'backup-gb',
      name: 'Backup Storage',
      priceMonthlyDisplay: PLACEHOLDER_PRICE,
      priceMonthlyUSD: 0,
      unit: 'gb',
      bullets: ['Verschlüsselter Storage', 'Point-in-Time Recovery', 'Retention Policies'],
      recommendedFor: 'Variable Datenmengen',
    },
    {
      id: 'backup-dr',
      name: 'Disaster Recovery Premium',
      priceMonthlyDisplay: PLACEHOLDER_PRICE,
      priceMonthlyUSD: 0,
      bullets: ['DR-Orchestrierung', 'Failover-Tests', 'RTO/RPO SLA'],
      recommendedFor: 'Business-kritische Recovery',
    },
  ],
}

// ─── Governance & Risk ──────────────────────────────────────────────────────
export const governanceCategory: MarketplaceCategory = {
  id: 'governance',
  name: 'Governance & Risk Premium',
  description: 'Monitoring, Intelligence und Executive Modeling',
  tiers: [
    {
      id: 'gov-monitoring',
      name: 'Governance Monitoring Suite',
      priceMonthlyDisplay: PLACEHOLDER_PRICE,
      priceMonthlyUSD: 0,
      bullets: ['Control Monitoring', 'Compliance-Dashboards', 'Audit Trails'],
      recommendedFor: 'Laufende Compliance und Audit-Readiness',
    },
    {
      id: 'gov-predictive',
      name: 'Predictive Risk Intelligence',
      priceMonthlyDisplay: PLACEHOLDER_PRICE,
      priceMonthlyUSD: 0,
      bullets: ['AI-Risiko-Prognose', 'Threat-Trend-Analyse', 'Vulnerability-Priorisierung'],
      recommendedFor: 'Proaktives Risikomanagement',
    },
    {
      id: 'gov-financial',
      name: 'Executive Cyber Financial Modeling',
      priceMonthlyDisplay: PLACEHOLDER_PRICE,
      priceMonthlyUSD: 0,
      bullets: ['ROI-Modellierung', 'Risiko-Quantifizierung', 'Board-taugliche Finanzen'],
      recommendedFor: 'CFO- und Board-Reporting',
    },
  ],
}

// ─── Platform & Data (MDU) ──────────────────────────────────────────────────
export const dataMduCategory: MarketplaceCategory = {
  id: 'data-mdu',
  name: 'Platform & Data (MDU)',
  description: 'Event-basierte Datenverarbeitung – RMM, EDR, Maschinen-Events. Struktur für Volumenpreise; konkrete Preise folgen.',
  tiers: [
    {
      id: 'mdu-tiered',
      name: 'Mahoney Data Units (MDU)',
      priceMonthlyDisplay: PLACEHOLDER_PRICE,
      priceMonthlyUSD: 0,
      unit: 'flat',
      bullets: [
        'Staffelung nach Event-Volumen',
        'Transparente volumenbasierte Abrechnung',
        'RMM- und EDR-Alerts nur zur Anzeige, nicht abrechnungsrelevant',
      ],
      mostPopular: true,
      recommendedFor: 'Alle Tiers – Basis jeder Plattform-Berechnung',
    },
  ],
}

// ─── Bundles ───────────────────────────────────────────────────────────────
export const marketplaceBundles: MarketplaceBundle[] = [
  {
    id: 'bundle-enterprise',
    name: 'Enterprise Governance Bundle',
    priceMonthlyDisplay: PLACEHOLDER_PRICE,
    priceMonthlyUSD: 0,
    bullets: [
      'Enterprise SOC',
      'vCISO Board-Level',
      'Predictive Risk Engine',
      'Governance Monitoring',
      'Executive Reporting',
    ],
    recommendedFor: 'Enterprise und regulierte Organisationen',
    scheduleStrategyCall: true,
  },
  {
    id: 'bundle-growth',
    name: 'Growth & Risk Optimization Bundle',
    priceMonthlyDisplay: PLACEHOLDER_PRICE,
    priceMonthlyUSD: 0,
    mostPopular: true,
    bullets: [
      'Advanced SOC',
      'Strategic vCISO',
      'AI Risk Forecast',
      'Financial Dashboard',
    ],
    recommendedFor: 'Wachstums- und Mid-Market',
  },
]

export const marketplaceCategories: MarketplaceCategory[] = [
  vCISOCategory,
  SOCaaSCategory,
  endpointCategory,
  dataMduCategory,
  backupCategory,
  governanceCategory,
]
