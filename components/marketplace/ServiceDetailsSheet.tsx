'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Sheet } from '../Sheets'
import { HapticButton } from '../HapticButton'
import { Badge } from '../Badge'
import { useHaptics } from '@/hooks/useHaptics'
import { monthlyAddonUSD, prorate, formatCurrency } from '@/lib/pricing'
import { CheckCircle, Info } from 'lucide-react'

interface ServiceDetailsSheetProps {
  service: {
    key: string
    name: string
    unit: 'gb' | 'seat' | 'device' | 'flat'
    unitPriceUSD: number
    description?: string
    bullets?: string[]
  }
  billing: {
    periodStartISO: string
    periodEndISO: string
  }
  isOpen: boolean
  onClose: () => void
  onAdd: (payload: { qty: number; monthlyUSD: number; proratedUSD: number }) => void
}

export default function ServiceDetailsSheet({ 
  service, 
  billing, 
  isOpen, 
  onClose, 
  onAdd 
}: ServiceDetailsSheetProps) {
  const [qty, setQty] = useState<number>(service.unit === 'flat' ? 1 : (service.unit === 'gb' ? 100 : 1))
  const h = useHaptics()

  const monthlyUSD = useMemo(() => 
    monthlyAddonUSD(service.unit, service.unitPriceUSD, qty), 
    [service, qty]
  )
  
  const proratedUSD = useMemo(() => 
    prorate(monthlyUSD, billing.periodStartISO, billing.periodEndISO), 
    [monthlyUSD, billing]
  )

  const handleAdd = () => {
    h.success()
    onAdd({ qty, monthlyUSD, proratedUSD })
    onClose()
  }

  const getQuantityHint = () => {
    switch (service.unit) {
      case 'gb': return 'Tip: start with 100 GB; you can adjust anytime.'
      case 'seat': return 'Tip: add seats as your team grows.'
      case 'device': return 'Tip: add devices as you expand infrastructure.'
      default: return ''
    }
  }

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title={service.name}
      maxHeight="90vh"
    >
      <div className="space-y-6">
        {/* Service Info */}
        <div className="space-y-3">
          {service.description && (
            <p className="text-sm text-[var(--muted)]">{service.description}</p>
          )}
          
          {service.bullets?.length && (
            <div className="space-y-2">
              {service.bullets.map((bullet, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-[var(--success)] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[var(--text)]">{bullet}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quantity Selector */}
        {service.unit !== 'flat' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--text)]">Quantity</label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-[var(--muted)] uppercase">{service.unit}</span>
                <Badge variant="secondary" className="text-xs">
                  {formatCurrency(service.unitPriceUSD)}/{service.unit}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="number"
                min={0}
                step={service.unit === 'gb' ? 10 : 1}
                value={qty}
                onChange={(e) => {
                  h.impact('light')
                  setQty(Math.max(0, Number(e.target.value) || 0))
                }}
                className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-[12px] px-3 py-2 text-sm text-[var(--text)]"
              />
              <span className="text-xs text-[var(--muted)] uppercase w-8">{service.unit}</span>
            </div>
            
            {getQuantityHint() && (
              <div className="flex items-start space-x-2 p-2 bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-[8px]">
                <Info className="w-3 h-3 text-[var(--primary)] mt-0.5 flex-shrink-0" />
                <span className="text-xs text-[var(--muted)]">{getQuantityHint()}</span>
              </div>
            )}
          </div>
        )}

        {/* Totals */}
        <div className="bg-[var(--surface)]/50 rounded-[16px] p-4 space-y-3">
          <h3 className="font-medium text-[var(--text)]">Cost Summary</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Monthly Cost</span>
              <span className="font-medium text-[var(--text)]">{formatCurrency(monthlyUSD)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Prorated (until period end)</span>
              <span className="text-[var(--muted)]">{formatCurrency(proratedUSD)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <HapticButton
            label="Add to Plan"
            onClick={handleAdd}
            disabled={service.unit !== 'flat' && qty === 0}
            className="flex-1"
          />
          <HapticButton
            label="Request Quote"
            onClick={handleAdd}
            variant="surface"
            className="flex-1"
          />
        </div>
      </div>
    </Sheet>
  )
}
