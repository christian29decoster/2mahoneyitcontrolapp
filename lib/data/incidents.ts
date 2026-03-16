/**
 * Incident Management (ITIL-aligned) – Lifecycle, category, priority, times.
 * In-memory store; later replace with DB.
 * See docs/ITIL-AUSBAU-UND-QUALITAET.md
 */

export const INCIDENT_STATUSES = ['New', 'Assigned', 'In Progress', 'Resolved', 'Closed'] as const
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number]

export const INCIDENT_CATEGORIES = [
  'Security',
  'Hardware',
  'Software',
  'Access',
  'Network',
  'Performance',
  'Other',
] as const
export type IncidentCategory = (typeof INCIDENT_CATEGORIES)[number]

export const INCIDENT_PRIORITIES = ['P1', 'P2', 'P3', 'P4'] as const
export type IncidentPriority = (typeof INCIDENT_PRIORITIES)[number]

export interface IncidentTimelineEntry {
  atISO: string
  text: string
}

/** Event-Log-Eintrag (z. B. aus RMM/Sophos) – Grundlage für Vergoldung/Billing. */
export interface IncidentEventLogEntry {
  atISO: string
  message: string
  source?: string
  raw?: unknown
}

export interface IncidentRecord {
  id: string
  title: string
  description: string
  category: IncidentCategory
  priority: IncidentPriority
  status: IncidentStatus
  loggedAtISO: string
  respondedAtISO?: string
  resolvedAtISO?: string
  closedAtISO?: string
  dueByISO?: string
  assignedTo?: string
  source?: 'manual' | 'rmm' | 'edr' | 'cloud' | 'autotask'
  sourceRef?: string
  tenantId?: string
  timeline: IncidentTimelineEntry[]
  /** Event-Logs aus RMM/Sophos/etc. – Grundlage für Vergoldung. */
  eventLog?: IncidentEventLogEntry[]
  /** Optional payload for vendor-specific data (e.g. AWS incident details). */
  extra?: Record<string, unknown>
}

const VALID_TRANSITIONS: Record<IncidentStatus, IncidentStatus[]> = {
  New: ['Assigned', 'In Progress', 'Resolved', 'Closed'],
  Assigned: ['In Progress', 'Resolved', 'Closed'],
  'In Progress': ['Assigned', 'Resolved', 'Closed'],
  Resolved: ['Closed', 'In Progress'],
  Closed: [],
}

const store: IncidentRecord[] = []

const DEMO_TITLES = [
  'Disk space below threshold',
  'Windows Update failed',
  'Agent offline',
  'High CPU usage',
  'Memory usage critical',
  'Service stopped',
  'Patch pending',
  'Antivirus definition update failed',
  'Backup failed',
  'Certificate expiring',
  'Login failure threshold exceeded',
  'RMM Alert',
  'EDR detection',
  'Unusual process',
  'Network adapter disconnected',
  'Low disk space',
  'Pending reboot',
  'Failed login attempt',
  'Software install required',
  'Monitoring alert',
]

function seed() {
  if (store.length > 0) return
  const now = new Date().toISOString()
  store.push(
    {
      id: 'inc-aws-2025-08-16-01',
      title: 'Suspicious AWS access key usage & S3 exfil attempt',
      description: 'A leaked IAM user key was used from an unusual ASN. A t3.medium EC2 was started and S3 GET/List operations targeted finance-archive.',
      category: 'Security',
      priority: 'P1',
      status: 'In Progress',
      loggedAtISO: '2025-08-16T11:21:00Z',
      respondedAtISO: '2025-08-16T11:25:00Z',
      dueByISO: '2025-08-16T15:21:00Z',
      assignedTo: 'SOC Tier 2',
      source: 'cloud',
      sourceRef: 'aws-guardduty',
      tenantId: undefined,
      timeline: [
        { atISO: '2025-08-16T11:21:00Z', text: 'GuardDuty: Unusual credential usage from ASN 209242' },
        { atISO: '2025-08-16T11:25:00Z', text: 'Incident acknowledged, assigned to SOC Tier 2' },
        { atISO: '2025-08-16T11:29:30Z', text: 'EC2 i-0ab3 started in us-east-1' },
        { atISO: '2025-08-16T11:33:10Z', text: 'S3 List/Get against arn:aws:s3:::finance-archive' },
      ],
      extra: { vendor: 'AWS', severity: 'critical' },
    },
    {
      id: 'inc-002',
      title: 'Laptop not booting – blue screen',
      description: 'User reports device shows blue screen after Windows update. Last successful boot yesterday.',
      category: 'Hardware',
      priority: 'P3',
      status: 'Resolved',
      loggedAtISO: '2025-08-15T09:00:00Z',
      respondedAtISO: '2025-08-15T09:30:00Z',
      resolvedAtISO: '2025-08-15T11:00:00Z',
      closedAtISO: '2025-08-15T14:00:00Z',
      assignedTo: 'Helpdesk',
      source: 'manual',
      tenantId: undefined,
      timeline: [
        { atISO: '2025-08-15T09:00:00Z', text: 'Ticket logged via portal' },
        { atISO: '2025-08-15T09:30:00Z', text: 'Remote session started, rollback of last update' },
        { atISO: '2025-08-15T11:00:00Z', text: 'Device booted successfully after rollback' },
      ],
    },
    {
      id: 'inc-003',
      title: 'Cannot access shared drive',
      description: 'User in Finance reports access denied to \\\\fileserver\\finance. Worked until this morning.',
      category: 'Access',
      priority: 'P2',
      status: 'New',
      loggedAtISO: now,
      tenantId: undefined,
      timeline: [{ atISO: now, text: 'Incident logged' }],
    }
  )
}
seed()

/** Demo incidents with varied, recent timestamps (for demo mode when no RMM/Autotask/Sophos). */
export function getDemoIncidents(opts: { count?: number; lastDays?: number } = {}): IncidentRecord[] {
  const count = opts.count ?? 2800
  const lastDays = opts.lastDays ?? 30
  const end = Date.now()
  const start = end - lastDays * 24 * 60 * 60 * 1000
  const statuses: IncidentStatus[] = ['New', 'Assigned', 'In Progress', 'Resolved', 'Resolved', 'Closed', 'Closed']
  const categories: IncidentCategory[] = ['Other', 'Other', 'Hardware', 'Software', 'Network', 'Security', 'Performance', 'Access']
  const priorities: IncidentPriority[] = ['P4', 'P4', 'P3', 'P3', 'P2', 'P1']
  const sources: Array<'rmm' | 'edr' | 'manual'> = ['rmm', 'rmm', 'rmm', 'edr', 'manual']
  const out: IncidentRecord[] = []
  for (let i = 0; i < count; i++) {
    const t = start + Math.random() * (end - start)
    const loggedAt = new Date(t).toISOString()
    const loggedTs = new Date(loggedAt).getTime()
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const priority = priorities[Math.floor(Math.random() * priorities.length)]
    const source = sources[Math.floor(Math.random() * sources.length)]
    const title = DEMO_TITLES[Math.floor(Math.random() * DEMO_TITLES.length)]
    const eventLog =
      source === 'manual'
        ? undefined
        : [
            { atISO: loggedAt, message: `Demo ${source.toUpperCase()} signal ingested.`, source },
            { atISO: new Date(loggedTs + 60 * 1000).toISOString(), message: 'SOC triage started (auto-enrichment + correlation).', source: 'soc' },
            { atISO: new Date(loggedTs + 4 * 60 * 1000).toISOString(), message: 'SOC note: prioritized and categorized; next step generated for responder.', source: 'soc' },
          ]
    out.push({
      id: `demo-${source}-${i + 1}`,
      title: `${title} #${i + 1}`,
      description: `Demo incident from ${source}.`,
      category,
      priority,
      status,
      loggedAtISO: loggedAt,
      source,
      timeline: [{ atISO: loggedAt, text: 'Logged' }],
      eventLog,
    })
  }
  out.sort((a, b) => new Date(b.loggedAtISO).getTime() - new Date(a.loggedAtISO).getTime())
  return out
}

export function listIncidents(filters?: {
  status?: IncidentStatus
  category?: IncidentCategory
  priority?: IncidentPriority
  tenantId?: string
}): IncidentRecord[] {
  let list = store.slice()
  if (filters?.status) list = list.filter((i) => i.status === filters.status)
  if (filters?.category) list = list.filter((i) => i.category === filters.category)
  if (filters?.priority) list = list.filter((i) => i.priority === filters.priority)
  if (filters?.tenantId != null) list = list.filter((i) => i.tenantId === filters.tenantId)
  list.sort((a, b) => new Date(b.loggedAtISO).getTime() - new Date(a.loggedAtISO).getTime())
  return list
}

export function getIncidentById(id: string): IncidentRecord | undefined {
  return store.find((i) => i.id === id)
}

export function createIncident(data: Omit<IncidentRecord, 'id' | 'loggedAtISO'> & { id?: string }): IncidentRecord {
  const id = data.id ?? `inc-${Date.now()}`
  const loggedAtISO = new Date().toISOString()
  const record: IncidentRecord = {
    ...data,
    id,
    loggedAtISO,
    timeline: data.timeline?.length ? data.timeline : [{ atISO: loggedAtISO, text: 'Incident logged' }],
  }
  store.push(record)
  return record
}

export function updateIncident(
  id: string,
  data: Partial<Pick<IncidentRecord, 'status' | 'assignedTo' | 'respondedAtISO' | 'resolvedAtISO' | 'closedAtISO' | 'dueByISO' | 'title' | 'description' | 'category' | 'priority'>> & { timelineAppend?: IncidentTimelineEntry }
): IncidentRecord | undefined {
  const i = store.findIndex((r) => r.id === id)
  if (i < 0) return undefined
  const rec = store[i]
  if (data.status != null && !VALID_TRANSITIONS[rec.status]?.includes(data.status)) return undefined
  const now = new Date().toISOString()
  if (data.status === 'Resolved' && !rec.resolvedAtISO) (data as any).resolvedAtISO = now
  if (data.status === 'Closed' && !rec.closedAtISO) (data as any).closedAtISO = now
  if (data.status === 'Assigned' && !rec.respondedAtISO) (data as any).respondedAtISO = now
  if (data.timelineAppend) {
    store[i].timeline = [...store[i].timeline, data.timelineAppend]
    delete (data as any).timelineAppend
  }
  Object.assign(store[i], data)
  return store[i]
}

export function canTransition(from: IncidentStatus, to: IncidentStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false
}
