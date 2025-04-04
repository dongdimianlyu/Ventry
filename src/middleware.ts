import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/auth/login',
  '/auth/signup',
  '/auth/login/email',
];

// Public API endpoints (like auth endpoints)
const publicApiPaths = [
  '/api/auth',
];

// Check if the path should be accessible without authentication
const isPublicPath = (path: string) => {
  return publicPaths.some(publicPath => 
    path === publicPath || 
    path.startsWith(`${publicPath}/`) ||
    // Also allow static files and images
    path.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js)$/) ||
    path.startsWith('/_next/')
  );
};

// Check if the API path should be accessible without authentication
const isPublicApiPath = (path: string) => {
  return publicApiPaths.some(publicApiPath => 
    path === publicApiPath || 
    path.startsWith(`${publicApiPath}/`)
  );
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user is authenticated by looking for the Firebase auth cookie
  const authCookie = request.cookies.get('firebase-auth-token')?.value;
  const sessionCookie = request.cookies.get('__session')?.value;
  const isAuthenticated = !!authCookie || !!sessionCookie;

  // Allow access to public paths without authentication
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  
  // Check for API routes
  if (pathname.startsWith('/api/')) {
    // Allow access to public API paths without authentication
    if (isPublicApiPath(pathname)) {
      return NextResponse.next();
    }
    
    // Protect all other API routes
    if (!isAuthenticated) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Authentication required' }),
        { 
          status: 401,
          headers: { 'content-type': 'application/json' } 
        }
      );
    }
    
    return NextResponse.next();
  }

  // If user is not authenticated and tries to access a protected route, redirect to login
  if (!isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated, allow access to protected route
  return NextResponse.next();
}

// Apply middleware to all routes except api routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. _next (Next.js internals)
     * 2. /_next/static (static files)
     * 3. /_next/image (image optimization files)
     * 4. /favicon.ico, /robots.txt, etc. (static files at root)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 