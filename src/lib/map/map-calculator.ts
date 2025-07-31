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

export function calculateMapImpacts(args : MapCalculatorArgs) {
    const impacts: LocationImpact[] = [];
    const { locations, pitDepth } = args;

    for(let loc of locations) {
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
            general
        };
        const siltingInputs = {
            ...loc, 
            general, 
            erosionSiltingUp, 
            dredgingAndRiverSediments, 
            cavaGroundingCostAuFertile, 
            cavaGroundingCostAuNorm
        };
        const mercuryInputs = {
            ...loc,
            general, 
            neuroSymptomsGarimpeiro, 
            hypertension, 
            lossQI, 
            heartAttack, 
            soilMercuryRemediation
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


