/**
 * In-memory store for events sent by device agents.
 * Used by POST /api/agent/events and can be used for MDU/usage counts.
 */

export type AgentEvent = {
  at: string // ISO
  type?: string
  message?: string
  source?: string
}

export type AgentEventEnvelope = {
  tenantId: string
  deviceId?: string
  at: string
  events: AgentEvent[]
}

const MAX_TOTAL_EVENTS = 200_000
const store: AgentEventEnvelope[] = []

export function appendAgentEvents(tenantId: string, deviceId: string | undefined, events: AgentEvent[]): number {
  if (!events.length) return 0
  const at = new Date().toISOString()
  store.push({ tenantId, deviceId, at, events })
  while (store.length > MAX_TOTAL_EVENTS) store.shift()
  return events.length
}

export function getAgentEventsCount(tenantId?: string, since?: Date): number {
  let count = 0
  const sinceTime = since?.getTime()
  for (const envelope of store) {
    if (tenantId && envelope.tenantId !== tenantId) continue
    if (sinceTime && new Date(envelope.at).getTime() < sinceTime) continue
    count += envelope.events.length
  }
  return count
}

export function getAgentEventsForMonth(tenantId: string, year: number, month: number): number {
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 0, 23, 59, 59, 999)
  let count = 0
  for (const envelope of store) {
    if (envelope.tenantId !== tenantId) continue
    const t = new Date(envelope.at).getTime()
    if (t >= start.getTime() && t <= end.getTime()) count += envelope.events.length
  }
  return count
}
