import devApiKeys from '@/config/apiKeys.development.json';
import prodApiKeys from '@/config/apiKeys.json';

interface ApiKeyConfig {
    key: string;
    name: string;
    rateLimit: number;
    allowedOrigins: string[];
}

interface ApiKeysConfigFile {
    keys: ApiKeyConfig[];
}

// In-memory rate limiting
export const rateLimitStore = new Map<string, {
    requests: number[];
    windowStart: number;
}>();

const typedConfigDev = devApiKeys as ApiKeysConfigFile;
const typedConfigProd = prodApiKeys as ApiKeysConfigFile;

// Load keys at startup
const API_KEYS = new Map<string, ApiKeyConfig>(
    (process.env.NODE_ENV === 'development' ? typedConfigDev : typedConfigProd)
        .keys.map(key => [key.key, key])
);

export function validateApiKey(key: string, origin?: string | null): ApiKeyConfig | null {
    const config = API_KEYS.get(key);
    
    if (!config) return null;
    
    // Optional origin check
    if (origin && config.allowedOrigins.length > 0) {
        if (!config.allowedOrigins.includes(origin)) {
            return null;
        }
    }
    
    return config;
}

// Optional: Rate limiting helper
export function checkRateLimit(key: string): boolean {
    const now = Date.now();
    const config = API_KEYS.get(key);
    if (!config) return false;

    const windowData = rateLimitStore.get(key) ?? {
        requests: [],
        windowStart: now
    };

    // Clean old requests (older than 1 minute)
    windowData.requests = windowData.requests.filter(
        time => time > now - 60000
    );

    if (windowData.requests.length >= config.rateLimit) {
        return false;
    }

    windowData.requests.push(now);
    rateLimitStore.set(key, windowData);
    return true;
}