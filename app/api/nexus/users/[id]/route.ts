import { NextRequest, NextResponse } from 'next/server'
import { updateNexusUserPassword, getNexusUserById, isNexusAdmin } from '@/lib/nexus-auth'

export const dynamic = 'force-dynamic'

function getSession(req: NextRequest): { username: string; role: string } | null {
  const cookie = req.cookies.get('nexus_session')?.value
  if (!cookie) return null
  try {
    const s = JSON.parse(decodeURIComponent(cookie)) as { username: string; role: string }
    return s
  } catch {
    return null
  }
}

/** PATCH /api/nexus/users/[id] – Update password (admin only). Body: { password }. */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = getSession(req)
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (!isNexusAdmin(session.username)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  try {
    const body = await req.json()
    const password = typeof body.password === 'string' ? body.password : ''
    if (!password) return NextResponse.json({ error: 'Password required.' }, { status: 400 })
    const result = updateNexusUserPassword(id, password)
    if ('error' in result) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ user: result })
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
