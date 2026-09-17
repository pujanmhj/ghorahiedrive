import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'ded_session';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const hasCookie = Boolean(token);

  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    if (!hasCookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/signin';
      url.searchParams.set('next', '/dashboard');
      return NextResponse.redirect(url);
    }
  }

  if ((pathname === '/signin' || pathname === '/signup') && hasCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*', '/signin', '/signup'],
};
