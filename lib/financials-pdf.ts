import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import type { Locale } from '@/lib/locale.store'
import { financialKpis, getTopExpensiveIncidents } from '@/lib/financials'
import {
  monthlyTrendHistory12M,
  benchmarkProfiles,
  budgetCategoryLabels,
  computeComplianceTotals,
  defaultComplianceSelectionForExport,
  type BudgetCategory,
  type BudgetScenario,
} from '@/data/financials-mock'

export type BudgetMatrix = Record<BudgetScenario, Record<BudgetCategory, number>>

function fmtMoney(n: number, locale: Locale) {
  const cur = locale === 'de' ? 'EUR' : 'USD'
  return new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-US', {
    style: 'currency',
    currency: cur,
    maximumFractionDigits: 0,
  }).format(n)
}

function nextY(doc: jsPDF, startY: number, pad = 16): number {
  const last = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
  return (last?.finalY ?? startY) + pad
}

export function generateInsuranceBrokerPdf(opts: {
  locale: Locale
  premiumUsd: number
  riskExposureUsd: number
  reductionPct: number
  estimatedSavingsUsd: number
  coverageRatioPct: number
}) {
  const { locale, premiumUsd, riskExposureUsd, reductionPct, estimatedSavingsUsd, coverageRatioPct } = opts
  const de = locale === 'de'
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  doc.setFontSize(14)
  doc.text(de ? 'Cyber-Versicherung – Zusammenfassung' : 'Cyber insurance – summary', 40, 48)
  doc.setFontSize(10)
  const lines = [
    de ? `Prämie (p.a.): ${fmtMoney(premiumUsd, locale)}` : `Premium (annual): ${fmtMoney(premiumUsd, locale)}`,
    de ? `Risk Exposure: ${fmtMoney(riskExposureUsd, locale)}` : `Risk exposure: ${fmtMoney(riskExposureUsd, locale)}`,
    de ? `Deckungsquote: ${coverageRatioPct.toFixed(2)}%` : `Coverage ratio: ${coverageRatioPct.toFixed(2)}%`,
    de
      ? `Geschätzte Einsparung (${reductionPct}%): ${fmtMoney(estimatedSavingsUsd, locale)}`
      : `Est. savings (${reductionPct}%): ${fmtMoney(estimatedSavingsUsd, locale)}`,
    '',
    de ? 'Mahoney IT – vertraulich' : 'Mahoney IT – confidential',
  ]
  doc.text(lines, 40, 72)
  doc.save(de ? 'cyber-versicherung.pdf' : 'cyber-insurance-broker.pdf')
}

const categories = Object.keys(budgetCategoryLabels) as BudgetCategory[]

export function exportBudgetExcel(matrix: BudgetMatrix, locale: Locale) {
  const head = locale === 'de' ? ['Kategorie', 'Status quo', 'Optimiert', 'Erweitert'] : ['Category', 'Status quo', 'Optimized', 'Expanded']
  const rows: (string | number)[][] = [head]
  for (const c of categories) {
    rows.push([
      budgetCategoryLabels[c],
      matrix.status_quo[c],
      matrix.optimized[c],
      matrix.expanded[c],
    ])
  }
  const ws = XLSX.utils.aoa_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, locale === 'de' ? 'Budget' : 'Budget')
  XLSX.writeFile(wb, 'security-budget.xlsx')
}

export function exportBudgetPdf(
  matrix: BudgetMatrix,
  totals: Record<BudgetScenario, number>,
  itBudget: number,
  locale: Locale
) {
  const de = locale === 'de'
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  doc.setFontSize(12)
  doc.text(de ? 'Security-Budget' : 'Security budget forecast', 40, 40)
  const body = categories.map((c) => [
    budgetCategoryLabels[c],
    String(matrix.status_quo[c]),
    String(matrix.optimized[c]),
    String(matrix.expanded[c]),
  ])
  body.push([
    de ? 'Summe' : 'Total',
    String(totals.status_quo),
    String(totals.optimized),
    String(totals.expanded),
  ])
  autoTable(doc, {
    startY: 56,
    head: [
      [
        de ? 'Kategorie' : 'Category',
        'Status quo',
        de ? 'Optimiert' : 'Optimized',
        de ? 'Erweitert' : 'Expanded',
      ],
    ],
    body,
  })
  const y = nextY(doc, 56, 24)
  doc.setFontSize(9)
  doc.text(`${de ? 'IT-Budget' : 'IT budget'}: ${fmtMoney(itBudget, locale)}`, 40, y)
  doc.save(de ? 'security-budget.pdf' : 'security-budget.pdf')
}

const benchmarkMetricLabel = (key: string, locale: Locale) => {
  const de = locale === 'de'
  const map: Record<string, { en: string; de: string }> = {
    costPerIncident: { en: 'Cost / incident', de: 'Kosten / Vorfall' },
    securitySpendPerUser: { en: 'Spend / user', de: 'Ausgaben / User' },
    mttrHours: { en: 'MTTR (h)', de: 'MTTR (h)' },
    automationSavingsPct: { en: 'Automation %', de: 'Automatisierung %' },
  }
  return map[key]?.[de ? 'de' : 'en'] ?? key
}

export function generateExecutiveFinancialsPdf(opts: {
  locale: Locale
  partnerName?: string
  roiAnnualRiskUsd: number
  automationSavingsUsd: number
  costReductionAutomationUsd: number
  savingsFromAiUsd: number
}) {
  const {
    locale,
    partnerName = 'Mahoney IT MSP',
    roiAnnualRiskUsd,
    automationSavingsUsd,
    costReductionAutomationUsd,
    savingsFromAiUsd,
  } = opts
  const de = locale === 'de'
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  let y = 36
  doc.setFontSize(9)
  doc.setTextColor(100, 116, 139)
  doc.text(de ? '[Partner-/Mandantenlogo]' : '[Partner / client logo]', 40, y)
  doc.setTextColor(0, 0, 0)
  y += 22
  doc.setFontSize(16)
  doc.text(de ? 'Executive Report – Financials' : 'Executive Report – Financials', 40, y)
  y += 22
  doc.setFontSize(9)
  doc.text(
    `${de ? 'Erstellt von' : 'Prepared by'}: ${partnerName} | ${de ? 'Powered by Mahoney IT' : 'Powered by Mahoney IT'}`,
    40,
    y
  )
  y += 28

  doc.setFontSize(11)
  doc.text(de ? 'Top-KPIs' : 'Top KPIs', 40, y)
  y += 6
  const kpis: (string | number)[][] = [
    [de ? 'Security Spend / User' : 'Security spend / user', fmtMoney(financialKpis.securitySpendPerUserUsd, locale)],
    [de ? 'Kosten / geschütztes Gerät' : 'Cost / protected device', fmtMoney(financialKpis.costPerProtectedDeviceUsd, locale)],
    [de ? 'Kosten / Vorfall' : 'Cost / incident', fmtMoney(financialKpis.costPerIncidentUsd, locale)],
    [
      de ? 'MTTR vs finanzielle Auswirkung' : 'MTTR vs financial impact',
      `${financialKpis.mttrHours}h × ${fmtMoney(financialKpis.financialImpactPerMttrHourUsd, locale)}`,
    ],
    [de ? 'Automatisierung (Schätzung)' : 'Automation savings (est.)', fmtMoney(financialKpis.automationSavingsEstimateUsd, locale)],
    [de ? 'Risk Exposure' : 'Risk exposure', fmtMoney(financialKpis.riskExposureValueUsd, locale)],
  ]
  autoTable(doc, { startY: y, head: [[de ? 'Kennzahl' : 'Metric', de ? 'Wert' : 'Value']], body: kpis })
  y = nextY(doc, y, 20)

  doc.setFontSize(11)
  doc.text(de ? 'ROI-Simulator (Auszug)' : 'ROI simulator (summary)', 40, y)
  y += 6
  autoTable(doc, {
    startY: y,
    head: [[de ? 'Position' : 'Item', de ? 'Betrag' : 'Amount']],
    body: [
      [de ? 'Geschätztes jährliches Risiko' : 'Estimated annual risk', fmtMoney(roiAnnualRiskUsd, locale)],
      [de ? 'Reduktion durch Automatisierung' : 'Cost reduction via automation', fmtMoney(costReductionAutomationUsd, locale)],
      [de ? 'Einsparungen KI-Empfehlungen' : 'Savings from AI recommendations', fmtMoney(savingsFromAiUsd, locale)],
      [de ? 'Automatisierung (KPI)' : 'Automation savings (KPI)', fmtMoney(automationSavingsUsd, locale)],
    ],
  })
  y = nextY(doc, y, 20)

  doc.setFontSize(11)
  doc.text(de ? 'Trend (letzte 12 Monate, Spend)' : 'Trend snapshot (last 12M, spend)', 40, y)
  y += 6
  const trendRows = monthlyTrendHistory12M.slice(-12).map((m) => [m.label, fmtMoney(m.securitySpendUsd, locale)])
  autoTable(doc, {
    startY: y,
    head: [[de ? 'Monat' : 'Month', de ? 'Security Spend' : 'Security spend']],
    body: trendRows,
  })
  y = nextY(doc, y, 20)

  const bm = benchmarkProfiles.mid.rows.map((r) => [
    benchmarkMetricLabel(r.metricKey, locale),
    r.unit === 'usd' ? fmtMoney(r.clientValue, locale) : String(r.clientValue),
    r.unit === 'usd' ? fmtMoney(r.industryMedian, locale) : String(r.industryMedian),
  ])
  doc.setFontSize(11)
  doc.text(de ? 'Benchmark (Mid-Market)' : 'Benchmark (Mid-Market)', 40, y)
  y += 6
  autoTable(doc, {
    startY: y,
    head: [[de ? 'Kennzahl' : 'Metric', de ? 'Mandant' : 'Client', de ? 'Median' : 'Median']],
    body: bm,
  })
  y = nextY(doc, y, 20)

  doc.setFontSize(11)
  doc.text(de ? 'Top 5 Vorfälle (Kosten)' : 'Top 5 incidents (cost)', 40, y)
  y += 6
  const top = getTopExpensiveIncidents(5).map((i) => [i.id, i.title, fmtMoney(i.totalCostUsd, locale)])
  autoTable(doc, { startY: y, head: [['ID', de ? 'Titel' : 'Title', de ? 'Summe' : 'Total']], body: top })
  y = nextY(doc, y, 20)

  const comp = computeComplianceTotals(defaultComplianceSelectionForExport)
  doc.setFontSize(11)
  doc.text(de ? 'Compliance (Auszug)' : 'Compliance (summary)', 40, y)
  y += 6
  autoTable(doc, {
    startY: y,
    head: [[de ? 'Kennzahl' : 'Metric', de ? 'Wert' : 'Value']],
    body: [
      [de ? 'Geschätzte Gesamtexposition' : 'Total exposure (est.)', fmtMoney(comp.exposure, locale)],
      [
        de ? 'Aktuelle Investition (annualisiert)' : 'Current investment (annualized)',
        fmtMoney(comp.investment * 12, locale),
      ],
    ],
  })
  y = nextY(doc, y, 28)

  doc.setFontSize(10)
  doc.setTextColor(71, 85, 105)
  doc.text(
    `${de ? 'Unterschrift / Freigabe' : 'Signature / approval'}: ________________________________   ${de ? 'Datum' : 'Date'}: __________`,
    40,
    y
  )
  y += 36
  doc.setFontSize(8)
  doc.text(de ? 'Vertraulich – nur zur internen Nutzung' : 'Confidential – internal use only', 40, y)

  doc.save(de ? 'executive-financials.pdf' : 'executive-financials.pdf')
}
