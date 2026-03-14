'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/Card'
import {
  PARTNER_TIERS,
  PLATFORM_LIST_PRICES,
  platformPartnerCost,
  SOC_LIST_PRICES,
  SOC_PARTNER_MARGIN_PCT,
  socPartnerCost,
  MITAI_LIST_PRICES,
  mitaiPartnerCost,
  PARTNER_BUNDLES,
  VOLUME_BONUS,
  PARTNER_ONBOARDING_FEE,
  PARTNER_ONBOARDING_INCLUDES,
  REVENUE_SHARE_MODELS,
  MAX_PARTNER_CUSTOMER_DISCOUNT_PCT,
  type PartnerTierId,
} from '@/lib/partner-pricing'
import { Lock } from 'lucide-react'

type Session = { role: string | null; partnerId: string | null; partnerTier?: string; partnerName?: string }

const ALLOWED_ROLES = ['partner', 'admin', 'superadmin']

function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function PartnerPricingPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/demo/me')
      .then((r) => r.json())
      .then((d: Session) => setSession(d))
      .catch(() => setSession({ role: null, partnerId: null }))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-6">
        <p className="text-sm text-[var(--muted)]">Loading…</p>
      </div>
    )
  }

  const canSee = session?.role && ALLOWED_ROLES.includes(session.role)

  if (!canSee) {
    return (
      <div className="max-w-lg mx-auto py-12 px-4 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] mb-4">
          <Lock className="w-7 h-7 text-[var(--muted)]" />
        </div>
        <h1 className="text-xl font-semibold text-[var(--text)] mb-2">Partner-Preise</h1>
        <p className="text-sm text-[var(--muted)]">
          Der Zugriff auf Partner-Preise und Margen ist nur für eingeloggte Partner (und Admins) sichtbar. So bleibt der Marktpreis stabil und Partner verkaufen immer zum offiziellen Listenpreis.
        </p>
        <p className="text-xs text-[var(--muted)] mt-4">
          Bitte als Partner einloggen oder im Admin einen Partner-Account anlegen.
        </p>
      </div>
    )
  }

  const tierIds: PartnerTierId[] = ['authorized', 'advanced', 'elite']
  const myTierId = (session?.partnerTier && tierIds.includes(session.partnerTier as PartnerTierId)) ? (session.partnerTier as PartnerTierId) : null
  const myDiscountPct = myTierId ? PARTNER_TIERS[myTierId].discountPct : PARTNER_TIERS.elite.discountPct
  const tableDiscountPct = myTierId ? PARTNER_TIERS[myTierId].discountPct : PARTNER_TIERS.elite.discountPct

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Partner-Preise &amp; Margen</h1>
        {session?.partnerName && <p className="text-sm text-[var(--muted)] mt-0.5">Partner: {session.partnerName}</p>}
        {myTierId && (
          <p className="text-sm font-medium text-[var(--primary)] mt-1">Dein Tier: {PARTNER_TIERS[myTierId].label} ({tableDiscountPct} % Rabatt)</p>
        )}
        <p className="text-sm text-[var(--muted)] mt-1">
          Vertraulich – nur für Partner. Du verkaufst immer zum Listenpreis; dein Gewinn ist die Differenz zum Einkaufspreis. Direktverkauf von Mahoney = Listenpreis; Partner dürfen Endkunden optional bis max. {MAX_PARTNER_CUSTOMER_DISCOUNT_PCT} % Rabatt geben.
        </p>
      </div>

      {/* Partner Tiers */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)]">Partner-Stufen</h2>
        <Card className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Tier</th>
                <th className="py-2 pr-4 text-left">Rabatt / Marge</th>
                <th className="py-2 text-left">Voraussetzungen</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              {tierIds.map((id) => (
                <tr key={id} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2 pr-4 font-medium">{PARTNER_TIERS[id].label}</td>
                  <td className="py-2 pr-4">{PARTNER_TIERS[id].discountPct} %</td>
                  <td className="py-2">{PARTNER_TIERS[id].requirements}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      {/* Platform – List vs Dein Einkauf (nach Tier) */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)]">
          Plattform {myTierId ? `(Dein Einkauf: ${PARTNER_TIERS[myTierId].label})` : '(Beispiel: Elite Partner)'}
        </h2>
        <p className="text-xs text-[var(--muted)]">Listenpreis = was der Endkunde zahlt. Dein Einkauf = Listenpreis minus Tier-Rabatt.</p>
        <Card className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Tier</th>
                <th className="py-2 pr-4 text-right">Listenpreis (net)</th>
                <th className="py-2 text-right">{myTierId ? 'Dein Einkauf' : 'Elite-Partner Einkauf'}</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">Essential</td>
                <td className="py-2 pr-4 text-right">{formatUsd(PLATFORM_LIST_PRICES.essential)}</td>
                <td className="py-2 text-right">{formatUsd(platformPartnerCost(PLATFORM_LIST_PRICES.essential, myDiscountPct))}</td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">Professional</td>
                <td className="py-2 pr-4 text-right">{formatUsd(PLATFORM_LIST_PRICES.professional)}</td>
                <td className="py-2 text-right">{formatUsd(platformPartnerCost(PLATFORM_LIST_PRICES.professional, myDiscountPct))}</td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">Enterprise</td>
                <td className="py-2 pr-4 text-right">{formatUsd(PLATFORM_LIST_PRICES.enterprise)}</td>
                <td className="py-2 text-right">{formatUsd(platformPartnerCost(PLATFORM_LIST_PRICES.enterprise, myDiscountPct))}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">Security OS</td>
                <td className="py-2 pr-4 text-right">{formatUsd(PLATFORM_LIST_PRICES.securityOs)}</td>
                <td className="py-2 text-right">{formatUsd(platformPartnerCost(PLATFORM_LIST_PRICES.securityOs, myDiscountPct))}</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </section>

      {/* SOC – lower margins */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)]">SOC – Partner-Marge (operativer Service)</h2>
        <p className="text-xs text-[var(--muted)]">SOC hat geringere Margen (Analysten, Infrastruktur, SIEM).</p>
        <Card className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Tier</th>
                <th className="py-2 pr-4 text-right">Listenpreis</th>
                <th className="py-2 pr-4 text-right">Partner-Marge</th>
                <th className="py-2 text-right">Partner-Einkauf</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              {Object.entries(SOC_LIST_PRICES).map(([name, listPrice]) => {
                const margin = SOC_PARTNER_MARGIN_PCT[name] ?? 20
                return (
                  <tr key={name} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-2 pr-4 font-medium">{name}</td>
                    <td className="py-2 pr-4 text-right">{formatUsd(listPrice)}</td>
                    <td className="py-2 pr-4 text-right">{margin} %</td>
                    <td className="py-2 text-right">{formatUsd(socPartnerCost(listPrice, margin))}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      </section>

      {/* MIT-AI – 40% */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)]">MIT-AI – 40 % Partner-Marge</h2>
        <p className="text-xs text-[var(--muted)]">Software skaliert ohne hohe Betriebskosten – großzügigere Marge.</p>
        <Card className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Plan</th>
                <th className="py-2 pr-4 text-right">Listenpreis</th>
                <th className="py-2 text-right">Partner-Einkauf</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              {Object.entries(MITAI_LIST_PRICES).map(([name, listPrice]) => (
                <tr key={name} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2 pr-4 font-medium">{name}</td>
                  <td className="py-2 pr-4 text-right">{formatUsd(listPrice)} / Monat</td>
                  <td className="py-2 text-right">{formatUsd(mitaiPartnerCost(listPrice))} / Monat</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      {/* Bundles */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)]">Bundle-Preise für Partner</h2>
        <p className="text-xs text-[var(--muted)]">Partner sollen Bundles verkaufen – höhere Marge pro Deal.</p>
        <Card className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Bundle</th>
                <th className="py-2 pr-4 text-right">Listenpreis</th>
                <th className="py-2 pr-4 text-right">Partner-Einkauf</th>
                <th className="py-2 text-right">Dein MRR (Differenz)</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              {PARTNER_BUNDLES.map((b) => (
                <tr key={b.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2 pr-4 font-medium">{b.name}</td>
                  <td className="py-2 pr-4 text-right">{formatUsd(b.listPrice)}</td>
                  <td className="py-2 pr-4 text-right">{formatUsd(b.partnerCost)}</td>
                  <td className="py-2 text-right font-medium text-[var(--primary)]">{formatUsd(b.partnerMrr)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      {/* Volume bonus */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)]">Volume Bonus (ARR)</h2>
        <Card className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">ARR Volumen</th>
                <th className="py-2 text-right">Bonus-Marge</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              {VOLUME_BONUS.map((v) => (
                <tr key={v.arrUsd} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2 pr-4">{formatUsd(v.arrUsd)} ARR</td>
                  <td className="py-2 text-right">+{v.bonusMarginPct} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      {/* Onboarding Fee */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)]">Partner Onboarding Fee (einmalig)</h2>
        <p className="text-xs text-[var(--muted)]">Eintritt ins Programm – dafür erhält der Partner Training, Demo, Material.</p>
        <Card className="p-4 space-y-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Partner Level</th>
                <th className="py-2 text-right">Fee</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              {tierIds.map((id) => (
                <tr key={id} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2 pr-4 font-medium">{PARTNER_TIERS[id].label}</td>
                  <td className="py-2 text-right">{formatUsd(PARTNER_ONBOARDING_FEE[id])}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="text-xs text-[var(--muted)] list-disc list-inside space-y-1">
            {PARTNER_ONBOARDING_INCLUDES.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Revenue Share */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)]">Revenue Share (Recurring)</h2>
        <Card className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Modell</th>
                <th className="py-2 pr-4 text-left">Beschreibung</th>
                <th className="py-2 text-right">Partner-Anteil</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              {REVENUE_SHARE_MODELS.map((m) => (
                <tr key={m.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-2 pr-4 font-medium">{m.label}</td>
                  <td className="py-2 pr-4 text-sm text-[var(--muted)]">{m.description}</td>
                  <td className="py-2 text-right">{m.partnerSharePct} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <p className="text-xs text-[var(--muted)] border-t border-[var(--border)] pt-6">
        Strategie: Partner als Security Infrastructure Partner positionieren – verkaufen Mahoney Control Platform, SOC, MIT-AI und Compliance. Direktverkauf von Mahoney = immer Listenpreis; du darfst nie günstiger verkaufen als dein Partner.
      </p>
    </div>
  )
}
