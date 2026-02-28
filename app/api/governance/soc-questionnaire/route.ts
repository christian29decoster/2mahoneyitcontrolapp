import { NextRequest, NextResponse } from 'next/server'
import { getActorTenantId } from '@/lib/auth/session-from-cookie'
import { getSocQuestionnaireByTenant, setSocQuestionnaireForTenant } from '@/lib/soc-questionnaire-store'
import type { SocQuestionnaireAnswers } from '@/lib/soc-questionnaire'

export const dynamic = 'force-dynamic'

/** GET – lädt gespeicherte SOC-Fragebogen-Antworten für den aktuellen Mandanten (Cookie). */
export async function GET(req: NextRequest) {
  const tenantId = getActorTenantId(req)
  if (!tenantId) {
    return NextResponse.json({ answers: null, tenantId: null })
  }
  const stored = getSocQuestionnaireByTenant(tenantId)
  return NextResponse.json({
    answers: stored?.answers ?? null,
    tenantId,
    updatedAtISO: stored?.updatedAtISO ?? null,
  })
}

/** POST – speichert SOC-Fragebogen-Antworten für den aktuellen Mandanten. */
export async function POST(req: NextRequest) {
  const tenantId = getActorTenantId(req)
  if (!tenantId) {
    return NextResponse.json({ error: 'Kein Mandant zugeordnet. Bitte anmelden bzw. Mandant wählen.' }, { status: 400 })
  }
  let body: { answers?: SocQuestionnaireAnswers }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiger JSON-Body.' }, { status: 400 })
  }
  const answers = body.answers
  if (!answers || typeof answers !== 'object') {
    return NextResponse.json({ error: 'answers (Objekt) ist erforderlich.' }, { status: 400 })
  }
  const entry = setSocQuestionnaireForTenant(tenantId, answers)
  return NextResponse.json({
    ok: true,
    tenantId: entry.tenantId,
    updatedAtISO: entry.updatedAtISO,
  })
}
