'use client'

import { useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import {
  defaultBudgetMatrix,
  budgetCategoryLabels,
  defaultTotalItBudgetUsd,
  type BudgetCategory,
  type BudgetScenario,
} from '@/data/financials-mock'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { useLocaleStore } from '@/lib/locale.store'
import { financialsExtended } from '@/lib/financials-i18n'
import { HapticButton } from '@/components/HapticButton'
import { useHaptics } from '@/hooks/useHaptics'
import { exportBudgetExcel, exportBudgetPdf } from '@/lib/financials-pdf'

const categories = Object.keys(budgetCategoryLabels) as BudgetCategory[]
const scenarios: BudgetScenario[] = ['status_quo', 'optimized', 'expanded']

export function BudgetForecastSection({ riskExposureUsd }: { riskExposureUsd: number }) {
  const formatCurrency = useFormatCurrency()
  const locale = useLocaleStore((s) => s.locale)
  const t = financialsExtended(locale)
  const h = useHaptics()
  const [matrix, setMatrix] = useState(() => JSON.parse(JSON.stringify(defaultBudgetMatrix)) as typeof defaultBudgetMatrix)
  const [itBudget, setItBudget] = useState(defaultTotalItBudgetUsd)

  const totals = useMemo(() => {
    const out: Record<BudgetScenario, number> = {
      status_quo: 0,
      optimized: 0,
      expanded: 0,
    }
    scenarios.forEach((s) => {
      out[s] = categories.reduce((sum, c) => sum + matrix[s][c], 0)
    })
    return out
  }, [matrix])

  const riskReduction = (total: number) => Math.min(45, Math.max(5, (total / Math.max(itBudget, 1)) * 30))

  const setCell = (scenario: BudgetScenario, cat: BudgetCategory, val: number) => {
    setMatrix((m) => ({
      ...m,
      [scenario]: { ...m[scenario], [cat]: Math.max(0, val) },
    }))
  }

  return (
    <Card id="budget" className="p-6 scroll-mt-24">
      <h2 className="text-lg font-semibold text-[var(--text)] mb-4">{t.budgetTitle}</h2>
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <label className="text-xs text-[var(--muted)] block mb-1">
            {locale === 'de' ? 'Gesamt-IT-Budget (USD, p.a.)' : 'Total IT budget (USD, annual)'}
          </label>
          <input
            type="number"
            value={itBudget}
            onChange={(e) => setItBudget(Math.max(1, +e.target.value || 0))}
            className="rounded-lg bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-sm w-40"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-[var(--muted)] border-b border-[var(--border)]">
              <th className="pb-2 pr-2">{locale === 'de' ? 'Kategorie' : 'Category'}</th>
              <th className="pb-2 pr-2">{locale === 'de' ? 'Status quo' : 'Status quo'}</th>
              <th className="pb-2 pr-2">{locale === 'de' ? 'Optimiert' : 'Optimized'}</th>
              <th className="pb-2 pr-2">{locale === 'de' ? 'Erweitert' : 'Expanded'}</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat} className="border-b border-[var(--border)]">
                <td className="py-2 pr-2 font-medium text-[var(--text)]">{budgetCategoryLabels[cat]}</td>
                {scenarios.map((s) => (
                  <td key={s} className="py-2 pr-2">
                    <input
                      type="number"
                      className="w-full min-w-[7rem] rounded bg-[var(--surface-2)] border border-[var(--border)] px-2 py-1 text-xs"
                      value={matrix[s][cat]}
                      onChange={(e) => setCell(s, cat, +e.target.value || 0)}
                    />
                  </td>
                ))}
              </tr>
            ))}
            <tr className="font-semibold bg-[var(--surface-2)]/60">
              <td className="py-2 pr-2">{locale === 'de' ? 'Summe' : 'Total'}</td>
              {scenarios.map((s) => (
                <td key={s} className="py-2 pr-2">
                  {formatCurrency(totals[s])}
                  <span className="block text-[10px] text-[var(--muted)] font-normal">
                    {((totals[s] / itBudget) * 100).toFixed(1)}% {locale === 'de' ? 'vom IT-Budget' : 'of IT budget'}
                  </span>
                  <span className="block text-[10px] text-emerald-400/90">
                    ~{riskReduction(totals[s]).toFixed(0)}% {locale === 'de' ? 'Risk-Reduktion (illustrativ)' : 'risk reduction (illustr.)'}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[var(--muted)] mt-3">
        {locale === 'de' ? 'Risk Exposure Referenz' : 'Risk exposure reference'}: {formatCurrency(riskExposureUsd)}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">
        <HapticButton
          label={t.exportXlsx}
          variant="surface"
          onClick={() => {
            h.impact('light')
            exportBudgetExcel(matrix, locale)
          }}
        />
        <HapticButton
          label={t.exportPdf}
          variant="surface"
          onClick={() => {
            h.impact('light')
            exportBudgetPdf(matrix, totals, itBudget, locale)
          }}
        />
      </div>
    </Card>
  )
}
