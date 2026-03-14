/**
 * Partner-only pricing: margins, tiers, bundles, onboarding fees.
 * Partners sell at list price; their margin = discount on cost.
 * Only visible to users with role partner (or admin for viewing).
 */

import type { PartnerTierId } from '@/lib/auth/roles'
export type { PartnerTierId }

export const PARTNER_TIERS: Record<
  PartnerTierId,
  { label: string; discountPct: number; requirements: string }
> = {
  authorized: {
    label: 'Authorized Partner',
    discountPct: 20,
    requirements: 'Registration + NDA',
  },
  advanced: {
    label: 'Advanced Partner',
    discountPct: 30,
    requirements: '3 customers + training',
  },
  elite: {
    label: 'Elite Partner',
    discountPct: 40,
    requirements: '10 customers + certified',
  },
}

/** Platform list prices (net) – partner sells at this; cost = list × (1 - discount/100) */
export const PLATFORM_LIST_PRICES = {
  essential: 799,
  professional: 2999,
  enterprise: 7499,
  securityOs: 22999,
} as const

export function platformPartnerCost(listPrice: number, discountPct: number): number {
  return Math.round(listPrice * (1 - discountPct / 100))
}

/** SOC: lower margins (operational cost). Partner margin % on list. */
export const SOC_PARTNER_MARGIN_PCT: Record<string, number> = {
  'Core Shield': 15,
  'Advanced Guard': 20,
  'Enterprise Threat Operations': 25,
  'Board-Level': 25,
}

export const SOC_LIST_PRICES: Record<string, number> = {
  'Core Shield': 3500,
  'Advanced Guard': 8500,
  'Enterprise Threat Operations': 22000,
  'Board-Level': 85000, // from $85,000
}

export function socPartnerCost(listPrice: number, marginPct: number): number {
  return Math.round(listPrice * (1 - marginPct / 100))
}

/** MIT-AI: 40% partner margin (software scales). */
export const MITAI_PARTNER_MARGIN_PCT = 40

export const MITAI_LIST_PRICES: Record<string, number> = {
  Insight: 290,
  Intelligence: 990,
  Command: 2490,
}

export function mitaiPartnerCost(listPrice: number): number {
  return Math.round(listPrice * (1 - MITAI_PARTNER_MARGIN_PCT / 100))
}

/** Bundles: list price → partner cost (approx 35% margin for motivation). */
export const PARTNER_BUNDLES: Array<{ id: string; name: string; listPrice: number; partnerCost: number; partnerMrr: number }> = [
  { id: 'growth', name: 'Growth Bundle', listPrice: 3699, partnerCost: 2400, partnerMrr: 1299 },
  { id: 'professional', name: 'Professional Bundle', listPrice: 9749, partnerCost: 6300, partnerMrr: 3449 },
  { id: 'enterprise', name: 'Enterprise Bundle', listPrice: 23999, partnerCost: 15600, partnerMrr: 8399 },
]

/** Volume bonus on top of tier discount (ARR). */
export const VOLUME_BONUS: Array<{ arrUsd: number; bonusMarginPct: number }> = [
  { arrUsd: 100_000, bonusMarginPct: 3 },
  { arrUsd: 500_000, bonusMarginPct: 5 },
  { arrUsd: 1_000_000, bonusMarginPct: 8 },
]

/** Partner onboarding fee (one-time). */
export const PARTNER_ONBOARDING_FEE: Record<PartnerTierId, number> = {
  authorized: 2500,
  advanced: 5000,
  elite: 10000,
}

/** What partner gets for onboarding fee. */
export const PARTNER_ONBOARDING_INCLUDES = [
  'Sales training',
  'Demo platform',
  'Marketing material',
  'Access to Mahoney Control demo',
]

/** Revenue share models (partner share of recurring). */
export const REVENUE_SHARE_MODELS: Array<{ id: string; label: string; partnerSharePct: number; description: string }> = [
  { id: 'reseller', label: 'Reseller', partnerSharePct: 30, description: 'Partner sells, you operate' },
  { id: 'co-managed', label: 'Co-Managed', partnerSharePct: 35, description: 'Partner + Mahoney SOC' },
  { id: 'white-label', label: 'White Label', partnerSharePct: 45, description: 'Partner sells under own brand' },
]

/** Direct sales = list price. Partner may give end customer max 10% discount. */
export const MAX_PARTNER_CUSTOMER_DISCOUNT_PCT = 10
