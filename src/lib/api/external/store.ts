import { countryCodes } from "@/enums";

export interface CalculatorArgs {
    // city: string;
    regionId: number;
    country: countryCodes;
    affectedArea: number;
}

export const pitDepth = 2.5;
export const daysInTheYear = 365;
export const hoursWorkedByDredgePerDay = 24;
export const valueHypothesis = 0.29; // CONSERVATIVE
  
