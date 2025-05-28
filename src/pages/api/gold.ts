import { NextApiRequest, NextApiResponse } from 'next';
import { fetchGoldPriceInUSD } from '@/lib/api/gold';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const response = await fetchGoldPriceInUSD();
  
  if (response.error) {
    return res.status(500).json(response);
  }
  
  return res.status(200).json(response);
};

export default handler;