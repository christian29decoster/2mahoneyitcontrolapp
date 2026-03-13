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
