import { LocationImpact } from "@/lib/map/map-calculator";
import { DeforestationImpact } from "@/lib/calculator/deforestation";
import { SiltingOfRiversImpact } from "@/lib/calculator/silting";
import { MercuryImpact } from "@/lib/calculator/mercury";


export type SiltingOfRiversImpactWithoutNotMonetary = Omit<SiltingOfRiversImpact, 'notMonetary'>;
export type MercuryImpactWithoutNotMonetary = Omit<MercuryImpact, 'notMonetary'>;


export interface ConsolidatedImpacts {
    deforestation: DeforestationImpact;
    siltingOfRivers: SiltingOfRiversImpactWithoutNotMonetary;
    mercury: MercuryImpactWithoutNotMonetary;
    totalImpact: number;
    originalTotalImpacts: number[];
}

export const consolidateImpacts = (impacts: LocationImpact[]): ConsolidatedImpacts => {
    if (impacts.length === 0) {
        return {
            deforestation: {
                bioProspectingImpact: 0,
                carbonImpact: 0,
                culturedAndSpeciesImpact: 0,
                recoveryOfTopsoilImpact: 0,
                recreationImpact: 0,
                woodAndNonWoodProductsImpact: 0
            },
            siltingOfRivers: {
                cavaGroundingCostAuNormImpact: 0,
                cavaGroundingCostAuFertileImpact: 0,
                dredgingAndRiverSedimentsImpact: 0,
                erosionSiltingUpImpact: 0
            },
            mercury: {
                neuroSymptomsGarimpeiroImpact: 0,
                hypertensionImpact: 0,
                lossIQImpact: 0,
                heartAttackImpact: 0,
                soilMercuryRemediationImpact: 0,
                waterMercuryRemediationImpact: 0
            },
            totalImpact: 0,
            originalTotalImpacts: []
        };
    }

    const originalTotalImpacts = impacts.map(impact => impact.totalImpact);

    const initialValue: ConsolidatedImpacts = {
        deforestation: {
            bioProspectingImpact: 0,
            carbonImpact: 0,
            culturedAndSpeciesImpact: 0,
            recoveryOfTopsoilImpact: 0,
            recreationImpact: 0,
            woodAndNonWoodProductsImpact: 0
        },
        siltingOfRivers: {
            cavaGroundingCostAuNormImpact: 0,
            cavaGroundingCostAuFertileImpact: 0,
            dredgingAndRiverSedimentsImpact: 0,
            erosionSiltingUpImpact: 0
        },
        mercury: {
            neuroSymptomsGarimpeiroImpact: 0,
            hypertensionImpact: 0,
            lossIQImpact: 0,
            heartAttackImpact: 0,
            soilMercuryRemediationImpact: 0,
            waterMercuryRemediationImpact: 0
        },
        totalImpact: 0,
        originalTotalImpacts: originalTotalImpacts
    };

    const consolidated = impacts.reduce<ConsolidatedImpacts>((acc, impact) => {
        // Consolidate deforestation impacts
        acc.deforestation.bioProspectingImpact += impact.deforestation.bioProspectingImpact;
        acc.deforestation.carbonImpact += impact.deforestation.carbonImpact;
        acc.deforestation.culturedAndSpeciesImpact += impact.deforestation.culturedAndSpeciesImpact;
        acc.deforestation.recoveryOfTopsoilImpact += impact.deforestation.recoveryOfTopsoilImpact;
        acc.deforestation.recreationImpact += impact.deforestation.recreationImpact;
        acc.deforestation.woodAndNonWoodProductsImpact += impact.deforestation.woodAndNonWoodProductsImpact;

        // Consolidate silting of rivers impacts
        acc.siltingOfRivers.cavaGroundingCostAuNormImpact += impact.siltingOfRivers.cavaGroundingCostAuNormImpact;
        acc.siltingOfRivers.cavaGroundingCostAuFertileImpact += impact.siltingOfRivers.cavaGroundingCostAuFertileImpact;
        acc.siltingOfRivers.dredgingAndRiverSedimentsImpact += impact.siltingOfRivers.dredgingAndRiverSedimentsImpact;
        acc.siltingOfRivers.erosionSiltingUpImpact += impact.siltingOfRivers.erosionSiltingUpImpact;

        // Consolidate mercury impacts
        acc.mercury.neuroSymptomsGarimpeiroImpact += impact.mercury.neuroSymptomsGarimpeiroImpact;
        acc.mercury.hypertensionImpact += impact.mercury.hypertensionImpact;
        acc.mercury.lossIQImpact += impact.mercury.lossIQImpact;
        acc.mercury.heartAttackImpact += impact.mercury.heartAttackImpact;
        acc.mercury.soilMercuryRemediationImpact += impact.mercury.soilMercuryRemediationImpact;
        acc.mercury.waterMercuryRemediationImpact += impact.mercury.waterMercuryRemediationImpact;

        // Consolidate total impact
        acc.totalImpact += impact.totalImpact;

        return acc;
    }, initialValue);

    return consolidated;
};