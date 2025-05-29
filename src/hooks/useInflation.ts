import { useState, useEffect } from 'react';
import { countryCodes } from '@/enums';

interface InflationData {
    data: number;
    fallback: boolean;
}

const useInflation = (country: countryCodes | undefined) => {
    const [data, setData] = useState<InflationData>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    
    useEffect(() => {
        if(!country) return
        const fetchInflation = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(`/api/inflation?country=${country}&force-refresh=true`);
                if (!response.ok) {
                    throw new Error('Failed to fetch inflation data');
                }
                const _data = await response.json();
                // console.log('hook data', _data);
                setData(_data);
            } catch (error) {
                console.error('Error fetching inflation data:', error);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInflation();
    }, [country]);

    return {
        data,
        isLoading,
        error
    }
};

export default useInflation;
