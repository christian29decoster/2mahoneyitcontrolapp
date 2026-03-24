'use client'

import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import { partnerClientPnLMock } from '@/data/financials-mock'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { useLocaleStore } from '@/lib/locale.store'
import { financialsExtended } from '@/lib/financials-i18n'

function marginClass(pct: number) {
  if (pct > 30) return 'text-emerald-400'
  if (pct >= 15) return 'text-amber-400'
  return 'text-red-400'
}

function statusLabel(locale: string, s: string) {
  if (locale === 'de') {
    if (s === 'healthy') return 'Gesund'
    if (s === 'at_risk') return 'Risiko'
    return 'Unterversorgt'
  }
  if (s === 'healthy') return 'Healthy'
  if (s === 'at_risk') return 'At risk'
  return 'Underserved'
}

export function PartnerPnLSection() {
  const formatCurrency = useFormatCurrency()
  const locale = useLocaleStore((s) => s.locale)
  const t = financialsExtended(locale)
  const router = useRouter()

  const totals = partnerClientPnLMock.reduce(
    (a, r) => ({
      mrr: a.mrr + r.mrrUsd,
      cost: a.cost + r.serviceCostUsd + r.incidentCost30dUsd,
    }),
    { mrr: 0, cost: 0 }
  )
  const blendedMargin = totals.mrr > 0 ? ((totals.mrr - totals.cost) / totals.mrr) * 100 : 0

  return (
    <Card id="partner-pnl" className="p-6 scroll-mt-24">
      <h2 className="text-lg font-semibold text-[var(--text)] mb-4">{t.partnerPnlTitle}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="text-left text-[var(--muted)] border-b border-[var(--border)]">
              <th className="pb-2 pr-3">{locale === 'de' ? 'Kunde' : 'Client'}</th>
              <th className="pb-2 pr-3 text-right">MRR</th>
              <th className="pb-2 pr-3 text-right">{locale === 'de' ? 'Servicekosten' : 'Service cost'}</th>
              <th className="pb-2 pr-3 text-right">{locale === 'de' ? 'Vorfälle 30d' : 'Incidents 30d'}</th>
              <th className="pb-2 pr-3 text-right">Auto %</th>
              <th className="pb-2 pr-3 text-right">Margin %</th>
              <th className="pb-2 pr-3">{locale === 'de' ? 'Status' : 'Status'}</th>
            </tr>
          </thead>
          <tbody>
            {partnerClientPnLMock.map((row) => (
              <tr
                key={row.tenantId}
                className="border-b border-[var(--border)] hover:bg-[var(--surface-2)]/50 cursor-pointer"
                onClick={() => router.push(`/financials?tenant=${encodeURIComponent(row.tenantId)}`)}
              >
                <td className="py-2 pr-3 font-medium text-[var(--text)]">{row.clientName}</td>
                <td className="py-2 pr-3 text-right">{formatCurrency(row.mrrUsd)}</td>
                <td className="py-2 pr-3 text-right">{formatCurrency(row.serviceCostUsd)}</td>
                <td className="py-2 pr-3 text-right">{formatCurrency(row.incidentCost30dUsd)}</td>
                <td className="py-2 pr-3 text-right">{row.automationLevelPct}%</td>
                <td className={`py-2 pr-3 text-right font-semibold ${marginClass(row.marginPct)}`}>{row.marginPct}%</td>
                <td className="py-2 pr-3 text-[var(--muted)]">{statusLabel(locale, row.status)}</td>
              </tr>
            ))}
            <tr className="bg-[var(--surface-2)]/80 font-semibold">
              <td className="py-3 pr-3">{locale === 'de' ? 'Gesamt' : 'Total'}</td>
              <td className="py-3 pr-3 text-right">{formatCurrency(totals.mrr)}</td>
              <td className="py-3 pr-3 text-right" colSpan={2}>
                {locale === 'de' ? 'Kosten gesamt' : 'Total cost'}: {formatCurrency(totals.cost)}
              </td>
              <td className="py-3 pr-3 text-right" colSpan={2}>
                {locale === 'de' ? 'Blended margin' : 'Blended margin'}:{' '}
                <span className={marginClass(blendedMargin)}>{blendedMargin.toFixed(1)}%</span>
              </td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  )
}
