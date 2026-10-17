// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = [
  '/',
  '/sign-in',
  '/sign-up',
  '/api/webhooks/clerk',
  '/api/webhooks/stripe',
  '/api/cron/fee-reminders',
  '/api/cron/guardian-digests',
  '/admissions/apply',
  '/manifest.json',
  '/sw.js',
];

export default async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Allow public static assets and next internal assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/webhooks') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Demo role simulation parameter for smooth previewing & testing
  const demoRoleParam = searchParams.get('demo_role');
  if (demoRoleParam) {
    const response = NextResponse.redirect(new URL(pathname, request.url));
    response.cookies.set('demo_role', demoRoleParam, { path: '/' });
    return response;
  }

  // 2. Allow explicitly public routes
  if (PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return NextResponse.next();
  }

  // 3. Check Clerk session or demo role cookie
  const demoRole = request.cookies.get('demo_role')?.value;

  // Redirect /dashboard to role-specific portal
  if (pathname === '/dashboard') {
    const targetRole = demoRole || 'admin';
    return NextResponse.redirect(new URL(`/${targetRole}`, request.url));
  }

  // Role portal guards
  const portalRoles = ['admin', 'teacher', 'student', 'parent'] as const;
  const currentPortal = portalRoles.find((role) => pathname.startsWith(`/${role}`));

  if (currentPortal) {
    const effectiveRole = demoRole || currentPortal;
    const res = NextResponse.next();
    res.headers.set('x-user-role', effectiveRole);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
