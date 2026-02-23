/**
 * Autotask PSA REST API – Tickets (Incidents) abrufen für Incident-Liste und SLA.
 * Siehe docs/AUTOTASK-PSA-ANBINDUNG.md
 */

import type { IncidentRecord, IncidentPriority, IncidentStatus } from '@/lib/data/incidents'

export interface AutotaskConfig {
  baseUrl: string
  username: string
  secret: string
  integrationCode: string
}

export function getAutotaskConfig(): AutotaskConfig | null {
  const baseUrl = process.env.AUTOTASK_BASE_URL?.trim()
  const username = process.env.AUTOTASK_USERNAME?.trim()
  const secret = process.env.AUTOTASK_SECRET?.trim()
  const integrationCode = process.env.AUTOTASK_INTEGRATION_CODE?.trim()
  if (!baseUrl || !username || !secret || !integrationCode) return null
  return { baseUrl, username, secret, integrationCode }
}

/** Raw ticket from Autotask API (subset of fields we use). */
export interface AutotaskTicket {
  id: number
  ticketNumber?: string
  title?: string
  description?: string
  createDate?: string
  firstResponseDateTime?: string
  resolvedDateTime?: string
  dueDateTime?: string
  firstResponseDueDateTime?: string
  resolvedDueDateTime?: string
  status?: number
  priority?: number
  ticketType?: number
  assignedResourceID?: number
  companyID?: number
  serviceLevelAgreementHasBeenMet?: boolean
}

function autotaskHeaders(config: AutotaskConfig): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Username: config.username,
    Secret: config.secret,
    APIIntegrationcode: config.integrationCode,
  }
}

/**
 * Query Autotask Tickets (e.g. last 30 days, optional type = Incident).
 * Returns raw ticket array; empty on error or no config.
 */
export async function queryAutotaskTickets(options?: {
  sinceDays?: number
  ticketType?: number
  maxPages?: number
}): Promise<AutotaskTicket[]> {
  const config = getAutotaskConfig()
  if (!config) return []

  const sinceDays = options?.sinceDays ?? 30
  const since = new Date()
  since.setDate(since.getDate() - sinceDays)
  const sinceISO = since.toISOString()

  const filter: { op: string; field: string; value: string }[] = [
    { op: 'gte', field: 'createDate', value: sinceISO },
  ]
  if (options?.ticketType != null) {
    filter.push({ op: 'eq', field: 'ticketType', value: String(options.ticketType) })
  }

  const results: AutotaskTicket[] = []

  try {
    const body: { filter: typeof filter; MaxRecords?: number } = { filter, MaxRecords: 500 }
    const res = await fetch(`${config.baseUrl}/Tickets/query`, {
      method: 'POST',
      headers: autotaskHeaders(config),
      body: JSON.stringify(body),
    })
    const raw = await res.text()
    if (!res.ok) {
      console.error('Autotask Tickets query failed:', res.status, raw)
      return results
    }
    let data: { items?: AutotaskTicket[] }
    try {
      data = JSON.parse(raw) as { items?: AutotaskTicket[] }
    } catch {
      console.error('Autotask Tickets response not JSON:', raw.slice(0, 500))
      return results
    }
    const items = data?.items ?? []
    results.push(...items)
  } catch (e) {
    console.error('Autotask query error:', e)
  }

  return results
}

/** Map Autotask priority picklist ID to our P1–P4 (default mapping; adjust per tenant if needed). */
function mapPriority(priorityId: number | undefined): IncidentPriority {
  if (priorityId == null) return 'P4'
  if (priorityId <= 1) return 'P1'
  if (priorityId <= 2) return 'P2'
  if (priorityId <= 3) return 'P3'
  return 'P4'
}

/** Map Autotask status to our lifecycle (simplified; status IDs are instance-specific). */
function mapStatus(statusId: number | undefined, resolvedDateTime?: string): IncidentStatus {
  if (resolvedDateTime) return 'Resolved'
  if (statusId == null) return 'New'
  if (statusId <= 2) return 'New'
  if (statusId <= 4) return 'Assigned'
  if (statusId <= 6) return 'In Progress'
  return 'Resolved'
}

/**
 * Map one Autotask ticket to our IncidentRecord (for display and SLA).
 */
export function mapAutotaskTicketToIncident(ticket: AutotaskTicket): IncidentRecord {
  const id = `autotask-${ticket.id}`
  const loggedAtISO = ticket.createDate ?? new Date().toISOString()
  const status = mapStatus(ticket.status, ticket.resolvedDateTime)
  const priority = mapPriority(ticket.priority)

  const timeline: { atISO: string; text: string }[] = []
  timeline.push({ atISO: loggedAtISO, text: `Autotask ticket ${ticket.ticketNumber ?? ticket.id} created` })
  if (ticket.firstResponseDateTime) {
    timeline.push({ atISO: ticket.firstResponseDateTime, text: 'First response' })
  }
  if (ticket.resolvedDateTime) {
    timeline.push({ atISO: ticket.resolvedDateTime, text: 'Resolved' })
  }

  return {
    id,
    title: ticket.title ?? `Ticket ${ticket.ticketNumber ?? ticket.id}`,
    description: ticket.description ?? '',
    category: 'Other',
    priority,
    status,
    loggedAtISO,
    respondedAtISO: ticket.firstResponseDateTime,
    resolvedAtISO: ticket.resolvedDateTime,
    dueByISO: ticket.resolvedDueDateTime ?? ticket.dueDateTime,
    source: 'manual',
    sourceRef: `autotask:${ticket.id}`,
    timeline,
    extra: {
      autotaskId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      companyID: ticket.companyID,
      serviceLevelAgreementHasBeenMet: ticket.serviceLevelAgreementHasBeenMet,
    },
  }
}

/**
 * Fetch tickets from Autotask and return as IncidentRecord[].
 * Returns [] when Autotask is not configured or on error.
 */
export async function fetchIncidentsFromAutotask(options?: {
  sinceDays?: number
  ticketType?: number
}): Promise<IncidentRecord[]> {
  const tickets = await queryAutotaskTickets({
    sinceDays: options?.sinceDays ?? 90,
    ticketType: options?.ticketType,
  })
  return tickets.map(mapAutotaskTicketToIncident)
}
