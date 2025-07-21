export interface ApiKeyRecord {
    keyHash: string;
    name: string;
    environment: 'prod' | 'dev' | 'test';
    partner: string;
    isActive: boolean;
    rateLimit: number;
    allowedOrigins: string[];
}

// Build the keys object dynamically from environment variables
function buildProductionKeys(): Record<string, ApiKeyRecord> {
    const keys: Record<string, ApiKeyRecord> = {};
    
    // Add keys based on environment variables
    if (process.env.API_KEY_1_HASH) {
        keys[process.env.API_KEY_1_HASH] = {
            keyHash: process.env.API_KEY_1_HASH,
            name: "CSF DEV",
            environment: "dev",
            partner: "CSF dev",
            isActive: true,
            rateLimit: 7, // Match your test key limit
            allowedOrigins: []
        };
    }
    
    if (process.env.API_KEY_2_HASH) {
        keys[process.env.API_KEY_2_HASH] = {
            keyHash: process.env.API_KEY_2_HASH,
            name: "Earth Genome TEST",
            environment: "test",
            partner: "Earth Genome",
            isActive: true,
            rateLimit: 100,
            allowedOrigins: []
        };
    }

    if (process.env.PROD_AMAZON_MINING_WATCH_API_KEY_HASH) {
        keys[process.env.PROD_AMAZON_MINING_WATCH_API_KEY_HASH] = {
            keyHash: process.env.PROD_AMAZON_MINING_WATCH_API_KEY_HASH,
            name: "Amazon Mining Watch PROD",
            environment: "prod",
            partner: "Amazon Mining Watch",
            isActive: true,
            rateLimit: 100,
            allowedOrigins: []
        };
    }
    
    return keys;
}

const PRODUCTION_KEYS = buildProductionKeys();

// In-memory rate limiting
const rateLimitStore = new Map<string, {
    requests: number[];
    windowStart: number;
}>();

export async function validateApiKey(key: string, origin?: string | null): Promise<ApiKeyRecord | null> {
    const crypto = await import('crypto');
    const keyHash = crypto.createHash('sha256').update(key).digest('hex');
    
    const record = PRODUCTION_KEYS[keyHash];
    if (!record) return null;

    if (!record.isActive) return null;
    
    // Check origin if specified
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