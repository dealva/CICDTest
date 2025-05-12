import { NextResponse } from 'next/server';
import { createCsrfMiddleware } from '@edge-csrf/nextjs';

const csrfMiddleware = createCsrfMiddleware({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
  },
});

// Generate a nonce using a UUID (compatible with Edge Runtime)
function generateNonce() {
  return crypto.randomUUID().replace(/-/g, '');
}

function applySecurityHeaders(request, response, nonce) {
  // const isDev = process.env.NODE_ENV !== 'production';

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('Permissions-Policy', 'geolocation=(), camera=()');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // CORS
  const origin = `${request.nextUrl.protocol}//${request.headers.get('host')}`;
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token'
  );
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  // Content Security Policy
  // response.headers.set(
  //   'Content-Security-Policy',
  //   `default-src 'self'; script-src 'self' https://www.google.com https://www.gstatic.com;`
  // );

  // if (!isDev) {
  //   response.cookies.set('nonce', nonce, {
  //     httpOnly: false,
  //     path: '/',
  //     sameSite: 'Lax',
  //     secure: true,
  //   });
  // }

  return response;
}

export async function middleware(request) {
  const nonce = generateNonce();
  const pathname = request.nextUrl.pathname;

  if (pathname === '/register' || pathname === '/api/auth/register') {
    const response = await csrfMiddleware(request);
    return applySecurityHeaders(request, response, nonce);
  }

  const response = NextResponse.next();
  return applySecurityHeaders(request, response, nonce);
}
