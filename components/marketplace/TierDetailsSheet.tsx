'use client'

import { useState, useMemo } from 'react'
import { Sheet } from '../Sheets'
import { HapticButton } from '../HapticButton'
import { Badge } from '../Badge'
import { useHaptics } from '@/hooks/useHaptics'
import { prorate } from '@/lib/pricing'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { CheckCircle } from 'lucide-react'
import type { MarketplaceTier, MarketplaceBundle } from '@/lib/marketplace-pricing'

type TierOrBundle = (MarketplaceTier & { bundle?: boolean }) | (MarketplaceBundle & { bundle: true })

interface TierDetailsSheetProps {
  item: TierOrBundle
  categoryName?: string
  billing: { periodStartISO: string; periodEndISO: string }
  isOpen: boolean
  onClose: () => void
  onAdd?: (payload: { qty: number; monthlyUSD: number; proratedUSD: number }) => void
  onRequestQuote?: () => void
  onScheduleCall?: () => void
}

function isBundle(item: TierOrBundle): item is MarketplaceBundle & { bundle: true } {
  return 'bundle' in item && item.bundle === true
}

export default function TierDetailsSheet({
  item,
  categoryName,
  billing,
  isOpen,
  onClose,
  onAdd,
  onRequestQuote,
  onScheduleCall,
}: TierDetailsSheetProps) {
  const tier = item as MarketplaceTier
  const [qty, setQty] = useState(
    tier.unit === 'gb' ? 500 : tier.unit === 'user' || tier.unit === 'device' ? 50 : 1
  )
  const h = useHaptics()
  const formatCurrency = useFormatCurrency()

  const monthlyUSD = useMemo(() => {
    if (isBundle(item)) return item.priceMonthlyUSD
    const t = tier as MarketplaceTier
    if (t.unit && t.unitPriceUSD != null && t.unitPriceUSD > 0) {
      if (t.unit === 'gb') return Math.max(t.minimumMonthlyUSD ?? 0, t.unitPriceUSD * qty)
      return Math.max(t.minimumMonthlyUSD ?? 0, t.unitPriceUSD * qty)
    }
    return t.priceMonthlyUSD
  }, [tier, item, qty])

  const proratedUSD = useMemo(
    () => prorate(monthlyUSD, billing.periodStartISO, billing.periodEndISO),
    [monthlyUSD, billing]
  )

  const showQuantity = !isBundle(item) && tier.unit && tier.unit !== 'flat' && tier.unit !== 'hour'
  const scheduleStrategyCall = !isBundle(item) ? tier.scheduleStrategyCall : (item as MarketplaceBundle).scheduleStrategyCall

  const handleAdd = () => {
    h.success()
    onAdd?.({ qty: showQuantity ? qty : 1, monthlyUSD, proratedUSD })
    onClose()
  }

  const handleScheduleCall = () => {
    h.impact('medium')
    onScheduleCall?.()
    onClose()
  }

  const priceDisplay = isBundle(item)
    ? item.priceMonthlyDisplay
    : tier.priceAnnualDisplay
      ? `${tier.priceAnnualDisplay}${tier.billedAnnually ? ' (jährlich)' : ''}`
      : tier.priceMonthlyDisplay

  const hasPrice = monthlyUSD > 0

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title={item.name} maxHeight="90vh">
      <div className="space-y-6">
        {categoryName && (
          <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">{categoryName}</p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-lg font-semibold text-[var(--primary)]">{priceDisplay}</span>
          {hasPrice && !isBundle(tier) && tier.priceAnnualDisplay && (
            <span className="text-sm text-[var(--muted)]">≈ {tier.priceMonthlyDisplay}</span>
          )}
          {hasPrice && (tier as MarketplaceTier).minimumDisplay && (
            <Badge variant="secondary" className="text-xs">
              {(tier as MarketplaceTier).minimumDisplay}
            </Badge>
          )}
        </div>

        {(tier.recommendedFor || item.recommendedFor) && (
          <p className="text-sm text-[var(--muted)]">
            <strong className="text-[var(--text)]">Empfohlen für:</strong> {tier.recommendedFor || (item as MarketplaceBundle).recommendedFor}
          </p>
        )}

        <div className="space-y-2">
          {(tier.bullets || (item as MarketplaceBundle).bullets).map((bullet, index) => (
            <div key={index} className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-[var(--success)] mt-0.5 flex-shrink-0" />
              <span className="text-sm text-[var(--text)]">{bullet}</span>
            </div>
          ))}
        </div>

        {hasPrice && showQuantity && tier.unit && tier.unitPriceUSD != null && tier.unitPriceUSD > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text)]">Quantity ({tier.unit})</label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => {
                h.impact('light')
                setQty(Math.max(1, +(e.target.value || 0)))
              }}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text)]"
            />
          </div>
        )}

        {hasPrice && (
          <div className="bg-[var(--surface)]/50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted)]">Monatlich</span>
              <span className="font-medium text-[var(--text)]">{formatCurrency(monthlyUSD)}</span>
            </div>
            <div className="flex justify-between text-xs text-[var(--muted)]">
              <span>Prorata (erste Periode)</span>
              <span>{formatCurrency(proratedUSD)}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {scheduleStrategyCall ? (
            <HapticButton
              label="Strategie-Call vereinbaren"
              onClick={handleScheduleCall}
              className="w-full"
            />
          ) : hasPrice ? (
            <>
              <HapticButton
                label="Zum Plan hinzufügen"
                onClick={handleAdd}
                className="w-full"
              />
              <HapticButton
                label="Anfrage stellen"
                onClick={() => { h.impact('light'); onRequestQuote?.(); onClose(); }}
                variant="surface"
                className="w-full"
              />
            </>
          ) : (
            <HapticButton
              label="Anfrage stellen"
              onClick={() => { h.impact('light'); onRequestQuote?.(); onClose(); }}
              className="w-full"
            />
          )}
        </div>
      </div>
    </Sheet>
  )
}
