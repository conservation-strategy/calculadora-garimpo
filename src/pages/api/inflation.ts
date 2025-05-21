import { NextApiRequest, NextApiResponse } from 'next';
import { fetchCumulativeInflationData } from '@/lib/api/inflation';
import { countryCodes } from '@/enums';
import { CACHE_VERSION, CACHE_DURATION, CACHE_REVALIDATION } from '@/lib/api/inflation';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { country, forceRefresh } = req.query;

  if (!Object.values(countryCodes).includes(country as countryCodes)) {
    return res.status(400).json({ error: 'invalid country param' });
  }

  const shouldSkipCache = 
    req.headers['x-force-refresh'] === 'true' || 
    forceRefresh === 'true';

  if (shouldSkipCache) {
    res.setHeader('Cache-Control', 'no-store');
  } else {
    // Include version in the Vary header to ensure different versions are cached separately
    res.setHeader('Vary', 'x-cache-version');
    res.setHeader('x-cache-version', CACHE_VERSION);
    res.setHeader('Cache-Control', `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_REVALIDATION}`);
  }

  try {
    console.log('fetching inflation data from primary source...')
    const response = await fetchCumulativeInflationData(country as countryCodes);

    if (!response.ok) {
      console.log('fetch from primary source failed. Status:', response.status);
      console.log('fetching from fallback source...')
      const fallback = await fetchCumulativeInflationData(country as countryCodes, true);
      if (fallback.ok) {
        return res.status(200).json({
          ...fallback,
          cacheVersion: CACHE_VERSION,
          cachedAt: new Date().toISOString()
        });
      }
      throw new Error(`Failed to fetch inflation data. Status: ${fallback.status}`);
    }

    return res.status(200).json({
      ...response,
      cacheVersion: CACHE_VERSION,
      cachedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching inflation data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default handler;

// real fallback query
// https://api.stlouisfed.org/fred/series/observations?series_id=FPCPITOTLZGBRA&observation_start=2020-01-01&observation_end=2024-12-31&api_key=YOUR_API_KEY&file_type=json


// dolar fallback query
// https://api.stlouisfed.org/fred/series/observations?series_id=FPCPITOTLZGUSA&observation_start=2020-01-01&observation_end=2024-12-31&api_key=YOUR_API_KEY&file_type=json

// fallback data response example
// fallback data {
//     realtime_start: '2025-05-20',
//     realtime_end: '2025-05-20',
//     observation_start: '2020-01-01',
//     observation_end: '2024-12-31',
//     units: 'lin',
//     output_type: 1,
//     file_type: 'json',
//     order_by: 'observation_date',
//     sort_order: 'asc',
//     count: 5,
//     offset: 0,
//     limit: 100000,
//     observations: [
//       {
//         realtime_start: '2025-05-20',
//         realtime_end: '2025-05-20',
//         date: '2020-01-01',
//         value: '3.21176803803376'
//       },
//       {
//         realtime_start: '2025-05-20',
//         realtime_end: '2025-05-20',
//         date: '2021-01-01',
//         value: '8.30165975585673'
//       },
//       {
//         realtime_start: '2025-05-20',
//         realtime_end: '2025-05-20',
//         date: '2022-01-01',
//         value: '9.28010608956873'
//       },
//       {
//         realtime_start: '2025-05-20',
//         realtime_end: '2025-05-20',
//         date: '2023-01-01',
//         value: '4.59356282283204'
//       },
//       {
//         realtime_start: '2025-05-20',
//         realtime_end: '2025-05-20',
//         date: '2024-01-01',
//         value: '4.36746407652337'
//       }
//     ]
//   }
  