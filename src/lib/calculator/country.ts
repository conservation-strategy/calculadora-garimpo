import { countryCodes } from "@/enums";
// import { fixedValuesProps } from "@/types";

export function getCountryData(country: countryCodes) {
    return countryDataMap[country] || countryDataMap[countryCodes.BR]
}

const DensidadeSedimento = 2.7;

const countryDataMap = {
    [countryCodes.SU]: null,
    [countryCodes.GU]: null,
    [countryCodes.BR]: {
        general: {
            speciesForZero: 69,
            GDPperCapitaBrazilUSD: 6796.84,
            celciusTemperature: 26.8,
            kmRotatedPerLiter: 2.5,
            priceLiterDieselUSD: 0.648,
            averageDriverSalaryFreightPerKmUSD: 0.444,
            densityGold: 2.76,
            excavationGoldLoss: 2,
            hollowMediumDepth: 10,
            averageDepthOfFertileEarth: 0.4,
            quantitOfM3ExcavatorPerHour: 160,
            quantityOfGoldGramsPerYearWell: 23700,
            HgAuRatio: 2.6,
            percentLossHgInWater_convervative: 0.13,
            percentLossHgInWater: 0.21,
            percentLossHgInWater_ferry__convervative: 0.22,
            percentLossHgInWater_ferry: 0.35,
            methyladPercent_conservative: 0.11,
            methyladPercent: 0.22,
            ruralIndividualWeight: 59.1,
            urbanindividualWeight: 70,
            levelMediumContaminationFish: 0.5,
            AverageFishConsumptionPerDayInRuralGrams: 144.5,
            consumptionMediumFishByDayInGramsUrban: 57,
            densityPopulationalRegionNorth2060: 6,
            aDALYUSD: 20719.8,
            excavatorHoursDays: 10,
            excavatorCostPerKMUSD: 0.76,
            cavaAverageProductivity: 0.4,
            prodGoldMonthFerry: 302
        },
        bioprospecting: {
            bioprospectingCostByUSD_conservative: 13.63,
            bioprospectingCostByUSD: 23.39,
            discountRate: 0.03
        },
        carbon: {
            carbonCostPerHaUSD: 177.55
        },
        recoverOfTopSoll: {
            hectare: 0.31,
            soilSurfaceRecPerHa_conservative: 2938,
            soilSurfaceRecPerHa: 4680,
            capacityLoadTruckNumberOfSeedlings: 2700,
            superficialSeedlingsPerHa: 1667,
            transportCostChangesPerKm: 0.32
        },
        erosionSiltingUp: {
            siltingUpCostPerHaUSD: 18
        },
        dredgingAndRiverSediments: {
            prodOuroKgporMes: 0.00604,
            dredgingCostPerM3: 5.6,
            averageMotorPower: 54.4,
            productionSedimentTurnsFeatherTonnesPerMonth: 37.82,
            equivalentErosionTonPerHaPerYear: 12.54,
            erosionControlUSD: 13.28,
            productionSedimentTurnsFeatherTonnesPerMonthGold: 6.262,
            siltingPercentage: 0.15,
            theAmountOfSedimentPer1DredgeM3PerHour: 300,
            transportCost1DredgeUSD: 0.76
        },
        cavaGroundingCostAuNorm: {
            normalCavaGroundingCostUSD: 0.2
        },
        cavaGroundingCostAuFertile: {
            groundingCostFertilePitUSD: 2.54
        },
        lossQI: {
            birthRate: 18.8
        },
        neuroSymptomsGarimpeiro: {
            amountOfGoldminersYear: 150.45,
            neuroTreatmentCostPerGoldMinerUSD: 449.8
        },
        heartAttack: {
        proMenOver40ByPopTotal: 0.12,
        //accumulatedRiskMercuryInfarction: 0.0161,
        annualInfarctTreatmentCostUSD: 460,
        propHomensAcima40AnosComInfartoporPopHomensAcima40anosRegiaoPais: 0.0016,
        duracaoDaIncapacidadeInfarto: 27
        },    
        hypertension: {
            propOfPeopleOver20YearsOfAgeByTotalPop: 0.58,
            AnnualHypertensionCostTreatamentUSD: 58.4,
            //accumulatedRiskMercuryHypertension: 0.0121,
            propAcima20AnosComHipertensaoporPopAcima20anosRegiaoPais: 0.0009,
            duracaoDaIncapacidadeHipertensao: 52
        },
        soilMercuryRemediation: {
            lossPercentHgInSoil_conservative: 0.088,
            lossPercentHgInSoil: 0.14,
            HgContainedSoilinGrassPerTon: 0.24,
            DensidadeSolo: 2.76,
            DensidadeSedimento,
            remediationCostUSDPerTonOfSoil: 37.6
        },
        woodAndNonWoodProducts: {
            costPMNMPerHaYearUSD: 152.8,
            discountRate: 0.03
        },    
        protectedAreaMultiplier: {
            value: 1
        }
    },
    [countryCodes.BO]: {
        protectedAreaMultiplier: { value: 1.38 },
        general: {
            speciesForZero: 162,
            GDPperCapitaBrazilUSD: 14906, /**mudado de 3701 */
            celciusTemperature: 24,
            kmRotatedPerLiter: 2.5,
            excavationGoldLoss: 2,
            priceLiterDieselUSD: 0.54,
            densityGold: 2.76,
            averageDriverSalaryFreightPerKmUSD: 0.22,
            quantityOfGoldGramsPerYearWell: 12800,
            averageDepthOfFertileEarth: 0.4,
            quantitOfM3ExcavatorPerHour: 100,
            HgAuRatio: 7,
            percentLossHgInWater_convervative: 0.09,
            percentLossHgInWater: 0.12,
            percentLossHgInWater_ferry__convervative: 0.17,
            percentLossHgInWater_ferry: 0.28,
            methyladPercent_conservative: 0.11,
            methyladPercent: 0.22,
            ruralIndividualWeight: 55,
            urbanindividualWeight: 68,
            levelMediumContaminationFish: 0.19, /**mudado de 0.119 */
            AverageFishConsumptionPerDayInRuralGrams: 107.9,
            consumptionMediumFishByDayInGramsUrban: 30, /**era 2.97 */
            densityPopulationalRegionNorth2060: 0.39,
            excavatorHoursDays: 10,
            excavatorCostPerKMUSD: 0.76,
            hollowMediumDepth: 50,
            cavaAverageProductivity: 0.17,
            prodGoldMonthFerry: 380,
            aDALYUSD: 11103,
        },
        bioprospecting: {
            bioprospectingCostByUSD_conservative: 13.64,
            bioprospectingCostByUSD: 23.3,
            discountRate: 0.03,
        },
        carbon: { 
            carbonCostPerHaUSD: 93.46 
        },
        recoverOfTopSoll: {
            hectare: 0.31,
            soilSurfaceRecPerHa_conservative: 872,
            soilSurfaceRecPerHa: 4250,
            capacityLoadTruckNumberOfSeedlings: 1500,
            superficialSeedlingsPerHa: 1000,
            transportCostChangesPerKm: 0.22
        },
        erosionSiltingUp: {
            siltingUpCostPerHaUSD: 18,
        },
        dredgingAndRiverSediments: {
            dredgingCostPerM3: 4.69,
            prodOuroKgporMes: 0.00604,
            averageMotorPower: 147,
            productionSedimentTurnsFeatherTonnesPerMonth: 9.96,
            equivalentErosionTonPerHaPerYear: 12.54,
            erosionControlUSD: 13.28,
            productionSedimentTurnsFeatherTonnesPerMonthGold: 6.54,
            siltingPercentage: 0.15,
            theAmountOfSedimentPer1DredgeM3PerHour: 250,
            transportCost1DredgeUSD: 0.76,
        },
        cavaGroundingCostAuNorm: {
            normalCavaGroundingCostUSD: 0.2,
        },
        cavaGroundingCostAuFertile: {
            groundingCostFertilePitUSD: 5.08,
        },
        lossQI: {
            birthRate: 22,
        },
        neuroSymptomsGarimpeiro: {
            amountOfGoldminersYear: 2496 /** CONFIRMAR */,
            neuroTreatmentCostPerGoldMinerUSD: 353,
        },
        heartAttack: {
            proMenOver40ByPopTotal: 0.24,
            //accumulatedRiskMercuryInfarction: 0.0178
            annualInfarctTreatmentCostUSD: 6196,
            propHomensAcima40AnosComInfartoporPopHomensAcima40anosRegiaoPais: 0.00044,
            duracaoDaIncapacidadeInfarto: 22,
        },
        hypertension: {
            AnnualHypertensionCostTreatamentUSD: 96.15,
            propOfPeopleOver20YearsOfAgeByTotalPop: 0.563,
            //accumulatedRiskMercuryHypertension: 0.0121
            propAcima20AnosComHipertensaoporPopAcima20anosRegiaoPais: 0.0009, //0.022
            duracaoDaIncapacidadeHipertensao: 45,
        },
        soilMercuryRemediation: {
            lossPercentHgInSoil_conservative: 0.088,
            lossPercentHgInSoil: 0.14,
            HgContainedSoilinGrassPerTon: 0.2,
            DensidadeSolo: 2.76,
            remediationCostUSDPerTonOfSoil: 45.67,
            DensidadeSedimento
        },
        woodAndNonWoodProducts: {
            costPMNMPerHaYearUSD: 433,
            discountRate: 0.03,        
        }
    },
    [countryCodes.CO]: {
        general: {
            speciesForZero: 162,
            GDPperCapitaBrazilUSD: 5334.6,
            celciusTemperature: 26.3,
            kmRotatedPerLiter: 3.17,
            excavationGoldLoss: 2,
            priceLiterDieselUSD: 0.75,
            densityGold: 2.76,
            averageDriverSalaryFreightPerKmUSD: 0.14,
            quantityOfGoldGramsPerYearWell: 23700,
            averageDepthOfFertileEarth: 0.4,
            quantitOfM3ExcavatorPerHour: 64,
            HgAuRatio: 2.33,
            percentLossHgInWater_convervative: 0.09,
            percentLossHgInWater: 0.2,
            percentLossHgInWater_ferry__convervative: 0.17,
            percentLossHgInWater_ferry: 0.28,
            methyladPercent_conservative: 0.11,
            methyladPercent: 0.22,
            ruralIndividualWeight: 65.25,
            urbanindividualWeight: 69.14,
            levelMediumContaminationFish: 0.49,
            AverageFishConsumptionPerDayInRuralGrams: 89.55,
            consumptionMediumFishByDayInGramsUrban: 9.35,
            densityPopulationalRegionNorth2060: 2.59,
            excavatorHoursDays: 10,
            excavatorCostPerKMUSD: 0.76,
            hollowMediumDepth: 10,
            cavaAverageProductivity: 0.2,
            prodGoldMonthFerry: 852,
            aDALYUSD: 16003.8,
        },
        bioprospecting: {
            bioprospectingCostByUSD_conservative: 13.63,
            bioprospectingCostByUSD: 23.39,
            discountRate: 0.03
        },
        carbon: {
            carbonCostPerHaUSD: 277.53
        },
        recoverOfTopSoll: {
            hectare: 0.27,
            soilSurfaceRecPerHa_conservative: 1771,
            soilSurfaceRecPerHa: 4833,
            capacityLoadTruckNumberOfSeedlings: 2700,
            superficialSeedlingsPerHa: 1100,
            transportCostChangesPerKm: 0.32
        },
        erosionSiltingUp: {
            siltingUpCostPerHaUSD: 18
        },
        dredgingAndRiverSediments: {
            dredgingCostPerM3: 7.51,
            prodOuroKgporMes: 0.0028,
            averageMotorPower: 147,
            productionSedimentTurnsFeatherTonnesPerMonth: 9.94,
            equivalentErosionTonPerHaPerYear: 12.54,
            erosionControlUSD: 13.28,
            productionSedimentTurnsFeatherTonnesPerMonthGold: 3.51,
            siltingPercentage: 0.15,
            theAmountOfSedimentPer1DredgeM3PerHour: 20,
            transportCost1DredgeUSD: 0.76,
        },
        cavaGroundingCostAuNorm: {
            normalCavaGroundingCostUSD: 0.2,
        },
        cavaGroundingCostAuFertile: {
            groundingCostFertilePitUSD: 1.55,            
        },
        lossQI: {
            birthRate: 14.7
        },
        neuroSymptomsGarimpeiro: {
            amountOfGoldminersYear: 150.45,
            neuroTreatmentCostPerGoldMinerUSD: 49
        },
        heartAttack: {
            proMenOver40ByPopTotal: 0.2564,
            //accumulatedRiskMercuryInfarction: 0.0178,
            annualInfarctTreatmentCostUSD: 1509.4,
            propHomensAcima40AnosComInfartoporPopHomensAcima40anosRegiaoPais: 0.0037,
            duracaoDaIncapacidadeInfarto: 30,
        },
        hypertension: {
            AnnualHypertensionCostTreatamentUSD: 96.15, //acerto do leo csf  "5896.29"
            propOfPeopleOver20YearsOfAgeByTotalPop: 0.57,
            //accumulatedRiskMercuryHypertension: 0.0121
            propAcima20AnosComHipertensaoporPopAcima20anosRegiaoPais: 0.0009, //0.022
            duracaoDaIncapacidadeHipertensao: 55
        },
        soilMercuryRemediation: {
            lossPercentHgInSoil_conservative: 0.088,
            lossPercentHgInSoil: 0.14,
            HgContainedSoilinGrassPerTon: 0.21,
            DensidadeSolo: 2.76,
            remediationCostUSDPerTonOfSoil: 45.67,
            DensidadeSedimento
        },
        woodAndNonWoodProducts: {
            costPMNMPerHaYearUSD: 119.81,
            discountRate: 0.03
        }
    },
    [countryCodes.EC]: {
        general:{
            speciesForZero: 72,
            GDPperCapitaBrazilUSD: 5600.39,
            celciusTemperature: 24.5,
            kmRotatedPerLiter: 2.86,
            densityGold: 2.76,
            excavationGoldLoss: 2,
            priceLiterDieselUSD: 0.502,
            averageDriverSalaryFreightPerKmUSD: 0.28,
            quantityOfGoldGramsPerYearWell: 18000,
            averageDepthOfFertileEarth: 0.4,
            quantitOfM3ExcavatorPerHour: 81.95, //VALOR ORIGINAL 160,
            HgAuRatio: 2.6, //VALOR ORIGINAL 7.2,
            percentLossHgInWater_convervative: 0.13,
            percentLossHgInWater: 0.15,
            percentLossHgInWater_ferry__convervative: 0.155,
            percentLossHgInWater_ferry: 0.28,
            methyladPercent_conservative: 0.11,
            methyladPercent: 0.22,
            ruralIndividualWeight: 59.75,
            urbanindividualWeight: 69.38, //VALOR ORIGINAL 70,
            levelMediumContaminationFish: 0.36,
            AverageFishConsumptionPerDayInRuralGrams: 183,
            consumptionMediumFishByDayInGramsUrban: 23.33,
            densityPopulationalRegionNorth2060: 6.2,
            aDALYUSD: 16801.17,
            excavatorHoursDays: 10,
            excavatorCostPerKMUSD: 0.76,
            hollowMediumDepth: 10,
            cavaAverageProductivity: 0.4,
            prodGoldMonthFerry: 4348 //VALOR ORIGINAL 302
        },
        bioprospecting: {
            bioprospectingCostByUSD_conservative: 13.63,
            bioprospectingCostByUSD: 23.39,
            discountRate: 0.03,
        },
        carbon: {
            carbonCostPerHaUSD: 113.39
        },
        recoverOfTopSoll: {
            hectare: 0.31,
            soilSurfaceRecPerHa_conservative: 933.19,
            soilSurfaceRecPerHa: 3134,
            capacityLoadTruckNumberOfSeedlings: 1500,
            superficialSeedlingsPerHa: 1111,
            transportCostChangesPerKm: 0.32,
        },
        erosionSiltingUp: {
            siltingUpCostPerHaUSD: 18
        },
        dredgingAndRiverSediments: {
            dredgingCostPerM3: 5.33, //VALOR ORIGINAL 5.33,
            prodOuroKgporMes: 0.00604        ,
            productionSedimentTurnsFeatherTonnesPerMonth: 9.94,
            equivalentErosionTonPerHaPerYear: 12.54,
            erosionControlUSD: 13.28,
            productionSedimentTurnsFeatherTonnesPerMonthGold: 6.262,
            siltingPercentage: 0.15,
            theAmountOfSedimentPer1DredgeM3PerHour: 245,
            transportCost1DredgeUSD: 0.76,
            averageMotorPower: 0 // verificar valor
        },
        cavaGroundingCostAuNorm: {
            normalCavaGroundingCostUSD: 0.2,
        },
        cavaGroundingCostAuFertile: {
            groundingCostFertilePitUSD: 2.54
        },
        lossQI: {
            birthRate: 19.19
        },
        neuroSymptomsGarimpeiro: {
            amountOfGoldminersYear: 255,
            neuroTreatmentCostPerGoldMinerUSD: 362
        },
        heartAttack: {
            proMenOver40ByPopTotal: 0.1, //VALOR ORIGINAL 0.2204
            //heartAttack.accumulatedRiskMercuryInfarction: 0.0148 //VALOR ORIGINAL 0.0161
            annualInfarctTreatmentCostUSD: 8139.05,
            propHomensAcima40AnosComInfartoporPopHomensAcima40anosRegiaoPais: 0.0016,
            duracaoDaIncapacidadeInfarto: 27,
        },

        hypertension: {
            AnnualHypertensionCostTreatamentUSD: 1296.43,
            propOfPeopleOver20YearsOfAgeByTotalPop: 0.48, //VALOR ORIGINAL 0.57
            propAcima20AnosComHipertensaoporPopAcima20anosRegiaoPais: 0.0009, //0.022
            duracaoDaIncapacidadeHipertensao: 50
        },
        soilMercuryRemediation: {
            lossPercentHgInSoil_conservative: 0.088,
            lossPercentHgInSoil: 0.14,
            HgContainedSoilinGrassPerTon: 0.19,
            DensidadeSolo: 2.76,
            remediationCostUSDPerTonOfSoil: 45.67,
            DensidadeSedimento
        },
        woodAndNonWoodProducts: {
            costPMNMPerHaYearUSD: 26.1, //VALOR ORIGINAL 484.84
            discountRate: 0.03
        }
    },
    [countryCodes.PE]: {
        general: {
            speciesForZero: 105,
            GDPperCapitaBrazilUSD: 6126.9,
            celciusTemperature: 26,
            densityGold: 2.76,
            excavationGoldLoss: 2,
            kmRotatedPerLiter: 5.4,
            priceLiterDieselUSD: 0.82,
            averageDriverSalaryFreightPerKmUSD: 0.78,
            quantityOfGoldGramsPerYearWell: 23700,
            averageDepthOfFertileEarth: 0.4,
            quantitOfM3ExcavatorPerHour: 70,
            HgAuRatio: 2.6,
            percentLossHgInWater_convervative: 0.13,
            percentLossHgInWater: 0.35,
            percentLossHgInWater_ferry__convervative: 0.155,
            percentLossHgInWater_ferry: 0.28,
            methyladPercent_conservative: 0.11,
            methyladPercent: 0.22,
            ruralIndividualWeight: 55.97,
            urbanindividualWeight: 55.97,
            levelMediumContaminationFish: 0.55,
            AverageFishConsumptionPerDayInRuralGrams: 183,
            consumptionMediumFishByDayInGramsUrban: 36,
            densityPopulationalRegionNorth2060: 5.2,
            aDALYUSD: 18360.7,
            excavatorHoursDays: 10,
            excavatorCostPerKMUSD: 0.77,
            hollowMediumDepth: 10,
            cavaAverageProductivity: 0.141,
            prodGoldMonthFerry: 229.4,
        },
        bioprospecting: {
            bioprospectingCostByUSD_conservative: 13.63,
            bioprospectingCostByUSD: 23.39,
            discountRate: 0.03
        },
        carbon:{
            carbonCostPerHaUSD: 259.73
        },
        recoverOfTopSoll: {
            hectare: 0.1,
            soilSurfaceRecPerHa_conservative: 933.19,
            soilSurfaceRecPerHa: 2536.63,
            capacityLoadTruckNumberOfSeedlings: 1500,
            superficialSeedlingsPerHa: 1111,
            transportCostChangesPerKm: 0.32,
        },
        erosionSiltingUp: {
            siltingUpCostPerHaUSD: 18
        },
        dredgingAndRiverSediments: {
            dredgingCostPerM3: 7.51,
            prodOuroKgporMes: 0.0015,
            averageMotorPower: 130,
            productionSedimentTurnsFeatherTonnesPerMonth: 9.94,
            equivalentErosionTonPerHaPerYear: 12.54,
            erosionControlUSD: 13.28,
            productionSedimentTurnsFeatherTonnesPerMonthGold: 6.54,
            siltingPercentage: 0.15,
            theAmountOfSedimentPer1DredgeM3PerHour: 250,
            transportCost1DredgeUSD: 0.73,
        },
        cavaGroundingCostAuNorm: {
            normalCavaGroundingCostUSD: 0.2
        },
        cavaGroundingCostAuFertile:{
            groundingCostFertilePitUSD: 2.86
        },
        lossQI: {
            birthRate: 17.55
        },
        neuroSymptomsGarimpeiro:{
            amountOfGoldminersYear: 170,
            neuroTreatmentCostPerGoldMinerUSD: 353
        },

        heartAttack:{
            proMenOver40ByPopTotal: 0.1732,
            //accumulatedRiskMercuryInfarction: 0.0161,
            annualInfarctTreatmentCostUSD: 6191.55,
            propHomensAcima40AnosComInfartoporPopHomensAcima40anosRegiaoPais: 0.0009,
            duracaoDaIncapacidadeInfarto: 27,
        },

        hypertension:{
            AnnualHypertensionCostTreatamentUSD: 96.15,
            propOfPeopleOver20YearsOfAgeByTotalPop: 0.59,
            //accumulatedRiskMercuryHypertension: 0.0121,
            propAcima20AnosComHipertensaoporPopAcima20anosRegiaoPais: 0.0009, //0.039
            duracaoDaIncapacidadeHipertensao: 50,
        },

        soilMercuryRemediation:{
            lossPercentHgInSoil_conservative: 0.088,
            lossPercentHgInSoil: 0.14,
            HgContainedSoilinGrassPerTon: 0.2,
            DensidadeSolo: 2.76,
            remediationCostUSDPerTonOfSoil: 45.67,
            DensidadeSedimento
        },

        woodAndNonWoodProducts:{
            costPMNMPerHaYearUSD: 93.83,
            discountRate: 0.03
        }
    }
}