
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
    '/dashboard',
    '/climate-risk',
    '/profit-planner',
    '/marketplace',
    '/plant-doctor',
    '/soil-analysis',
    '/irrigation',
    '/crop-management',
    '/equipment',
    '/govt-schemes',
    '/profile'
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token && protectedRoutes.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup'))) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

    