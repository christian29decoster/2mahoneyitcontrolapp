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
      ? 'absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 min-w-[200px] max-w-[280px] py-2 px-3 rounded-xl bg-[var(--surface-elev)] border border-[var(--border)] shadow-lg text-left pointer-events-none z-30'
      : 'absolute z-30 left-full ml-1.5 top-1/2 -translate-y-1/2 min-w-[200px] max-w-[280px] py-2 px-3 rounded-xl bg-[var(--surface-elev)] border border-[var(--border)] shadow-lg text-left pointer-events-none'
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
            <div className="text-xs font-semibold text-[var(--text)] mb-1.5">{title}</div>
            <ul className="text-xs text-[var(--muted)] space-y-0.5 list-disc list-inside">
              {bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            <span className="text-[10px] text-[var(--primary)] mt-1 block">Click for full details</span>
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
          Multi-tenant governance platform for devices, incidents, risk and financials. Pricing as per MIT-AI price
          list.
        </p>
        <Card className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Tier</th>
                <th className="py-2 pr-4 text-left">Monthly price (gross)</th>
                <th className="py-2 text-left">Included</th>
                <th className="py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">
                  <span className="inline-flex items-center gap-1">
                    Starter
                    <InfoIconWithPopover
                      size="sm"
                      tooltipPosition="bottom"
                      title="Starter – included"
                      bullets={[
                        'Up to 25 users or devices',
                        '1M events included per month',
                        'Standard support (email, portal)',
                        'Dashboard, devices, incidents, governance',
                        'Billing and basic reporting',
                      ]}
                      fullContent={
                        <>
                          <p>
                            <strong>Starter</strong> ($499/month gross) is the entry tier for small teams and first
                            steps with the Control Platform.
                          </p>
                          <ul className="list-disc list-inside mt-2 space-y-1 text-[var(--muted)]">
                            <li>Up to 25 users or devices (whichever is lower)</li>
                            <li>1M events per month included (MDU); beyond that, volume pricing applies</li>
                            <li>Standard support: email and portal; response per SLA</li>
                            <li>Full access to dashboard, device and staff management, incidents, governance views, and billing</li>
                            <li>Basic reporting; no advanced analytics or dedicated success manager</li>
                          </ul>
                        </>
                      }
                    />
                  </span>
                </td>
                <td className="py-2 pr-4">$499</td>
                <td className="py-2 text-sm">
                  Up to 25 users/devices, 1M events included, standard support.
                </td>
                <td className="py-2 text-sm">
                  <HapticButton
                    label="Add to cart"
                    onClick={() =>
                      addToCart({
                        id: 'platform-starter',
                        name: 'Mahoney Control Platform – Starter',
                        description: '$499 / month',
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
                        'Higher user/device limits',
                        'Priority support',
                        'Advanced reports and analytics',
                        'All Starter features included',
                      ]}
                      fullContent={
                        <>
                          <p>
                            <strong>Professional</strong> ($1,499/month gross) is for growing teams that need higher
                            limits and priority support.
                          </p>
                          <ul className="list-disc list-inside mt-2 space-y-1 text-[var(--muted)]">
                            <li>Higher limits on users and devices (exact caps per agreement)</li>
                            <li>Priority support: faster response and escalation path</li>
                            <li>Advanced reports and analytics; customizable dashboards</li>
                            <li>All Starter features included; optional add-ons (e.g. Mahoney Grow, MIT-AI) available</li>
                          </ul>
                        </>
                      }
                    />
                  </span>
                </td>
                <td className="py-2 pr-4">$1,499</td>
                <td className="py-2 text-sm">
                  Higher limits, priority support, advanced reports.
                </td>
                <td className="py-2 text-sm">
                  <HapticButton
                    label="Add to cart"
                    onClick={() =>
                      addToCart({
                        id: 'platform-professional',
                        name: 'Mahoney Control Platform – Professional',
                        description: '$1,499 / month',
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">
                  <span className="inline-flex items-center gap-1">
                    Enterprise
                    <InfoIconWithPopover
                      size="sm"
                      tooltipPosition="bottom"
                      title="Enterprise – included"
                      bullets={[
                        'Full usage and custom limits',
                        'SLA-backed service',
                        'Dedicated support and success manager',
                        'Custom integrations and onboarding',
                      ]}
                      fullContent={
                        <>
                          <p>
                            <strong>Enterprise</strong> (custom pricing, typically from $2,500/month) is for larger
                            or regulated organizations that need full usage and dedicated support.
                          </p>
                          <ul className="list-disc list-inside mt-2 space-y-1 text-[var(--muted)]">
                            <li>Full usage; custom limits on users, devices and events</li>
                            <li>SLA-backed availability and response times</li>
                            <li>Dedicated support and optional success manager</li>
                            <li>Custom integrations, onboarding and training; optional on-prem or hybrid</li>
                          </ul>
                        </>
                      }
                    />
                  </span>
                </td>
                <td className="py-2 pr-4">Custom (from $2,500)</td>
                <td className="py-2 text-sm">
                  Full usage, SLA, dedicated support.
                </td>
                <td className="py-2 text-sm">
                  <HapticButton
                    label="Request quote"
                    variant="surface"
                    onClick={() =>
                      addToCart({
                        id: 'platform-enterprise',
                        name: 'Mahoney Control Platform – Enterprise',
                        description: 'Custom pricing – from $2,500 / month',
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
            title="SOC tiers from Core Monitoring up to Enterprise Threat Operations, aligned with the SOC section of the price list."
          >
            <Info className="w-4 h-4 text-[var(--muted)]" />
          </span>
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Security Operations Center as a Service. Pricing per MIT-AI price list ($).
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
                    Core Monitoring
                    <span
                      className="inline-flex items-center justify-center"
                      title="Baseline 24/7 monitoring with alert triage and monthly reporting."
                    >
                      <Info className="w-3 h-3 text-[var(--muted)]" />
                    </span>
                  </span>
                </td>
                <td className="py-2 text-sm">
                  $85 per user / month (minimum $3,000 / month)
                </td>
                <td className="py-2 text-sm">
                  <HapticButton
                    label="Add to cart"
                    onClick={() =>
                      addToCart({
                        id: 'soc-core',
                        name: 'SOC – Core Monitoring',
                        description: '$85 / user / month (min. $3,000)',
                      })
                    }
                  />
                </td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">
                  <span className="inline-flex items-center gap-1">
                    Advanced SOC
                    <span
                      className="inline-flex items-center justify-center"
                      title="24/7 monitoring with incident prioritization, threat intelligence and compliance-aligned reporting."
                    >
                      <Info className="w-3 h-3 text-[var(--muted)]" />
                    </span>
                  </span>
                </td>
                <td className="py-2 text-sm">
                  $135 per user / month (minimum $7,500 / month)
                </td>
                <td className="py-2 text-sm">
                  <HapticButton
                    label="Add to cart"
                    onClick={() =>
                      addToCart({
                        id: 'soc-advanced',
                        name: 'SOC – Advanced',
                        description: '$135 / user / month (min. $7,500)',
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">
                  <span className="inline-flex items-center gap-1">
                    Enterprise Threat Operations
                    <span
                      className="inline-flex items-center justify-center"
                      title="Dedicated SOC pod, advanced threat hunting, war-room support and executive reporting for regulated/enterprise customers."
                    >
                      <Info className="w-3 h-3 text-[var(--muted)]" />
                    </span>
                  </span>
                </td>
                <td className="py-2 text-sm">from $45,000 / month</td>
                <td className="py-2 text-sm">
                  <HapticButton
                    label="Request quote"
                    variant="surface"
                    onClick={() =>
                      addToCart({
                        id: 'soc-enterprise',
                        name: 'SOC – Enterprise Threat Operations',
                        description: 'from $45,000 / month',
                      })
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
        <p className="text-xs text-[var(--muted)]">
          Upsell: Core → Advanced as incident/compliance volume increases; Enterprise as anchor offer for regulated /
          KRITIS-like customers.
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
            Mahoney Control <span className="text-[var(--muted)]">(Starter)</span> + Mahoney One Essential +
            SOC Core Monitoring.
          </li>
          <li>
            <span className="font-semibold">Mid-market:</span>{' '}
            Mahoney Control Professional + Mahoney One Standard + SOC Advanced + MIT-AI Standard/Pro.
          </li>
          <li>
            <span className="font-semibold">Enterprise / regulated:</span>{' '}
            Mahoney Control Enterprise + Mahoney One Elite + SOC Enterprise Threat Operations +
            MIT-AI Pro/Premium + MDU volume tiers.
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
