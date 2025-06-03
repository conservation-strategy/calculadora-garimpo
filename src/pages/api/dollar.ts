import { NextApiRequest, NextApiResponse } from "next";
import { fetchDollarQuotation } from "@/lib/api/dollar";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      let data;
      let _fallback = false;
      try {
        console.log('Fetching dollar API data from primary source...');
        let _date = new Date();
        _date.setDate(_date.getDate() - 1);
        data = await fetchDollarQuotation();
  
        if(data.data.value) {
          if(data.data.value.length === 0) {            
            for(let i=0; i<2; i++) {
              _date.setDate(_date.getDate() - 1);
              _date.setHours(0, 0, 0, 0);
              console.log(`Fetching primary dollar API data for date: ${_date}`);
              data = await fetchDollarQuotation(_date);
              if(data.data.value && data.data.value.length > 0) break
            }
          }
        }
        if(!data.data.value || data.data.value.length === 0) {
          _fallback = true;
          console.log('Primary dollar API returned empty data, trying fallback API...');
          data = await fetchDollarQuotation(new Date(), _fallback);
        }
      } catch (error: any) {
        if(!_fallback) {
          console.log('Primary dollar API returned error:', error.message);
          console.log('trying fallback dollar API...')
          data = await fetchDollarQuotation(new Date(), true);
        } else {
          throw new Error('Fallback dollar API failed:', error.message)
        }
      }
      console.log(data);
      
      const now = new Date();
      const spTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
      const nextUpdate = new Date(spTime);
      nextUpdate.setHours(0, 0, 0, 0); // Changed from 13:30 to 00:00
      nextUpdate.setDate(nextUpdate.getDate() + 1); // Always set to next day's midnight    
      
      const maxAge = Math.floor((nextUpdate.getTime() - spTime.getTime()) / 1000);
  
      const response = data.fallback
        ? {
          fallback: data.fallback,
          value: data.data.response.rates.BRL,
          date: data.data.response.date
        }
        : {
          fallback: data.fallback,
          value: (data.data.value[0].cotacaoCompra + data.data.value[0].cotacaoVenda) / 2,
          date: data.data.value[0].dataHoraCotacao
        }
  
  
      res.setHeader('Cache-Control', `public, s-maxage=${maxAge}, stale-while-revalidate, stale-if-error`);
      res.status(200).json(response);
    } catch (error: any) {
      console.error("Error fetching dollar quotation:", error);
      res.setHeader('Cache-Control', 'public, max-age=60, stale-if-error=600');
      res.status(500).json({ error: 'Failed to fetch dollar quotation', message: error.message });
    }
  }
  