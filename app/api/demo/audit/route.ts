import { NextRequest, NextResponse } from 'next/server';
import { maskIp } from '@/lib/hash';

type Audit = { atISO:string; username:string; ipMasked:string; tz?:string; ua?:string };
let auditLog: Audit[] = [];

export async function POST(req: NextRequest){
  try {
    const body = await req.json();
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    auditLog.unshift({
      atISO: new Date().toISOString(),
      username: String(body.username||'unknown'),
      ipMasked: maskIp(ip),
      tz: String(body.tz||''),
      ua: String(body.ua||'')
    });
    // keep last 500
    auditLog = auditLog.slice(0,500);
    return NextResponse.json({ ok:true });
  } catch (e) {
    return NextResponse.json({ ok:false }, { status: 400 });
  }
}

export async function GET(){
  return NextResponse.json({ items: auditLog });
}
