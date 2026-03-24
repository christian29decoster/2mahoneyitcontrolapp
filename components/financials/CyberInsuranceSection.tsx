'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import { cyberInsuranceDefaults } from '@/data/financials-mock'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { useLocaleStore } from '@/lib/locale.store'
import { financialsExtended } from '@/lib/financials-i18n'
import { HapticButton } from '@/components/HapticButton'
import { useHaptics } from '@/hooks/useHaptics'
import { generateInsuranceBrokerPdf } from '@/lib/financials-pdf'

type Props = { riskExposureUsd: number }

export function CyberInsuranceSection({ riskExposureUsd }: Props) {
  const formatCurrency = useFormatCurrency()
  const locale = useLocaleStore((s) => s.locale)
  const t = financialsExtended(locale)
  const h = useHaptics()
  const [premium, setPremium] = useState(cyberInsuranceDefaults.defaultPremiumUsd)
  const [reductionPct, setReductionPct] = useState(20)

  const coverageRatio = riskExposureUsd > 0 ? (premium / riskExposureUsd) * 100 : 0
  const estReduction = premium * (reductionPct / 100)
  const baseline = riskExposureUsd * 0.12

  const exportPdf = () => {
    h.impact('medium')
    generateInsuranceBrokerPdf({
      locale,
      premiumUsd: premium,
      riskExposureUsd,
      reductionPct,
      estimatedSavingsUsd: estReduction,
      coverageRatioPct: coverageRatio,
    })
  }

  return (
    <Card id="insurance" className="p-6 scroll-mt-24">
      <h2 className="text-lg font-semibold text-[var(--text)] mb-4">{t.insuranceTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[var(--muted)] block mb-1">
              {locale === 'de' ? 'Jährliche Cyber-Versicherungsprämie (USD)' : 'Annual cyber insurance premium (USD)'}
            </label>
            <input
              type="number"
              min={0}
              value={premium}
              onChange={(e) => setPremium(Math.max(0, +e.target.value || 0))}
              className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--text)]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--muted)] block mb-1">
              {locale === 'de' ? 'Geschätzte Prämienreduktion (Posture) %' : 'Estimated premium reduction (posture) %'}
            </label>
            <input
              type="range"
              min={cyberInsuranceDefaults.premiumReductionMinPct}
              max={cyberInsuranceDefaults.premiumReductionMaxPct}
              value={reductionPct}
              onChange={(e) => setReductionPct(+e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-[var(--muted)] mt-1">{reductionPct}%</p>
          </div>
        </div>
        <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50 p-4 text-sm">
          <p>
            <span className="text-[var(--muted)]">{locale === 'de' ? 'Risk Exposure (KPI)' : 'Risk exposure (KPI)'}: </span>
            <strong className="text-[var(--text)]">{formatCurrency(riskExposureUsd)}</strong>
          </p>
          <p>
            <span className="text-[var(--muted)]">{locale === 'de' ? 'Deckungsquote (Prämie / Exposure)' : 'Coverage ratio (premium / exposure)'}: </span>
            <strong className="text-[var(--text)]">{coverageRatio.toFixed(2)}%</strong>
          </p>
          <p>
            <span className="text-[var(--muted)]">{locale === 'de' ? 'Geschätzte jährliche Einsparung' : 'Estimated annual savings'}: </span>
            <strong className="text-emerald-400">{formatCurrency(estReduction)}</strong>
          </p>
          <p className="text-xs text-[var(--muted)]">
            {locale === 'de' ? 'Unprotected baseline (illustrativ)' : 'Unprotected baseline (illustrative)'}: ~{formatCurrency(baseline)}{' '}
            / yr
          </p>
        </div>
      </div>
      <HapticButton label={t.brokerPdf} variant="surface" onClick={exportPdf} className="mt-4" />
    </Card>
  )
}
