import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  console.log(`[Middleware] ${request.method} ${request.nextUrl.pathname}`);

  // Log headers for debugging
  const headers = Object.fromEntries(request.headers);
  console.log('[Middleware] Headers:', headers);

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if user is authenticated for protected routes
  if (
    !session &&
    (request.nextUrl.pathname.startsWith('/search') ||
      request.nextUrl.pathname.startsWith('/maps-search'))
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is already logged in and tries to access login page, redirect to home
  if (session && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return res;
}

export const config = {
  matcher: ['/api/real-estate/property-search/:path*', '/api/real-estate/property-detail/:path*'],
};
