'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, X, Lock } from 'lucide-react'
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
import { stagger, fadeUp } from '@/lib/ui/motion'

type Session = { role: string | null; partnerId: string | null; partnerTier?: string; partnerName?: string }

/** Ausziehbar wie Marketplace: Klick öffnet Popover mit psychologischen Argumenten. */
function InfoIconWithPopover({
  bullets,
  fullContent,
  title,
  size = 'default',
}: {
  title: string
  bullets: string[]
  fullContent: React.ReactNode
  size?: 'default' | 'sm'
}) {
  const [hover, setHover] = useState(false)
  const [open, setOpen] = useState(false)
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
  const tooltipClass = 'absolute z-30 left-full ml-1.5 top-1/2 -translate-y-1/2 w-[min(320px,90vw)] max-h-[min(280px,60vh)] overflow-y-auto py-3 px-4 rounded-xl bg-[var(--surface-elev)] border border-[var(--border)] shadow-lg text-left pointer-events-none'
  return (
    <>
      <span
        className="relative inline-flex items-center justify-center cursor-help"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={(e) => { e.stopPropagation(); setOpen(true) }}
        role="button"
        tabIndex={0}
        aria-label={`Info: ${title}`}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true) } }}
      >
        <Info className={`${iconSize} text-[var(--muted)] hover:text-[var(--primary)] transition-colors`} />
        {hover && (
          <div className={tooltipClass}>
            <div className="text-xs font-semibold text-[var(--text)] mb-2 pr-2">{title}</div>
            <ul className="text-xs text-[var(--muted)] space-y-1 list-disc list-inside pr-1">
              {bullets.map((b, i) => (
                <li key={i} className="leading-snug">{b}</li>
              ))}
            </ul>
            <span className="text-[10px] text-[var(--primary)] mt-2 block">Klick für Details</span>
          </div>
        )}
      </span>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md max-h-[85vh] overflow-auto rounded-2xl bg-[var(--surface-elev)] border border-[var(--border)] shadow-xl p-5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
                <button type="button" onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-[var(--surface-2)] text-[var(--muted)]" aria-label="Schließen">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-sm text-[var(--text)] space-y-2">{fullContent}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

/** Vorteile pro MIT-AI-Plan für psychologische Argumentation. */
const MITAI_PLAN_BENEFITS: Record<string, { short: string; bullets: string[]; fullTitle: string }> = {
  Insight: {
    short: 'Einstieg, kurze Auswertungen, Basis-Co-Pilot.',
    bullets: ['Geringer Einstiegspreis – Kunde testet AI ohne großes Risiko.', 'Ideal für erste Use Cases und Proof of Concept.', 'Deine Marge pro Kunde bei minimalem Verkaufsaufwand.'],
    fullTitle: 'MIT-AI Insight – Warum verkaufen?',
  },
  Intelligence: {
    short: 'Co-Pilot, Analysen, Empfehlungen, Governance-Reports.',
    bullets: ['Der meistverkaufte Plan: Co-Pilot im Alltag.', 'Starke Argumentation: weniger manuelle Arbeit, bessere Entscheidungen.', 'Wiederkehrende Umsätze – Kunde bindet sich an die Plattform.'],
    fullTitle: 'MIT-AI Intelligence – Partner-Vorteile',
  },
  Command: {
    short: 'Komplexe Analysen, großer Kontext, Executive-Dashboards.',
    bullets: ['Premium-Marge bei Enterprise-Kunden.', 'Positionierung als strategischer Partner, nicht nur Reseller.', 'Hoher Deckungsbeitrag pro Vertrag bei vergleichsweise geringem Support.'],
    fullTitle: 'MIT-AI Command – Maximale Marge',
  },
}

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
    <motion.div className="max-w-4xl mx-auto py-8 px-4 space-y-10" variants={stagger} initial="initial" animate="animate">
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-[var(--text)]">Partner-Preise &amp; Margen</h1>
        {session?.partnerName && <p className="text-sm text-[var(--muted)] mt-0.5">Partner: {session.partnerName}</p>}
        {myTierId && (
          <p className="text-sm font-medium text-[var(--primary)] mt-1">Dein Tier: {PARTNER_TIERS[myTierId].label} ({tableDiscountPct} % Rabatt)</p>
        )}
        <p className="text-sm text-[var(--muted)] mt-1">
          Vertraulich – nur für Partner. Du verkaufst immer zum Listenpreis; dein Gewinn ist die Differenz zum Einkaufspreis. Direktverkauf von Mahoney = Listenpreis; Partner dürfen Endkunden optional bis max. {MAX_PARTNER_CUSTOMER_DISCOUNT_PCT} % Rabatt geben.
        </p>
      </motion.div>

      {/* Partner Tiers */}
      <motion.section className="space-y-3" variants={fadeUp}>
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
      </motion.section>

      {/* Platform – List vs Dein Einkauf (nach Tier) */}
      <motion.section className="space-y-3" variants={fadeUp}>
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
      </motion.section>

      {/* SOC – lower margins */}
      <motion.section className="space-y-3" variants={fadeUp}>
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
      </motion.section>

      {/* MIT-AI – 40 % (ausziehbar wie Marketplace, mit psychologischen Vorteilen) */}
      <motion.section className="space-y-3" variants={fadeUp}>
        <h2 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
          MIT-AI – 40 % Partner-Marge
          <InfoIconWithPopover
            title="Warum 40 % Marge bei MIT-AI?"
            bullets={[
              'Software skaliert ohne hohe Betriebskosten – deine Marge bleibt sicher.',
              'Wiederkehrende Umsätze bei minimalen Grenzkosten für Mahoney.',
              'Attraktiver Einstieg für Kunden (Insight) → Upsell zu Intelligence und Command.',
              'Du positionierst dich als AI-Partner, nicht nur Reseller.',
            ]}
            fullContent={
              <>
                <p>Bei MIT-AI handelt es sich um Software: Sie skaliert praktisch ohne zusätzliche Betriebskosten. Deshalb können wir Partnern eine großzügige Marge von 40 % einräumen.</p>
                <p className="mt-2">Vorteile für dich: Wiederkehrende Umsätze pro Kunde, klare Preisargumentation (Listenpreis vs. dein Einkauf), und die Möglichkeit, Kunden schrittweise von Insight über Intelligence bis Command zu begleiten – mit steigender Marge pro Vertrag.</p>
              </>
            }
          />
        </h2>
        <p className="text-sm text-[var(--muted)]">
          Software skaliert ohne hohe Betriebskosten – großzügigere Marge.
        </p>
        <Card className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Plan</th>
                <th className="py-2 pr-4 text-left">Vorteile / Einsatz</th>
                <th className="py-2 pr-4 text-right">Listenpreis</th>
                <th className="py-2 text-right">Partner-Einkauf</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              {Object.entries(MITAI_LIST_PRICES).map(([name, listPrice]) => {
                const benefit = MITAI_PLAN_BENEFITS[name]
                return (
                  <tr key={name} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-2 pr-4 font-medium align-top">
                      <span className="inline-flex items-center gap-1">
                        {name}
                        {benefit && (
                          <InfoIconWithPopover title={benefit.fullTitle} bullets={benefit.bullets} fullContent={<ul className="list-disc list-inside space-y-1">{benefit.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>} size="sm" />
                        )}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-[var(--muted)] align-top max-w-[240px]">{benefit?.short ?? '—'}</td>
                    <td className="py-2 pr-4 text-right align-top">{formatUsd(listPrice)} / Monat</td>
                    <td className="py-2 text-right align-top">{formatUsd(mitaiPartnerCost(listPrice))} / Monat</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      </motion.section>

      {/* Bundles */}
      <motion.section className="space-y-3" variants={fadeUp}>
        <h2 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
          Bundle-Preise für Partner
          <InfoIconWithPopover
            title="Warum Bundles verkaufen?"
            bullets={[
              'Höhere Marge pro Deal – ein Bundle statt viele Einzelpositionen.',
              'Kunde bekommt sofort Mehrwert (Platform + SOC + AI) – weniger Verhandlungsaufwand.',
              'Dein MRR (Differenz) ist sofort sichtbar und motiviert zum Abschluss.',
            ]}
            fullContent={
              <>
                <p>Partner sollen Bundles verkaufen, nicht nur Module. Pro Deal verdienst du die Differenz zwischen Listenpreis und deinem Einkauf – bei Bundles ist diese Differenz (dein MRR) besonders attraktiv und reduziert den Verkaufsaufwand pro Position.</p>
              </>
            }
          />
        </h2>
        <p className="text-sm text-[var(--muted)]">Partner sollen Bundles verkaufen – höhere Marge pro Deal.</p>
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
      </motion.section>

      {/* Volume bonus */}
      <motion.section className="space-y-3" variants={fadeUp}>
        <h2 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
          Volume Bonus (ARR)
          <InfoIconWithPopover
            title="Warum Volume Bonus?"
            bullets={[
              'Wachstumsanreiz: Je höher dein ARR, desto mehr Bonus-Marge.',
              'Motivation für langfristige Partnerschaft und mehr Kunden.',
              'Transparente Stufen – du weißt, was du bei $100k, $500k, $1M ARR erreichst.',
            ]}
            fullContent={<p>Top-Partner erwarten Anreize zum Skalieren. Mit dem Volume Bonus erhältst du zusätzliche Marge auf dein Jahresumsatz-Volumen – so lohnt sich Wachstum für beide Seiten.</p>}
          />
        </h2>
        <p className="text-sm text-[var(--muted)]">Mehr ARR = mehr Bonus-Marge. Klare Stufen für Planbarkeit.</p>
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
      </motion.section>

      {/* Onboarding Fee */}
      <motion.section className="space-y-3" variants={fadeUp}>
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
      </motion.section>

      {/* Revenue Share */}
      <motion.section className="space-y-3" variants={fadeUp}>
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
      </motion.section>

      <motion.p className="text-xs text-[var(--muted)] border-t border-[var(--border)] pt-6" variants={fadeUp}>
        Strategie: Partner als Security Infrastructure Partner positionieren – verkaufen Mahoney Control Platform, SOC, MIT-AI und Compliance. Direktverkauf von Mahoney = immer Listenpreis; du darfst nie günstiger verkaufen als dein Partner.
      </motion.p>
    </motion.div>
  )
}
