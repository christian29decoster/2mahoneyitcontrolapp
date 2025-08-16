export type Signal = 'good' | 'warn' | 'risk'

export const serviceCockpit = {
  plan: { tier: 'Essential', seats: 150, devices: 250, renewalISO: '2025-12-01' },
  soc: { status: 'Monitoring', team: 'SOC-III-US-Team' as const },
  edr: { coverage: 0.92, stale: 3, unprotected: 2 }, // from audit demo
  mail: { o365Approaching: 1, onPremHighUtil: 1 },
  backup: { protectedPct: 0.78, lastFailures: 2, rtoOk: true },
  compliance: { score: 78, gaps: ['MFA on legacy mail', 'VLAN segmentation review'] },
} as const

export function toSignal(value: number, warn: number, risk: number): Signal {
  return value >= risk ? 'risk' : value >= warn ? 'warn' : 'good'
}

// Service recommendations (short)
export const cockpitTips = [
  { key: 'edr', text: 'Enable automated discovery to raise EDR coverage to 98%.' },
  { key: 'backup', text: 'Increase backup scope for Finance DB; add DR verification.' },
  { key: 'mail', text: 'Expand mailbox analytics; finance mailbox near quota.' },
  { key: 'compliance', text: 'Run a quick gap assessment against SOC 2.' },
]

// AI demo intents & canned short answers (rule-based; replace later with gateway LLM)
export const aiIntents = [
  { match: /risk|secure|posture|status/i, answer: 'Overall risk is Moderate. 3 active alerts, EDR coverage 92%, backups at 78% scope.' },
  { match: /unprotected|edr|agent/i, answer: '2 devices lack EDR or have stale check-ins. Open Remediation to address them now.' },
  { match: /mail|o365|exchange|quota/i, answer: 'One O365 mailbox is approaching quota; Exchange DB02 is at high utilization.' },
  { match: /backup|rto|restore/i, answer: 'Backups are 78% of scope; RTO is on target. Consider DR verification add-on.' },
  { match: /upgrade|plan|prime|elite/i, answer: 'Upgrading to Prime unlocks auto-discovery and reduces MTTR. Est. +$600/mo.' },
  { match: /project|vlan|network/i, answer: 'Create a Network project (VLANs/Wi-Fi/Firewall). We can generate a scoped quote.' },
]
