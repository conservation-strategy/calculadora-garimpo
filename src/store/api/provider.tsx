import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import useCountry from '@/hooks/useCountry';
import { countryCodes } from '@/enums';
import { InflationDataResponse, GoldPriceResponse, DollarQuotationResponse, referenceYears } from '@/lib/api';


export interface GoldPriceResponseWithCache extends GoldPriceResponse {
    cacheVersion?: string;
    cachedAt?: string;
}

export interface InflationDataResponseWithCache extends InflationDataResponse {
    yearOfRef?: number;
    cacheVersion?: string;
    cachedAt?: string;
}

interface PriceContextData {
  goldPriceData: GoldPriceResponseWithCache;
  inflationData: InflationDataResponseWithCache; 
  dollarPriceData: DollarQuotationResponse;
  isLoadingPriceData: boolean;
  isLoadingInflationData: boolean;
  error: any
}

const PriceContext = createContext<PriceContextData>({} as PriceContextData);

interface PriceProviderProps {
  children: ReactNode;
}

const initialStateInflation: InflationDataResponseWithCache = {
    fallback: undefined,
    data: undefined,
    cachedAt: undefined,
    cacheVersion: undefined
}

const initialStateDollar: DollarQuotationResponse = {
    fallback: undefined,
    value: undefined,
    date: undefined
}


export function PriceAPIProvider({ children }: PriceProviderProps) {
  const [goldPriceData, setGoldPriceData] = useState<GoldPriceResponseWithCache>({});
  const [inflationData, setInflationData] = useState<InflationDataResponseWithCache>(initialStateInflation);
  const [dollarPriceData, setDollarPriceData] = useState<DollarQuotationResponse>(initialStateDollar);
  const [isLoadingPriceData, setIsLoadingPriceData] = useState(false);
  const [isLoadingInflationData, setIsLoadingInflationData] = useState(false);
  const [error, setError] = useState<any>(null);
  const { currentCountry } = useCountry();

  useEffect(() => {
    const fetchPriceData = async () => {
        setIsLoadingPriceData(true)
        try {
            const dollarResponse = await fetch(`/api/dollar`);
            const goldResponse = await fetch('/api/gold');
            if (!dollarResponse.ok || !goldResponse.ok) {
                throw new Error(`
                    Failed to fetch dollar price data. Status: 
                    - gold: ${goldResponse.status}
                    - dollar: ${dollarResponse.status}
                `);
            }
            const dollarData = await dollarResponse.json();
            const goldData = await goldResponse.json();
            console.log('dollarData', dollarData)
            console.log('goldData', goldData)
            // const _data = await response.json();
            // console.log('gold hook data', _data);
            setGoldPriceData(goldData);
            setDollarPriceData(dollarData)
        } catch (error: any) {
            console.error('Error fetching price data:', error);
            setError(error);
        } finally {
            setIsLoadingPriceData(false);
        }
    }
    fetchPriceData();
  },[]);

  useEffect(() => {
    if(!currentCountry) return
    const fetchInflation = async () => {
        setIsLoadingInflationData(true)
        try {
            const response = await fetch(`/api/inflation?country=${currentCountry.country}`);
            if (!response.ok) {
                throw new Error('Failed to fetch inflation data');
            }
            const responseData = await response.json();
            console.log('inflationData', responseData);
            const yearOfRef = referenceYears[currentCountry.country];
            const data = {...responseData, yearOfRef}
            setInflationData(data);
        } catch (error: any) {
            console.error('Error fetching inflation data:', error);
            setError(error);
        } finally {
            setIsLoadingInflationData(false);
        }
    };

    fetchInflation();    
  },[currentCountry]);



  return (
    <PriceContext.Provider 
      value={{
        goldPriceData,
        inflationData,
        dollarPriceData,
        isLoadingPriceData,
        isLoadingInflationData,
        error
      }}
    >
      {children}
    </PriceContext.Provider>
  );
}

export function usePriceData() {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error('usePriceData must be used within a PriceProvider');
  }
  return context;
}
