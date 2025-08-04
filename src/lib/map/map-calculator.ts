import { filterValuesBelowOnePercent, sumValues } from "@/utils/filterValues";
import { 
    calculateDeforestationImpact, 
    calculateMercuryImpact, 
    calculateSiltingOfRiversImpact, 
    CalculatorArgs, 
    DeforestationImpact, 
    getCountryData, 
    MercuryImpact, 
    MercuryNotMonetary, 
    SiltingOfRiversImpact,
    SiltingOfRiversNotMonetary
} from "../calculator";
import { hectareToGold } from "../calculator/gold";
import { brUSDInflation, inflationBackupValues, referenceYears } from "../api";
import { getDollarInflationForStartYear } from "../api/external/inflation";
import { countryCodes } from "@/enums";

export interface LocationImpact {
    deforestation: DeforestationImpact;
    siltingOfRivers: SiltingOfRiversImpact;
    mercury: MercuryImpact;
    totalImpact: number;
    totalGold: number;
    notMonetary: {
        mercury: MercuryNotMonetary;
        siltingOfRivers: SiltingOfRiversNotMonetary;
    }
}

export interface MapCalculatorArgs {
    locations: CalculatorArgs[];
    pitDepth: number;
}

export async function calculateMapImpacts(args : MapCalculatorArgs) {
    const impacts: LocationImpact[] = [];
    const { locations, pitDepth } = args;
    let prevRefYear = null;
    let inflation = 0;

    for(let loc of locations) {
        const refYear = referenceYears[loc.country];
        if(refYear !== prevRefYear) {
            try {
                inflation = await getDollarInflationForStartYear(refYear);
            } catch (error) {
                console.error(error);
                console.log("Using inflation backup values");
                inflation = loc.country === countryCodes.BR
                    ? brUSDInflation
                    : inflationBackupValues[loc.country];
            }
            prevRefYear = refYear;
        }
        if(!inflation) console.error("Missing inflation value");
        const inflationCorrection = (inflation / 100) + 1;

        const countryData = getCountryData(loc.country);
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
            ...loc, 
            bioprospecting, 
            carbon, 
            recoverOfTopSoll, 
            woodAndNonWoodProducts, 
            general,
            inflationCorrection
        };
        const siltingInputs = {
            ...loc, 
            general, 
            erosionSiltingUp, 
            dredgingAndRiverSediments, 
            cavaGroundingCostAuFertile, 
            cavaGroundingCostAuNorm,
            inflationCorrection
        };
        const mercuryInputs = {
            ...loc,
            general, 
            neuroSymptomsGarimpeiro, 
            hypertension, 
            lossQI, 
            heartAttack, 
            soilMercuryRemediation,
            inflationCorrection
        };
        const deforestation = calculateDeforestationImpact(deforestationInputs);
        const siltingOfRivers = calculateSiltingOfRiversImpact(siltingInputs);
        const mercury = calculateMercuryImpact(mercuryInputs);
        const totalImpact = 
            sumValues(filterValuesBelowOnePercent(Object.values(deforestation))) + 
            sumValues(filterValuesBelowOnePercent(Object.values(siltingOfRivers).filter(value => typeof value === 'number'))) + 
            sumValues(filterValuesBelowOnePercent(Object.values(mercury).filter(value => typeof value === 'number')));
        
        const { cavaAverageProductivity, excavationGoldLoss } = general;
        const totalGold = hectareToGold({ pitDepth, cavaAverageProductivity, excavationGoldLoss, area: loc.affectedArea });

        const notMonetary = {
            mercury: mercury.notMonetary,
            siltingOfRivers: siltingOfRivers.notMonetary
        };
        
        impacts.push({
            deforestation,
            siltingOfRivers,
            mercury,
            totalImpact,
            totalGold,
            notMonetary
        });
    }

    return impacts;
}


