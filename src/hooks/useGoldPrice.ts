import { useState, useEffect } from 'react';
import { GoldPriceResponse } from '@/lib/api/gold';

const useGoldPrice = () => {
    const [data, setData] = useState<GoldPriceResponse>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    
    useEffect(() => {
        const fetchGoldPrice = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`/api/gold`);
                // console.log('response in hook', response)
                if (!response.ok) {
                    throw new Error(`Failed to fetch gold price data. Status ${response.status}`);
                }
                const _data = await response.json();
                // console.log('gold hook data', _data);
                setData(_data);
            } catch (error) {
                console.error('Error fetching gold price data:', error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGoldPrice()
    }, []);

    return {
        data,
        isLoading,
        error
    }
};

export default useGoldPrice;
