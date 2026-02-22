/**
 * Strategic Marketplace Pricing – High Anchor Model (US Market)
 * Annual-first, tier contrast, enterprise positioning, CFO-friendly framing.
 */

export type PricingUnit = 'flat' | 'user' | 'device' | 'gb' | 'hour'

export interface MarketplaceTier {
  id: string
  name: string
  /** Primary display: annual first (e.g. "$336,000 / year") */
  priceAnnualDisplay?: string
  /** Monthly equivalent – shown smaller (e.g. "$28,000 / month") */
  priceMonthlyDisplay: string
  /** Numeric monthly for calculations (USD) */
  priceMonthlyUSD: number
  unit?: PricingUnit
  /** Per-user or per-device rate when applicable */
  unitPriceUSD?: number
  /** Minimum spend or minimum quantity */
  minimumDisplay?: string
  minimumMonthlyUSD?: number
  bullets: string[]
  mostPopular?: boolean
  recommendedFor?: string
  scheduleStrategyCall?: boolean
  /** Billed annually note */
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

// ─── vCISO – Premium Authority ─────────────────────────────────────────────
export const vCISOCategory: MarketplaceCategory = {
  id: 'vciso',
  name: 'Virtual CISO Advisory',
  description: 'Board-level governance and strategic security leadership',
  tiers: [
    {
      id: 'vciso-board',
      name: 'Board-Level Governance (Enterprise Anchor)',
      priceAnnualDisplay: '$336,000 / year',
      priceMonthlyDisplay: '$28,000 / month',
      priceMonthlyUSD: 28000,
      billedAnnually: true,
      bullets: [
        'Dedicated fractional CISO',
        'Board participation (quarterly)',
        'Regulatory alignment (ISO/NIS2/SOC2)',
        'Enterprise risk modeling',
        'Vendor & supply chain risk oversight',
        'Crisis governance leadership',
        'Executive cyber financial modeling',
      ],
      recommendedFor: 'Regulated and board-driven organizations',
      scheduleStrategyCall: true,
    },
    {
      id: 'vciso-strategic',
      name: 'Strategic Governance Partner',
      priceMonthlyDisplay: '$14,500 / month',
      priceMonthlyUSD: 14500,
      bullets: [
        'Monthly executive session',
        'Compliance oversight',
        'Risk index reporting',
        'Policy & governance review',
        'Executive-level reporting',
      ],
      mostPopular: true,
      recommendedFor: 'Mid-market and growth-stage companies',
    },
    {
      id: 'vciso-advisory',
      name: 'Advisory Essentials',
      priceMonthlyDisplay: '$7,500 / month',
      priceMonthlyUSD: 7500,
      bullets: [
        'Quarterly advisory',
        'Risk posture review',
        'Policy updates',
        'Security roadmap',
      ],
      recommendedFor: 'SMBs building governance foundation',
    },
    {
      id: 'vciso-ondemand',
      name: 'On-Demand Executive Consulting',
      priceMonthlyDisplay: '$500 / hour',
      priceMonthlyUSD: 5000,
      unit: 'hour',
      unitPriceUSD: 500,
      minimumDisplay: 'Minimum 10 hours per engagement',
      minimumMonthlyUSD: 5000,
      bullets: ['Executive advisory', 'Project-based engagement'],
      recommendedFor: 'Specific initiatives or assessments',
    },
  ],
}

// ─── SOCaaS – Value Ladder ─────────────────────────────────────────────────
export const SOCaaSCategory: MarketplaceCategory = {
  id: 'soc',
  name: 'SOCaaS',
  description: 'Security Operations Center as a Service',
  tiers: [
    {
      id: 'soc-enterprise',
      name: 'Enterprise Threat Operations',
      priceMonthlyDisplay: 'Starting at $45,000 / month',
      priceMonthlyUSD: 45000,
      minimumDisplay: 'Minimum 300 users',
      bullets: [
        'Dedicated SOC pod',
        'Advanced threat hunting',
        'SLA-backed incident response',
        'Executive war-room support',
        'Compliance integration',
      ],
      recommendedFor: 'Large enterprises and regulated industries',
      scheduleStrategyCall: true,
    },
    {
      id: 'soc-advanced',
      name: 'Advanced SOC Protection',
      priceMonthlyDisplay: '$135 / user / month',
      priceMonthlyUSD: 135,
      unit: 'user',
      unitPriceUSD: 135,
      minimumDisplay: 'Minimum $7,500 / month',
      minimumMonthlyUSD: 7500,
      bullets: [
        '24/7 monitoring',
        'Incident prioritization',
        'Threat intelligence',
        'Compliance-aligned reporting',
      ],
      mostPopular: true,
      recommendedFor: 'Mid-market with compliance needs',
    },
    {
      id: 'soc-core',
      name: 'Core Monitoring',
      priceMonthlyDisplay: '$85 / user / month',
      priceMonthlyUSD: 85,
      unit: 'user',
      unitPriceUSD: 85,
      minimumDisplay: 'Minimum $3,000 / month',
      minimumMonthlyUSD: 3000,
      bullets: ['Monitoring', 'Alert triage', 'Monthly reporting'],
      recommendedFor: 'SMBs and first-step SOC',
    },
  ],
}

// ─── Managed Endpoint ──────────────────────────────────────────────────────
export const endpointCategory: MarketplaceCategory = {
  id: 'endpoint',
  name: 'Managed Endpoint',
  description: 'Device protection and management',
  tiers: [
    {
      id: 'endpoint-elite',
      name: 'Elite Endpoint Protection',
      priceMonthlyDisplay: '$125 / device / month',
      priceMonthlyUSD: 125,
      unit: 'device',
      unitPriceUSD: 125,
      bullets: ['Full stack EDR', 'MDR integration', 'Priority support'],
      recommendedFor: 'High-value assets and regulated environments',
    },
    {
      id: 'endpoint-advanced',
      name: 'Advanced Endpoint',
      priceMonthlyDisplay: '$79 / device / month',
      priceMonthlyUSD: 79,
      unit: 'device',
      unitPriceUSD: 79,
      mostPopular: true,
      bullets: ['EDR', 'Patch & policy', '24/7 monitoring'],
      recommendedFor: 'Most organizations',
    },
    {
      id: 'endpoint-essential',
      name: 'Essential Endpoint',
      priceMonthlyDisplay: '$49 / device / month',
      priceMonthlyUSD: 49,
      unit: 'device',
      unitPriceUSD: 49,
      minimumDisplay: 'Minimum $2,500 / month',
      minimumMonthlyUSD: 2500,
      bullets: ['AV/EPP', 'Patch management', 'Reporting'],
      recommendedFor: 'Cost-conscious SMB',
    },
  ],
}

// ─── Backup ────────────────────────────────────────────────────────────────
export const backupCategory: MarketplaceCategory = {
  id: 'backup',
  name: 'Backup & Recovery',
  description: 'Data protection and disaster recovery',
  tiers: [
    {
      id: 'backup-gb',
      name: 'Backup Storage',
      priceMonthlyDisplay: '$0.45 / GB / month',
      priceMonthlyUSD: 0.45,
      unit: 'gb',
      unitPriceUSD: 0.45,
      minimumDisplay: 'Minimum $750 / month',
      minimumMonthlyUSD: 750,
      bullets: ['Encrypted storage', 'Point-in-time recovery', 'Retention policies'],
      recommendedFor: 'Variable data volumes',
    },
    {
      id: 'backup-dr',
      name: 'Disaster Recovery Premium',
      priceMonthlyDisplay: '$3,500 / month',
      priceMonthlyUSD: 3500,
      bullets: ['DR orchestration', 'Failover testing', 'RTO/RPO SLA'],
      recommendedFor: 'Business-critical recovery',
    },
  ],
}

// ─── Governance & Risk Premium ─────────────────────────────────────────────
export const governanceCategory: MarketplaceCategory = {
  id: 'governance',
  name: 'Governance & Risk Premium',
  description: 'Monitoring, intelligence, and executive modeling',
  tiers: [
    {
      id: 'gov-monitoring',
      name: 'Governance Monitoring Suite',
      priceMonthlyDisplay: '$3,500 / month',
      priceMonthlyUSD: 3500,
      bullets: ['Control monitoring', 'Compliance dashboards', 'Audit trails'],
      recommendedFor: 'Ongoing compliance and audit readiness',
    },
    {
      id: 'gov-predictive',
      name: 'Predictive Risk Intelligence',
      priceMonthlyDisplay: '$4,500 / month',
      priceMonthlyUSD: 4500,
      bullets: ['AI risk forecast', 'Threat trend analysis', 'Vulnerability prioritization'],
      recommendedFor: 'Proactive risk management',
    },
    {
      id: 'gov-financial',
      name: 'Executive Cyber Financial Modeling',
      priceMonthlyDisplay: '$3,000 / month',
      priceMonthlyUSD: 3000,
      bullets: ['ROI modeling', 'Risk quantification', 'Board-ready financials'],
      recommendedFor: 'CFO and board reporting',
    },
  ],
}

// ─── Platform & Data (MDU) – Layer 3, aktuelle Preisliste ──────────────────
export const dataMduCategory: MarketplaceCategory = {
  id: 'data-mdu',
  name: 'Platform & Data (MDU)',
  description: 'Event-basierte Datenverarbeitung – RMM, EDR, Maschinen-Events',
  tiers: [
    {
      id: 'mdu-tiered',
      name: 'Mahoney Data Units (MDU)',
      priceMonthlyDisplay: 'From $0 / month',
      priceMonthlyUSD: 0,
      unit: 'flat',
      bullets: [
        '0–1M events / month included',
        '1M–50M: $0.10 per 1,000 events',
        '50M–200M: $0.08 per 1,000 events',
        '200M+: $0.05 per 1,000 events',
        'RMM + EDR (Sophos) Alerts fließen ein',
        'Transparente Abrechnung nach Volumen',
      ],
      mostPopular: true,
      recommendedFor: 'Alle Stufen – Basis in jeder Plattform-Kalkulation',
    },
  ],
}

// ─── Strategic Bundles ─────────────────────────────────────────────────────
export const marketplaceBundles: MarketplaceBundle[] = [
  {
    id: 'bundle-enterprise',
    name: 'Enterprise Governance Bundle',
    priceMonthlyDisplay: '$75,000 / month',
    priceMonthlyUSD: 75000,
    bullets: [
      'Enterprise SOC',
      'vCISO Board-Level',
      'Predictive Risk Engine',
      'Governance Monitoring',
      'Executive Reporting',
    ],
    recommendedFor: 'Enterprise and regulated organizations',
    scheduleStrategyCall: true,
  },
  {
    id: 'bundle-growth',
    name: 'Growth & Risk Optimization Bundle',
    priceMonthlyDisplay: '$22,000 / month',
    priceMonthlyUSD: 22000,
    mostPopular: true,
    bullets: [
      'Advanced SOC',
      'Strategic vCISO',
      'AI Risk Forecast',
      'Financial Dashboard',
    ],
    recommendedFor: 'Growth-stage and mid-market',
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
