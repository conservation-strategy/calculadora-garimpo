import { NextApiRequest, NextApiResponse } from 'next';
import { CACHE_DURATION, CACHE_VERSION, CACHE_REVALIDATION, fetchGoldPriceInUSD } from '@/lib/api/gold';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { forceRefresh } = req.query;

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

  const response = await fetchGoldPriceInUSD();
  
  if (response.error) {
    return res.status(500).json({
      ...response,
      cacheVersion: CACHE_VERSION,
      cachedAt: new Date().toString()
    });
  }
  
  return res.status(200).json(response);
};

export default handler;