'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, X, Lock } from 'lucide-react'
import { Card } from '@/components/Card'
import {
  PARTNER_TIERS,
  PLATFORM_LIST_PRICES,
  platformPartnerCost,
  SOC_LIST_PRICES,
  SOC_PARTNER_MARGIN_PCT,
  socPartnerCost,
  MITAI_LIST_PRICES,
  mitaiPartnerCost,
  PARTNER_BUNDLES,
  VOLUME_BONUS,
  PARTNER_ONBOARDING_FEE,
  PARTNER_ONBOARDING_INCLUDES,
  REVENUE_SHARE_MODELS,
  MAX_PARTNER_CUSTOMER_DISCOUNT_PCT,
  TIER_MIN_CUSTOMERS,
  PLATFORM_TO_CUSTOMER_SIZE,
  PARTNER_CLOSE_ARGUMENTS,
  CUSTOMER_FACING_ARGUMENTS,
  PARTNER_MDU_MARGIN_PER_1K_EVENTS_USD,
  type PartnerTierId,
  type CustomerSize,
} from '@/lib/partner-pricing'
import { estimateMonthlyEvents, EVENTS_PER_DEVICE_PER_DAY_SECURITY } from '@/lib/mdu-pricing'
import { stagger, fadeUp } from '@/lib/ui/motion'
import { Calculator, TrendingUp, MessageSquare } from 'lucide-react'

type Session = { role: string | null; partnerId: string | null; partnerTier?: string; partnerName?: string }

/** Ausziehbar wie Marketplace: Klick öffnet Popover mit psychologischen Argumenten. */
function InfoIconWithPopover({
  bullets,
  fullContent,
  title,
  size = 'default',
}: {
  title: string
  bullets: string[]
  fullContent: React.ReactNode
  size?: 'default' | 'sm'
}) {
  const [hover, setHover] = useState(false)
  const [open, setOpen] = useState(false)
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
  const tooltipClass = 'absolute z-30 left-full ml-1.5 top-1/2 -translate-y-1/2 w-[min(320px,90vw)] max-h-[min(280px,60vh)] overflow-y-auto py-3 px-4 rounded-xl bg-[var(--surface-elev)] border border-[var(--border)] shadow-lg text-left pointer-events-none'
  return (
    <>
      <span
        className="relative inline-flex items-center justify-center cursor-help"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={(e) => { e.stopPropagation(); setOpen(true) }}
        role="button"
        tabIndex={0}
        aria-label={`Info: ${title}`}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true) } }}
      >
        <Info className={`${iconSize} text-[var(--muted)] hover:text-[var(--primary)] transition-colors`} />
        {hover && (
          <div className={tooltipClass}>
            <div className="text-xs font-semibold text-[var(--text)] mb-2 pr-2">{title}</div>
            <ul className="text-xs text-[var(--muted)] space-y-1 list-disc list-inside pr-1">
              {bullets.map((b, i) => (
                <li key={i} className="leading-snug">{b}</li>
              ))}
            </ul>
            <span className="text-[10px] text-[var(--primary)] mt-2 block">Click for details</span>
          </div>
        )}
      </span>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md max-h-[85vh] overflow-auto rounded-2xl bg-[var(--surface-elev)] border border-[var(--border)] shadow-xl p-5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
                <button type="button" onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-[var(--surface-2)] text-[var(--muted)]" aria-label="Schließen">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-sm text-[var(--text)] space-y-2">{fullContent}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

/** Benefits per MIT-AI plan for psychological argumentation. */
const MITAI_PLAN_BENEFITS: Record<string, { short: string; bullets: string[]; fullTitle: string }> = {
  Insight: {
    short: 'Entry-level, short evaluations, basic Co-Pilot.',
    bullets: ['Low entry price – customer tries AI with minimal risk.', 'Ideal for first use cases and proof of concept.', 'Your margin per customer with minimal sales effort.'],
    fullTitle: 'MIT-AI Insight – Why sell it?',
  },
  Intelligence: {
    short: 'Co-Pilot, analytics, recommendations, governance reports.',
    bullets: ['The most-sold plan: Co-Pilot in daily use.', 'Strong pitch: less manual work, better decisions.', 'Recurring revenue – customer commits to the platform.'],
    fullTitle: 'MIT-AI Intelligence – Partner benefits',
  },
  Command: {
    short: 'Complex analytics, large context, executive dashboards.',
    bullets: ['Premium margin with enterprise customers.', 'Position as strategic partner, not just reseller.', 'High contribution per contract with relatively low support.'],
    fullTitle: 'MIT-AI Command – Maximum margin',
  },
}

const ALLOWED_ROLES = ['partner', 'admin', 'superadmin']

function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}
function formatUsdCents(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}

type PlatformKey = keyof typeof PLATFORM_LIST_PRICES

const tierIds: PartnerTierId[] = ['authorized', 'advanced', 'elite']

export default function PartnerPricingPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [calcPartnerTier, setCalcPartnerTier] = useState<PartnerTierId>('authorized')
  const [calcCurrentCustomers, setCalcCurrentCustomers] = useState(2)
  const [calcPlatform, setCalcPlatform] = useState<PlatformKey>('essential')
  const [calcSoc, setCalcSoc] = useState<string>('')
  const [calcMitai, setCalcMitai] = useState<string>('')
  const [calcDevices, setCalcDevices] = useState(50)
  /** Optional: override estimated events (e.g. 80_000_000–150_000_000 for 250 devices). If 0, use estimate from devices. */
  const [calcEventsOverride, setCalcEventsOverride] = useState(0)

  const myTierId = (session?.partnerTier && tierIds.includes(session.partnerTier as PartnerTierId)) ? (session.partnerTier as PartnerTierId) : null

  useEffect(() => {
    fetch('/api/demo/me')
      .then((r) => r.json())
      .then((d: Session) => setSession(d))
      .catch(() => setSession({ role: null, partnerId: null }))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (myTierId) setCalcPartnerTier(myTierId)
  }, [myTierId])

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        <p className="text-sm text-[var(--muted)]">Loading…</p>
      </div>
    )
  }

  const canSee = session?.role && ALLOWED_ROLES.includes(session.role)

  if (!canSee) {
    return (
      <div className="max-w-lg mx-auto py-12 px-4 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] mb-4">
          <Lock className="w-7 h-7 text-[var(--muted)]" />
        </div>
        <h1 className="text-xl font-semibold text-[var(--text)] mb-2">Partner Pricing</h1>
        <p className="text-sm text-[var(--muted)]">
          Access to partner pricing and margins is only visible to logged-in partners (and admins). This keeps the market price stable and partners always sell at the official list price.
        </p>
        <p className="text-xs text-[var(--muted)] mt-4">
          Please log in as a partner or create a partner account in Admin.
        </p>
      </div>
    )
  }

  const myDiscountPct = myTierId ? PARTNER_TIERS[myTierId].discountPct : PARTNER_TIERS.elite.discountPct
  const tableDiscountPct = myTierId ? PARTNER_TIERS[myTierId].discountPct : PARTNER_TIERS.elite.discountPct

  const calcDiscountPct = PARTNER_TIERS[calcPartnerTier].discountPct
  const listPlatform = PLATFORM_LIST_PRICES[calcPlatform]
  const costPlatform = platformPartnerCost(listPlatform, calcDiscountPct)
  const listSoc = calcSoc ? (SOC_LIST_PRICES[calcSoc] ?? 0) : 0
  const marginSoc = calcSoc ? (SOC_PARTNER_MARGIN_PCT[calcSoc] ?? 20) : 0
  const costSoc = listSoc ? socPartnerCost(listSoc, marginSoc) : 0
  const listMitai = calcMitai ? (MITAI_LIST_PRICES[calcMitai] ?? 0) : 0
  const costMitai = listMitai ? mitaiPartnerCost(listMitai) : 0

  const calcListTotal = listPlatform + listSoc + listMitai
  const calcCostTotal = costPlatform + costSoc + costMitai
  const calcMarginTotal = calcListTotal - calcCostTotal
  const customersAfter = calcCurrentCustomers + 1

  const nextTier = (tierIds as PartnerTierId[]).find((t) => TIER_MIN_CUSTOMERS[t] > calcCurrentCustomers && TIER_MIN_CUSTOMERS[t] <= customersAfter)
  const tierImpactMessage = nextTier
    ? `With ${customersAfter} customer${customersAfter > 1 ? 's' : ''} you'd meet ${PARTNER_TIERS[nextTier].label} (${PARTNER_TIERS[nextTier].requirements}).`
    : calcCurrentCustomers + 1 >= TIER_MIN_CUSTOMERS.elite
      ? 'You keep or strengthen Elite tier.'
      : null

  const customerSize: CustomerSize = PLATFORM_TO_CUSTOMER_SIZE[calcPlatform] ?? 'medium'
  const partnerArgs = PARTNER_CLOSE_ARGUMENTS[customerSize]
  const customerArgs = CUSTOMER_FACING_ARGUMENTS[customerSize]
  const hasCalculation = calcListTotal > 0

  const estimatedEventsMdu = estimateMonthlyEvents(calcDevices, EVENTS_PER_DEVICE_PER_DAY_SECURITY)
  const eventsMdu = calcEventsOverride > 0 ? calcEventsOverride : estimatedEventsMdu
  const mduMarginUsd = Math.round((eventsMdu / 1000) * PARTNER_MDU_MARGIN_PER_1K_EVENTS_USD * 100) / 100
  const mduEventsDisplay = eventsMdu >= 1_000_000 ? `${(eventsMdu / 1_000_000).toFixed(1)}M` : `${(eventsMdu / 1000).toFixed(1)}k`

  return (
    <motion.div className="max-w-4xl mx-auto py-8 px-4 space-y-10" variants={stagger} initial="initial" animate="animate">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-[var(--text)]">Partner Pricing &amp; Margins</h1>
        {session?.partnerName && <p className="text-sm text-[var(--muted)] mt-0.5">Partner: {session.partnerName}</p>}
        {myTierId && (
          <p className="text-sm font-medium text-[var(--primary)] mt-1">Your tier: {PARTNER_TIERS[myTierId].label} ({tableDiscountPct}% discount)</p>
        )}
        <p className="text-sm text-[var(--muted)] mt-1">
          Confidential – for partners only. You always sell at list price; your profit is the difference to your cost. Direct sales from Mahoney = list price; partners may give end customers up to {MAX_PARTNER_CUSTOMER_DISCOUNT_PCT}% discount.
        </p>
      </motion.div>

      {/* Deal calculator */}
      <motion.section className="space-y-4" variants={fadeUp}>
        <h2 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
          <Calculator className="w-5 h-5 text-[var(--primary)]" />
          Deal calculator
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Enter a potential deal to see revenue, your cost, margin, tier impact, MDU (data) earning potential, and arguments for closing (for you and for your customer).
        </p>
        <Card className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1">Your partner tier</label>
              <select
                value={calcPartnerTier}
                onChange={(e) => setCalcPartnerTier(e.target.value as PartnerTierId)}
                className="w-full text-sm bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text)]"
              >
                {tierIds.map((id) => (
                  <option key={id} value={id}>{PARTNER_TIERS[id].label} ({PARTNER_TIERS[id].discountPct}%)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1">Current # of customers</label>
              <input
                type="number"
                min={0}
                value={calcCurrentCustomers}
                onChange={(e) => setCalcCurrentCustomers(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full text-sm bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1">Platform tier (deal)</label>
              <select
                value={calcPlatform}
                onChange={(e) => setCalcPlatform(e.target.value as PlatformKey)}
                className="w-full text-sm bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text)]"
              >
                <option value="essential">Essential ($799/mo)</option>
                <option value="professional">Professional ($2,999/mo)</option>
                <option value="enterprise">Enterprise ($7,499/mo)</option>
                <option value="securityOs">Security OS ($22,999/mo)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1">SOC add-on (optional)</label>
              <select
                value={calcSoc}
                onChange={(e) => setCalcSoc(e.target.value)}
                className="w-full text-sm bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text)]"
              >
                <option value="">None</option>
                {Object.keys(SOC_LIST_PRICES).map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs font-medium text-[var(--muted)] mb-1">MIT-AI add-on (optional)</label>
              <select
                value={calcMitai}
                onChange={(e) => setCalcMitai(e.target.value)}
                className="w-full text-sm bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text)]"
              >
                <option value="">None</option>
                {Object.keys(MITAI_LIST_PRICES).map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1">Customer size – devices</label>
              <input
                type="number"
                min={0}
                value={calcDevices}
                onChange={(e) => setCalcDevices(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full text-sm bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text)]"
              />
              <p className="text-[10px] text-[var(--muted)] mt-0.5">For MDU: estimate or enter events below</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1">Events/mo (optional override)</label>
              <input
                type="number"
                min={0}
                placeholder="e.g. 80000000 or 150000000"
                value={calcEventsOverride > 0 ? calcEventsOverride : ''}
                onChange={(e) => setCalcEventsOverride(Math.max(0, parseInt(e.target.value.replace(/\D/g, ''), 10) || 0))}
                className="w-full text-sm bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text)] placeholder-[var(--muted)]"
              />
              <p className="text-[10px] text-[var(--muted)] mt-0.5">Real volumes: e.g. 80–150M for ~250 devices</p>
            </div>
          </div>

          {hasCalculation && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-[var(--border)]">
                <div>
                  <div className="text-xs text-[var(--muted)]">What the customer pays (list)</div>
                  <div className="text-lg font-semibold text-[var(--text)]">{formatUsd(calcListTotal)}/mo</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--muted)]">Your cost</div>
                  <div className="text-lg font-semibold text-[var(--text)]">{formatUsd(calcCostTotal)}/mo</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--muted)]">Your margin</div>
                  <div className="text-lg font-semibold text-[var(--primary)]">{formatUsd(calcMarginTotal)}/mo</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--muted)]">Customers after deal</div>
                  <div className="text-lg font-semibold text-[var(--text)]">{customersAfter}</div>
                </div>
              </div>

              {/* Monthly potential from data (MDU) – passive revenue */}
              <div className="pt-4 pb-2 border-t border-[var(--border)]">
                <h3 className="text-sm font-semibold text-[var(--text)] mb-2">Monthly potential from data (MDU / Datenveredelung)</h3>
                <p className="text-xs text-[var(--muted)] mb-3">
                  The customer&apos;s data flows through the platform; you earn this margin without extra work.
                  {calcEventsOverride > 0
                    ? ' Using your entered events/mo. Many customers with ~250 devices generate 80–150M events/month.'
                    : ` Estimate: ${EVENTS_PER_DEVICE_PER_DAY_SECURITY} events/device/day. For real volumes (e.g. 80–150M), enter Events/mo above.`}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-[var(--muted)]">Devices (deal)</div>
                    <div className="text-lg font-semibold text-[var(--text)]">{calcDevices}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--muted)]">{calcEventsOverride > 0 ? 'Events/mo' : 'Est. events/mo'}</div>
                    <div className="text-lg font-semibold text-[var(--text)]">{mduEventsDisplay}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--muted)]">Your margin</div>
                    <div className="text-lg font-semibold text-[var(--primary)]">{formatUsd(mduMarginUsd)}/mo</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--muted)]">Rate</div>
                    <div className="text-sm font-medium text-[var(--text)]">{formatUsdCents(PARTNER_MDU_MARGIN_PER_1K_EVENTS_USD)}/1k events</div>
                  </div>
                </div>
                <p className="text-xs font-medium text-[var(--primary)] mt-3 bg-[var(--primary)]/10 rounded-xl px-4 py-2">
                  Passive income: you earn this margin every month from data processing as long as the customer is live – no extra effort required.
                </p>
                <p className="text-[10px] text-[var(--muted)] mt-2">Per-tenant MDU budget (min $1000) can be set in Admin → Customer file → Billing. When reached, processing stops until next period.</p>
              </div>

              {tierImpactMessage && (
                <p className="text-sm font-medium text-[var(--primary)] bg-[var(--primary)]/10 rounded-xl px-4 py-2">
                  {tierImpactMessage}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text)] flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
                    Why you should close this deal
                  </h3>
                  <p className="text-xs text-[var(--muted)] mb-2">Economic-psychological arguments for you (customer segment: {customerSize})</p>
                  <ul className="space-y-1.5">
                    {partnerArgs.map((arg, i) => (
                      <li key={i} className="text-sm text-[var(--text)] flex items-start gap-2">
                        <span className="text-[var(--primary)] shrink-0">•</span>
                        <span>{arg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text)] flex items-center gap-1.5 mb-2">
                    <MessageSquare className="w-4 h-4 text-[var(--primary)]" />
                    Arguments for your customer
                  </h3>
                  <p className="text-xs text-[var(--muted)] mb-2">Copy or use in the conversation (by segment)</p>
                  <div className="flex flex-wrap gap-2">
                    {customerArgs.map((a, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(a.text)}
                        className="text-left px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--surface-elev)] hover:border-[var(--primary)]/30 text-sm text-[var(--text)] transition-colors"
                        title="Click to copy"
                      >
                        <span className="font-medium block mb-0.5">{a.label}</span>
                        <span className="text-xs text-[var(--muted)]">{a.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>
      </motion.section>

      {/* Partner Tiers */}
      <motion.section className="space-y-3" variants={fadeUp}>
        <h2 className="text-lg font-semibold text-[var(--text)]">Partner Tiers</h2>
        <Card className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Tier</th>
                <th className="py-2 pr-4 text-left">Discount / Margin</th>
                <th className="py-2 text-left">Requirements</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              {tierIds.map((id) => (
                <tr key={id} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2 pr-4 font-medium">{PARTNER_TIERS[id].label}</td>
                  <td className="py-2 pr-4">{PARTNER_TIERS[id].discountPct} %</td>
                  <td className="py-2">{PARTNER_TIERS[id].requirements}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </motion.section>

      {/* Platform – List vs your cost by tier */}
      <motion.section className="space-y-3" variants={fadeUp}>
        <h2 className="text-lg font-semibold text-[var(--text)]">
          Platform {myTierId ? `(Your cost: ${PARTNER_TIERS[myTierId].label})` : '(Example: Elite Partner)'}
        </h2>
        <p className="text-xs text-[var(--muted)]">List price = what the end customer pays. Your cost = list price minus tier discount.</p>
        <Card className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Tier</th>
                <th className="py-2 pr-4 text-right">List price (net)</th>
                <th className="py-2 text-right">{myTierId ? 'Your cost' : 'Elite partner cost'}</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">Essential</td>
                <td className="py-2 pr-4 text-right">{formatUsd(PLATFORM_LIST_PRICES.essential)}</td>
                <td className="py-2 text-right">{formatUsd(platformPartnerCost(PLATFORM_LIST_PRICES.essential, myDiscountPct))}</td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">Professional</td>
                <td className="py-2 pr-4 text-right">{formatUsd(PLATFORM_LIST_PRICES.professional)}</td>
                <td className="py-2 text-right">{formatUsd(platformPartnerCost(PLATFORM_LIST_PRICES.professional, myDiscountPct))}</td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">Enterprise</td>
                <td className="py-2 pr-4 text-right">{formatUsd(PLATFORM_LIST_PRICES.enterprise)}</td>
                <td className="py-2 text-right">{formatUsd(platformPartnerCost(PLATFORM_LIST_PRICES.enterprise, myDiscountPct))}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">Security OS</td>
                <td className="py-2 pr-4 text-right">{formatUsd(PLATFORM_LIST_PRICES.securityOs)}</td>
                <td className="py-2 text-right">{formatUsd(platformPartnerCost(PLATFORM_LIST_PRICES.securityOs, myDiscountPct))}</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </motion.section>

      {/* SOC – lower margins */}
      <motion.section className="space-y-3" variants={fadeUp}>
        <h2 className="text-lg font-semibold text-[var(--text)]">SOC – Partner margin (operational service)</h2>
        <p className="text-xs text-[var(--muted)]">SOC has lower margins (analysts, infrastructure, SIEM).</p>
        <Card className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Tier</th>
                <th className="py-2 pr-4 text-right">List price</th>
                <th className="py-2 pr-4 text-right">Partner margin</th>
                <th className="py-2 text-right">Partner cost</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              {Object.entries(SOC_LIST_PRICES).map(([name, listPrice]) => {
                const margin = SOC_PARTNER_MARGIN_PCT[name] ?? 20
                return (
                  <tr key={name} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-2 pr-4 font-medium">{name}</td>
                    <td className="py-2 pr-4 text-right">{formatUsd(listPrice)}</td>
                    <td className="py-2 pr-4 text-right">{margin} %</td>
                    <td className="py-2 text-right">{formatUsd(socPartnerCost(listPrice, margin))}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      </motion.section>

      {/* MIT-AI – 40 % partner margin (expandable like Marketplace) */}
      <motion.section className="space-y-3" variants={fadeUp}>
        <h2 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
          MIT-AI – 40% Partner Margin
          <InfoIconWithPopover
            title="Why 40% margin on MIT-AI?"
            bullets={[
              'Software scales without high operating costs – your margin stays secure.',
              'Recurring revenue at minimal marginal cost for Mahoney.',
              'Attractive entry for customers (Insight) → upsell to Intelligence and Command.',
              'You position as an AI partner, not just a reseller.',
            ]}
            fullContent={
              <>
                <p>MIT-AI is software: it scales with virtually no extra operating cost. That is why we can offer partners a 40% margin.</p>
                <p className="mt-2">Benefits for you: recurring revenue per customer, clear pricing story (list price vs. your cost), and the chance to move customers from Insight to Intelligence to Command – with higher margin per contract.</p>
              </>
            }
          />
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Software scales without high operating costs – more generous margin.
        </p>
        <Card className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Plan</th>
                <th className="py-2 pr-4 text-left">Benefits / Use case</th>
                <th className="py-2 pr-4 text-right">List price</th>
                <th className="py-2 text-right">Partner cost</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              {Object.entries(MITAI_LIST_PRICES).map(([name, listPrice]) => {
                const benefit = MITAI_PLAN_BENEFITS[name]
                return (
                  <tr key={name} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-2 pr-4 font-medium align-top">
                      <span className="inline-flex items-center gap-1">
                        {name}
                        {benefit && (
                          <InfoIconWithPopover title={benefit.fullTitle} bullets={benefit.bullets} fullContent={<ul className="list-disc list-inside space-y-1">{benefit.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>} size="sm" />
                        )}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-[var(--muted)] align-top max-w-[240px]">{benefit?.short ?? '—'}</td>
                    <td className="py-2 pr-4 text-right align-top">{formatUsd(listPrice)} / mo</td>
                    <td className="py-2 text-right align-top">{formatUsd(mitaiPartnerCost(listPrice))} / mo</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      </motion.section>

      {/* Bundles */}
      <motion.section className="space-y-3" variants={fadeUp}>
        <h2 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
          Bundle Pricing for Partners
          <InfoIconWithPopover
            title="Why sell bundles?"
            bullets={[
              'Higher margin per deal – one bundle instead of many line items.',
              'Customer gets immediate value (Platform + SOC + AI) – less negotiation.',
              'Your MRR (difference) is visible and motivates closing.',
            ]}
            fullContent={
              <>
                <p>Partners should sell bundles, not just modules. Per deal you earn the difference between list price and your cost – with bundles that difference (your MRR) is especially attractive and reduces sales effort per line.</p>
              </>
            }
          />
        </h2>
        <p className="text-sm text-[var(--muted)]">Partners should sell bundles – higher margin per deal.</p>
        <Card className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Bundle</th>
                <th className="py-2 pr-4 text-right">List price</th>
                <th className="py-2 pr-4 text-right">Partner cost</th>
                <th className="py-2 text-right">Your MRR (difference)</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              {PARTNER_BUNDLES.map((b) => (
                <tr key={b.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2 pr-4 font-medium">{b.name}</td>
                  <td className="py-2 pr-4 text-right">{formatUsd(b.listPrice)}</td>
                  <td className="py-2 pr-4 text-right">{formatUsd(b.partnerCost)}</td>
                  <td className="py-2 text-right font-medium text-[var(--primary)]">{formatUsd(b.partnerMrr)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </motion.section>

      {/* Volume bonus */}
      <motion.section className="space-y-3" variants={fadeUp}>
        <h2 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
          Volume Bonus (ARR)
          <InfoIconWithPopover
            title="Why volume bonus?"
            bullets={[
              'Growth incentive: the higher your ARR, the more bonus margin.',
              'Motivation for long-term partnership and more customers.',
              'Transparent tiers – you know what you get at $100k, $500k, $1M ARR.',
            ]}
            fullContent={<p>Top partners expect incentives to scale. With the volume bonus you get extra margin on your annual recurring volume – so growth pays off for both sides.</p>}
          />
        </h2>
        <p className="text-sm text-[var(--muted)]">More ARR = more bonus margin. Clear tiers for planning.</p>
        <Card className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">ARR volume</th>
                <th className="py-2 text-right">Bonus margin</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              {VOLUME_BONUS.map((v) => (
                <tr key={v.arrUsd} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2 pr-4">{formatUsd(v.arrUsd)} ARR</td>
                  <td className="py-2 text-right">+{v.bonusMarginPct} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </motion.section>

      {/* Onboarding Fee */}
      <motion.section className="space-y-3" variants={fadeUp}>
        <h2 className="text-lg font-semibold text-[var(--text)]">Partner onboarding fee (one-time)</h2>
        <p className="text-xs text-[var(--muted)]">Program entry – partner receives training, demo, and materials.</p>
        <Card className="p-4 space-y-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Partner Level</th>
                <th className="py-2 text-right">Fee</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              {tierIds.map((id) => (
                <tr key={id} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2 pr-4 font-medium">{PARTNER_TIERS[id].label}</td>
                  <td className="py-2 text-right">{formatUsd(PARTNER_ONBOARDING_FEE[id])}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="text-xs text-[var(--muted)] list-disc list-inside space-y-1">
            {PARTNER_ONBOARDING_INCLUDES.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Card>
      </motion.section>

      {/* Revenue Share */}
      <motion.section className="space-y-3" variants={fadeUp}>
        <h2 className="text-lg font-semibold text-[var(--text)]">Revenue Share (Recurring)</h2>
        <Card className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Model</th>
                <th className="py-2 pr-4 text-left">Description</th>
                <th className="py-2 text-right">Partner share</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              {REVENUE_SHARE_MODELS.map((m) => (
                <tr key={m.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2 pr-4 font-medium">{m.label}</td>
                  <td className="py-2 pr-4 text-sm text-[var(--muted)]">{m.description}</td>
                  <td className="py-2 text-right">{m.partnerSharePct} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </motion.section>

      <motion.p className="text-xs text-[var(--muted)] border-t border-[var(--border)] pt-6" variants={fadeUp}>
        Strategy: Position partners as Security Infrastructure Partners – they sell Mahoney Control Platform, SOC, MIT-AI, and compliance. Direct sales from Mahoney = always list price; you must never sell cheaper than your partner.
      </motion.p>
    </motion.div>
  )
}
