'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, ArrowRight, Check, Star } from 'lucide-react'
import { Card } from '@/components/Card'
import { HapticButton } from '@/components/HapticButton'
import { Sheet } from '@/components/Sheets'
import { Toast, ToastType } from '@/components/Toasts'
import TierDetailsSheet from '@/components/marketplace/TierDetailsSheet'
import CheckoutSummary from '@/components/marketplace/CheckoutSummary'
import { stagger } from '@/lib/ui/motion'
import { useHaptics } from '@/hooks/useHaptics'
import { useActivityStore } from '@/lib/activity.store'
import {
  marketplaceCategories,
  marketplaceBundles,
  type MarketplaceTier,
  type MarketplaceBundle,
} from '@/lib/marketplace-pricing'
import { MDU_TIERS, computeMduCost } from '@/lib/mdu-pricing'
import { Database } from 'lucide-react'

type SelectedItem = { type: 'tier'; tier: MarketplaceTier; categoryName: string } | { type: 'bundle'; bundle: MarketplaceBundle }

export default function MarketplacePage() {
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [checkoutItems, setCheckoutItems] = useState<Array<{ name: string; monthlyUSD: number; proratedUSD: number; qty: number; unit?: string; unitPriceUSD?: number }>>([])
  const [checkoutStep, setCheckoutStep] = useState(0)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; title: string; message?: string }>>([])
  const h = useHaptics()
  const addActivity = useActivityStore((s) => s.addActivity)

  const addToast = (type: ToastType, title: string, message?: string) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, type, title, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  const handleTierClick = (tier: MarketplaceTier, categoryName: string) => {
    h.impact('light')
    setSelectedItem({ type: 'tier', tier, categoryName })
    setIsDetailsOpen(true)
  }

  const handleBundleClick = (bundle: MarketplaceBundle) => {
    h.impact('light')
    setSelectedItem({ type: 'bundle', bundle })
    setIsDetailsOpen(true)
  }

  const handleAdd = (payload: { qty: number; monthlyUSD: number; proratedUSD: number }) => {
    h.impact('medium')
    const name = selectedItem?.type === 'tier' ? selectedItem.tier.name : selectedItem?.type === 'bundle' ? selectedItem.bundle.name : ''
    addActivity({ type: 'added', title: 'Service in cart', message: name })
    setCheckoutItems((prev) => [
      ...prev,
      {
        name,
        qty: payload.qty,
        monthlyUSD: payload.monthlyUSD,
        proratedUSD: payload.proratedUSD,
      },
    ])
    setSelectedItem(null)
    setIsDetailsOpen(false)
    setIsCheckoutOpen(true)
    setCheckoutStep(0)
  }

  const handleScheduleCall = () => {
    h.impact('medium')
    addToast('success', 'Strategy Call Requested', 'Our team will contact you to schedule.')
    setSelectedItem(null)
    setIsDetailsOpen(false)
  }

  const handleRequestQuote = () => {
    addToast('success', 'Quote Requested', 'Our team will contact you within 24 hours.')
    setSelectedItem(null)
    setIsDetailsOpen(false)
  }

  const handleCheckoutNext = () => {
    h.impact('light')
    if (checkoutStep < 2) setCheckoutStep((s) => s + 1)
    else {
      h.success()
      addActivity({ type: 'changed', title: 'Order submitted', message: 'Activation by team' })
      addToast('success', 'Request Submitted', 'Our team will activate this shortly.')
      setIsCheckoutOpen(false)
      setCheckoutStep(0)
    }
  }

  const handleCheckoutBack = () => {
    h.impact('light')
    if (checkoutStep > 0) setCheckoutStep((s) => s - 1)
    else setIsCheckoutOpen(false)
  }

  const checkoutSteps = [
    {
      title: 'Summary',
      content: (
        <div className="space-y-4">
          <CheckoutSummary lines={checkoutItems.map((l) => ({ ...l, unit: (l as any).unit || 'flat', unitPriceUSD: (l as any).unitPriceUSD ?? l.monthlyUSD }))} />
          <p className="text-sm text-[var(--muted)]">Services will be added to your plan and billed accordingly.</p>
        </div>
      ),
    },
    {
      title: 'Billing',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">Card Number</label>
            <input type="text" placeholder="•••• •••• •••• ••••" className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[16px] text-[var(--text)] placeholder-[var(--muted)]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">Expiry</label>
              <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[16px] text-[var(--text)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">CVC</label>
              <input type="text" placeholder="123" className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[16px] text-[var(--text)]" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Review & Confirm',
      content: (
        <div className="space-y-4">
          <div className="bg-[var(--surface)]/50 rounded-[16px] p-4">
            <h3 className="font-semibold text-[var(--text)] mb-2">Order Summary</h3>
            <div className="space-y-2 text-sm">
              {checkoutItems.map((line, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-[var(--muted)]">{line.name}</span>
                  <span className="text-[var(--primary)] font-medium">${line.monthlyUSD.toLocaleString()}/mo</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-[var(--muted)]">By confirming, you agree to add these services to your plan.</p>
        </div>
      ),
    },
  ]

  const sheetItem = selectedItem
    ? selectedItem.type === 'bundle'
      ? { ...selectedItem.bundle, bundle: true as const }
      : selectedItem.tier
    : null

  return (
    <>
      <motion.div className="space-y-8" variants={stagger} initial="initial" animate="animate">
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold text-[var(--text)]">Marketplace</h1>
          <p className="text-[var(--muted)]">Enterprise risk platform – high-anchor pricing, tier contrast, CFO-friendly</p>
        </div>

        {/* Events & Data (MDU) – transparent pricing table */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="text-lg font-semibold text-[var(--text)]">Events & Data (MDU) – Transparent pricing</h2>
          </div>
          <p className="text-sm text-[var(--muted)]">
            Layer 3 data processing is billed by event volume per month. RMM and EDR alert counts are for visibility only and do not affect MDU cost.
          </p>
          <Card className="p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--muted)] border-b border-[var(--border)]">
                  <th className="pb-2 pr-4">Tier</th>
                  <th className="pb-2 pr-4">Events / month</th>
                  <th className="pb-2 pr-4">Price per 1,000 events</th>
                  <th className="pb-2">Example monthly cost</th>
                </tr>
              </thead>
              <tbody className="text-[var(--text)]">
                {MDU_TIERS.map((tier, i) => {
                  const prevUpTo = i === 0 ? 0 : MDU_TIERS[i - 1].upTo
                  const rangeLabel = tier.upTo === Infinity ? '200M+' : `${prevUpTo === 0 ? '0' : (prevUpTo / 1_000_000).toFixed(0) + 'M'} – ${(tier.upTo / 1_000_000).toFixed(0)}M`
                  const exampleEvents = [500_000, 10_000_000, 100_000_000, 250_000_000][i] ?? 500_000
                  const example = computeMduCost(exampleEvents)
                  return (
                    <tr key={tier.label} className="border-b border-[var(--border)] last:border-0">
                      <td className="py-3 pr-4 font-medium">{tier.label}</td>
                      <td className="py-3 pr-4">{rangeLabel}</td>
                      <td className="py-3 pr-4">{tier.perThousandUsd === 0 ? 'Included' : `$${tier.perThousandUsd.toFixed(2)}`}</td>
                      <td className="py-3">
                        {tier.perThousandUsd === 0 ? '$0 (included)' : `$${example.costUsd.toFixed(2)}/mo for ${(exampleEvents / 1_000_000).toFixed(0)}M events`}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
          <div className="rounded-xl bg-[var(--surface-2)]/50 border border-[var(--border)] p-4">
            <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-2">Quick examples</p>
            <ul className="text-sm text-[var(--text)] space-y-1">
              <li>500k events/mo → <strong>$0</strong> (within 0–1M included)</li>
              <li>2M events/mo → <strong>${computeMduCost(2_000_000).costUsd.toFixed(2)}/mo</strong></li>
              <li>50M events/mo → <strong>${computeMduCost(50_000_000).costUsd.toFixed(2)}/mo</strong></li>
            </ul>
          </div>
        </section>

        {marketplaceCategories.map((category) => (
          <section key={category.id} className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text)]">{category.name}</h2>
              {category.description && <p className="text-sm text-[var(--muted)]">{category.description}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.tiers.map((tier) => (
                <Card
                  key={tier.id}
                  onClick={() => handleTierClick(tier, category.name)}
                  className={`cursor-pointer hover:bg-[var(--surface-elev)]/80 transition-colors relative ${tier.mostPopular ? 'ring-2 ring-[var(--primary)]/50' : ''}`}
                >
                  {tier.mostPopular && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-[var(--primary)]/15 px-2 py-0.5 text-xs font-medium text-[var(--primary)]">
                      <Star size={12} />
                      Most Popular
                    </div>
                  )}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-[var(--text)] mb-1 pr-20">{tier.name}</h3>
                      <div className="flex flex-wrap items-baseline gap-1">
                        {tier.priceAnnualDisplay && (
                          <span className="text-sm font-medium text-[var(--primary)]">{tier.priceAnnualDisplay}</span>
                        )}
                        <span className="text-sm text-[var(--muted)]">
                          {tier.priceAnnualDisplay ? `≈ ${tier.priceMonthlyDisplay}` : tier.priceMonthlyDisplay}
                        </span>
                      </div>
                      {tier.minimumDisplay && <p className="text-[10px] text-[var(--muted)] mt-0.5">{tier.minimumDisplay}</p>}
                    </div>
                    {tier.recommendedFor && <p className="text-[10px] text-[var(--muted)]">Recommended for: {tier.recommendedFor}</p>}
                    <ul className="space-y-1">
                      {tier.bullets.slice(0, 3).map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-[var(--muted)]">
                          <Check className="w-3 h-3 text-[var(--success)] mt-0.5 shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ))}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--text)]">Strategic Bundles</h2>
          <p className="text-sm text-[var(--muted)]">Anchor stacking – enterprise value and contract size</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketplaceBundles.map((bundle) => (
              <Card
                key={bundle.id}
                onClick={() => handleBundleClick(bundle)}
                className={`cursor-pointer hover:bg-[var(--surface-elev)]/80 transition-colors relative ${bundle.mostPopular ? 'ring-2 ring-[var(--primary)]/50' : ''}`}
              >
                {bundle.mostPopular && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-[var(--primary)]/15 px-2 py-0.5 text-xs font-medium text-[var(--primary)]">
                    <Star size={12} />
                    Most Popular
                  </div>
                )}
                <div className="space-y-3">
                  <h3 className="font-semibold text-[var(--text)] pr-24">{bundle.name}</h3>
                  <p className="text-[var(--primary)] font-medium">{bundle.priceMonthlyDisplay}</p>
                  {bundle.recommendedFor && <p className="text-[10px] text-[var(--muted)]">Recommended for: {bundle.recommendedFor}</p>}
                  <ul className="space-y-1">
                    {bundle.bullets.slice(0, 4).map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-[var(--muted)]">
                        <Check className="w-3 h-3 text-[var(--success)] mt-0.5 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </motion.div>

      {sheetItem && (
        <TierDetailsSheet
          item={sheetItem}
          categoryName={selectedItem?.type === 'tier' ? selectedItem.categoryName : undefined}
          billing={{
            periodStartISO: new Date().toISOString(),
            periodEndISO: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          }}
          isOpen={isDetailsOpen}
          onClose={() => { setIsDetailsOpen(false); setSelectedItem(null) }}
          onAdd={handleAdd}
          onRequestQuote={handleRequestQuote}
          onScheduleCall={handleScheduleCall}
        />
      )}

      <Sheet
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title={`Checkout – ${checkoutSteps[checkoutStep]?.title}`}
        maxHeight="90vh"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            {checkoutSteps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= checkoutStep ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface)] text-[var(--muted)]'
                  }`}
                >
                  {index < checkoutStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                {index < checkoutSteps.length - 1 && <div className={`w-12 h-0.5 mx-2 ${index < checkoutStep ? 'bg-[var(--primary)]' : 'bg-[var(--surface)]'}`} />}
              </div>
            ))}
          </div>
          <div>{checkoutSteps[checkoutStep]?.content}</div>
          <div className="flex gap-3 pt-4">
            <HapticButton label="Back" variant="surface" onClick={handleCheckoutBack} className="flex-1" />
            <HapticButton label={checkoutStep === 2 ? 'Confirm' : 'Next'} onClick={handleCheckoutNext} className="flex-1" />
          </div>
        </div>
      </Sheet>

      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} />
          </div>
        ))}
      </div>
    </>
  )
}
