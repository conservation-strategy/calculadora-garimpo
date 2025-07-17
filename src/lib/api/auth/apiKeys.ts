import { ProductionKeyManager } from './keyManager';

const keyManager = new ProductionKeyManager();

// In-memory rate limiting (same as before)
const rateLimitStore = new Map<string, {
    requests: number[];
    windowStart: number;
}>();

export async function validateApiKey(key: string, origin?: string | null): Promise<ApiKeyRecord | null> {
    const record = await keyManager.validateKey(key);
    
    if (!record) return null;
    
    // Optional origin check
    if (origin && record.allowedOrigins.length > 0) {
        if (!record.allowedOrigins.includes(origin)) {
            return null;
        }
    }
    
    return record;
}

export function checkRateLimit(key: string, limit: number): boolean {
    const now = Date.now();

    const windowData = rateLimitStore.get(key) ?? {
        requests: [],
        windowStart: now
    };

    // Clean old requests (older than 1 minute)
    windowData.requests = windowData.requests.filter(
        time => time > now - 60000
    );

    if (windowData.requests.length >= limit) {
        return false;
    }

    windowData.requests.push(now);
    rateLimitStore.set(key, windowData);
    return true;
}

// Export for header access
export { rateLimitStore };