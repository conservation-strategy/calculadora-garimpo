// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateApiKey, checkRateLimit, rateLimitStore } from '@/lib/api/auth/apiKeys';

// Request size config
const MAX_BODY_SIZE = 1024 * 50; // 50KB limit

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    'Access-Control-Expose-Headers': 'X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset'
};

export async function middleware(request: NextRequest) {
    // Only apply to calculate endpoint
    if (!request.nextUrl.pathname.startsWith('/api/calculate')) {
        return NextResponse.next();
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
            headers: {
                ...corsHeaders,
                'Access-Control-Max-Age': '86400',
            },
        });
    }

    // Check request size
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
                    ...corsHeaders
                }
            }
        );
    }

    // API Key validation
    const apiKey = request.headers.get('x-api-key');
    const origin = request.headers.get('origin');

    if (!apiKey) {
        return new NextResponse(
            JSON.stringify({
                error: 'Unauthorized',
                details: 'Missing API key'
            }),
            {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            }
        );
    }

    const keyConfig = validateApiKey(apiKey, origin);
    if (!keyConfig) {
        return new NextResponse(
            JSON.stringify({
                error: 'Forbidden',
                details: 'Invalid API key or unauthorized origin'
            }),
            {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            }
        );
    }

    // Check rate limit
    if (!checkRateLimit(apiKey)) {
        return new NextResponse(
            JSON.stringify({
                error: 'Too many requests',
                details: `Rate limit of ${keyConfig.rateLimit} requests per minute exceeded`
            }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders,
                    'Retry-After': '60'
                }
            }
        );
    }

    // Add headers to successful response
    const response = NextResponse.next();
    Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    // Add rate limit info to headers
    const rateData = rateLimitStore.get(apiKey);
    if (rateData) {
        response.headers.set('X-RateLimit-Limit', keyConfig.rateLimit.toString());
        response.headers.set('X-RateLimit-Remaining', 
            (keyConfig.rateLimit - rateData.requests.length).toString()
        );
    }

    return response;
}

export const config = {
    matcher: '/api/calculate'
};