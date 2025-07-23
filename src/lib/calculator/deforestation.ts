import { countryCodes } from "@/enums";
import { getCityData } from "@/lib/calculator";
import calcMontante from "@/utils/calcMontante";
import vpl from "@/utils/vpl";
import { BioProspectingProps, CarbonProps, generalProps, RecoverOfTopSollProps, WoodAndNonWoodProductsProps } from "@/types";
import { CalculatorArgs } from "@/lib/calculator";
import { filterValuesBelowOnePercent, sumValues } from "@/utils/filterValues";

interface CalculateDeforestationInputs extends CalculatorArgs {
    bioprospecting: BioProspectingProps;
    carbon: CarbonProps;
    recoverOfTopSoll: RecoverOfTopSollProps;
    woodAndNonWoodProducts: WoodAndNonWoodProductsProps;
    general: generalProps;
}

export function calculateDeforestationImpact({
    country,
    city,
    affectedArea,
    bioprospecting,
    carbon,
    recoverOfTopSoll,
    woodAndNonWoodProducts,
    general
    // GDPperCapitaBrazilUSD,
    // celciusTemperature,
    // kmRotatedPerLiter,
    // priceLiterDieselUSD,
    // averageDriverSalaryFreightPerKmUSD
} : CalculateDeforestationInputs) {
    const {
        GDPperCapitaBrazilUSD,
        celciusTemperature,
        kmRotatedPerLiter,
        priceLiterDieselUSD,
        averageDriverSalaryFreightPerKmUSD
    } = general;
    const bioProspectingImpact = bioprospectingCalculator({
        area: affectedArea,
        bioprospecting
    });

    const carbonImpact = carbonCalculator({
        area: affectedArea,
        carbon
    });

    const culturedAndSpeciesImpact = culturedAndSpeciesCalculator({
        city,
        country,
        area: affectedArea,
        GDPperCapitaBrazilUSD,
        celciusTemperature,
        discountRate: bioprospecting.discountRate
    });

    const recoveryOfTopsoilImpact = recoveryOfTopsoilCalculator({
        city,
        country,
        area: affectedArea,
        recoverOfTopSoll,
        kmRotatedPerLiter,
        priceLiterDieselUSD,
        averageDriverSalaryFreightPerKmUSD
    });

    const recreationImpact = recreationCalculator({
        city,
        country,
        area: affectedArea,
        GDPperCapitaBrazilUSD,
        celciusTemperature,
    });

    const woodAndNonWoodProductsImpact = woodAndNonWoodProductsCalculator({
        area: affectedArea,
        woodAndNonWoodProducts
    });

    // console.log('bioProspectingImpact sem inflacao', bioProspectingImpact)
    // console.log('carbonImpact sem inflacao', carbonImpact)
    // console.log('culturedAndSpeciesImpact sem inflacao', culturedAndSpeciesImpact)
    // console.log('recoveryOfTopsoilImpact sem inflacao', recoveryOfTopsoilImpact)
    // console.log('woodAndNonWoodProductsImpact sem inflacao', woodAndNonWoodProductsImpact)
    const impacts = filterValuesBelowOnePercent([
        bioProspectingImpact,
        carbonImpact,
        culturedAndSpeciesImpact,
        recoveryOfTopsoilImpact,
        recreationImpact,
        woodAndNonWoodProductsImpact
    ]);

    return sumValues(impacts);    
}

function bioprospectingCalculator({
    area,
    bioprospecting
} : {
    area: number;
    bioprospecting: BioProspectingProps
}) {
    const amounts = calcMontante(bioprospecting.bioprospectingCostByUSD_conservative);
    const VPLBioprospecting = vpl(bioprospecting?.discountRate, amounts);
    return VPLBioprospecting * area;
}

function carbonCalculator({
    area,
    carbon
} : {
    area: number;
    carbon: CarbonProps
}) {
    const txDiscount = 0.03;
    const amounts = calcMontante(carbon.carbonCostPerHaUSD);
    const VPLCarbon = vpl(txDiscount, amounts);
    return VPLCarbon * area;
}

function culturedAndSpeciesCalculator({
    city,
    country,
    area,
    GDPperCapitaBrazilUSD,
    celciusTemperature,
    discountRate // usar a bioprospecting.discountRate
} : {
    city: string;
    country: countryCodes;
    area: number;
    GDPperCapitaBrazilUSD: number;
    celciusTemperature: number;
    discountRate: number;
}) {
    const cityData = getCityData(country, city);
    if(!cityData) throw new Error("Municipality data was not found.");

    const calc1 = 0.643 * Math.log(cityData.densidadePop2010);
    const calc2 = 1.655 * Math.log(GDPperCapitaBrazilUSD);
    const calc3 = 0.234 * celciusTemperature;
    const calc4 = 2.145 * Math.log(cityData.Especies_por_Municipio);
    const calc5 = calc1 + calc2 - calc3 + calc4;
    const calc6 = calc5 - 20.85;
    const speciesCostPerHaUSD = Math.exp(calc6);
    //const speciesCostPerHaBRL = speciesCostPerHaUSD * exchangeTax;

    const amounts = calcMontante(speciesCostPerHaUSD);
    const VPLHectareCulturedAndSpecies = vpl(
        discountRate,
        amounts
    );
    // console.log('densidadePop2010', cityData.densidadePop2010)
    // console.log('gdp', GDPperCapitaBrazilUSD)
    // console.log('celsius', celciusTemperature)
    // console.log('especies por mun', cityData.Especies_por_Municipio)    
    // console.log('speciesCostPerHaUSD', speciesCostPerHaUSD)
    // // console.log('amounts', amounts)
    // console.log('vpl', VPLHectareCulturedAndSpecies)

    return VPLHectareCulturedAndSpecies * area;
}

function recoveryOfTopsoilCalculator({
    city,
    country,
    area,
    recoverOfTopSoll,
    kmRotatedPerLiter,
    priceLiterDieselUSD,
    averageDriverSalaryFreightPerKmUSD
} : {
    city: string,
    country: countryCodes;
    area: number;
    recoverOfTopSoll: RecoverOfTopSollProps;
    kmRotatedPerLiter: number;
    priceLiterDieselUSD: number;
    averageDriverSalaryFreightPerKmUSD: number;
}) {
    const cityData = getCityData(country, city);
    if(!cityData) throw new Error("Municipality data was not found.");
    const distanciaGarimpoCentro = cityData.Distancia_Garimpo_Centro;
    
    const numberOfPathsSuperficialSeddlindRecovery =
        (area * recoverOfTopSoll.superficialSeedlingsPerHa) /
        recoverOfTopSoll.capacityLoadTruckNumberOfSeedlings <
        0.9999999999999
        ? 1
        : Math.ceil(
            (area * recoverOfTopSoll.superficialSeedlingsPerHa) /
                recoverOfTopSoll.capacityLoadTruckNumberOfSeedlings
            );
    const totalSurfaceFreightCostChances =
        distanciaGarimpoCentro * recoverOfTopSoll.transportCostChangesPerKm;
    const quantityOfLitersConsumedDieselSurfaceRecovery =
        distanciaGarimpoCentro / kmRotatedPerLiter;
    const fuelCostFreightSurfaceRecovery =
        priceLiterDieselUSD * quantityOfLitersConsumedDieselSurfaceRecovery;
    const costFreightWithDriverSurfaceRecovery =
        averageDriverSalaryFreightPerKmUSD * distanciaGarimpoCentro;
    const toSurfaceFreightCostOneWay =
        costFreightWithDriverSurfaceRecovery +
        fuelCostFreightSurfaceRecovery +
        totalSurfaceFreightCostChances;
    const toSurfaceFreightCostRoundTrip = toSurfaceFreightCostOneWay * 2;
    const toCostFreightFinalSurfaceRecovery =
        toSurfaceFreightCostRoundTrip * numberOfPathsSuperficialSeddlindRecovery;

    const surfaceSoilRecoveryWithoutFreight =
        recoverOfTopSoll.soilSurfaceRecPerHa_conservative * area
    const toSurfaceRecoveryCostWithFreight =
        toCostFreightFinalSurfaceRecovery + surfaceSoilRecoveryWithoutFreight
    return toSurfaceRecoveryCostWithFreight;
}

function recreationCalculator ({
    city,
    country,
    area,
    GDPperCapitaBrazilUSD,
    celciusTemperature
} : {
    city: string,
    country: countryCodes;
    area: number;
    GDPperCapitaBrazilUSD: number;
    celciusTemperature: number;
}) {
    const cityData = getCityData(country, city);
    if(!cityData) throw new Error("Municipality data was not found.");
    
    const discountRate = 0.03;
    const calculation1 = 0.562 * Math.log(cityData.densidadePop2010);
    const calculation2 = 0.566 * Math.log(GDPperCapitaBrazilUSD);
    const calculation3 = 0.0178 * celciusTemperature;
    const calculation4 = 1.133 * Math.log(cityData.Especies_por_Municipio);
    const calculation5 = calculation1 + calculation2 + calculation3 + calculation4;
    const calculation6 = calculation5 - 8.375;
    const recreationCostPerHaUSD = Math.exp(calculation6);
    //const recreationCostPerHaBRL = recreationCostPerHaUSD * exchangeTax;
    
    const amounts = calcMontante(recreationCostPerHaUSD);
    const VPLHaRecreation = vpl(discountRate, amounts);
    return VPLHaRecreation * area;;
}

function woodAndNonWoodProductsCalculator ({
    area,
    woodAndNonWoodProducts
} : {
    area: number;
    woodAndNonWoodProducts: WoodAndNonWoodProductsProps;
}) {
    const amounts = calcMontante(woodAndNonWoodProducts.costPMNMPerHaYearUSD);
    const VPLwoodAndNonWoodProducts = vpl(woodAndNonWoodProducts.discountRate, amounts)

    return VPLwoodAndNonWoodProducts * area
}
