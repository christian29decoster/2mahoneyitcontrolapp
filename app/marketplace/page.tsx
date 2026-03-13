'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { stagger } from '@/lib/ui/motion'
import { Card } from '@/components/Card'
import { HapticButton } from '@/components/HapticButton'

type CartItem = {
  id: string
  name: string
  description?: string
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
          <span
            className="inline-flex items-center justify-center"
            title="Multi-tenant governance platform including dashboard, devices & staff, incidents, governance views, billing and optional Mahoney Grow."
          >
            <Info className="w-4 h-4 text-[var(--muted)]" />
          </span>
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
                    <span
                      className="inline-flex items-center justify-center"
                      title="Up to 25 users/devices, 1M events included, standard support."
                    >
                      <Info className="w-3 h-3 text-[var(--muted)]" />
                    </span>
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
                    <span
                      className="inline-flex items-center justify-center"
                      title="Higher limits, priority support, advanced reports."
                    >
                      <Info className="w-3 h-3 text-[var(--muted)]" />
                    </span>
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
                    <span
                      className="inline-flex items-center justify-center"
                      title="Full usage, SLA-backed service and dedicated support for larger organizations."
                    >
                      <Info className="w-3 h-3 text-[var(--muted)]" />
                    </span>
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
