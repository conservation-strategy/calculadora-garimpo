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

export interface LocationImpact {
    deforestation: DeforestationImpact;
    siltingOfRivers: SiltingOfRiversImpact;
    mercury: MercuryImpact;
    totalImpact: number;
    notMonetary: {
        mercury: MercuryNotMonetary;
        siltingOfRivers: SiltingOfRiversNotMonetary;
    }
}

export default function calculateMapImpacts(args : CalculatorArgs[]) {
    const impacts: LocationImpact[] = [];

    for(let loc of args) {
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

        const notMonetary = {
            mercury: mercury.notMonetary,
            siltingOfRivers: siltingOfRivers.notMonetary
        };
        
        impacts.push({
            deforestation,
            siltingOfRivers,
            mercury,
            totalImpact,
            notMonetary
        });
    }

    return impacts;
}


