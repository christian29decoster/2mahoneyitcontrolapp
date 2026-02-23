import { NextResponse } from 'next/server'
import { SLA_TARGETS_BY_PRIORITY } from '@/lib/sla'

export const dynamic = 'force-dynamic'

/** GET /api/sla/targets – current SLA targets by priority. */
export async function GET() {
  return NextResponse.json({ targets: SLA_TARGETS_BY_PRIORITY })
}
