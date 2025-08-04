import { countryCodes } from '@/enums';
import { logApiRequest } from '@/lib/api/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { CalculatorArgs } from '@/lib/calculator';
import { getCityData } from '@/lib/calculator';
import { calculateImpact } from '@/lib/api/external';
import { brUSDInflation, inflationBackupValues, referenceYears } from '@/lib/api';
import { getDollarInflationForStartYear } from '@/lib/api/external/inflation';
import { validateApiKey, checkRateLimit, rateLimitStore } from '@/lib/api/auth/apiKeys';


export type CalculationRequest = {
  locations: CalculatorArgs[];
}

type CalculationResponse = {
  totalImpact: number;
}

type ErrorResponse = {
  error: string;
  details?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CalculationResponse | ErrorResponse>
) {
  
  const startTime = Date.now();  
  try {
    // Method check (although middleware already handles OPTIONS)
    if (req.method !== 'POST') {
      return res.status(405).json({ 
        error: 'Method not allowed',
        details: 'Only POST requests are accepted'
      });
    }

    // API Key validation (now in API route, not middleware)
    const apiKey = req.headers['x-api-key'] as string;
    const origin = req.headers.origin;

    if (!apiKey) {
        return res.status(401).json({
            error: 'Unauthorized',
            details: 'Missing API key'
        });
    }

    const keyRecord = await validateApiKey(apiKey, origin);
    if (!keyRecord) {
        return res.status(403).json({
            error: 'Forbidden',
            details: 'Invalid API key or unauthorized origin'
        });
    }

    // Rate limiting
    if (!checkRateLimit(apiKey, keyRecord.rateLimit)) {
        const rateData = rateLimitStore.get(apiKey);
        res.setHeader('X-RateLimit-Limit', keyRecord.rateLimit.toString());
        res.setHeader('X-RateLimit-Remaining', '0');
        res.setHeader('Retry-After', '60');
        
        return res.status(429).json({
            error: 'Too many requests',
            details: `Rate limit of ${keyRecord.rateLimit} requests per minute exceeded`
        });
    }

    // Add rate limit headers for successful requests
    const rateData = rateLimitStore.get(apiKey);
    if (rateData) {
        res.setHeader('X-RateLimit-Limit', keyRecord.rateLimit.toString());
        res.setHeader('X-RateLimit-Remaining', 
            (keyRecord.rateLimit - rateData.requests.length).toString()
        );
    }

    // Input validation with detailed errors
    const { locations } = req.body as CalculationRequest;
    
    if (!locations) {
      return res.status(400).json({ 
        error: 'Missing data',
        details: 'The locations array is required'
      });
    }

    if (!Array.isArray(locations)) {
      return res.status(400).json({ 
        error: 'Invalid data type',
        details: 'locations must be an array'
      });
    }

    if (locations.length === 0) {
      return res.status(400).json({ 
        error: 'Empty data',
        details: 'locations array cannot be empty'
      });
    }
    
    let totalImpact = 0;
    let prevRefYear = null;
    let inflation = null;
    for (let index = 0; index < locations.length; index++) {
      // Validate each location with specific error messages
      const location = locations[index];
      if (!location.country || !Object.values(countryCodes).includes(location.country as countryCodes)) {
        return res.status(400).json({ 
          error: 'Invalid country',
          details: `Location at index ${index} has invalid country code. Valid codes are: ${Object.values(countryCodes).join(', ')}`
        });
      }

      const cityData = getCityData(location.country, location.city);
      if (!location.city || typeof location.city !== 'string' || !cityData) {
        return res.status(400).json({ 
          error: 'Invalid city',
          details: `Location at index ${index} has invalid or missing city`
        });
      }
      
      if (typeof location.affectedArea !== 'number' || location.affectedArea <= 0) {
        return res.status(400).json({ 
          error: 'Invalid area',
          details: `Location at index ${index} has invalid or missing area`
        });
      }

      const refYear = referenceYears[location.country];
      if(refYear !== prevRefYear) {
        try {
          inflation = await getDollarInflationForStartYear(refYear);
        } catch (error) {
          console.error(error);
          console.log("Using inflation backup values");
          inflation = location.country === countryCodes.BR
            ? brUSDInflation
            : inflationBackupValues[location.country];
        }
        prevRefYear = refYear;
      }
      if(!inflation) throw new Error("Error fetching inflationData");
      console.log(`acc inflation for country ${location.country}: ${inflation}`);
      const inflationCorr = (inflation / 100) + 1;

      const impact = calculateImpact(location) * inflationCorr;
      console.log(`total impact for ${location.city}: ${impact}`);
      totalImpact += impact;
    }

    // Perform calculations
    // const result = await calculateImpact(locations);

    // Cache results for 1 hour if calculations are expensive
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=600');
    logApiRequest(req, 200, Date.now() - startTime);
    return res.status(200).json({ totalImpact });
  } catch (error) {
    console.error('Error processing calculation:', error);
    logApiRequest(req, 500, Date.now() - startTime);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: 'An unexpected error occurred while processing the calculation'
    });
  }
}

// Implement your calculation logic here
// async function calculateImpact(locations: CalculatorArgs[]): Promise<CalculationResponse> {
//   // Your calculation implementation
//   return {
//     totalImpact: 990,
//     mercuryExposure: 990,
//     deforestationArea: 990,
//     economicLoss: 990
//   }
// }