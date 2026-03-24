'use client'

import { useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import {
  complianceFrameworksMock,
  computeComplianceTotals,
  governanceOpenFindingsByFramework,
  type ComplianceFrameworkId,
} from '@/data/financials-mock'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { useLocaleStore } from '@/lib/locale.store'
import { financialsExtended } from '@/lib/financials-i18n'

type Props = { riskExposureUsd: number }

export function ComplianceSection({ riskExposureUsd }: Props) {
  const formatCurrency = useFormatCurrency()
  const locale = useLocaleStore((s) => s.locale)
  const t = financialsExtended(locale)
  const [selected, setSelected] = useState<Set<ComplianceFrameworkId>>(
    () => new Set<ComplianceFrameworkId>(['soc2', 'iso27001'])
  )

  const toggle = (id: ComplianceFrameworkId) => {
    setSelected((prev) => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  const totals = useMemo(() => {
    const t = computeComplianceTotals(selected)
    return { ...t, investment: t.investment + t.monthly }
  }, [selected])

  const gap = totals.exposure - totals.investment

  return (
    <Card id="compliance" className="p-6 scroll-mt-24">
      <h2 className="text-lg font-semibold text-[var(--text)] mb-1">{t.complianceTitle}</h2>
      <p className="text-xs text-[var(--muted)] mb-4">
        {locale === 'de'
          ? 'Frameworks wählen — Kosten und Risikoexposition (Demo).'
          : 'Select frameworks — costs and fine exposure (demo).'}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {complianceFrameworksMock.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => toggle(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              selected.has(f.id)
                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                : 'bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--text)]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--muted)] border-b border-[var(--border)]">
              <th className="pb-2 pr-4">{locale === 'de' ? 'Framework' : 'Framework'}</th>
              <th className="pb-2 pr-4">{locale === 'de' ? 'Audit (p.a.)' : 'Audit (annual)'}</th>
              <th className="pb-2 pr-4">{locale === 'de' ? 'Remediation (geschätzt)' : 'Remediation (est.)'}</th>
              <th className="pb-2 pr-4">{locale === 'de' ? 'Betrieb / Monat' : 'Maintenance / mo'}</th>
              <th className="pb-2 pr-4">{locale === 'de' ? 'Max. Bußgeld (expos.)' : 'Max fine exposure'}</th>
            </tr>
          </thead>
          <tbody>
            {complianceFrameworksMock.filter((f) => selected.has(f.id)).map((f) => {
              const findings = governanceOpenFindingsByFramework[f.id] ?? 0
              const rem = f.remediationEstimateUsd * (findings > 0 ? 0.1 + findings * 0.05 : 0.05)
              return (
                <tr key={f.id} className="border-b border-[var(--border)]">
                  <td className="py-2 pr-4 font-medium text-[var(--text)]">{f.label}</td>
                  <td className="py-2 pr-4">{formatCurrency(f.auditCostAnnualUsd)}</td>
                  <td className="py-2 pr-4">{formatCurrency(rem)}</td>
                  <td className="py-2 pr-4">{formatCurrency(f.maintenanceMonthlyUsd)}</td>
                  <td className="py-2 pr-4">{f.maxFineExposureUsd > 0 ? formatCurrency(f.maxFineExposureUsd) : '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-[var(--muted)]">{locale === 'de' ? 'Gesamtexposition (Compliance)' : 'Total compliance exposure (est.)'}</p>
          <p className="text-xl font-semibold text-[var(--text)]">{formatCurrency(totals.exposure)}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--muted)]">{locale === 'de' ? 'Aktuelle Investition (laufend)' : 'Current compliance investment'}</p>
          <p className="text-xl font-semibold text-[var(--text)]">{formatCurrency(totals.investment * 12)}</p>
          <p className="text-[10px] text-[var(--muted)]">{locale === 'de' ? 'annualisiert' : 'annualized'}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--muted)]">{locale === 'de' ? 'Gap' : 'Gap'}</p>
          <p className={`text-xl font-semibold ${gap > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
            {gap > 0 ? '+' : ''}
            {formatCurrency(gap)}
          </p>
          <p className="text-[10px] text-[var(--muted)]">
            {locale === 'de' ? 'vs. Risk KPI' : 'Risk KPI'}: {formatCurrency(riskExposureUsd)}
          </p>
        </div>
      </div>
    </Card>
  )
}
