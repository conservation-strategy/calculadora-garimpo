import { DataImpacts, DataImpactsNoMonetary } from "@/hooks/useCalculator";
import { consolidateImpacts } from "./location-impacts";
import useAppContext from "@/hooks/useAppContext";
import { useEffect, useState } from "react";
import { ResultsMapProps, TotalImpactPerLocation } from "@/components/ResultsMap";
import { LocationImpact } from "@/lib/map/map-calculator";
import { FormInputs } from "@/components/FormMap";
import { CalculatorArgs } from "@/lib/calculator";
import roundValue from "@/utils/roundValue";
import convertGramsToKg from "@/utils/convertGramsToKg";
import { overflow } from "@/lib/calculator/store";

export const useMapResults = ({
    impacts,
    inputs,
    locations
} : {
    impacts: LocationImpact[],
    inputs: FormInputs,
    locations: CalculatorArgs[]
}) => {
    const { state } = useAppContext();
    const { language } = state;
    const { calculator } = language;
    const { impacts: __impacts } = calculator;
    const { deforestation, siltingOfRivers, mercuryContamination, notMonetary } = __impacts;
    const [results, setResults] = useState<ResultsMapProps>();

    useEffect(() => {
        if(!impacts.length) return;
        const consolidatedImpacts = consolidateImpacts(impacts);
        const deforestatioData: DataImpacts[] = [
            {
                name: deforestation.sub_impact_Bioprospecting,
                value: consolidatedImpacts.deforestation.bioProspectingImpact
            },
            {
                name: deforestation.sub_impact_Carbon,
                value: consolidatedImpacts.deforestation.carbonImpact
            },
            {
                name: deforestation.sub_impact_culture_and_species,
                value: consolidatedImpacts.deforestation.culturedAndSpeciesImpact
            },
            {
                name: deforestation.sub_impact_recreation,
                value: consolidatedImpacts.deforestation.recreationImpact
            },
            {
                name: deforestation.sub_impact_reforestation,
                value: consolidatedImpacts.deforestation.recoveryOfTopsoilImpact
            },
            {
                name: deforestation.sub_impact_forest_products,
                value: consolidatedImpacts.deforestation.woodAndNonWoodProductsImpact
            }
        ];
        const siltingOfRiversData: DataImpacts[] = [
            {
                name: siltingOfRivers.sub_impact_dredging_of_sediments_in_the_river,
                value: consolidatedImpacts.siltingOfRivers.dredgingAndRiverSedimentsImpact
            },
            {
                name: siltingOfRivers.sub_impact_erosion,
                value: consolidatedImpacts.siltingOfRivers.erosionSiltingUpImpact
            },
            {
                name: siltingOfRivers.sub_impact_pit_grounding,
                value: consolidatedImpacts.siltingOfRivers.cavaGroundingCostAuFertileImpact + consolidatedImpacts.siltingOfRivers.cavaGroundingCostAuNormImpact
            }
        ];
        const mercuryData: DataImpacts[] = [
            {
                name: mercuryContamination.sub_impact_cardiovascular_diseases,
                value: consolidatedImpacts.mercury.heartAttackImpact + consolidatedImpacts.mercury.hypertensionImpact
            },
            {
                name: mercuryContamination.sub_impact_loss_of_Qi_in_Fetuses,
                value: consolidatedImpacts.mercury.lossIQImpact
            },
            {
                name: mercuryContamination.sub_impact_neuropsychological_symptoms,
                value: consolidatedImpacts.mercury.neuroSymptomsGarimpeiroImpact // RETORT === NO
            },
            {
                name: mercuryContamination.sub_impact_soil_remediation,
                value: consolidatedImpacts.mercury.soilMercuryRemediationImpact
            }
        ]
        if(consolidatedImpacts.mercury.waterMercuryRemediationImpact) {
            mercuryData.push({
                name: mercuryContamination.sub_impact_water_remediation,
                value: consolidatedImpacts.mercury.waterMercuryRemediationImpact
            });
        }

        const totalGold = impacts.reduce((sum, impact) => sum + impact.totalGold, 0);
        const totalArea = locations.reduce((sum, loc) => sum + loc.affectedArea, 0);
        console.log('lossyVolume', consolidatedImpacts.notMonetary.lossyVolume)

        const impactsNotMonetary: DataImpactsNoMonetary[] = [
            {
                label: notMonetary.goldGrass,
                value: convertGramsToKg(totalGold),
                measure: notMonetary.kgDeAu
            },
            {
                label: notMonetary.proporcaoKgporHectare,
                value: convertGramsToKg(totalGold) / totalArea,
                measure: notMonetary.kgDeAu_ha
            },
            {
                label: notMonetary.hecatereGrass,
                value: totalArea * overflow,
                measure: 'ha'
            },
            {
                label: notMonetary.lossyVolume,
                value: roundValue(consolidatedImpacts.notMonetary.lossyVolume),
                measure: 'm³'
            },
            {
                label: notMonetary.concentrationMediaMercuryHair,
                value: 0,
                measure: 'μg/g'
            },
            {
                label: notMonetary.porcentNascidosVivosPerdaQIAcimaDe2Pts,
                value: 0,
                measure: '%'
            },
            {
                label: notMonetary.toMethylatedWater,
                value: roundValue(consolidatedImpacts.notMonetary.toMethylatedWater),
                measure: notMonetary.GInHg
            },
            {
                label: notMonetary.toPopulationAffectedMercuryHair,
                value: Math.ceil(consolidatedImpacts.notMonetary.toPopulationAffectedMercuryHair),
                measure: notMonetary.people
            },
            {
                label: notMonetary.menOver40InTheRegionIn27Years,
                value: Math.ceil(consolidatedImpacts.notMonetary.menOver40InTheRegionIn27Years),
                measure: notMonetary.people
            },
            {
                label: notMonetary.peopleAbove20YearsoldInTheRegionIn52Years,
                value: Math.ceil(consolidatedImpacts.notMonetary.peopleAbove20YearsoldInTheRegionIn52Years),
                measure: notMonetary.people
            },
            {
                label: notMonetary.qtdOfMinersAffected,
                value: Math.ceil(consolidatedImpacts.notMonetary.qtdOfMinersAffected),
                measure: notMonetary.people
            },
        ]

        const totalImpactsPerLocation: TotalImpactPerLocation[] = [];
        consolidatedImpacts.originalTotalImpacts.map((impact, index) => {
            totalImpactsPerLocation.push({
                ...locations[index],
                totalImpact: impact
            });
        });

        setResults({
            deforestation: deforestatioData,
            siltingOfRivers: siltingOfRiversData,
            mercury: mercuryData,
            totalImpacts: totalImpactsPerLocation,
            totalGold,
            impactsNotMonetary,
            formInputs: inputs
        })
    }, [language, impacts]);

    return results;
    
}