import { calculateCumulativeInflation } from "@/utils/inflation";
import { fetchWithRetries } from "..";
import { extractValues, validateEnvVariables } from "../inflation";

export async function fetchDollarInflation(startYear: number, fallback=false) {
    let data: any;
    const currentYear = new Date().getFullYear();

    if(!process.env.FRED_API_KEY) {
        console.warn('missing env: FRED_API_KEY');
    }

    if(fallback) {
        validateEnvVariables();
        console.log('fetching inflationData from fallback source...')
        const apiKey = process.env.FRED_API_KEY;
        const startDate = `${startYear}-01-01`;
        const endDate = `${currentYear}-01-01`;
        const currencyCountry = "USA";
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
        // console.log('fallback values type', typeof values[0])
        data = calculateCumulativeInflation(values);
    } else {
        const currencyCountry = 'US';
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
        json: async() => ({ data }),
        ok: true,
        status: 200
    };
}