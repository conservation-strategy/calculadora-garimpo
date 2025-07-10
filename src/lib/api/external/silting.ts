import { CavaGroundingCostAuFertile, CavaGroundingCostAuNormProps, DredgingAndRiverSediments, ErosionSiltingUpProps, generalProps } from "@/types";
import { hectareToGold, densityGold } from "./gold";
import { CalculatorArgs, pitDepth, daysInTheYear, hoursWorkedByDredgePerDay } from "./store";
import { countryCodes } from "@/enums";
import { getCityData } from "@/lib/calculator";
import calcMontante from "@/utils/calcMontante";
import vpl from "@/utils/vpl";
import { filterValuesBelowOnePercent, sumValues } from "@/utils/filterValues";


interface SiltingOfRiversArgs extends CalculatorArgs {
    general: generalProps;
    cavaGroundingCostAuFertile: CavaGroundingCostAuFertile;
    cavaGroundingCostAuNorm: CavaGroundingCostAuNormProps;
    erosionSiltingUp: ErosionSiltingUpProps;
    dredgingAndRiverSediments: DredgingAndRiverSediments;
}

export function calculateSiltingOfRiversImpact({
    city,
    country,
    affectedArea,
    general,
    cavaGroundingCostAuFertile,
    cavaGroundingCostAuNorm,
    dredgingAndRiverSediments,
    erosionSiltingUp
} : SiltingOfRiversArgs) {
    const cavaGroundingCostAuFertileImpact = cavaGroundingCostAuFertileCalculator({
        city,
        country,
        area: affectedArea,
        cavaGroundingCostAuFertile,
        general
    });

    const cavaGroundingCostAuNormImpact = cavaGroundingCostAuNormCalculator({
        city,
        country,
        area: affectedArea,
        general,
        cavaGroundingCostAuNorm
    });

    const dredgingAndRiverSedimentsImpact = dredgingAndRiverSedimentsCalculator({
        city,
        country,
        area: affectedArea,
        dredgingAndRiverSediments,
        averageDriverSalaryFreightPerKmUSD: general.averageDriverSalaryFreightPerKmUSD,
        kmRotatedPerLiter: general.kmRotatedPerLiter,
        priceLiterDieselUSD: general.priceLiterDieselUSD
    });

    const erosionSiltingUpImpact = erosionSiltingUpCalculator({
        area: affectedArea,
        erosionSiltingUp
    });

    const impacts = filterValuesBelowOnePercent([
        cavaGroundingCostAuNormImpact,
        cavaGroundingCostAuFertileImpact.value,
        dredgingAndRiverSedimentsImpact,
        erosionSiltingUpImpact       
    ]);

    return sumValues(impacts);
}

function cavaGroundingCostAuFertileCalculator({
    city,
    country,
    area,
    cavaGroundingCostAuFertile,
    general
} : {
    city: string,
    country: countryCodes;
    area: number;
    cavaGroundingCostAuFertile: CavaGroundingCostAuFertile,
    general: generalProps
    // cavaAverageProductivity: number;
    // excavationGoldLoss: number;
    // averageDepthOfFertileEarth: number;    
    // excavatorHoursDays: number;
    // quantitOfM3ExcavatorPerHour: number;
    // excavatorCostPerKMUSD: number;
    // kmRotatedPerLiter: number;
    // priceLiterDieselUSD: number;
    // averageDriverSalaryFreightPerKmUSD: number;
}) {
    const cityData = getCityData(country, city);
    if(!cityData) throw new Error("Municipality data was not found.");

    const {
        cavaAverageProductivity,
        excavationGoldLoss,
        averageDepthOfFertileEarth,    
        excavatorHoursDays,
        quantitOfM3ExcavatorPerHour,
        excavatorCostPerKMUSD,
        kmRotatedPerLiter,
        priceLiterDieselUSD,
        averageDriverSalaryFreightPerKmUSD,
    } = general;

    const gold = hectareToGold({
        pitDepth,
        area,
        cavaAverageProductivity,
        excavationGoldLoss
    });
    const daysInTheYear = 365
    const sterileOreEnhancement = 7
    const pitProductivity = 0.4

    const revolvedSoloTon = gold / pitProductivity
    const upturnedSterileTon = revolvedSoloTon * sterileOreEnhancement
    const toUpturnedSoil = revolvedSoloTon + upturnedSterileTon
    const losslessVolume = toUpturnedSoil / densityGold
    const lossyVolume = losslessVolume * excavationGoldLoss
    //console.log('volume com perda', lossyVolume)
    const affectedAreaM2 = lossyVolume / pitDepth

    const fertileLandVolume = averageDepthOfFertileEarth * affectedAreaM2
    const toCostGroundingFertileLandWithoutFreight =
        fertileLandVolume * cavaGroundingCostAuFertile.groundingCostFertilePitUSD
    const excavatorQuantityM3PerYearFertileLand =
        daysInTheYear * excavatorHoursDays * quantitOfM3ExcavatorPerHour
    const excavatornsQuantityFertil =
        fertileLandVolume / excavatorQuantityM3PerYearFertileLand < 1
        ? 1
        : Math.ceil(
            fertileLandVolume / excavatorQuantityM3PerYearFertileLand
            ) //ok
    const transportCostTotalFreightFertileExcavator =
        cityData?.Distancia_Garimpo_Centro * excavatorCostPerKMUSD
    const qtLitersDieselConsumedFertil =
        cityData?.Distancia_Garimpo_Centro / kmRotatedPerLiter
    const fuelCostFertileFreight =
        priceLiterDieselUSD * qtLitersDieselConsumedFertil
    const freightCostWithFertilDriver =
        averageDriverSalaryFreightPerKmUSD * cityData?.Distancia_Garimpo_Centro
    const totalCostShippingFertileOneWay =
        freightCostWithFertilDriver +
        fuelCostFertileFreight +
        transportCostTotalFreightFertileExcavator
    const toCostShippingGroundFertilityRoundtrip =
        totalCostShippingFertileOneWay * 2
    const toCostFreightFinalFertileGrounding =
        toCostShippingGroundFertilityRoundtrip * excavatornsQuantityFertil
    const toCostOfFertileGroundingWithFreight =
        toCostFreightFinalFertileGrounding +
        toCostGroundingFertileLandWithoutFreight
    return {
        lossyVolume,
        value: toCostOfFertileGroundingWithFreight
    }
}

function cavaGroundingCostAuNormCalculator ({
    city,
    country,
    area,
    general,
    cavaGroundingCostAuNorm
} : {
    city: string;
    country: countryCodes;
    area: number;
    general: generalProps;
    cavaGroundingCostAuNorm: CavaGroundingCostAuNormProps;
    // averageDepthOfFertileEarth: number;
    // normalCavaGroundingCostUSD: number;
    // excavatorHoursDays: number;
    // quantitOfM3ExcavatorPerHour: number;
    // excavatorCostPerKMUSD: number;
    // kmRotatedPerLiter: number;
    // averageDriverSalaryFreightPerKmUSD: number;
    // priceLiterDieselUSD: number;
}) {
    const cityData = getCityData(country, city);
    if(!cityData) throw new Error("Municipality data was not found.");

    const {
        averageDepthOfFertileEarth,
        excavatorHoursDays,
        quantitOfM3ExcavatorPerHour,
        excavatorCostPerKMUSD,
        kmRotatedPerLiter,
        averageDriverSalaryFreightPerKmUSD,
        priceLiterDieselUSD,
    } = general;

    const normalGroundDepth = pitDepth - averageDepthOfFertileEarth
    const affectedAreaM2 = area * 10000;
    const normalGroundVolume = normalGroundDepth * affectedAreaM2

    const toCostNormalGroundingWithoutShipping =
        normalGroundVolume * cavaGroundingCostAuNorm.normalCavaGroundingCostUSD
    const excavatorQuantityM3PerYear =
        daysInTheYear * excavatorHoursDays * quantitOfM3ExcavatorPerHour
    const normalExcavatorsQuantity =
        normalGroundVolume / excavatorQuantityM3PerYear < 1
        ? 1
        : Math.ceil(normalGroundVolume / excavatorQuantityM3PerYear)
    const transportCostTotalFreightNormalExcavator =
        cityData.Distancia_Garimpo_Centro * excavatorCostPerKMUSD
    const AmountOfLitersDieselConsumed =
        cityData.Distancia_Garimpo_Centro / kmRotatedPerLiter
    const freightCostWithNormalDriver =
        averageDriverSalaryFreightPerKmUSD * cityData.Distancia_Garimpo_Centro
    const fuelCostNormalFreight =
        priceLiterDieselUSD * AmountOfLitersDieselConsumed
    const toCostNormalShippingOneWay =
        freightCostWithNormalDriver +
        fuelCostNormalFreight +
        transportCostTotalFreightNormalExcavator
    const toCostFreightNroamlGroundingRoundTrip =
        toCostNormalShippingOneWay * 2
    const toCostFreightFinalNormalGrounding =
        toCostFreightNroamlGroundingRoundTrip * normalExcavatorsQuantity
    const toCostNormalGroundingWithFreight =
        toCostFreightFinalNormalGrounding +
        toCostNormalGroundingWithoutShipping
    return toCostNormalGroundingWithFreight
}

function dredgingAndRiverSedimentsCalculator ({
    city,
    country,
    area,
    dredgingAndRiverSediments,
    priceLiterDieselUSD,
    averageDriverSalaryFreightPerKmUSD,
    kmRotatedPerLiter
} : {
    city: string;
    country: countryCodes;
    area: number;
    dredgingAndRiverSediments: DredgingAndRiverSediments;
    priceLiterDieselUSD: number;
    averageDriverSalaryFreightPerKmUSD: number;
    kmRotatedPerLiter: number;
}) {
    const cityData = getCityData(country, city);
    if(!cityData) throw new Error("Municipality data was not found.");

    const affectedAreaM2 = area * 10000
    const volumeWithLoss = pitDepth * affectedAreaM2
    const volumeLandSiltingRiver = dredgingAndRiverSediments.siltingPercentage * volumeWithLoss
    const dredgingCostWithoutFreight =
        dredgingAndRiverSediments.dredgingCostPerM3 * volumeLandSiltingRiver
    const amountOfSedimentPer1M3DredgePerYear =
        daysInTheYear *
        hoursWorkedByDredgePerDay *
        dredgingAndRiverSediments.theAmountOfSedimentPer1DredgeM3PerHour
    const dredgerQuantity1Year =
        volumeLandSiltingRiver / amountOfSedimentPer1M3DredgePerYear < 1
        ? 1
        : Math.round(
            volumeLandSiltingRiver / amountOfSedimentPer1M3DredgePerYear
            )
    const shippingCostDredgeBRL =
        cityData.Distancia_Garimpo_Centro * dredgingAndRiverSediments.transportCost1DredgeUSD
    const quantityOfLitersConsumedDiesel =
        cityData.Distancia_Garimpo_Centro / kmRotatedPerLiter
    const fuelCostFreightDredging =
        priceLiterDieselUSD * quantityOfLitersConsumedDiesel
    const shippingCostWithDredgingDriver =
        averageDriverSalaryFreightPerKmUSD * cityData.Distancia_Garimpo_Centro
    const toCostShippingDredgingOneWay =
        shippingCostWithDredgingDriver +
        fuelCostFreightDredging +
        shippingCostDredgeBRL
    const toCostShippingDredgingOneWayAndReturn =
        toCostShippingDredgingOneWay * 2
    const toCostShippingFinalDredging =
        toCostShippingDredgingOneWayAndReturn * dredgerQuantity1Year
    const toDredgingCostWithFreight =
        toCostShippingFinalDredging + dredgingCostWithoutFreight
    return toDredgingCostWithFreight
}

function erosionSiltingUpCalculator ({
    area,
    erosionSiltingUp
} : {
    area: number;
    erosionSiltingUp: ErosionSiltingUpProps
}) {
    const discountRate = 0.03
    const amounts = calcMontante(erosionSiltingUp.siltingUpCostPerHaUSD);
    const VPLhectareSilting = vpl(discountRate, amounts);
    return VPLhectareSilting * area;
}

