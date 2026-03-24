import type { Locale } from '@/lib/locale.store'

export function financialsExtended(locale: Locale) {
  const de = locale === 'de'
  return {
    generateReport: de ? 'Bericht erstellen' : 'Generate Report',
    brokerPdf: de ? 'PDF für Versicherer' : 'Share with Insurance Broker (PDF)',
    exportXlsx: de ? 'Excel exportieren' : 'Export Excel',
    exportPdf: de ? 'PDF exportieren' : 'Export PDF',
    trendsTitle: de ? 'Trends (historisch)' : 'Trend Charts (Historical)',
    benchmarkTitle: de ? 'Branchen-Benchmark' : 'Industry Benchmark',
    complianceTitle: de ? 'Compliance-Kosten' : 'Compliance Cost Layer',
    insuranceTitle: de ? 'Cyber-Versicherung ROI' : 'Cyber Insurance ROI',
    partnerPnlTitle: de ? 'Kunden-P&L (Partner)' : 'Per-Client P&L (MSP)',
    budgetTitle: de ? 'Budgetplanung & Prognose' : 'Security Budget Planning & Forecast',
    preparedBy: de ? 'Erstellt von' : 'Prepared by',
    poweredBy: de ? 'Powered by Mahoney IT' : 'Powered by Mahoney IT',
  }
}
