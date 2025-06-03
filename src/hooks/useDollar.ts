import { useState, useEffect } from 'react';
import { DollarQuotationResponse } from '@/lib/api/dollar';

export interface UseDollarResponse {
    data: DollarQuotationResponse;
    isLoading: boolean;
    error: any;
}

const useDollar = () => {
    const [data, setData] = useState<DollarQuotationResponse>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    
    useEffect(() => {
        const fetchDolarPrice = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`/api/dollar`);
                // console.log('response in hook', response)
                if (!response.ok) {
                    throw new Error(`Failed to fetch dollar price data. Status ${response.status}`);
                }
                const _data = await response.json();
                // console.log('gold hook data', _data);
                setData(_data);
            } catch (error) {
                console.error('Error fetching dollar price data:', error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDolarPrice();
    }, []);

    return {
        data,
        isLoading,
        error
    }
};

export default useDollar;
