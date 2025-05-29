import { fetchWithRetries } from ".";

export const CACHE_VERSION = '1.0';
export const CACHE_DURATION = 7 * 24 * 60 * 60; // 1 WEEK
export const CACHE_REVALIDATION = 24 * 60 * 60; // 1 DAY

const METAL_PRICE_API_KEY = process.env.METAL_PRICE_API_KEY;
const METAL_PRICE_API_URL = `https://api.metalpriceapi.com/v1/latest?api_key=${METAL_PRICE_API_KEY}&base=USD&currencies=XAU`;
const GOLD_API_KEY = process.env.GOLD_API_KEY;
const GOLD_API_URL = `https://www.goldapi.io/api/XAU/USD`;


export const ozToGrams = (oz: number) => {
    return oz / 31.1034768;
}


export interface GoldPriceResponse {
    data: number;
    fallback: boolean;
    timestamp?: string;
    error?: string;
}


export const fetchGoldPriceInUSD = async (): Promise<GoldPriceResponse> => {
    try {
        if(!METAL_PRICE_API_KEY) throw new Error('missing env: METAL_PRICE_API_KEY');
        if(!GOLD_API_KEY) console.warn('missing env: GOLD_API_KEY');

        let primaryFailed = false;
        let response: any;
        
        console.log('Fetching gold price data from primary source...');
        try {
            response = await fetchWithRetries(METAL_PRICE_API_URL);
            const currentRequests = Number(response.headers.get('x-api-current'));
            const quota = Number(response.headers.get('x-api-quota'));
            
            primaryFailed = !response.ok || (currentRequests > quota);
            
            if (currentRequests > quota) {
                console.warn('Rate limit exceeded for primary source');
            }
        } catch (error) {
            console.error('Error fetching gold price data from primary source:', error);
            primaryFailed = true;
        }

        // If primary source failed or returned non-ok response, try fallback
        if (primaryFailed) {
            console.log('Using fallback source for gold price data...');
            if(!GOLD_API_KEY) throw new Error('missing env: GOLD_API_KEY')
            const fallback = await fetch(GOLD_API_URL, {
                method: 'GET',
                headers: {
                    'x-access-token': GOLD_API_KEY,
                    'Content-Type': 'application/json',
                },
            });

            if(!fallback.ok) {
                throw new Error(`Failed to fetch gold data. Status: ${fallback.status}`);
            }

            const data = await fallback.json();
            return {
                data: ozToGrams(data.price),
                fallback: true,
                timestamp: new Date().toISOString()
            };
        }

        const data = await response!.json();
        return {
            data: ozToGrams(data.rates.USDXAU),
            fallback: false,
            timestamp: new Date().toISOString()
        };
    } catch(error: any) {
        return {
            data: 0,
            fallback: false,
            error: error.message || 'Failed to fetch gold price data'
        };
    }
}


export const getGoldPrice = async () => {
    try {
        const response = await fetch('/api/gold');
        if(!response.ok) {
            throw new Error(`failed to fetch gold price data. Status: ${response.status}`);
        }
        return response.json();
    } catch(error: any) {
        console.error(error || 'Fail to fetch data from Gold price API');
        return null;
    }
}