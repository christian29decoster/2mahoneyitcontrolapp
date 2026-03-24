'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import {
  benchmarkProfiles,
  BENCHMARK_METHODOLOGY,
  type BenchmarkProfileId,
} from '@/data/financials-mock'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { useLocaleStore } from '@/lib/locale.store'
import { financialsExtended } from '@/lib/financials-i18n'
import { HelpCircle } from 'lucide-react'

const metricLabels: Record<string, { en: string; de: string }> = {
  costPerIncident: { en: 'Cost per incident', de: 'Kosten pro Vorfall' },
  securitySpendPerUser: { en: 'Security spend / user', de: 'Security-Ausgaben / User' },
  mttrHours: { en: 'MTTR (hours)', de: 'MTTR (Stunden)' },
  automationSavingsPct: { en: 'Automation savings %', de: 'Automatisierung %' },
}

function deltaColor(metricKey: string, client: number, median: number): 'good' | 'bad' | 'neutral' {
  if (metricKey === 'automationSavingsPct') {
    return client >= median ? 'good' : 'bad'
  }
  // lower is better for cost and MTTR
  return client <= median ? 'good' : 'bad'
}

export function BenchmarkSection() {
  const formatCurrency = useFormatCurrency()
  const locale = useLocaleStore((s) => s.locale)
  const t = financialsExtended(locale)
  const [profile, setProfile] = useState<BenchmarkProfileId>('mid')
  const rows = benchmarkProfiles[profile].rows

  const fmtVal = (metricKey: string, v: number) => {
    if (metricKey === 'mttrHours') return `${v.toFixed(1)} h`
    if (metricKey === 'automationSavingsPct') return `${v}%`
    return formatCurrency(v)
  }

  return (
    <Card id="benchmark" className="p-6 scroll-mt-24">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text)]">{t.benchmarkTitle}</h2>
          <p className="text-xs text-[var(--muted)] mt-1 max-w-2xl">
            {locale === 'de' ? 'Vergleich zu Branchenmedian (illustrativ).' : 'Comparison to industry median (illustrative).'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-[var(--muted)]">{locale === 'de' ? 'Profil' : 'Profile'}</label>
          <select
            value={profile}
            onChange={(e) => setProfile(e.target.value as BenchmarkProfileId)}
            className="rounded-lg bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--text)]"
          >
            {(Object.keys(benchmarkProfiles) as BenchmarkProfileId[]).map((id) => (
              <option key={id} value={id}>
                {benchmarkProfiles[id].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-[var(--muted)] mb-4 flex items-start gap-2">
        <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-[var(--primary)]" />
        <span>{benchmarkProfiles[profile].description}</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {rows.map((row) => {
          const deltaPct = row.industryMedian !== 0 ? ((row.clientValue - row.industryMedian) / row.industryMedian) * 100 : 0
          const tone = deltaColor(row.metricKey, row.clientValue, row.industryMedian)
          return (
            <div
              key={row.metricKey}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/80 p-4"
            >
              <p className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-wide mb-2">
                {metricLabels[row.metricKey]?.[locale === 'de' ? 'de' : 'en'] ?? row.metricKey}
              </p>
              <p className="text-xs text-[var(--muted)]">{locale === 'de' ? 'Ihr Wert' : 'Your value'}</p>
              <p className="text-lg font-semibold text-[var(--text)]">{fmtVal(row.metricKey, row.clientValue)}</p>
              <p className="text-xs text-[var(--muted)] mt-2">{locale === 'de' ? 'Median' : 'Industry median'}</p>
              <p className="text-sm text-[var(--text)]">{fmtVal(row.metricKey, row.industryMedian)}</p>
              <p
                className={`text-sm font-medium mt-2 ${
                  tone === 'good' ? 'text-emerald-500' : tone === 'bad' ? 'text-red-400' : 'text-[var(--muted)]'
                }`}
              >
                Δ {deltaPct >= 0 ? '+' : ''}
                {deltaPct.toFixed(1)}%
              </p>
            </div>
          )
        })}
      </div>

      <p className="text-[10px] text-[var(--muted)] mt-4 border-t border-[var(--border)] pt-3">{BENCHMARK_METHODOLOGY}</p>
    </Card>
  )
}
