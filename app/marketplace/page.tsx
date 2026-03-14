'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, X } from 'lucide-react'
import { stagger } from '@/lib/ui/motion'
import { Card } from '@/components/Card'
import { HapticButton } from '@/components/HapticButton'

type CartItem = {
  id: string
  name: string
  description?: string
}

function InfoIconWithPopover({
  bullets,
  fullContent,
  title,
  size = 'default',
  tooltipPosition = 'right',
}: {
  title: string
  bullets: string[]
  fullContent: React.ReactNode
  size?: 'default' | 'sm'
  tooltipPosition?: 'right' | 'bottom'
}) {
  const [hover, setHover] = useState(false)
  const [open, setOpen] = useState(false)
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
  const tooltipClass =
    tooltipPosition === 'bottom'
      ? 'absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-[min(320px,90vw)] max-h-[min(280px,60vh)] overflow-y-auto py-3 px-4 rounded-xl bg-[var(--surface-elev)] border border-[var(--border)] shadow-lg text-left pointer-events-none z-30'
      : 'absolute z-30 left-full ml-1.5 top-1/2 -translate-y-1/2 w-[min(320px,90vw)] max-h-[min(280px,60vh)] overflow-y-auto py-3 px-4 rounded-xl bg-[var(--surface-elev)] border border-[var(--border)] shadow-lg text-left pointer-events-none'
  return (
    <>
      <span
        className="relative inline-flex items-center justify-center cursor-help"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
        role="button"
        tabIndex={0}
        aria-label={`Info: ${title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen(true)
          }
        }}
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
            <span className="text-[10px] text-[var(--primary)] mt-2 block">Click for full details</span>
          </div>
        )}
      </span>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md max-h-[85vh] overflow-auto rounded-2xl bg-[var(--surface-elev)] border border-[var(--border)] shadow-xl p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-lg hover:bg-[var(--surface-2)] text-[var(--muted)]"
                  aria-label="Close"
                >
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

export default function MarketplacePage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [lastAdded, setLastAdded] = useState<string | null>(null)

  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item])
    setLastAdded(item.name)
  }

  const clearCart = () => setCart([])

  return (
    <motion.div className="space-y-8" variants={stagger} initial="initial" animate="animate">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold text-[var(--text)]">Marketplace</h1>
        <p className="text-[var(--muted)]">
          Overview of Mahoney services. Pricing may vary by region and commercial agreement.
        </p>
        {lastAdded && (
          <p className="text-xs text-[var(--muted)]">
            Added <span className="text-[var(--text)] font-medium">{lastAdded}</span> to cart. You can review and submit
            your order in the <span className="font-medium">Cart &amp; checkout</span> section at the bottom of this page
            ({cart.length} item{cart.length === 1 ? '' : 's'} in cart).
          </p>
        )}
      </div>

      {/* Mahoney One – Service Packages */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
          Mahoney One – Managed Service
          <span
            className="inline-flex items-center justify-center"
            title="Full-service managed offering combining platform, operations, and security for Mahoney customers."
          >
            <Info className="w-4 h-4 text-[var(--muted)]" />
          </span>
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Full-service operations for customers with or without their own IT. Mahoney One combines platform, operations,
          and security.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[var(--text)]">Mahoney One USA</h3>
              <span
                className="inline-flex items-center justify-center"
                title="US service packaging of Mahoney One including Mahoney Control platform and managed security operations."
              >
                <Info className="w-3 h-3 text-[var(--muted)]" />
              </span>
            </div>
            <p className="text-xs text-[var(--muted)]">Device-based pricing ($ per device per month).</p>
            <table className="w-full text-xs text-left mt-2">
              <thead>
                <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                  <th className="py-1 pr-2">Tier</th>
                  <th className="py-1">Price</th>
                </tr>
              </thead>
              <tbody className="text-[var(--text)]">
                <tr className="border-b border-[var(--border)]">
                  <td className="py-1 pr-2 font-medium">Essential</td>
                  <td className="py-1">$99 per device</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-1 pr-2 font-medium">Prime</td>
                  <td className="py-1">$175 per device</td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 font-medium">Elite</td>
                  <td className="py-1">$199 per device</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-[var(--muted)] mt-2">
              Upsell: Essential → Prime → Elite depending on regulatory, risk and 24x7 requirements.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <HapticButton
                label="Add Essential"
                onClick={() =>
                  addToCart({
                    id: 'mahoney-one-usa-essential',
                    name: 'Mahoney One USA – Essential',
                    description: '$99 per device / month',
                  })
                }
              />
              <HapticButton
                label="Add Prime"
                variant="surface"
                onClick={() =>
                  addToCart({
                    id: 'mahoney-one-usa-prime',
                    name: 'Mahoney One USA – Prime',
                    description: '$175 per device / month',
                  })
                }
              />
              <HapticButton
                label="Add Elite"
                variant="surface"
                onClick={() =>
                  addToCart({
                    id: 'mahoney-one-usa-elite',
                    name: 'Mahoney One USA – Elite',
                    description: '$199 per device / month',
                  })
                }
              />
            </div>
          </Card>

          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[var(--text)]">Mahoney One – Customer IT on site</h3>
              <span
                className="inline-flex items-center justify-center"
                title="Mahoney One service for customers operating their own on-site IT, with device-based pricing."
              >
                <Info className="w-3 h-3 text-[var(--muted)]" />
              </span>
            </div>
            <p className="text-xs text-[var(--muted)]">Device-based pricing ($ per device per month).</p>
            <table className="w-full text-xs text-left mt-2">
              <thead>
                <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                  <th className="py-1 pr-2">Tier</th>
                  <th className="py-1">Price</th>
                </tr>
              </thead>
              <tbody className="text-[var(--text)]">
                <tr className="border-b border-[var(--border)]">
                  <td className="py-1 pr-2 font-medium">Essential</td>
                  <td className="py-1">$35 per device</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-1 pr-2 font-medium">Standard (Extra Standard)</td>
                  <td className="py-1">$65 per device</td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 font-medium">Elite</td>
                  <td className="py-1">$95 per device</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-[var(--muted)] mt-2">
              Upsell: Essential → Standard when criticality increases; Standard → Elite for KRITIS / NIS-2 / 24x7.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <HapticButton
                label="Add Essential"
                onClick={() =>
                  addToCart({
                    id: 'mahoney-one-onsite-essential',
                    name: 'Mahoney One Onsite – Essential',
                    description: '$35 per device / month',
                  })
                }
              />
              <HapticButton
                label="Add Standard"
                variant="surface"
                onClick={() =>
                  addToCart({
                    id: 'mahoney-one-onsite-standard',
                    name: 'Mahoney One Onsite – Standard',
                    description: '$65 per device / month',
                  })
                }
              />
              <HapticButton
                label="Add Elite"
                variant="surface"
                onClick={() =>
                  addToCart({
                    id: 'mahoney-one-onsite-elite',
                    name: 'Mahoney One Onsite – Elite',
                    description: '$95 per device / month',
                  })
                }
              />
            </div>
          </Card>
        </div>
      </section>

      {/* Platform – Mahoney Control App */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
          Mahoney Control Platform
          <InfoIconWithPopover
            title="Mahoney Control Platform"
            bullets={[
              'Multi-tenant dashboard and governance',
              'Devices, staff and asset management',
              'Incidents, risk and compliance views',
              'Billing and financials',
              'Optional Mahoney Grow (growth from security data)',
            ]}
            fullContent={
              <>
                <p>
                  Multi-tenant governance platform for devices, incidents, risk and financials. Includes unified
                  dashboard, device and user management, incident tracking, governance and compliance views, and
                  billing. Optional add-on: Mahoney Grow for business growth insights from security data.
                </p>
                <p className="text-[var(--muted)] mt-2">
                  Pricing as per MIT-AI price list. Partners receive 20% discount; see Control Dashboard for partner P/L.
                </p>
              </>
            }
          />
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Multi-tenant governance platform for devices, incidents, risk and financials. Pricing as per Mahoney Control App price list (net, excl. tax). Four tiers: Essential, Professional, Enterprise, Security OS.
        </p>
        <Card className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Tier</th>
                <th className="py-2 pr-4 text-left">Monthly price (net)</th>
                <th className="py-2 text-left">Included</th>
                <th className="py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">
                  <span className="inline-flex items-center gap-1">
                    Essential
                    <InfoIconWithPopover
                      size="sm"
                      tooltipPosition="bottom"
                      title="Essential – included"
                      bullets={[
                        '5 users included',
                        'Dashboard, Devices & Staff, Incidents, Governance, Billing',
                        'Standard support',
                        'MDU: usage-based from 1M events',
                      ]}
                      fullContent={
                        <>
                          <p>
                            <strong>Essential</strong> ($799/month, net) equips small to mid-sized teams with the core
                            operational toolkit. 5 users included; additional users $29/user/month.
                          </p>
                          <ul className="list-disc list-inside mt-2 space-y-1 text-[var(--muted)]">
                            <li>Dashboard, Devices &amp; Staff, Incidents, Governance, Billing</li>
                            <li>Standard support (email, portal)</li>
                            <li>Platform &amp; Data (MDU): usage-based by event volume from 1M events</li>
                            <li>Onboarding: one-time (Essential tier) – see price list</li>
                          </ul>
                        </>
                      }
                    />
                  </span>
                </td>
                <td className="py-2 pr-4">$799</td>
                <td className="py-2 text-sm">
                  5 users · Dashboard, Devices &amp; Staff, Incidents, Governance, Billing · Standard support.
                </td>
                <td className="py-2 text-sm">
                  <HapticButton
                    label="Add to cart"
                    onClick={() =>
                      addToCart({
                        id: 'platform-essential',
                        name: 'Mahoney Control Platform – Essential',
                        description: '$799 / month',
                      })
                    }
                  />
                </td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">
                  <span className="inline-flex items-center gap-1">
                    Professional
                    <InfoIconWithPopover
                      size="sm"
                      tooltipPosition="bottom"
                      title="Professional – included"
                      bullets={[
                        '15 users included',
                        'All Essential modules · Advanced Reports · API Access',
                        'Security Financials · Cloud Posture · Priority support',
                        'Additional users $25/user/month',
                      ]}
                      fullContent={
                        <>
                          <p>
                            <strong>Professional</strong> ($2,999/month, net) adds advanced analytics, cloud posture
                            management, and priority support. 15 users included; additional users $25/user/month.
                          </p>
                          <ul className="list-disc list-inside mt-2 space-y-1 text-[var(--muted)]">
                            <li>All standard modules; Advanced Reports; API access</li>
                            <li>Security Financials; Cloud Posture; Priority support</li>
                            <li>Onboarding: one-time (Professional tier) – see price list</li>
                          </ul>
                        </>
                      }
                    />
                  </span>
                </td>
                <td className="py-2 pr-4">$2,999</td>
                <td className="py-2 text-sm">
                  15 users · Advanced Reports, API, Security Financials, Cloud Posture · Priority support.
                </td>
                <td className="py-2 text-sm">
                  <HapticButton
                    label="Add to cart"
                    onClick={() =>
                      addToCart({
                        id: 'platform-professional',
                        name: 'Mahoney Control Platform – Professional',
                        description: '$2,999 / month',
                      })
                    }
                  />
                </td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">
                  <span className="inline-flex items-center gap-1">
                    Enterprise
                    <InfoIconWithPopover
                      size="sm"
                      tooltipPosition="bottom"
                      title="Enterprise – included"
                      bullets={[
                        '50 users included',
                        'Full utilization · SLA · Dedicated support',
                        'Custom integrations and onboarding',
                        'Additional users $19/user/month',
                      ]}
                      fullContent={
                        <>
                          <p>
                            <strong>Enterprise</strong> ($7,499/month, net) is for larger or regulated organizations:
                            full utilization, SLA-backed service, dedicated support. 50 users included; additional users $19/user/month.
                          </p>
                          <ul className="list-disc list-inside mt-2 space-y-1 text-[var(--muted)]">
                            <li>Full utilization; SLA-backed availability and response</li>
                            <li>Dedicated support; optional success manager</li>
                            <li>Custom integrations, onboarding and training; optional on-prem or hybrid</li>
                            <li>Onboarding: one-time (Enterprise tier) – see price list</li>
                          </ul>
                        </>
                      }
                    />
                  </span>
                </td>
                <td className="py-2 pr-4">$7,499</td>
                <td className="py-2 text-sm">
                  50 users · Full utilization · SLA · Dedicated support.
                </td>
                <td className="py-2 text-sm">
                  <HapticButton
                    label="Add to cart"
                    onClick={() =>
                      addToCart({
                        id: 'platform-enterprise',
                        name: 'Mahoney Control Platform – Enterprise',
                        description: '$7,499 / month',
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">
                  <span className="inline-flex items-center gap-1">
                    Security OS
                    <InfoIconWithPopover
                      size="sm"
                      tooltipPosition="bottom"
                      title="Security OS – included"
                      bullets={[
                        'Unlimited users',
                        'Platform + SOC + MIT-AI at single fixed monthly price',
                        'All-inclusive bundle',
                        'No per-user add-on',
                      ]}
                      fullContent={
                        <>
                          <p>
                            <strong>Security OS</strong> ($22,999/month, net) is the all-inclusive bundle: platform,
                            SOC monitoring, and MIT-AI capability at a single fixed monthly price with unlimited users.
                          </p>
                          <ul className="list-disc list-inside mt-2 space-y-1 text-[var(--muted)]">
                            <li>Unlimited users (additional users included)</li>
                            <li>Platform, SOC, and MIT-AI in one bundle</li>
                            <li>Ideal for enterprises and regulated organizations</li>
                          </ul>
                        </>
                      }
                    />
                  </span>
                </td>
                <td className="py-2 pr-4">$22,999</td>
                <td className="py-2 text-sm">
                  Unlimited users · Platform + SOC + MIT-AI · single fixed price.
                </td>
                <td className="py-2 text-sm">
                  <HapticButton
                    label="Request quote"
                    variant="surface"
                    onClick={() =>
                      addToCart({
                        id: 'platform-security-os',
                        name: 'Mahoney Control Platform – Security OS',
                        description: '$22,999 / month (unlimited users)',
                      })
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
        <p className="text-xs text-[var(--muted)]">
          Cross-sell: combine Platform + Mahoney One + SOC + MIT-AI for full-stack governance and operations.
        </p>
      </section>

      {/* SOC – Security Operations */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
          SOC (Security Operations)
          <span
            className="inline-flex items-center justify-center"
            title="SOC tiers: Core Shield, Advanced Guard, Enterprise Threat Operations, Board-Level. Aligned with the price list."
          >
            <Info className="w-4 h-4 text-[var(--muted)]" />
          </span>
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Security Operations Center as a Service. Pricing per Mahoney Control App price list ($, net).
        </p>
        <Card className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Tier</th>
                <th className="py-2 text-left">Price</th>
                <th className="py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">
                  <span className="inline-flex items-center gap-1">
                    Core Shield
                    <span className="inline-flex items-center justify-center" title="Baseline 24/7 monitoring with alert triage and monthly reporting.">
                      <Info className="w-3 h-3 text-[var(--muted)]" />
                    </span>
                  </span>
                </td>
                <td className="py-2 text-sm">$3,500 / month</td>
                <td className="py-2 text-sm">
                  <HapticButton label="Add to cart" onClick={() => addToCart({ id: 'soc-core', name: 'SOC – Core Shield', description: '$3,500 / month' })} />
                </td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">
                  <span className="inline-flex items-center gap-1">
                    Advanced Guard
                    <span
                      className="inline-flex items-center justify-center"
                      title="24/7 monitoring with incident prioritization, threat intelligence and compliance-aligned reporting."
                    >
                      <Info className="w-3 h-3 text-[var(--muted)]" />
                    </span>
                  </span>
                </td>
                <td className="py-2 text-sm">$8,500 / month</td>
                <td className="py-2 text-sm">
                  <HapticButton label="Add to cart" onClick={() => addToCart({ id: 'soc-advanced', name: 'SOC – Advanced Guard', description: '$8,500 / month' })} />
                </td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">
                  <span className="inline-flex items-center gap-1">
                    Enterprise Threat Operations
                    <span className="inline-flex items-center justify-center" title="Dedicated SOC pod, advanced threat hunting, war-room support and executive reporting.">
                      <Info className="w-3 h-3 text-[var(--muted)]" />
                    </span>
                  </span>
                </td>
                <td className="py-2 text-sm">$22,000 / month</td>
                <td className="py-2 text-sm">
                  <HapticButton label="Add to cart" onClick={() => addToCart({ id: 'soc-enterprise', name: 'SOC – Enterprise Threat Operations', description: '$22,000 / month' })} />
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">
                  <span className="inline-flex items-center gap-1">
                    Board-Level
                    <span className="inline-flex items-center justify-center" title="Executive-grade SOC and board reporting for regulated / KRITIS-like customers.">
                      <Info className="w-3 h-3 text-[var(--muted)]" />
                    </span>
                  </span>
                </td>
                <td className="py-2 text-sm">from $85,000 / month</td>
                <td className="py-2 text-sm">
                  <HapticButton label="Request quote" variant="surface" onClick={() => addToCart({ id: 'soc-board', name: 'SOC – Board-Level', description: 'from $85,000 / month' })} />
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
        <p className="text-xs text-[var(--muted)]">
          Upsell: Core Shield → Advanced Guard as volume increases; Enterprise Threat Ops and Board-Level for regulated / KRITIS-like customers.
        </p>
      </section>

      {/* Platform & Data (MDU) */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
          Platform &amp; Data (MDU) – Events
          <span
            className="inline-flex items-center justify-center"
            title="Volume-based billing for events per month (from RMM, EDR, SIEM); 0–1M events are included with the platform."
          >
            <Info className="w-4 h-4 text-[var(--muted)]" />
          </span>
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Event-based billing per month (RMM, EDR, SIEM). RMM/EDR alert counts alone do not increase MDU cost.
        </p>
        <Card className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Volume (events / month)</th>
                <th className="py-2 text-left">Price</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4">0 – 1M</td>
                <td className="py-2">Included (with platform)</td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4">1M – 50M</td>
                <td className="py-2">0.10 $ per 1,000 events</td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4">50M – 200M</td>
                <td className="py-2">0.08 $ per 1,000 events</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">&gt; 200M</td>
                <td className="py-2">0.05 $ per 1,000 events</td>
              </tr>
            </tbody>
          </table>
        </Card>
        <p className="text-xs text-[var(--muted)]">
          Cross-sell: MDU as required building block for high-volume Mahoney One and SOC customers; entry via 0–1M
          included.
        </p>
      </section>

      {/* MIT-AI – AI analytics & Co-Pilot */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
          MIT-AI – AI Analytics &amp; Co-Pilot
          <span
            className="inline-flex items-center justify-center"
            title="AI-powered analytics and Co-Pilot usage, billed by input/output tokens across Standard, Pro and Premium plans."
          >
            <Info className="w-4 h-4 text-[var(--muted)]" />
          </span>
        </h2>
        <p className="text-sm text-[var(--muted)]">
          AI-supported analytics and Co-Pilot, billed by tokens used (input / output).
        </p>
        <Card className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Plan</th>
                <th className="py-2 pr-4 text-left">Input (per 1M tokens)</th>
                <th className="py-2 pr-4 text-left">Output (per 1M tokens)</th>
                <th className="py-2 text-left">Use case</th>
                <th className="py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">
                  <span className="inline-flex items-center gap-1">
                    Standard
                    <span
                      className="inline-flex items-center justify-center"
                      title="Standard AI usage tier for short queries and basic evaluations."
                    >
                      <Info className="w-3 h-3 text-[var(--muted)]" />
                    </span>
                  </span>
                </td>
                <td className="py-2 pr-4">$1.50</td>
                <td className="py-2 pr-4">$7.50</td>
                <td className="py-2 text-sm">Short queries, standard evaluations.</td>
                <td className="py-2 text-sm">
                  <HapticButton
                    label="Add to cart"
                    onClick={() =>
                      addToCart({
                        id: 'mitai-standard',
                        name: 'MIT-AI – Standard',
                        description: '$1.50 input / $7.50 output per 1M tokens',
                      })
                    }
                  />
                </td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">
                  <span className="inline-flex items-center gap-1">
                    Pro
                    <span
                      className="inline-flex items-center justify-center"
                      title="Pro tier for Co-Pilot, analytics and recommendations in day-to-day operations."
                    >
                      <Info className="w-3 h-3 text-[var(--muted)]" />
                    </span>
                  </span>
                </td>
                <td className="py-2 pr-4">$4.50</td>
                <td className="py-2 pr-4">$22.50</td>
                <td className="py-2 text-sm">
                  Co-Pilot, analysis, recommendations (standard use).
                </td>
                <td className="py-2 text-sm">
                  <HapticButton
                    label="Add to cart"
                    onClick={() =>
                      addToCart({
                        id: 'mitai-pro',
                        name: 'MIT-AI – Pro',
                        description: '$4.50 input / $22.50 output per 1M tokens',
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">
                  <span className="inline-flex items-center gap-1">
                    Premium
                    <span
                      className="inline-flex items-center justify-center"
                      title="Premium AI tier for complex analyses, long contexts and executive-grade outputs."
                    >
                      <Info className="w-3 h-3 text-[var(--muted)]" />
                    </span>
                  </span>
                </td>
                <td className="py-2 pr-4">$7.50</td>
                <td className="py-2 pr-4">$37.50</td>
                <td className="py-2 text-sm">
                  Complex analytics, large context windows.
                </td>
                <td className="py-2 text-sm">
                  <HapticButton
                    label="Add to cart"
                    onClick={() =>
                      addToCart({
                        id: 'mitai-premium',
                        name: 'MIT-AI – Premium',
                        description: '$7.50 input / $37.50 output per 1M tokens',
                      })
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
        <p className="text-xs text-[var(--muted)]">
          Upsell: MIT-AI Pro/Premium as add-on to Mahoney One + SOC for governance reports, risk analysis, and
          executive dashboards.
        </p>
      </section>

      {/* Consulting & Business Analysis */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
          Consulting &amp; Business Analysis
          <span
            className="inline-flex items-center justify-center"
            title="Consulting and business analysis services for strategy, governance and implementation support."
          >
            <Info className="w-4 h-4 text-[var(--muted)]" />
          </span>
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Day-rate services for senior consultants and business analysts supporting Mahoney Control deployments and
          governance programs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[var(--text)]">Consulting</h3>
              <span
                className="inline-flex items-center justify-center"
                title="Senior consulting for security strategy, governance, process design and implementation support."
              >
                <Info className="w-3 h-3 text-[var(--muted)]" />
              </span>
            </div>
            <p className="text-sm text-[var(--muted)]">
              Flat day rate: <span className="text-[var(--text)] font-medium">$1,500 per day</span>.
            </p>
            <HapticButton
              label="Add Consulting day"
              onClick={() =>
                addToCart({
                  id: 'consulting-day',
                  name: 'Consulting day',
                  description: '$1,500 per day',
                })
              }
            />
          </Card>

          <Card className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[var(--text)]">Business Analyst</h3>
              <span
                className="inline-flex items-center justify-center"
                title="Business analysis for requirements, process mapping, reporting design and stakeholder workshops."
              >
                <Info className="w-3 h-3 text-[var(--muted)]" />
              </span>
            </div>
            <p className="text-sm text-[var(--muted)]">
              Flat day rate: <span className="text-[var(--text)] font-medium">$2,300 per day</span>.
            </p>
            <HapticButton
              label="Add BA day"
              variant="surface"
              onClick={() =>
                addToCart({
                  id: 'business-analyst-day',
                  name: 'Business Analyst day',
                  description: '$2,300 per day',
                })
              }
            />
          </Card>
        </div>
      </section>

      {/* Helpdesk services */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
          Helpdesk Services
          <span
            className="inline-flex items-center justify-center"
            title="Helpdesk capacity that can be booked either by hour or as a per-device monthly service."
          >
            <Info className="w-4 h-4 text-[var(--muted)]" />
          </span>
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Additional helpdesk capacity that can be added on top of Mahoney One or the platform, either hourly or as a
          per-device subscription.
        </p>
        <Card className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Model</th>
                <th className="py-2 pr-4 text-left">Rate</th>
                <th className="py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">
                  <span className="inline-flex items-center gap-1">
                    Helpdesk hourly
                    <span
                      className="inline-flex items-center justify-center"
                      title="On-demand helpdesk support billed by the hour."
                    >
                      <Info className="w-3 h-3 text-[var(--muted)]" />
                    </span>
                  </span>
                </td>
                <td className="py-2 pr-4">$150 per hour</td>
                <td className="py-2 text-sm">
                  <HapticButton
                    label="Add hourly"
                    onClick={() =>
                      addToCart({
                        id: 'helpdesk-hourly',
                        name: 'Helpdesk – hourly',
                        description: '$150 per hour',
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">
                  <span className="inline-flex items-center gap-1">
                    Helpdesk per device
                    <span
                      className="inline-flex items-center justify-center"
                      title="Per-device helpdesk subscription, billed monthly."
                    >
                      <Info className="w-3 h-3 text-[var(--muted)]" />
                    </span>
                  </span>
                </td>
                <td className="py-2 pr-4">$35 per device / month</td>
                <td className="py-2 text-sm">
                  <HapticButton
                    label="Add per-device"
                    variant="surface"
                    onClick={() =>
                      addToCart({
                        id: 'helpdesk-per-device',
                        name: 'Helpdesk – per device',
                        description: '$35 per device / month',
                      })
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>

      {/* Recommended bundles / cross-sell paths */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)]">Recommended bundles (upsell / cross-sell)</h2>
        <ul className="space-y-2 text-sm text-[var(--text)]">
          <li>
            <span className="font-semibold">SMB / entry bundle:</span>{' '}
            Mahoney Control <span className="text-[var(--muted)]">(Essential)</span> + Mahoney One Essential +
            SOC Core Shield.
          </li>
          <li>
            <span className="font-semibold">Mid-market:</span>{' '}
            Mahoney Control Professional + Mahoney One Standard + SOC Advanced Guard + MIT-AI Insight/Intelligence.
          </li>
          <li>
            <span className="font-semibold">Enterprise / regulated:</span>{' '}
            Mahoney Control Enterprise + Mahoney One Elite + SOC Enterprise Threat Operations +
            MIT-AI Intelligence/Command + MDU volume tiers.
          </li>
          <li>
            <span className="font-semibold">Full platform (SOC + MIT-AI):</span>{' '}
            Mahoney Control Security OS (all-in-one) or Board-Level SOC for regulated / KRITIS.
          </li>
        </ul>
      </section>

      {/* Simple cart & checkout */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)]">Cart &amp; checkout</h2>
        <Card className="p-4 space-y-3">
          {cart.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">
              No items in cart yet. Use &quot;Add to cart&quot; on the services above.
            </p>
          ) : (
            <>
              <ul className="space-y-2 text-sm text-[var(--text)]">
                {cart.map((item, idx) => (
                  <li key={`${item.id}-${idx}`} className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    {item.description && (
                      <span className="text-xs text-[var(--muted)]">{item.description}</span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[var(--muted)]">
                This cart is for order requests. Final commercial terms will be confirmed by Mahoney.
              </p>
              <div className="flex flex-wrap gap-2">
                <HapticButton
                  label="Submit order request"
                  onClick={() => {
                    // In a real system, this would call an API or open a workflow.
                    clearCart()
                  }}
                />
                <HapticButton
                  label="Clear cart"
                  variant="surface"
                  onClick={clearCart}
                />
              </div>
            </>
          )}
        </Card>
      </section>
    </motion.div>
  )
}
