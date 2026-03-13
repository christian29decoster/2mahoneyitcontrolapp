'use client'

import { motion } from 'framer-motion'
import { stagger } from '@/lib/ui/motion'

export default function MarketplacePage() {
  return (
    <motion.div className="space-y-8" variants={stagger} initial="initial" animate="animate">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold text-[var(--text)]">Marktplatz</h1>
        <p className="text-[var(--muted)]">
          Übersicht der Mahoney Services. Preise können je nach Region und Angebot variieren.
        </p>
      </div>

      {/* Mahoney One – Service-Pakete */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)]">Mahoney One – Service</h2>
        <p className="text-sm text-[var(--muted)]">
          Vollservice für Kunden mit oder ohne eigene IT. Mahoney One bündelt Plattform, Betrieb und Security.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-4 space-y-2">
            <h3 className="font-semibold text-[var(--text)]">Mahoney One USA</h3>
            <p className="text-xs text-[var(--muted)]">Gerätebasierte Preise (USD pro Device / Monat).</p>
            <table className="w-full text-xs text-left mt-2">
              <thead>
                <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                  <th className="py-1 pr-2">Stufe</th>
                  <th className="py-1">Preis</th>
                </tr>
              </thead>
              <tbody className="text-[var(--text)]">
                <tr className="border-b border-[var(--border)]">
                  <td className="py-1 pr-2 font-medium">Essential</td>
                  <td className="py-1">$99 pro Device</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-1 pr-2 font-medium">Prime</td>
                  <td className="py-1">$175 pro Device</td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 font-medium">Elite</td>
                  <td className="py-1">$199 pro Device</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-[var(--muted)] mt-2">
              Upsell: von Essential &rarr; Prime &rarr; Elite je nach Sicherheits- und Governance-Anforderungen.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-4 space-y-2">
            <h3 className="font-semibold text-[var(--text)]">Mahoney One – mit eigener IT beim Kunden</h3>
            <p className="text-xs text-[var(--muted)]">Gerätebasierte Preise (USD pro Device / Monat).</p>
            <table className="w-full text-xs text-left mt-2">
              <thead>
                <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                  <th className="py-1 pr-2">Stufe</th>
                  <th className="py-1">Preis</th>
                </tr>
              </thead>
              <tbody className="text-[var(--text)]">
                <tr className="border-b border-[var(--border)]">
                  <td className="py-1 pr-2 font-medium">Essential</td>
                  <td className="py-1">$35 pro Device</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-1 pr-2 font-medium">Standard (\"Extra Standard\")</td>
                  <td className="py-1">$65 pro Device</td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 font-medium">Elite</td>
                  <td className="py-1">$95 pro Device</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-[var(--muted)] mt-2">
              Upsell: Von Essential &rarr; Standard bei wachsender Kritikalität, von Standard &rarr; Elite bei
              KRITIS / NIS-2 / 24x7-Anforderungen.
            </p>
          </div>
        </div>
      </section>

      {/* Plattform – Mahoney Control App */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)]">Mahoney Control Plattform</h2>
        <p className="text-sm text-[var(--muted)]">
          Mehrmandanten-Plattform für Governance, Incidents, Devices und Risk. Preise laut Preisliste MIT-AI.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Stufe</th>
                <th className="py-2 pr-4 text-left">Monatspreis (brutto)</th>
                <th className="py-2 text-left">Enthalten</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">Starter</td>
                <td className="py-2 pr-4">299–499 €</td>
                <td className="py-2 text-sm">
                  Bis 25 User/Geräte, 1M Events inklusive, Standard-Support.
                </td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">Professional</td>
                <td className="py-2 pr-4">799–1.499 €</td>
                <td className="py-2 text-sm">
                  Höhere Limits, Prioritäts-Support, erweiterte Reports.
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">Enterprise</td>
                <td className="py-2 pr-4">Individuell (ab 2.500 €)</td>
                <td className="py-2 text-sm">
                  Volle Nutzung, SLA, Dedicated Support.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--muted)]">
          Cross-Selling: Plattform + Mahoney One (Service) + SOC + MIT-AI für durchgängige Governance und Betrieb.
        </p>
      </section>

      {/* SOC – Security Operations */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)]">SOC (Security Operations)</h2>
        <p className="text-sm text-[var(--muted)]">
          Security Operations Center als Service. Preise laut Preisliste MIT-AI (USD).
        </p>
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Stufe</th>
                <th className="py-2 text-left">Preis</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">Core Monitoring</td>
                <td className="py-2 text-sm">
                  85 USD pro User / Monat (Mindestabnahme 3.000 USD / Monat)
                </td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">Advanced SOC</td>
                <td className="py-2 text-sm">
                  135 USD pro User / Monat (Mindestabnahme 7.500 USD / Monat)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">Enterprise Threat Operations</td>
                <td className="py-2 text-sm">ab 45.000 USD / Monat</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--muted)]">
          Upsell: von Core &rarr; Advanced bei wachsender Compliance-/Incident-Dichte; Enterprise als Anker für
          regulierte / KRITIS-Kunden.
        </p>
      </section>

      {/* Platform & Data (MDU) */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)]">Platform &amp; Data (MDU) – Events</h2>
        <p className="text-sm text-[var(--muted)]">
          Event-basierte Abrechnung pro Monat (RMM, EDR, SIEM). RMM-/EDR-Alert-Zahlen allein erhöhen die Kosten nicht.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Volumen (Events / Monat)</th>
                <th className="py-2 text-left">Preis</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4">0 – 1 Mio.</td>
                <td className="py-2">Inklusive (in Plattform)</td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4">1 Mio. – 50 Mio.</td>
                <td className="py-2">0,10 USD pro 1.000 Events</td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4">50 Mio. – 200 Mio.</td>
                <td className="py-2">0,08 USD pro 1.000 Events</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">&gt; 200 Mio.</td>
                <td className="py-2">0,05 USD pro 1.000 Events</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--muted)]">
          Cross-Selling: MDU als Pflicht-Baustein für hochvolumige Mahoney One / SOC-Kunden; Einstieg über
          0–1M inklusive.
        </p>
      </section>

      {/* MIT-AI – KI-Auswertungen & Co-Pilot */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)]">MIT-AI – KI-Auswertungen &amp; Co-Pilot</h2>
        <p className="text-sm text-[var(--muted)]">
          KI-gestützte Auswertungen und Co-Pilot-Funktionen, abgerechnet nach genutzten Tokens (Input / Output).
        </p>
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2 pr-4 text-left">Tarif</th>
                <th className="py-2 pr-4 text-left">Input (pro 1 Mio. Tokens)</th>
                <th className="py-2 pr-4 text-left">Output (pro 1 Mio. Tokens)</th>
                <th className="py-2 text-left">Einsatz</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text)]">
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">Standard</td>
                <td className="py-2 pr-4">1,50 USD</td>
                <td className="py-2 pr-4">7,50 USD</td>
                <td className="py-2 text-sm">Kurze Anfragen, Standard-Auswertungen.</td>
              </tr>
              <tr className="border-b border-[var(--border)]">
                <td className="py-2 pr-4 font-medium">Pro</td>
                <td className="py-2 pr-4">4,50 USD</td>
                <td className="py-2 pr-4">22,50 USD</td>
                <td className="py-2 text-sm">
                  Co-Pilot, Analysen, Empfehlungen (Standard).
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">Premium</td>
                <td className="py-2 pr-4">7,50 USD</td>
                <td className="py-2 pr-4">37,50 USD</td>
                <td className="py-2 text-sm">
                  Komplexe Auswertungen, umfangreiche Kontexte.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--muted)]">
          Upsell: MIT-AI Pro/Premium als Add-on zu Mahoney One + SOC für Governance-Reports, Risikoanalysen und
          Executive Dashboards.
        </p>
      </section>

      {/* Strategische Bundles / Cross-Selling-Einstiege */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)]">Empfohlene Bundles (Upsell / Cross-Sell)</h2>
        <ul className="space-y-2 text-sm text-[var(--text)]">
          <li>
            <span className="font-semibold">SMB / Einstiegsbundle:</span>{' '}
            Mahoney Control <span className="text-[var(--muted)]">(Starter)</span> + Mahoney One Essential +
            SOC Core Monitoring.
          </li>
          <li>
            <span className="font-semibold">Mid-Market:</span>{' '}
            Mahoney Control Professional + Mahoney One Standard + SOC Advanced + MIT-AI Standard/Pro.
          </li>
          <li>
            <span className="font-semibold">Enterprise / Regulierte Kunden:</span>{' '}
            Mahoney Control Enterprise + Mahoney One Elite + SOC Enterprise Threat Operations +
            MIT-AI Pro/Premium + MDU Volumenstaffel.
          </li>
        </ul>
      </section>
    </motion.div>
  )
}
