import { countryCodes } from '@/enums';

export * from './city';
export * from './country';
export * from './deforestation';
export * from './mercury';
export * from './silting';

export interface CalculatorArgs {
    city: string;
    country: countryCodes;
    affectedArea: number;
}