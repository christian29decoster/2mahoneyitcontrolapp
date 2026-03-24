/**
 * Demo SIEM-covered assets for Devices & Staff (SIEM tab).
 * Aligned with Mahoney SOC Handbook concepts: log collection → normalization → correlation → triage;
 * use-case coverage; MITRE mapping for analyst workflow (demo values).
 */

export type SiemIngestionHealth = 'ok' | 'degraded' | 'gap'

export type SiemDemoData = {
  /** Primary log sources feeding the SIEM (per handbook: breadth + criticality). */
  logSources: string[]
  /** Collection / parser health for this asset. */
  ingestionHealth: SiemIngestionHealth
  /** Approx. normalized events / 24h (Layer-3 / MDU-relevant framing in live env). */
  normalizedEvents24h: number
  /** Open correlated alerts tied to this asset (SOC queue). */
  openAlerts: number
  /** Highest severity among open items (demo). */
  maxSeverity: 'critical' | 'high' | 'medium' | 'low' | 'none'
  /** Human-readable last notable event (correlation / detection). */
  lastNotableEvent: string
  /** MITRE ATT&CK tactic(s) for last escalation (demo). */
  mitreTactics: string
  /** Correlation / detection tier (handbook-aligned labels). */
  correlationTier: 'L1 triage' | 'L2 analysis' | 'Tuned use case'
  /** Reference line for customer-facing copy. */
  handbookRef: string
}

export type SiemDemoDevice = {
  uid: string
  type: string
  name: string
  serial: string
  os: string
  version: string
  location: string
  room: string
  lastLogin: string
  status: 'Online' | 'Offline' | 'Quarantined'
  user?: string
  siemData: SiemDemoData
}

const HANDBOOK =
  'Mahoney SOC Handbook (General) — log collection, normalization, correlation, triage; AI-augmented workflows.'

export const siemDemoDevices: SiemDemoDevice[] = [
  {
    uid: 'siem-001',
    type: 'Server',
    name: 'DC01-ESCH',
    serial: 'SN-SIEM-44001',
    os: 'Windows Server 2022',
    version: '22H2',
    location: 'HQ · Server room',
    room: 'SR-01',
    lastLogin: 'svc_soc@domain.local • 2026-03-24 08:12',
    status: 'Online',
    user: 'svc_soc',
    siemData: {
      logSources: ['Windows Security', 'Sysmon', 'DC replication', 'DNS analytical'],
      ingestionHealth: 'ok',
      normalizedEvents24h: 184000,
      openAlerts: 2,
      maxSeverity: 'high',
      lastNotableEvent: 'Multiple failed Kerberos pre-auth (correlation: brute-force pattern)',
      mitreTactics: 'Credential Access (T1110)',
      correlationTier: 'Tuned use case',
      handbookRef: HANDBOOK,
    },
  },
  {
    uid: 'siem-002',
    type: 'Laptop',
    name: 'NB-FIN-042',
    serial: 'SN-SIEM-44002',
    os: 'Windows 11',
    version: '23H2',
    location: 'Finance · Floor 2',
    room: 'Open office',
    lastLogin: 'anna.meyer • 2026-03-24 07:55',
    status: 'Online',
    user: 'anna.meyer',
    siemData: {
      logSources: ['EDR telemetry', 'Windows Security', 'Office 365 sign-in'],
      ingestionHealth: 'ok',
      normalizedEvents24h: 42000,
      openAlerts: 0,
      maxSeverity: 'none',
      lastNotableEvent: 'Suspicious PowerShell encoded command (suppressed after L2 review)',
      mitreTactics: 'Execution (T1059)',
      correlationTier: 'L2 analysis',
      handbookRef: HANDBOOK,
    },
  },
  {
    uid: 'siem-003',
    type: 'Server',
    name: 'EXCH-EDGE',
    serial: 'SN-SIEM-44003',
    os: 'Windows Server 2019',
    version: '1809',
    location: 'DMZ',
    room: 'DMZ-A2',
    lastLogin: 'system • 2026-03-24 06:40',
    status: 'Online',
    user: 'system',
    siemData: {
      logSources: ['IIS / SMTP', 'Windows Security', 'Firewall edge'],
      ingestionHealth: 'degraded',
      normalizedEvents24h: 96000,
      openAlerts: 1,
      maxSeverity: 'medium',
      lastNotableEvent: 'Mail relay spike — volume threshold (awaiting network confirm)',
      mitreTactics: 'Collection (T1114)',
      correlationTier: 'L1 triage',
      handbookRef: HANDBOOK,
    },
  },
  {
    uid: 'siem-004',
    type: 'PC',
    name: 'PC-OPS-12',
    serial: 'SN-SIEM-44004',
    os: 'Windows 10',
    version: '22H2',
    location: 'Operations',
    room: 'B-103',
    lastLogin: 'ops.shared • 2026-03-23 18:20',
    status: 'Offline',
    user: 'ops.shared',
    siemData: {
      logSources: ['Windows Security', 'EDR telemetry'],
      ingestionHealth: 'gap',
      normalizedEvents24h: 12000,
      openAlerts: 3,
      maxSeverity: 'high',
      lastNotableEvent: 'Host offline — missed heartbeat; escalation per runbook',
      mitreTactics: 'Impact (T1489) — monitoring gap',
      correlationTier: 'L1 triage',
      handbookRef: HANDBOOK,
    },
  },
  {
    uid: 'siem-005',
    type: 'Server',
    name: 'LINUX-APP-03',
    serial: 'SN-SIEM-44005',
    os: 'RHEL 8',
    version: '8.8',
    location: 'Cloud colo',
    room: 'Remote',
    lastLogin: 'root • 2026-03-24 05:10',
    status: 'Online',
    user: 'app_svc',
    siemData: {
      logSources: ['auditd', 'auth', 'Docker events', 'NGINX access'],
      ingestionHealth: 'ok',
      normalizedEvents24h: 67000,
      openAlerts: 0,
      maxSeverity: 'none',
      lastNotableEvent: 'Privilege escalation attempt blocked (container)',
      mitreTactics: 'Privilege Escalation (T1068)',
      correlationTier: 'Tuned use case',
      handbookRef: HANDBOOK,
    },
  },
  {
    uid: 'siem-006',
    type: 'Laptop',
    name: 'NB-EXEC-01',
    serial: 'SN-SIEM-44006',
    os: 'macOS',
    version: '14.x',
    location: 'Executive',
    room: 'Exec floor',
    lastLogin: 'cfo.device • 2026-03-24 09:00',
    status: 'Online',
    user: 'cfo.device',
    siemData: {
      logSources: ['EDR telemetry', 'Cloud identity', 'Email DLP signals'],
      ingestionHealth: 'ok',
      normalizedEvents24h: 31000,
      openAlerts: 1,
      maxSeverity: 'low',
      lastNotableEvent: 'Unusual sign-in country (geo-velocity rule)',
      mitreTactics: 'Initial Access / Valid accounts (T1078)',
      correlationTier: 'Tuned use case',
      handbookRef: HANDBOOK,
    },
  },
]
