import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === 'production';
  const hostname = request.headers.get('host') || '';
  const proto = request.headers.get('x-forwarded-proto') || '';

  if (isProduction) {
    // Redirect if it's the non-www domain (indinest.co.uk)
    // Or if it's the www domain but served over http (to ensure final is always https://www.indinest.co.uk)
    if (hostname === 'indinest.co.uk' || (hostname === 'www.indinest.co.uk' && proto === 'http')) {
      const url = request.nextUrl.clone();
      url.protocol = 'https:';
      url.host = 'www.indinest.co.uk';
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml
     * - robots.txt
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo|sitemap.xml|robots.txt).*)',
  ],
};
