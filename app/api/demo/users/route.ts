import { NextRequest, NextResponse } from 'next/server';
import { listUsers, upsertUser, toggleActive, removeUser } from '@/lib/demo-users';

function isAdmin(req: NextRequest){
  const cookie = req.headers.get('cookie') || '';
  console.log('Cookie header:', cookie);
  const isAdminUser = /demo_role=admin/.test(cookie);
  console.log('Is admin:', isAdminUser);
  return isAdminUser;
}

export async function GET(req: NextRequest){
  if (!isAdmin(req)) return NextResponse.json({ error:'forbidden' }, { status: 403 });
  return NextResponse.json({ items: listUsers() });
}

export async function POST(req: NextRequest){
  if (!isAdmin(req)) return NextResponse.json({ error:'forbidden' }, { status: 403 });
  const body = await req.json();
  const saved = upsertUser(body);
  return NextResponse.json({ item: saved });
}

export async function PATCH(req: NextRequest){
  if (!isAdmin(req)) return NextResponse.json({ error:'forbidden' }, { status: 403 });
  const body = await req.json();
  if (body?.op === 'toggle' && body?.id !== undefined) {
    const updated = toggleActive(body.id, !!body.active);
    return NextResponse.json({ item: updated });
  }
  return NextResponse.json({ error:'bad_request' }, { status: 400 });
}

export async function DELETE(req: NextRequest){
  if (!isAdmin(req)) return NextResponse.json({ error:'forbidden' }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (id) removeUser(id);
  return NextResponse.json({ ok:true });
}
