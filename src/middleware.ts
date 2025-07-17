import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

    // Basic API key presence check (detailed validation in API route)
    const apiKey = request.headers.get('x-api-key');
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

    // Add CORS headers and continue to API route
    const response = NextResponse.next();
    Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
}

export const config = {
    matcher: '/api/calculate'
};