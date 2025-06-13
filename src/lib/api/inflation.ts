import { fetchWithRetries } from "@/lib/api";
import { calculateCumulativeInflation } from "@/utils/inflation";
import { countryCodes } from "@/enums";

export const INFLATION_CACHE_VERSION = '1.0';
export const INFLATION_CACHE_DURATION = 30 * 24 * 60 * 60; // 1 MONTH
export const INFLATION_CACHE_REVALIDATION = 24 * 60 * 60; // 1 DAY

export interface InflationDataResponse {
    fallback?: boolean;
    data?: number;
}

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

export const referenceYears = {
    [countryCodes.BR]: 2020,
    [countryCodes.CO]: 2023,
    [countryCodes.EC]: 2023,
    [countryCodes.PE]: 2023,
    [countryCodes.GU]: 2024,
    [countryCodes.SU]: 2024,
    [countryCodes.BO]: 2024
}

export const inflationBackupValues = {
    [countryCodes.BR]: 33.34462854936184,
    [countryCodes.CO]: 7.187276026742517,
    [countryCodes.EC]: 7.187276026742517,
    [countryCodes.PE]: 7.187276026742517,
    [countryCodes.GU]: 2.949525204852077,
    [countryCodes.SU]: 2.949525204852077,
    [countryCodes.BO]:2.949525204852077,
    date: "2025-06-05T17:42:11.463Z"
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