import { NextRequest, NextResponse } from 'next/server';
import { getActorUsername } from '@/lib/auth/session-from-cookie';
import { findUser } from '@/lib/demo-users';

/** GET /api/demo/2fa/status – returns { has2fa: boolean } for the current user. */
export async function GET(req: NextRequest) {
  const username = getActorUsername(req);
  if (!username) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }
  const user = findUser(username);
  return NextResponse.json({ has2fa: !!(user?.totpSecret) });
}
