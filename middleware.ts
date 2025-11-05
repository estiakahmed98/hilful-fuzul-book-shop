import { NextResponse, type NextRequest } from "next/server";

// List of public paths that don't require authentication
const publicPaths = [
  '/',
  '/signin',
  '/sign-up',
  '/api/auth/signin',
  '/api/auth/signout',
  '/api/auth/session',
  '/_next/static',
  '/_next/image',
  '/favicon.ico',
  '/static',
];

export default async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public paths
  if (publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }

  // Skip middleware for API routes (except auth)
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // Skip middleware for static files
  if (pathname.match(/\.(png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/)) {
    return NextResponse.next();
  }

  let session: any = null;

  try {
    const response = await fetch(new URL('/api/auth/session', request.url), {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        session = await response.json();
      }
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
  }

  // Handle protected routes (admin and dashboard)
  const isProtectedRoute = pathname.startsWith('/admin') || pathname.startsWith('/dashboard');

  if (isProtectedRoute && !session) {
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users away from auth pages -> to /home
  const isAuthRoute = ['/signin', '/sign-up'].includes(pathname);
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth|static).*)',
  ],
};
