
export function calculateCumulativeInflation(annualRates: (number | string)[]): number {
  return (
      annualRates.reduce((accumulator: number, rate) => {
          const numRate = Number(rate);
          if (isNaN(numRate)) {
              throw new Error('Invalid rate value');
          }
          return accumulator * (1 + numRate / 100);
      }, 1) - 1
  ) * 100;
}