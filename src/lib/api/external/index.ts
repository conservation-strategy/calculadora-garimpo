import { CalculatorArgs } from "@/lib/calculator";
import { 
    calculateDeforestationImpact, 
    calculateSiltingOfRiversImpact, 
    calculateMercuryImpact 
} from "@/lib/calculator";
import { getCountryData } from "@/lib/calculator";
import { filterValuesBelowOnePercent, sumValues } from "@/utils/filterValues";


/** FIXED VALUES FOR EXTERNAL API CALCULATOR
 * 
 * - typeMining: ALLUVION
 * - unitAnalysis: IMPACTED_AREA
 * - retort: NO
 * - pitDepth: 2.5
 * - valueHypothesis: CONSERVATIVE * 
 * 
 */

// const args = [{
//     city: "Alta Floresta D'Oeste",
//     country: countryCodes.BR,
//     affectedArea: 2
// }];

// export function calculateTotalImpact() {
//     try {
//         let totalImpact = 0;
//         for(let arg of args) {
//             const _impact = calculateImpact(arg);
//             totalImpact += _impact;
//         }
//         return totalImpact;
//     } catch(error: any) {
//         throw new Error(error)
//     }
// }

export function calculateImpact(args: CalculatorArgs) {
    try {
        const countryData = getCountryData(args.country);
        const {
            bioprospecting,
            carbon,
            recoverOfTopSoll,
            woodAndNonWoodProducts,
            general,
            erosionSiltingUp,
            dredgingAndRiverSediments,
            cavaGroundingCostAuNorm,
            cavaGroundingCostAuFertile,
            neuroSymptomsGarimpeiro,
            hypertension,
            lossQI,
            heartAttack,
            soilMercuryRemediation
        } = countryData;
        const deforestationInputs = {
            ...args, 
            bioprospecting, 
            carbon, 
            recoverOfTopSoll, 
            woodAndNonWoodProducts, 
            general
        };
        const siltingInputs = {
            ...args, 
            general, 
            erosionSiltingUp, 
            dredgingAndRiverSediments, 
            cavaGroundingCostAuFertile, 
            cavaGroundingCostAuNorm
        };
        const mercuryInputs = {
            ...args, 
            general, 
            neuroSymptomsGarimpeiro, 
            hypertension, 
            lossQI, 
            heartAttack, 
            soilMercuryRemediation
        };
        const _def = calculateDeforestationImpact(deforestationInputs);
        const totalDeforestation = sumValues(filterValuesBelowOnePercent(Object.values(_def)));

        const _silt = calculateSiltingOfRiversImpact(siltingInputs);
        const totalSilting = sumValues(filterValuesBelowOnePercent(Object.values(_silt)));

        const _mer = calculateMercuryImpact(mercuryInputs);
        const totalMercury = sumValues(filterValuesBelowOnePercent(Object.values(_mer)));

        console.log('impacts', _def, _silt, _mer)
        const total = totalDeforestation + totalSilting + totalMercury;
        return total;
    } catch(error: any) {
        console.error(error)
        throw new Error(error);
    }
}
