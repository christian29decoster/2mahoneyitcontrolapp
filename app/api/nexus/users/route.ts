import { NextRequest, NextResponse } from 'next/server'
import { listNexusUsers, createNexusUser, isNexusAdmin } from '@/lib/nexus-auth'

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

/** GET /api/nexus/users – List users (admin only). */
export async function GET(req: NextRequest) {
  const session = getSession(req)
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (!isNexusAdmin(session.username)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const users = listNexusUsers()
  return NextResponse.json({ users })
}

/** POST /api/nexus/users – Create user (admin only). Body: { name, username, password, role? }. */
export async function POST(req: NextRequest) {
  const session = getSession(req)
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (!isNexusAdmin(session.username)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  try {
    const body = await req.json()
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const username = typeof body.username === 'string' ? body.username.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const role = body.role === 'admin' ? 'admin' : 'user'
    if (!name || !username || !password) {
      return NextResponse.json({ error: 'Name, username and password required.' }, { status: 400 })
    }
    const result = createNexusUser({ name, username, password, role })
    if ('error' in result) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ user: result })
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
