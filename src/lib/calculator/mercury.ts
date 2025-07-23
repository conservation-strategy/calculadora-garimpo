import { generalProps, HeartAttack, HypertensionProps, LossQIProps, NeuroSymptomsGarimpeiroProps, SoilMercuryRemediationProps } from "@/types";
import { hectareToGold } from "./gold";
import { daysInTheYear, pitDepth, valueHypothesis } from "./store";
import { CalculatorArgs } from "@/lib/calculator";
import { getCityData } from "@/lib/calculator";
import { countryCodes } from "@/enums";
import normDist from "@/utils/normDist";
import { filterValuesBelowOnePercent, sumValues } from "@/utils/filterValues";


interface MercuryArgs extends CalculatorArgs {
    general: generalProps;
    neuroSymptomsGarimpeiro: NeuroSymptomsGarimpeiroProps;
    lossQI: LossQIProps;
    hypertension: HypertensionProps;
    heartAttack: HeartAttack
    soilMercuryRemediation: SoilMercuryRemediationProps
}

export function calculateMercuryImpact ({
    affectedArea,
    city,
    country,
    general,
    neuroSymptomsGarimpeiro,
    hypertension,
    lossQI,
    heartAttack,
    soilMercuryRemediation
} : MercuryArgs) {
    const {
        cavaAverageProductivity,
        excavationGoldLoss,
        aDALYUSD,
        HgAuRatio,
        percentLossHgInWater_convervative: percentLossHgInWater,
        methyladPercent_conservative: methyladPercent,
        ruralIndividualWeight,
        urbanindividualWeight,
        consumptionMediumFishByDayInGramsUrban,
        levelMediumContaminationFish,
        AverageFishConsumptionPerDayInRuralGrams,
    } = general;

    const neuroSymptomsGarimpeiroImpact = neuroSymptomsGarimpeiroCalculator({
        area: affectedArea,
        cavaAverageProductivity,
        excavationGoldLoss,
        aDALYUSD,
        neuroSymptomsGarimpeiro,        
    });

    const hypertensionImpact = hypertensionCalculator({
        city,
        country,
        area: affectedArea,
        cavaAverageProductivity,
        excavationGoldLoss,
        HgAuRatio,
        percentLossHgInWater,
        aDALYUSD,
        methyladPercent,
        ruralIndividualWeight,
        urbanindividualWeight,
        consumptionMediumFishByDayInGramsUrban,
        levelMediumContaminationFish,
        AverageFishConsumptionPerDayInRuralGrams,
        hypertension
    });

    const lossQIImpact = lossQICalculator({
        city,
        country,
        area: affectedArea,
        cavaAverageProductivity,
        excavationGoldLoss,
        percentLossHgInWater,
        HgAuRatio,
        methyladPercent,
        ruralIndividualWeight,
        urbanindividualWeight,
        consumptionMediumFishByDayInGramsUrban,
        levelMediumContaminationFish,
        AverageFishConsumptionPerDayInRuralGrams,
        aDALYUSD,
        lossQI        
    });

    const heartAttackImpact = heartAttackCalculator({
        city,
        country,
        area: affectedArea,
        general,
        heartAttack
    });

    const soilMercuryRemediationImpact = soilMercuryRemediationCalculator({
        area: affectedArea,
        HgAuRatio,
        soilMercuryRemediation,
        cavaAverageProductivity,
        excavationGoldLoss
    });

    const waterMercuryRemediationImpact = waterMercuryRemediationCalculator({
        area: affectedArea,
        country,
        cavaAverageProductivity,
        excavationGoldLoss,
        HgAuRatio,
        percentLossHgInWater, //conservative
        methyladPercent, //conservative
        soilMercuryRemediation
    });

    // console.log('neuro s/ inflacao', neuroSymptomsGarimpeiroImpact.value)
    // console.log('hypertension s/ inflacao', hypertensionImpact.value)
    // console.log('qi s/ inflacao', lossQIImpact.value)
    // console.log('heartattack s/ inflacao', heartAttackImpact.value)
    // console.log('soilremed s/ inflacao', soilMercuryRemediationImpact)
    // console.log('waterremed s/ inflacao', waterMercuryRemediationImpact)

    const impacts = filterValuesBelowOnePercent([
        neuroSymptomsGarimpeiroImpact.value,
        hypertensionImpact.value,
        lossQIImpact.value,
        heartAttackImpact.value,
        soilMercuryRemediationImpact,
        waterMercuryRemediationImpact
    ]);

    // console.log('impacts mercurio', impacts)
    return impacts;
}

function neuroSymptomsGarimpeiroCalculator ({
    area,
    cavaAverageProductivity,
    excavationGoldLoss,
    neuroSymptomsGarimpeiro,
    aDALYUSD
} : {
    area: number;
    cavaAverageProductivity: number;
    excavationGoldLoss: number;
    neuroSymptomsGarimpeiro: NeuroSymptomsGarimpeiroProps;
    aDALYUSD: number;
}) {
    const gold = hectareToGold({
        area,
        pitDepth,
        cavaAverageProductivity,
        excavationGoldLoss
    });
    const weightNeuroDisabilityGoldminers = 0.368;

    const qtdTotalGoldMiners = gold / neuroSymptomsGarimpeiro.amountOfGoldminersYear;
    const qtdOfMinersAffected = qtdTotalGoldMiners * valueHypothesis;
    //console.log('Quantidade de garimpeiros afetados', qtdOfMinersAffected)
    const neuroGoldMinersTreatmentCost =
        qtdOfMinersAffected * neuroSymptomsGarimpeiro.neuroTreatmentCostPerGoldMinerUSD;

    const weightNeuroDisabilityGoldminersQtdGoldDiggers =
        weightNeuroDisabilityGoldminers * qtdTotalGoldMiners;
    const dalyYearsProspectors =
        valueHypothesis * weightNeuroDisabilityGoldminersQtdGoldDiggers;
    const toCostDALYGoldDigger = dalyYearsProspectors * aDALYUSD;
    const toGoldMinersCost =
        toCostDALYGoldDigger + neuroGoldMinersTreatmentCost;
    return {
        qtdOfMinersAffected,
        value: toGoldMinersCost
    }
}

function hypertensionCalculator ({
    city,
    country,
    area,
    cavaAverageProductivity,
    excavationGoldLoss,
    HgAuRatio,
    percentLossHgInWater, //conservative
    aDALYUSD,
    methyladPercent, // conservative
    ruralIndividualWeight,
    urbanindividualWeight,
    consumptionMediumFishByDayInGramsUrban,
    levelMediumContaminationFish,
    AverageFishConsumptionPerDayInRuralGrams,
    hypertension

} : {
    city: string;
    country: countryCodes;
    area: number;
    cavaAverageProductivity: number;
    excavationGoldLoss: number;
    HgAuRatio: number;
    percentLossHgInWater: number;
    aDALYUSD: number;
    methyladPercent: number;
    ruralIndividualWeight: number;
    urbanindividualWeight: number;
    consumptionMediumFishByDayInGramsUrban: number;
    levelMediumContaminationFish: number;
    AverageFishConsumptionPerDayInRuralGrams: number;
    hypertension: HypertensionProps;
}) {
    const cityData = getCityData(country, city);
    if(!cityData) throw new Error("Municipality data was not found.");

    const gold = hectareToGold({
        area,
        pitDepth,
        cavaAverageProductivity,
        excavationGoldLoss
    });
    // ALLUVION
    const gramsHgReleasedInWater = percentLossHgInWater * HgAuRatio * gold;
    // 
    const qtdMercurioPerdidoNaAgua = gramsHgReleasedInWater
    ? gramsHgReleasedInWater
    : 0
    const toMethylatedWater = methyladPercent * qtdMercurioPerdidoNaAgua

    const years = 50

    const durationOfDisabilityHypertension = 52
    const weightOgDisabilityHypertension = 0.246
    const agwt = 1
    const discountRate = 0.03
    const bplusr = -0.07
    const yearBeginningOfDisabilityHypertension = 20
    const constant = 0.1658

    const individualAverageWeight =
        cityData.PopRuralMunicipio * ruralIndividualWeight +
        cityData.PopUrbMunicipio * urbanindividualWeight;
    const daysIn50years = daysInTheYear * years;

    const ingestionMediaDailyMicrogramMercuryUrban =
        (consumptionMediumFishByDayInGramsUrban *
            levelMediumContaminationFish) / urbanindividualWeight;
    const ingestionMediaDailyMicrogramMercuryRural =
        (AverageFishConsumptionPerDayInRuralGrams *
            levelMediumContaminationFish) / ruralIndividualWeight;
    const ingestionMediaMercuryDaily1IndividualInMicrogramsPerKG =
        cityData.PopRuralMunicipio * ingestionMediaDailyMicrogramMercuryRural +
        cityData.PopUrbMunicipio * ingestionMediaDailyMicrogramMercuryUrban;
    const ingestionMediaMercuryDaily1IndividualInGramsPerKG =
        ingestionMediaMercuryDaily1IndividualInMicrogramsPerKG / 1000000;
    const ingestionMediaDailyIndividualInGramsPerDaily =
        ingestionMediaMercuryDaily1IndividualInGramsPerKG *
        individualAverageWeight;
    const ingestionMediaMercuryEmyears =
        daysIn50years * ingestionMediaDailyIndividualInGramsPerDaily;
    const concentrationMediaMercuryHair =
        ingestionMediaMercuryDaily1IndividualInMicrogramsPerKG / 0.1;
    const deflectionPatternAverageMercury = concentrationMediaMercuryHair / 2;
    const rAoQuadrado = Math.pow(100, 2);
    const popSize100kmRadius = cityData.densidadePop2060 * (Math.PI * rAoQuadrado);
    const affectedPeople = toMethylatedWater / ingestionMediaMercuryEmyears;
    const toPopulationAffectedMercuryHair =
        affectedPeople < popSize100kmRadius
            ? affectedPeople
            : popSize100kmRadius;
    const popPeopleAbove20YearsOldinTheRegion =
        toPopulationAffectedMercuryHair * hypertension.propOfPeopleOver20YearsOfAgeByTotalPop;

    //console.log('Homens acima de 20 anos', peopleAbove20YearsoldInTheRegionIn52Years)

    const disnorm0 = normDist(
    0,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm2 = normDist(
    2,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm4 = normDist(
    4,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm6 = normDist(
    6,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm8 = normDist(
    8,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm10 = normDist(
    10,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm12 = normDist(
    12,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm14 = normDist(
    14,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm16 = normDist(
    16,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm18 = normDist(
    18,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm20 = normDist(
    20,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm22 = normDist(
    22,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm24 = normDist(
    24,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm26 = normDist(
    26,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm28 = normDist(
    28,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm30 = normDist(
    30,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm32 = normDist(
    32,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm34 = normDist(
    34,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm36 = normDist(
    36,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm38 = normDist(
    38,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm40 = normDist(
    40,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )

    const distNorm0ate2 = ((1 - disnorm0 - (1 - disnorm2)) * (1 - 1)) / 1
    const distNorm2ate4 = ((1 - disnorm2 - (1 - disnorm4)) * (1 - 1)) / 1
    const distNorm4ate6 =
    ((1 - disnorm4 - (1 - disnorm6)) * (1.35 - 1)) / 1.35
    const distNorm6ate8 =
    ((1 - disnorm6 - (1 - disnorm8)) * (1.87 - 1)) / 1.87
    const distNorm8ate10 =
    ((1 - disnorm8 - (1 - disnorm10)) * (2.39 - 1)) / 2.39
    const distNorm10ate12 =
    ((1 - disnorm10 - (1 - disnorm12)) * (2.91 - 1)) / 2.91
    const distNorm12ate14 =
    ((1 - disnorm12 - (1 - disnorm14)) * (2.91 - 1)) / 2.91
    const distNorm14ate16 =
    ((1 - disnorm14 - (1 - disnorm16)) * (2.91 - 1)) / 2.91
    const distNorm16ate18 =
    ((1 - disnorm16 - (1 - disnorm18)) * (2.91 - 1)) / 2.91
    const distNorm18ate20 =
    ((1 - disnorm18 - (1 - disnorm20)) * (2.91 - 1)) / 2.91
    const distNorm20ate22 =
    ((1 - disnorm20 - (1 - disnorm22)) * (2.91 - 1)) / 2.91
    const distNorm22ate24 =
    ((1 - disnorm22 - (1 - disnorm24)) * (2.91 - 1)) / 2.91
    const distNorm24ate26 =
    ((1 - disnorm24 - (1 - disnorm26)) * (2.91 - 1)) / 2.91
    const distNorm26ate28 =
    ((1 - disnorm26 - (1 - disnorm28)) * (2.91 - 1)) / 2.91
    const distNorm28ate30 =
    ((1 - disnorm28 - (1 - disnorm30)) * (2.91 - 1)) / 2.91
    const distNorm30ate32 =
    ((1 - disnorm30 - (1 - disnorm32)) * (2.91 - 1)) / 2.91
    const distNorm32ate34 =
    ((1 - disnorm32 - (1 - disnorm34)) * (2.91 - 1)) / 2.91
    const distNorm34ate36 =
    ((1 - disnorm34 - (1 - disnorm36)) * (2.91 - 1)) / 2.91
    const distNorm36ate38 =
    ((1 - disnorm36 - (1 - disnorm38)) * (2.91 - 1)) / 2.91
    const distNorm38ate40 =
    ((1 - disnorm38 - (1 - disnorm40)) * (2.91 - 1)) / 2.91

    const attributableFraction =
    distNorm0ate2 +
    distNorm2ate4 +
    distNorm4ate6 +
    distNorm6ate8 +
    distNorm8ate10 +
    distNorm10ate12 +
    distNorm12ate14 +
    distNorm14ate16 +
    distNorm16ate18 +
    distNorm18ate20 +
    distNorm20ate22 +
    distNorm22ate24 +
    distNorm24ate26 +
    distNorm26ate28 +
    distNorm28ate30 +
    distNorm30ate32 +
    distNorm32ate34 +
    distNorm34ate36 +
    distNorm36ate38 +
    distNorm38ate40

    const annualHypertensionRisk =
        attributableFraction *
        hypertension.propAcima20AnosComHipertensaoporPopAcima20anosRegiaoPais;

    const hypertensionSurvivalProbability = 1 - annualHypertensionRisk
    const productHypertension = Math.pow(
        hypertensionSurvivalProbability,
        hypertension.duracaoDaIncapacidadeHipertensao
    );
    const riscoAcumuladoHipertensaoMercurio = 1 - productHypertension;

    const peopleAbove20YearsoldInTheRegionIn52Years =
        riscoAcumuladoHipertensaoMercurio * popPeopleAbove20YearsOldinTheRegion;

    const hypertensionAttributableFraction =
        (peopleAbove20YearsoldInTheRegionIn52Years * 1000) /
        toPopulationAffectedMercuryHair;
    const hypertensionIncidence =
        (hypertensionAttributableFraction * toPopulationAffectedMercuryHair) /1000;

    //Estava despadronizado comparado ao impacto INFARTO
    /* const calculation1 = (constant*Math.exp(discountRate*yearBeginningOfDisabilityHypertension))/(Math.pow(bplusr,2))
    const calculation2 = bplusr*(durationOfDisabilityHypertension + yearBeginningOfDisabilityHypertension);
    const calculation3 = bplusr*(durationOfDisabilityHypertension + yearBeginningOfDisabilityHypertension)-1;
    const calculation4 = Math.exp(bplusr*yearBeginningOfDisabilityHypertension)*(bplusr*yearBeginningOfDisabilityHypertension-1);
    const calculation5 = (1-agwt)/discountRate;
    const calculation6 = (1-Math.exp(-discountRate*durationOfDisabilityHypertension));
    const calculation7 = (agwt*calculation1*((Math.exp(calculation2)*calculation3)-calculation4)+calculation5*calculation6);

    const dalyHypertension = hypertensionIncidence * weightOgDisabilityHypertension * calculation7;
    const DALY1HypertensionCost = dalyHypertension * aDALYUSD; */

    //Padronizado
    const calculation0 =
        hypertensionIncidence * weightOgDisabilityHypertension;
    const calculation1 =
        (constant *
            Math.exp(discountRate * yearBeginningOfDisabilityHypertension)) /
        Math.pow(bplusr, 2);
    const calculation2 =
        bplusr *
        (durationOfDisabilityHypertension +
            yearBeginningOfDisabilityHypertension);
    const calculation3 =
        bplusr *
            (durationOfDisabilityHypertension +
            yearBeginningOfDisabilityHypertension) - 1;
    const calculation4 =
        Math.exp(bplusr * yearBeginningOfDisabilityHypertension) *
        (bplusr * yearBeginningOfDisabilityHypertension - 1);
    const calculation5 = (1 - agwt) / discountRate;
    const calculation6 =
        1 - Math.exp(-discountRate * durationOfDisabilityHypertension);

    const dalyHypertension =
        calculation0 *
        (agwt *
            calculation1 *
            (Math.exp(calculation2) * calculation3 - calculation4) +
            calculation5 * calculation6);
    const DALY1HypertensionCost = dalyHypertension * aDALYUSD;

    //const AnnualHypertensionCostTreatamentUSD = 292;
    const incidenceHypertensionTreatament =
        (hypertensionIncidence * toPopulationAffectedMercuryHair) / 1000;
    const toCostHypertensionTreatamentInYears =
        incidenceHypertensionTreatament *
        durationOfDisabilityHypertension *
        hypertension.AnnualHypertensionCostTreatamentUSD;
    const toDALYCostAndHypertensionTreatment =
        toCostHypertensionTreatamentInYears + DALY1HypertensionCost;

    //console.log('toDALYCostAndHypertensionTreatment', toDALYCostAndHypertensionTreatment)

    return {
        peopleAbove20YearsoldInTheRegionIn52Years,
        value: toDALYCostAndHypertensionTreatment
    }

}

function lossQICalculator ({
    city,
    country,
    area,
    cavaAverageProductivity,
    excavationGoldLoss,
    percentLossHgInWater,
    HgAuRatio,
    methyladPercent,
    ruralIndividualWeight,
    urbanindividualWeight,
    consumptionMediumFishByDayInGramsUrban,
    levelMediumContaminationFish,
    AverageFishConsumptionPerDayInRuralGrams,
    aDALYUSD,
    lossQI
} : {
    city: string;
    country: countryCodes;
    area: number;
    cavaAverageProductivity: number;
    excavationGoldLoss: number;
    percentLossHgInWater: number;
    HgAuRatio: number;
    methyladPercent: number;
    ruralIndividualWeight: number;
    urbanindividualWeight: number;
    consumptionMediumFishByDayInGramsUrban: number;
    levelMediumContaminationFish: number;
    AverageFishConsumptionPerDayInRuralGrams: number;
    aDALYUSD: number;
    lossQI: LossQIProps;
    
}) {
    const cityData = getCityData(country, city);
    if(!cityData) throw new Error("Municipality data was not found.");

    const gold = hectareToGold({
        area,
        pitDepth,
        cavaAverageProductivity,
        excavationGoldLoss
    });

    const gramsHgReleasedinWater = percentLossHgInWater * HgAuRatio * gold;
    const toMethylatedWater = methyladPercent * gramsHgReleasedinWater;

    const years = 50
    //const birthRate = 18.8;
    //const ruralIndividualWeight = 59.1;
    //const urbanindividualWeight = 70;
    //const levelMediumContaminationFish = 0.5;
    //const AverageFishConsumptionPerDayInRuralGrams = 144.5;
    //const consumptionMediumFishByDayInGramsUrban = 57;
    //const densityPopulationalRegionNorth2060 = 6.00696;

    const individualAverageWeight =
        cityData.PopRuralMunicipio * ruralIndividualWeight +
        cityData.PopUrbMunicipio * urbanindividualWeight;
    const ingestionMediaDailyMicrogramMercuryUrban =
        (consumptionMediumFishByDayInGramsUrban *
            levelMediumContaminationFish) /
        urbanindividualWeight;
    const ingestionMediaDailyMicrogramMercuryRural =
        (AverageFishConsumptionPerDayInRuralGrams *
            levelMediumContaminationFish) / ruralIndividualWeight;
    const ingestionMediaMercuryDaily1IndividualInMicrogramsPerKG =
        cityData.PopRuralMunicipio * ingestionMediaDailyMicrogramMercuryRural +
        cityData.PopUrbMunicipio * ingestionMediaDailyMicrogramMercuryUrban;
    const ingestionMediaMercuryDaily1IndividualInGramsPerKGperDay =
        ingestionMediaMercuryDaily1IndividualInMicrogramsPerKG / 1000000;
    const ingestionMediaDailyIndividualInGramsPerDaily =
        ingestionMediaMercuryDaily1IndividualInGramsPerKGperDay *
        individualAverageWeight;
    const ingestionMediaMercuryIn50years =
        daysInTheYear * years * ingestionMediaDailyIndividualInGramsPerDaily;

    const concentrationMediaMercuryHair =
        ingestionMediaMercuryDaily1IndividualInMicrogramsPerKG / 0.1
    //console.log('concentração médio de mercurio no cabelo', concentrationMediaMercuryHair)
    const deflectionPatternAverageMercury = concentrationMediaMercuryHair / 2
    const rAoQuadrado = Math.pow(100, 2)
    const popSize100kmRadius = cityData.densidadePop2060 * (Math.PI * rAoQuadrado);

    const affectedPeople = toMethylatedWater / ingestionMediaMercuryIn50years

    const toPopulationAffectedMercuryHair =
    affectedPeople < popSize100kmRadius
        ? affectedPeople
        : popSize100kmRadius

    const affectedLiveBirths = toPopulationAffectedMercuryHair * lossQI.birthRate;
    const liveBornPop = affectedLiveBirths / 1000;

    const weightOfDisability = 0.361
    const agwt = 1
    const constant = 0.1658
    const discountRate = 0.03
    const yearStarOfDisability = 0
    const bplusr = -0.07
    const durationOfDisability = 72

    const disnorm0 = normDist(
    0,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm2 = normDist(
    2,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm4 = normDist(
    4,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm6 = normDist(
    6,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm8 = normDist(
    8,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm10 = normDist(
    10,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm12 = normDist(
    12,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm14 = normDist(
    14,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm16 = normDist(
    16,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm18 = normDist(
    18,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm20 = normDist(
    20,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm22 = normDist(
    22,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm24 = normDist(
    24,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm26 = normDist(
    26,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm28 = normDist(
    28,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm30 = normDist(
    30,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm32 = normDist(
    32,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm34 = normDist(
    34,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm36 = normDist(
    36,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm38 = normDist(
    38,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm40 = normDist(
    40,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )

    const porcentNascidosVivosPerdaQIAcimaDe2Pts = 1 - disnorm10

    const porcentNascidosVivosPerdaQIAcimaDe2PtsFinal =
    porcentNascidosVivosPerdaQIAcimaDe2Pts < 0.01
        ? 0.01
        : porcentNascidosVivosPerdaQIAcimaDe2Pts

    const porcentNascidosVivosPerdaQIAcimaDe2PtsFinal2 =
    porcentNascidosVivosPerdaQIAcimaDe2PtsFinal > 1.0
        ? 1.0
        : porcentNascidosVivosPerdaQIAcimaDe2PtsFinal

    const distNorm0ate2 = (1 - disnorm0 - (1 - disnorm2)) * 1000 * 0.0005
    const distNorm2ate4 = (1 - disnorm2 - (1 - disnorm4)) * 1000 * 0.0022
    const distNorm4ate6 = (1 - disnorm4 - (1 - disnorm6)) * 1000 * 0.0034
    const distNorm6ate8 = (1 - disnorm6 - (1 - disnorm8)) * 1000 * 0.0046
    const distNorm8ate10 = (1 - disnorm8 - (1 - disnorm10)) * 1000 * 0.0066
    const distNorm10ate12 = (1 - disnorm10 - (1 - disnorm12)) * 1000 * 0.0079
    const distNorm12ate14 = (1 - disnorm12 - (1 - disnorm14)) * 1000 * 0.0101
    const distNorm14ate16 = (1 - disnorm14 - (1 - disnorm16)) * 1000 * 0.0116
    const distNorm16ate18 = (1 - disnorm16 - (1 - disnorm18)) * 1000 * 0.0131
    const distNorm18ate20 = (1 - disnorm18 - (1 - disnorm20)) * 1000 * 0.0156
    const distNorm20ate22 = (1 - disnorm20 - (1 - disnorm22)) * 1000 * 0.0173
    const distNorm22ate24 = (1 - disnorm22 - (1 - disnorm24)) * 1000 * 0.0199
    const distNorm24ate26 = (1 - disnorm24 - (1 - disnorm26)) * 1000 * 0.0218
    const distNorm26ate28 = (1 - disnorm26 - (1 - disnorm28)) * 1000 * 0.0237
    const distNorm28ate30 = (1 - disnorm28 - (1 - disnorm30)) * 1000 * 0.0267
    const distNorm30ate32 = (1 - disnorm30 - (1 - disnorm32)) * 1000 * 0.0288
    const distNorm32ate34 = (1 - disnorm32 - (1 - disnorm34)) * 1000 * 0.032
    const distNorm34ate36 = (1 - disnorm34 - (1 - disnorm36)) * 1000 * 0.0343
    const distNorm36ate38 = (1 - disnorm36 - (1 - disnorm38)) * 1000 * 0.0366
    const distNorm38ate40 = (1 - disnorm38 - (1 - disnorm40)) * 1000 * 0.0402

    const attributableFraction =
    distNorm0ate2 +
    distNorm2ate4 +
    distNorm4ate6 +
    distNorm6ate8 +
    distNorm8ate10 +
    distNorm10ate12 +
    distNorm12ate14 +
    distNorm14ate16 +
    distNorm16ate18 +
    distNorm18ate20 +
    distNorm20ate22 +
    distNorm22ate24 +
    distNorm24ate26 +
    distNorm26ate28 +
    distNorm28ate30 +
    distNorm30ate32 +
    distNorm32ate34 +
    distNorm34ate36 +
    distNorm36ate38 +
    distNorm38ate40

    const incidence = attributableFraction * (liveBornPop / 1000)

    const weightOfDisabilityPorincidence = incidence * weightOfDisability
    const calculation1 =
    (constant * Math.exp(discountRate * yearStarOfDisability)) /
    Math.pow(bplusr, 2)
    const calculation2 =
    bplusr * (durationOfDisability + yearStarOfDisability)
    const calculation3 =
    bplusr * (durationOfDisability + yearStarOfDisability) - 1
    const calculation4 =
    Math.exp(bplusr * yearStarOfDisability) *
    (bplusr * yearStarOfDisability - 1)
    const calculation5 = (1 - agwt) / discountRate
    const calculation6 = 1 - Math.exp(-discountRate * durationOfDisability)
    const daly =
    weightOfDisabilityPorincidence *
    (agwt *
        calculation1 *
        (Math.exp(calculation2) * calculation3 - calculation4) +
        calculation5 * calculation6)
    //const aDALYUSD = 103599;
    const toLossQIFetuses = daly * aDALYUSD

    return {
    concentrationMediaMercuryHair,
    porcentNascidosVivosPerdaQIAcimaDe2Pts:
        porcentNascidosVivosPerdaQIAcimaDe2PtsFinal2, //porcentNascidosVivosPerdaQIAcimaDe2PtsValue,
    value: toLossQIFetuses
    }
}

function heartAttackCalculator ({
    city,
    country,
    area,
    general,
    heartAttack
} : {
    city: string;
    country: countryCodes;
    area: number;
    // cavaAverageProductivity,
    // excavationGoldLoss
    // percentLossHgInWater_convervative
    // HgAuRatio
    general: generalProps;
    heartAttack: HeartAttack;
}) {
    const cityData = getCityData(country, city);
    if(!cityData) throw new Error("Municipality data was not found.");

    const gold = hectareToGold({
        area,
        pitDepth,
        cavaAverageProductivity: general.cavaAverageProductivity,
        excavationGoldLoss: general.excavationGoldLoss
    });

    // ALLUVION
    const HgGrassReleasedInWater = general.percentLossHgInWater_convervative * general.HgAuRatio * gold
    // 
    const toMethylatedWater = general.methyladPercent_conservative * HgGrassReleasedInWater;
    //console.log('Mercurio metilado na agua', toMethylatedWater)

    const years = 50

    const durationDisabilityInfarction = 27
    const weightOfDisabilityDisease = 0.439
    const agwt = 1
    const constant = 0.1658
    const discountRate = 0.03
    const yearStartOfDisabilityInfarction = 40
    const bplusr = -0.07

    //const accumulatedRiskMercuryInfarction = 0.0161;

    const individualAverageWeight =
        cityData.PopRuralMunicipio * general.ruralIndividualWeight +
        cityData.PopUrbMunicipio * general.urbanindividualWeight
    const daysIn50years = 365 * years

    const ingestionMediaDailyMicrogramMercuryUrban =
        (general.consumptionMediumFishByDayInGramsUrban *
            general.levelMediumContaminationFish) / general.urbanindividualWeight;
    const ingestionMediaDailyMicrogramMercuryRural =
        (general.AverageFishConsumptionPerDayInRuralGrams *
            general.levelMediumContaminationFish) / general.ruralIndividualWeight;
    const ingestionMediaMercuryDaily1IndividualInMicrogramsPerKG =
        cityData.PopRuralMunicipio * ingestionMediaDailyMicrogramMercuryRural +
        cityData.PopUrbMunicipio * ingestionMediaDailyMicrogramMercuryUrban;
    const ingestionMediaMercuryDaily1IndividualInGramsPerKGDay =
        ingestionMediaMercuryDaily1IndividualInMicrogramsPerKG / 1000000;
    const ingestionMediaDaily1IndividualInGrams =
        ingestionMediaMercuryDaily1IndividualInGramsPerKGDay *
        individualAverageWeight;
    const ingestionMediaMercuryEmyears =
        daysIn50years * ingestionMediaDaily1IndividualInGrams;
    const concentrationMediaMercuryHair =
        ingestionMediaMercuryDaily1IndividualInMicrogramsPerKG / 0.1;
    const deflectionPatternAverageMercury = concentrationMediaMercuryHair / 2

    //const rAoQuadrado = Math.pow(100, 2)
    //const popSize100kmRadius = isRegion ? (popDensity2060 * (Math.PI * rAoQuadrado)) : (densityPopulationalRegionNorth2060 * (Math.PI * rAoQuadrado));
    const popSize100kmRadius = cityData.densidadePop2060 * Math.pow(Math.PI * 100, 2);

    const affectedPeople = toMethylatedWater / ingestionMediaMercuryEmyears;
    const toPopulationAffectedMercuryHair =
        affectedPeople < popSize100kmRadius
            ? affectedPeople
            : popSize100kmRadius;
    //console.log('População afetada com mercurio no cabelo', toPopulationAffectedMercuryHair)
    const popMenOver40inTheRegion = toPopulationAffectedMercuryHair * heartAttack.proMenOver40ByPopTotal;

    // console.log('&&&', concentrationMediaMercuryHair,
    //     deflectionPatternAverageMercury)

    const disnorm0 = normDist(
    0,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm2 = normDist(
    2,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm4 = normDist(
    4,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm6 = normDist(
    6,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm8 = normDist(
    8,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm10 = normDist(
    10,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm12 = normDist(
    12,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm14 = normDist(
    14,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm16 = normDist(
    16,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm18 = normDist(
    18,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm20 = normDist(
    20,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm22 = normDist(
    22,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm24 = normDist(
    24,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm26 = normDist(
    26,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm28 = normDist(
    28,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm30 = normDist(
    30,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm32 = normDist(
    32,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm34 = normDist(
    34,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm36 = normDist(
    36,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm38 = normDist(
    38,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    const disnorm40 = normDist(
    40,
    concentrationMediaMercuryHair,
    deflectionPatternAverageMercury,
    1
    )
    // console.log('###', disnorm0, disnorm2)

    const distNorm0ate2 = ((1 - disnorm0 - (1 - disnorm2)) * (1 - 1)) / 1
    const distNorm2ate4 = ((1 - disnorm2 - (1 - disnorm4)) * (1 - 1)) / 1
    const distNorm4ate6 =
    ((1 - disnorm4 - (1 - disnorm6)) * (1.69 - 1)) / 1.69
    // console.log('!!!', disnorm4, disnorm6)
    const distNorm6ate8 =
    ((1 - disnorm6 - (1 - disnorm8)) * (1.81 - 1)) / 1.81
    const distNorm8ate10 =
    ((1 - disnorm8 - (1 - disnorm10)) * (1.93 - 1)) / 1.93
    const distNorm10ate12 =
    ((1 - disnorm10 - (1 - disnorm12)) * (2.04 - 1)) / 2.04
    const distNorm12ate14 =
    ((1 - disnorm12 - (1 - disnorm14)) * (2.16 - 1)) / 2.16
    const distNorm14ate16 =
    ((1 - disnorm14 - (1 - disnorm16)) * (2.16 - 1)) / 2.16
    // console.log('!!!', disnorm14, disnorm16)
    const distNorm16ate18 =
    ((1 - disnorm16 - (1 - disnorm18)) * (2.16 - 1)) / 2.16
    const distNorm18ate20 =
    ((1 - disnorm18 - (1 - disnorm20)) * (2.16 - 1)) / 2.16
    const distNorm20ate22 =
    ((1 - disnorm20 - (1 - disnorm22)) * (2.16 - 1)) / 2.16
    const distNorm22ate24 =
    ((1 - disnorm22 - (1 - disnorm24)) * (2.16 - 1)) / 2.16
    const distNorm24ate26 =
    ((1 - disnorm24 - (1 - disnorm26)) * (2.16 - 1)) / 2.16
    const distNorm26ate28 =
    ((1 - disnorm26 - (1 - disnorm28)) * (2.16 - 1)) / 2.16
    const distNorm28ate30 =
    ((1 - disnorm28 - (1 - disnorm30)) * (2.16 - 1)) / 2.16
    const distNorm30ate32 =
    ((1 - disnorm30 - (1 - disnorm32)) * (2.16 - 1)) / 2.16
    const distNorm32ate34 =
    ((1 - disnorm32 - (1 - disnorm34)) * (2.16 - 1)) / 2.16
    const distNorm34ate36 =
    ((1 - disnorm34 - (1 - disnorm36)) * (2.16 - 1)) / 2.16
    const distNorm36ate38 =
    ((1 - disnorm36 - (1 - disnorm38)) * (2.16 - 1)) / 2.16
    const distNorm38ate40 =
    ((1 - disnorm38 - (1 - disnorm40)) * (2.16 - 1)) / 2.16

    const attributableFraction =
    distNorm0ate2 +
    distNorm2ate4 +
    distNorm4ate6 +
    distNorm6ate8 +
    distNorm8ate10 +
    distNorm10ate12 +
    distNorm12ate14 +
    distNorm14ate16 +
    distNorm16ate18 +
    distNorm18ate20 +
    distNorm20ate22 +
    distNorm22ate24 +
    distNorm24ate26 +
    distNorm26ate28 +
    distNorm28ate30 +
    distNorm30ate32 +
    distNorm32ate34 +
    distNorm34ate36 +
    distNorm36ate38 +
    distNorm38ate40

//       console.log('##', distNorm0ate2 +
//         distNorm2ate4, 
//         distNorm4ate6 ,
//         distNorm6ate8 ,
//         distNorm8ate10 ,
//         distNorm10ate12 ,
//         distNorm12ate14 ,
//         distNorm14ate16 ,
//         distNorm16ate18 ,
//         distNorm18ate20 ,
//         distNorm20ate22 ,
//         distNorm22ate24 ,
//         distNorm24ate26 ,
//         distNorm26ate28 ,
//         distNorm28ate30 ,
//         distNorm30ate32 ,
//         distNorm32ate34 ,
//         distNorm34ate36 ,
//         distNorm36ate38 ,
//         distNorm38ate40
// )
    const annualHeartAttackRisk =
        attributableFraction *
        heartAttack.propHomensAcima40AnosComInfartoporPopHomensAcima40anosRegiaoPais;
    // console.log('###', attributableFraction , propHomensAcima40AnosComInfartoporPopHomensAcima40anosRegiaoPais)
    const heartAttackSurvivalProbability = 1 - annualHeartAttackRisk;
    // console.log('###', annualHeartAttackRisk)
    const productHeartAttack = Math.pow(
        heartAttackSurvivalProbability,
        heartAttack.duracaoDaIncapacidadeInfarto
    );
    // console.log('###', heartAttackSurvivalProbability,duracaoDaIncapacidadeInfarto)
    const riscoAcumuladoInfartoMercurio = 1 - productHeartAttack;
    // console.log('**', productHeartAttack)

    const menOver40InTheRegionIn27Years =
        riscoAcumuladoInfartoMercurio * popMenOver40inTheRegion;
    // console.log('**', riscoAcumuladoInfartoMercurio, popMenOver40inTheRegion)
    //console.log("riscoAcumuladoInfartoMercurio", riscoAcumuladoInfartoMercurio,"popMenOver40inTheRegion", popMenOver40inTheRegion)
    //console.log('Homens acima de 40anos', menOver40InTheRegionIn27Years)

    const infarctionAttributableFraction =
        (menOver40InTheRegionIn27Years * 1000) / toPopulationAffectedMercuryHair;
    // console.log('***', menOver40InTheRegionIn27Years, toPopulationAffectedMercuryHair)
    const infarctionIncidence =
        (infarctionAttributableFraction * toPopulationAffectedMercuryHair) / 1000;
    // console.log('###', infarctionAttributableFraction , toPopulationAffectedMercuryHair)
    const calculation0 = infarctionIncidence * weightOfDisabilityDisease
    // console.log('####', infarctionIncidence , weightOfDisabilityDisease)
    const calculation1 =
        (constant * Math.exp(discountRate * yearStartOfDisabilityInfarction)) /
        Math.pow(bplusr, 2);
    // console.log('calculation1', calculation1)
    // console.log('####', constant, Math.exp(discountRate * yearStartOfDisabilityInfarction), Math.pow(bplusr, 2))
    const calculation2 =
        bplusr *
        (durationDisabilityInfarction + yearStartOfDisabilityInfarction);
    const calculation3 =
        bplusr *
            (durationDisabilityInfarction + yearStartOfDisabilityInfarction) - 1;
    const calculation4 =
        Math.exp(bplusr * yearStartOfDisabilityInfarction) *
        (bplusr * yearStartOfDisabilityInfarction - 1);
    const calculation5 = (1 - agwt) / discountRate;
    const calculation6 =
        1 - Math.exp(-discountRate * durationDisabilityInfarction);

    const dalyInfarInfarto =
        calculation0 * (
            agwt * calculation1 * (
                Math.exp(calculation2) * calculation3 - calculation4
            ) + calculation5 * calculation6
        );
        // console.log('^^', calculation0, agwt, calculation1, calculation2, calculation3 - calculation4)
    const DALYInfarction = dalyInfarInfarto * general.aDALYUSD;
    // console.log('^^^', dalyInfarInfarto , aDALYUSD)

    //const annualInfarctTreatmentCostUSD = 2300;
    const infarctionIncidenceTreatment =
    (infarctionAttributableFraction * toPopulationAffectedMercuryHair) / 1000;
    // console.log(infarctionAttributableFraction, toPopulationAffectedMercuryHair)
    const toCostOfInfarctionTreatmentYears =
        infarctionIncidenceTreatment *
        durationDisabilityInfarction *
        heartAttack.annualInfarctTreatmentCostUSD;
    // console.log(infarctionIncidenceTreatment, durationDisabilityInfarction, annualInfarctTreatmentCostUSD)
    const toDALYCostAndInfarctionTreatment =
        toCostOfInfarctionTreatmentYears + DALYInfarction;
    // console.log(toCostOfInfarctionTreatmentYears, DALYInfarction)

    // console.log('toDALYCostAndInfarctionTreatment', toDALYCostAndInfarctionTreatment);

    return {
    toMethylatedWater,
    toPopulationAffectedMercuryHair,
    menOver40InTheRegionIn27Years,
    value: toDALYCostAndInfarctionTreatment
    }
}

function soilMercuryRemediationCalculator({
    area,
    HgAuRatio,
    soilMercuryRemediation,
    cavaAverageProductivity,
    excavationGoldLoss
} : {
    area: number;
    HgAuRatio: number;
    soilMercuryRemediation: SoilMercuryRemediationProps;
    cavaAverageProductivity: number;
    excavationGoldLoss: number;
}) {
    // const cityData = getCityData(country, city);
    // if(!cityData) throw new Error("Municipality data was not found.");

    const gold = hectareToGold({
        area,
        pitDepth,
        cavaAverageProductivity,
        excavationGoldLoss
    });

    const amountOfHgDumpedintoSoilerGold = soilMercuryRemediation.lossPercentHgInSoil_conservative * HgAuRatio;
    // ALLUVION 
    const toQuantityHgDumpedSoil = amountOfHgDumpedintoSoilerGold * gold
    const contaminatedSoilTon =
        toQuantityHgDumpedSoil / soilMercuryRemediation.HgContainedSoilinGrassPerTon;
    const M3SoloContaminadoHg = contaminatedSoilTon / soilMercuryRemediation.DensidadeSolo;

    const toCostOfSoilHgRemediation =
        soilMercuryRemediation.remediationCostUSDPerTonOfSoil * M3SoloContaminadoHg
    return toCostOfSoilHgRemediation
}

function waterMercuryRemediationCalculator ({
    area,
    country,
    cavaAverageProductivity,
    excavationGoldLoss,
    HgAuRatio,
    percentLossHgInWater, //conservative
    methyladPercent, //conservative
    soilMercuryRemediation
} : {
    area: number;
    country: countryCodes;
    cavaAverageProductivity: number;
    excavationGoldLoss: number;
    HgAuRatio: number;
    percentLossHgInWater: number;
    methyladPercent: number;
    soilMercuryRemediation: SoilMercuryRemediationProps;
}) {
    if(country !== countryCodes.PE) {
        return 0;
    }
    const gold = hectareToGold({
        area,
        pitDepth,
        cavaAverageProductivity,
        excavationGoldLoss
    });
    
    const hgl = gold * HgAuRatio * percentLossHgInWater * (1 - methyladPercent);
    return ((hgl / soilMercuryRemediation.HgContainedSoilinGrassPerTon) / 
        soilMercuryRemediation.DensidadeSedimento) * 
        soilMercuryRemediation.remediationCostUSDPerTonOfSoil;
}