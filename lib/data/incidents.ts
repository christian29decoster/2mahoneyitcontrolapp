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
  source?: 'manual' | 'rmm' | 'edr' | 'cloud'
  sourceRef?: string
  tenantId?: string
  timeline: IncidentTimelineEntry[]
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
