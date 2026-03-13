import type { MetricDeltaTooltipContent } from '@/components/ui/MetricDeltaTooltip'

/** Tooltip content for Key Metrics deltas: source, meaning, data basis. Use wherever delta numbers are shown. */
export const KEY_METRIC_TOOLTIPS: Record<string, MetricDeltaTooltipContent> = {
  activeAlerts: {
    source: 'RMM, EDR and SIEM alert feeds',
    meaning: 'Change in count of open, unacknowledged alerts compared to the previous period (e.g. last 24h or 7d).',
    dataBasis: 'Alerts from connected RMM (Datto), Sophos EDR and SIEM; count of currently active alerts.',
  },
  offlineDevices: {
    source: 'RMM device status',
    meaning: 'Change in number of devices that have been offline for more than 12 hours.',
    dataBasis: 'RMM agent last-seen timestamps; devices with no heartbeat beyond the threshold are counted as offline.',
  },
  mttr: {
    source: 'Incident and SLA data',
    meaning: 'Change in Mean Time To Recovery (or Resolution) compared to the previous period.',
    dataBasis: 'Resolved incidents in the period; average time from creation to resolution.',
  },
  coverage: {
    source: 'RMM and EDR inventory',
    meaning: 'Change in the share of managed devices that are covered by monitoring and protection.',
    dataBasis: 'Devices with active RMM agent and EDR (where applicable) divided by total managed devices.',
  },
  openIncidents: {
    source: 'PSA / Autotask or internal incident list',
    meaning: 'Change in number of incidents currently in open status.',
    dataBasis: 'Incidents in status Open (or equivalent) from your PSA or the Control App incident list.',
  },
  compliance: {
    source: 'Governance and control assessment',
    meaning: 'Change in the overall compliance score (e.g. control coverage and open findings).',
    dataBasis: 'Governance inputs: control coverage, patch/compliance state, audit findings; score normalized to 0–100%.',
  },
}

/** Tooltip for AI Growth & Risk – Security-to-Growth Score. */
export const GROW_SCORE_TOOLTIP: MetricDeltaTooltipContent = {
  source: 'Mahoney Grow / AI Growth & Risk',
  meaning: 'Combined score balancing security posture and growth readiness (e.g. EDR coverage, compliance, risk indicators).',
  dataBasis: 'Demo baseline and optional RMM/EDR/SIEM inputs; see Mahoney Grow page for full breakdown.',
}

/** Tooltips for Quick Security Audit metrics (Unprotected, Stale, Quarantined). */
export const QUICK_AUDIT_TOOLTIPS: Record<string, MetricDeltaTooltipContent> = {
  unprotected: {
    source: 'Quick Security Audit scan',
    meaning: 'Devices without active EDR/XDR protection or with protection disabled.',
    dataBasis: 'Scan of managed devices; EDR agent status from RMM/EDR connectors.',
  },
  stale: {
    source: 'Quick Security Audit scan',
    meaning: 'Devices with outdated security definitions or agents that have not reported recently.',
    dataBasis: 'Definition age and last-seen timestamps from EDR/RMM; thresholds configurable.',
  },
  quarantined: {
    source: 'Quick Security Audit scan',
    meaning: 'Devices currently in quarantine (isolated from network due to detected threat or policy).',
    dataBasis: 'EDR/RMM quarantine state; count of devices in isolation.',
  },
}

/** Tooltips for Security Financials KPI cards (same structure as Key Metrics). */
export const FINANCIAL_KPI_TOOLTIPS: Record<string, MetricDeltaTooltipContent> = {
  securitySpendPerUser: {
    source: 'Finance and license data',
    meaning: 'Monthly security-related cost per user (licenses, tools, labor share). Trend: change vs. previous 30 days.',
    dataBasis: 'Total security spend and user count; can be linked to PSA or internal cost allocation.',
  },
  costPerProtectedDevice: {
    source: 'Finance and RMM/EDR inventory',
    meaning: 'Total security spend divided by number of protected endpoints. Trend: change vs. previous 30 days.',
    dataBasis: 'Security spend and device count from RMM/EDR; reflects efficiency of spend per device.',
  },
  costPerIncident: {
    source: 'Incident and cost tracking (PSA / internal)',
    meaning: 'Average cost (downtime + labor) per resolved incident. Trend: change vs. previous 30 days.',
    dataBasis: 'Closed incidents with estimated downtime and labor cost; average total cost per incident.',
  },
  mttrFinancialImpact: {
    source: 'Incident and SLA data',
    meaning: 'Mean time to resolve × estimated cost per hour of downtime (financial impact of resolution time).',
    dataBasis: 'MTTR from resolved incidents; hourly cost from labor and business impact assumptions.',
  },
  automationSavings: {
    source: 'Automation and labor estimates',
    meaning: 'Estimated monthly savings from current automation (e.g. playbooks, EDR, automated response).',
    dataBasis: 'Comparison of manual vs. automated handling; hours saved and cost per hour.',
  },
  riskExposureValue: {
    source: 'Risk and finding data',
    meaning: 'Estimated value at risk from open gaps and unresolved findings.',
    dataBasis: 'Open findings, missing controls, and exposure estimates; can be linked to risk register.',
  },
  mduMonthly: {
    source: 'Platform usage (events)',
    meaning: 'Layer 3 Data Processing cost: events from RMM/devices. 0–1M events included, then tiered per 1,000 events.',
    dataBasis: 'Event volume from RMM/SIEM; Mahoney price list (Layer 3 Data Processing).',
  },
}

/** AI Growth & Risk Intelligence page – provenance for opportunities and Predictive Risk Engine. */
export const GROW_PAGE_TOOLTIPS: Record<string, MetricDeltaTooltipContent> = {
  opportunitiesFromLogData: {
    source: 'SIEM, RMM, telephony and mailbox logs',
    meaning: 'Log data is used as objective evidence; with you and process owners we interpret it. AI then calculates automation potential and savings.',
    dataBasis: 'Calls, emails, usage and security events from your connected systems; analysis runs when you request it.',
  },
  predictiveRiskEngine: {
    source: 'Incident history, device and patch data, user behavior',
    meaning: 'Probability that a significant risk event (e.g. breach, outage, compliance finding) occurs in the next 30 or 90 days.',
    dataBasis: 'Historical incident patterns, device vulnerability age, patch latency and user behavior anomalies; model output is indicative for planning.',
  },
  predictiveRisk30: {
    source: 'Predictive Risk Engine model',
    meaning: 'Estimated risk probability for the next 30 days. Used to prioritize preventive actions and resource allocation.',
    dataBasis: 'Historical incident patterns, device vulnerability age, patch latency and user behavior anomalies aggregated and scored.',
  },
  predictiveRisk90: {
    source: 'Predictive Risk Engine model',
    meaning: 'Estimated risk probability for the next 90 days. Longer horizon supports strategic planning and investment decisions.',
    dataBasis: 'Same inputs as 30-day forecast with extended time window and trend; typically higher as more time allows more failure modes.',
  },
}

/** Governance Center – Overview metrics: what is assessed and source. */
export const GOVERNANCE_OVERVIEW_TOOLTIPS: Record<string, MetricDeltaTooltipContent> = {
  complianceScore: {
    source: 'RMM, EDR, backup, identity provider, and incident data',
    meaning: 'Weighted score from protected devices, patch compliance, backup coverage, MFA, EDR deployment; minus penalties for open critical findings and high-severity incidents.',
    dataBasis: 'Process software via API (devices, patch, EDR) and optional uploaded framework documents assessed by AI.',
  },
  riskIndex: {
    source: 'Coverage gaps, critical findings, open incidents',
    meaning: 'Aggregated risk from device coverage, patch and MFA gaps, plus open critical findings and high-severity incidents.',
    dataBasis: 'Same as compliance: APIs (RMM, EDR, IdP) and AI-assessed uploaded frameworks.',
  },
  auditReadiness: {
    source: 'Compliance score and risk level',
    meaning: 'Ready = score ≥80% and low risk. At Risk = score ≥60%. Not Ready otherwise. Helps prioritize audit prep.',
    dataBasis: 'Derived from Compliance Score and Risk Index; evidence from process software APIs and uploaded frameworks fed to AI.',
  },
}
