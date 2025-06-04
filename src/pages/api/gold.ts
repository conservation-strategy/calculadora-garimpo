import { NextApiRequest, NextApiResponse } from 'next';
import { GOLD_CACHE_DURATION, GOLD_CACHE_VERSION, GOLD_CACHE_REVALIDATION, fetchGoldPriceInUSD } from '@/lib/api/gold';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { forceRefresh } = req.query;
  const shouldSkipCache = 
    req.headers['x-force-refresh'] === 'true' || 
    forceRefresh === 'true';

  const response = await fetchGoldPriceInUSD();
  
  if (response.error) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(500).json(response);
  }

  const responseWithMetadata = {
    ...response,
    cacheVersion: GOLD_CACHE_VERSION,
    cachedAt: new Date().toISOString()
  };
  
  if (shouldSkipCache) {
    res.setHeader('Cache-Control', 'no-store');
  } else {
    res.setHeader('Vary', 'x-cache-version');
    res.setHeader('x-cache-version', GOLD_CACHE_VERSION);
    res.setHeader('Cache-Control', `public, s-maxage=${GOLD_CACHE_DURATION}, stale-while-revalidate=${GOLD_CACHE_REVALIDATION}`);
  }
  
  return res.status(200).json(responseWithMetadata);
};

export default handler;