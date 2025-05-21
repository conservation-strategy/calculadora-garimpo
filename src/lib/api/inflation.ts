import { fetchWithRetries } from "@/lib/api";
import { calculateCumulativeInflation } from "@/utils/inflation";
import { countryCodes } from "@/enums";

export const CACHE_VERSION = '1.0';
export const CACHE_DURATION = 30 * 24 * 60 * 60; // 1 MONTH
export const CACHE_REVALIDATION = 24 * 60 * 60; // 1 DAY

interface FREDObservation {
    realtime_start: string;
    realtime_end: string;
    date: string;
    value: string;
}

interface FREDResponse {
    realtime_start: string;
    realtime_end: string;
    observation_start: string;
    observation_end: string;
    units: string;
    output_type: number;
    file_type: string;
    order_by: string;
    sort_order: string;
    count: number;
    offset: number;
    limit: number;
    observations: FREDObservation[];
}

export interface WorldBankResponse {
    country: {
        id: string;
        value: string;
    };
    countryiso3code: string;
    date: string;
    decimal: number;
    indicator: {
        id: string;
        value: string;
    };
    obs_status: string;
    unit: string;
    value: number;
}

export type InflationDataObject = WorldBankResponse | FREDObservation;

export function extractValues(data: InflationDataObject[]): (string | number)[] {
    return data.map(item => item.value);
}

const referenceYears = {
    'BR': 2022,
    'CO': 2023,
    'EC': 2023,
    'PE': 2023,
    'GU': 2024,
    'SU': 2024,
    'BO': 2024
}

function validateEnvVariables() {
    if (!process.env.FRED_API_KEY) {
        throw new Error('FRED_API_KEY environment variable is not set');
    }
}

export async function fetchCumulativeInflationData (    
    country: countryCodes,
    fallback = false,
) {
    // let apiUrl: string;
    let data: any;
    const currentYear = new Date().getFullYear();    
    const isBrazil = country === 'BR';
    const startYear = referenceYears[country];
    if(!process.env.FRED_API_KEY) {
        console.warn('missing env: FRED_API_KEY');
    }
    
    if(fallback) {
        validateEnvVariables();
        console.log('fallback source')
        const apiKey = process.env.FRED_API_KEY;
        const currencyCountry = isBrazil ? 'BRA' : 'USA';
        const startDate = `${startYear}-01-01`;
        const endDate = `${currentYear}-01-01`;
        const url = `
            https://api.stlouisfed.org/fred/series/observations?series_id=FPCPITOTLZG${currencyCountry}&observation_start=${startDate}&observation_end=${endDate}&api_key=${apiKey}&file_type=json
        `
        const response = await fetchWithRetries(url);

        if(!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return response;
        }

        const resData = await response.json();
        const values = extractValues(resData.observations); // extracts inflation values from response data
        console.log('fallback values type', typeof values[0])
        data = calculateCumulativeInflation(values);
    } else {
        const currencyCountry = isBrazil ? 'BR' : 'US';
        const url = `
            https://api.worldbank.org/v2/country/${currencyCountry}/indicator/FP.CPI.TOTL.ZG?date=${startYear}:${currentYear}&format=json
        `
        const response = await fetchWithRetries(url);

        if(!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return response;
        }

        const resData = await response.json(); // returns [metadata, data]        
        const values = extractValues(resData[1]).reverse(); // extracts inflation values from response data and puts in increasing chronological order
        data = calculateCumulativeInflation(values);
    }

    return {
        fallback,
        data,
        ok: true,
        status: 200
    }
}