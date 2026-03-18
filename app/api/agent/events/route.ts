import { NextRequest, NextResponse } from 'next/server'
import { appendAgentEvents } from '@/lib/agent-events-store'

/**
 * POST /api/agent/events
 * Accepts events from a device agent. Body: { tenantId, deviceId?, events: [ { at?, type?, message? } ] }
 * Optional header: X-Agent-Key (must match MAHONEY_AGENT_SECRET if set in env)
 */
export async function POST(req: NextRequest) {
  const secret = process.env.MAHONEY_AGENT_SECRET
  if (secret) {
    const key = req.headers.get('x-agent-key') ?? req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    if (key !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  let body: { tenantId?: string; deviceId?: string; events?: Array<{ at?: string; type?: string; message?: string }> }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const tenantId = typeof body.tenantId === 'string' ? body.tenantId.trim() : undefined
  if (!tenantId) {
    return NextResponse.json({ error: 'tenantId required' }, { status: 400 })
  }

  const deviceId = typeof body.deviceId === 'string' ? body.deviceId.trim() || undefined : undefined
  const raw = body.events
  if (!Array.isArray(raw) || raw.length === 0) {
    return NextResponse.json({ error: 'events array required and must not be empty' }, { status: 400 })
  }

  const events = raw.slice(0, 1000).map((e) => ({
    at: typeof e?.at === 'string' ? e.at : new Date().toISOString(),
    type: typeof e?.type === 'string' ? e.type : undefined,
    message: typeof e?.message === 'string' ? e.message : undefined,
    source: 'agent',
  }))

  const accepted = appendAgentEvents(tenantId, deviceId, events)
  return NextResponse.json({ ok: true, accepted })
}
