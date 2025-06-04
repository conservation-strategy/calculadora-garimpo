import { fetchWithRetries } from ".";

export interface DollarQuotationResponse {
    fallback?: boolean;
    value?: number;
    date?: string;
}

export async function fetchDollarQuotation(date=new Date(), fallback=false) {
    let apiUrl;
    const api_key = process.env.CURRENCY_BEACON_API_KEY;
    if(!api_key) console.warn('Missing env: CURRENCY_BEACON_API_KEY');
      
    if(fallback) {
      if(!api_key) throw new Error('Missing env: CURRENCY_BEACON_API_KEY');
      const baseUrl = 'https://api.currencybeacon.com/v1/latest';
      const queryParams = new URLSearchParams({
        'api_key': `${process.env.CURRENCY_BEACON_API_KEY}`,
        'base': 'USD',
        'symbols': 'BRL'
      });
      apiUrl = `${baseUrl}?${queryParams}`;
    } else {
      // const now = new Date();
      const formattedDate = date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        timeZone: 'America/Sao_Paulo'
      }).split('/').join('-');
  
      const baseUrl = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata';
      const endpoint = 'CotacaoDolarDia(dataCotacao=@dataCotacao)';
      const queryParams = new URLSearchParams({
        '@dataCotacao': `'${formattedDate}'`,
        '$top': '1',
        '$format': 'json',
        '$select': 'cotacaoCompra,cotacaoVenda,dataHoraCotacao'
      });
  
      apiUrl = `${baseUrl}/${endpoint}?${queryParams}`;
    }
    const response = await fetchWithRetries(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return {
      fallback,
      data: await response.json()
    };
}
  