import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // open routes
  const open = pathname === '/login' || pathname === '/api/health'
  const isAsset =
    pathname.startsWith('/_next') ||
    /\.(png|jpg|jpeg|webp|svg|ico|css|js|map|txt)$/i.test(pathname)

  if (open || isAsset) return NextResponse.next()

  const authed = req.cookies.get('demo_authed')?.value === '1'
  if (!authed) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  // protect everything except static files & /login
  matcher: ['/((?!_next|.*\\..*).*)'],
}
