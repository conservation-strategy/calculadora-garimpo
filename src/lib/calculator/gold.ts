interface HectareToGoldArgs {
    pitDepth: number;
    area: number;
    cavaAverageProductivity: number;
    excavationGoldLoss: number;
}

export const densityGold = 2.76;
export const sterileOreRatio = 7;

export function hectareToGold ({
    pitDepth,
    area,
    cavaAverageProductivity,
    excavationGoldLoss
} : HectareToGoldArgs) {    
    const affectedAreaM2 = area * 10000;
    const lossyVolume = pitDepth * affectedAreaM2;
    const volumeWithoutLoss = lossyVolume / excavationGoldLoss;
    const toSoilUpturned = densityGold * volumeWithoutLoss;
    const calculationBaseTon = toSoilUpturned / (sterileOreRatio + 1);
    const revolvedMineralTon = calculationBaseTon * 1;
    return cavaAverageProductivity * revolvedMineralTon;
}