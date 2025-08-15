'use client'

import { formatCurrency } from '@/lib/pricing'

type Line = {
  name: string
  unit: 'gb' | 'seat' | 'device' | 'flat'
  qty: number
  unitPriceUSD: number
  monthlyUSD: number
  proratedUSD: number
}

interface CheckoutSummaryProps {
  lines: Line[]
}

export default function CheckoutSummary({ lines }: CheckoutSummaryProps) {
  const monthly = lines.reduce((sum, line) => sum + line.monthlyUSD, 0)
  const prorate = lines.reduce((sum, line) => sum + line.proratedUSD, 0)

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-[var(--text)]">Order Summary</h3>
      
      <div className="rounded-[16px] border border-[var(--border)] p-4 bg-[var(--surface)]/50">
        {lines.map((line, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div className="flex-1">
              <div className="text-sm font-medium text-[var(--text)]">{line.name}</div>
              <div className="text-xs text-[var(--muted)]">
                {line.qty} {line.unit} × {formatCurrency(line.unitPriceUSD)}
              </div>
            </div>
            <div className="text-sm font-medium text-[var(--text)]">
              {formatCurrency(line.monthlyUSD)}
            </div>
          </div>
        ))}
        
        <div className="mt-4 pt-3 border-t border-[var(--border)] space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-[var(--text)]">Monthly Total</span>
            <span className="text-sm font-bold text-[var(--text)]">{formatCurrency(monthly)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-[var(--muted)]">Prorated (first invoice)</span>
            <span className="text-xs text-[var(--muted)]">{formatCurrency(prorate)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
