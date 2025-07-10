// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// request size config
const MAX_BODY_SIZE = 1024 * 50; // 50KB limit

// Rate limit configuration
const RATE_LIMIT = {
  WINDOW_SIZE: 60 * 1000, // 1 minute in milliseconds
  MAX_REQUESTS: 100
};

// In-memory store
const rateLimit = new Map();

export async function middleware(request: NextRequest) {
  // Only apply to calculate endpoint
  if (!request.nextUrl.pathname.startsWith('/api/calculate')) {
    return NextResponse.next();
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400', // 24 hours
      },
    });
  }
  
  // check request size
  if (request.headers.get('content-length') && 
        parseInt(request.headers.get('content-length')!) > MAX_BODY_SIZE) {
    return new NextResponse(
        JSON.stringify({ 
        error: 'Request too large',
        details: 'Request body exceeds 50KB limit'
        }),
        {
        status: 413,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        }
    );
  }

  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'anonymous';
  const now = Date.now();

  const windowData = rateLimit.get(ip) ?? {
    requests: [],
    windowStart: now,
  };

  // Clean old requests
  windowData.requests = windowData.requests.filter(
    (time: number) => time > now - RATE_LIMIT.WINDOW_SIZE
  );

  // Check if rate limited
  if (windowData.requests.length >= RATE_LIMIT.MAX_REQUESTS) {
    const resetTime = windowData.requests[0] + RATE_LIMIT.WINDOW_SIZE;
    return new NextResponse(
      JSON.stringify({ 
        error: 'Too many requests',
        resetAt: new Date(resetTime).toISOString()
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-RateLimit-Limit': RATE_LIMIT.MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetTime.toString(),
          'Retry-After': Math.ceil((resetTime - now) / 1000).toString()
        },
      }
    );
  }

  // Update rate limit data
  windowData.requests.push(now);
  rateLimit.set(ip, windowData);

  // Add rate limit headers to successful requests
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', RATE_LIMIT.MAX_REQUESTS.toString());
  response.headers.set(
    'X-RateLimit-Remaining', 
    (RATE_LIMIT.MAX_REQUESTS - windowData.requests.length).toString()
  );
  response.headers.set(
    'X-RateLimit-Reset', 
    (now + RATE_LIMIT.WINDOW_SIZE).toString()
  );

  return response;
}

// Configure matcher for the middleware
export const config = {
  matcher: '/api/calculate'
};