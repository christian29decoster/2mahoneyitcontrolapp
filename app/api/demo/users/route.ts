import { NextRequest, NextResponse } from 'next/server';
import { listUsers, upsertUser, toggleActive, removeUser, findUserById, findUser, isSuperAdminUser } from '@/lib/demo-users';

type DemoRole = import('@/lib/demo-users').DemoRole;

/** Admin oder SuperAdmin dürfen User-Verwaltung. */
function getActorRole(req: NextRequest): DemoRole | null {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/demo_role=([^;]+)/);
  const role = match?.[1] as DemoRole | undefined;
  if (role && ['superadmin', 'admin', 'sales', 'partner', 'tenant_user', 'demo'].includes(role)) return role;
  return null;
}

function canManageUsers(req: NextRequest): boolean {
  const role = getActorRole(req);
  return role === 'superadmin' || role === 'admin' || role === 'sales';
}

/** SuperAdmin darf nur von SuperAdmin geändert/gelöscht werden. */
function canModifyTarget(actorRole: DemoRole | null, targetIsSuperAdmin: boolean): boolean {
  if (!targetIsSuperAdmin) return true;
  return actorRole === 'superadmin';
}

export async function GET(req: NextRequest) {
  if (!canManageUsers(req)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  return NextResponse.json({ items: listUsers() });
}

export async function POST(req: NextRequest) {
  if (!canManageUsers(req)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const actorRole = getActorRole(req);
  const body = await req.json();
  const existing = body?.username ? findUser(body.username) : undefined;
  if (existing && isSuperAdminUser(existing) && !canModifyTarget(actorRole, true)) {
    return NextResponse.json({ error: 'SuperAdmin darf nur von SuperAdmin bearbeitet werden.' }, { status: 403 });
  }
  const saved = upsertUser(body);
  return NextResponse.json({ item: saved });
}

export async function PATCH(req: NextRequest) {
  if (!canManageUsers(req)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const actorRole = getActorRole(req);
  const body = await req.json();
  if (body?.op === 'toggle' && body?.id !== undefined) {
    const target = findUserById(body.id);
    if (target && isSuperAdminUser(target) && !canModifyTarget(actorRole, true)) {
      return NextResponse.json({ error: 'SuperAdmin darf nicht deaktiviert werden.' }, { status: 403 });
    }
    const updated = toggleActive(body.id, !!body.active);
    return NextResponse.json({ item: updated });
  }
  return NextResponse.json({ error: 'bad_request' }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  if (!canManageUsers(req)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const actorRole = getActorRole(req);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const target = findUserById(id);
  if (target && isSuperAdminUser(target) && !canModifyTarget(actorRole, true)) {
    return NextResponse.json({ error: 'SuperAdmin darf nicht gelöscht werden.' }, { status: 403 });
  }
  removeUser(id);
  return NextResponse.json({ ok: true });
}
