export interface generalProps {
    speciesForZero: number
    GDPperCapitaBrazilUSD: number
    celciusTemperature: number
    kmRotatedPerLiter: number
    priceLiterDieselUSD: number
    averageDriverSalaryFreightPerKmUSD: number
    densityGold: number
    excavationGoldLoss: number
    hollowMediumDepth: number
    averageDepthOfFertileEarth: number
    quantitOfM3ExcavatorPerHour: number
    quantityOfGoldGramsPerYearWell: number
    HgAuRatio: number
    percentLossHgInWater_convervative: number
    percentLossHgInWater: number
    percentLossHgInWater_ferry__convervative: number
    percentLossHgInWater_ferry: number
    methyladPercent_conservative: number
    methyladPercent: number
    ruralIndividualWeight: number
    urbanindividualWeight: number
    levelMediumContaminationFish: number
    AverageFishConsumptionPerDayInRuralGrams: number
    consumptionMediumFishByDayInGramsUrban: number
    densityPopulationalRegionNorth2060: number
    aDALYUSD: number
    excavatorHoursDays: number
    excavatorCostPerKMUSD: number
    cavaAverageProductivity: number
    prodGoldMonthFerry: number
  }
  
  export interface CarbonProps {
    carbonCostPerHaUSD: number
  }
  
  export interface BioProspectingProps {
    bioprospectingCostByUSD_conservative: number
    bioprospectingCostByUSD: number
    discountRate: number
  }
  
  export interface RecoverOfTopSollProps {
    hectare: number
    soilSurfaceRecPerHa_conservative: number
    soilSurfaceRecPerHa: number
    capacityLoadTruckNumberOfSeedlings: number
    superficialSeedlingsPerHa: number
    transportCostChangesPerKm: number
  }
  
  export interface ErosionSiltingUpProps {
    siltingUpCostPerHaUSD: number
  }
  
  export interface DredgingAndRiverSediments {
    prodOuroKgporMes: number
    dredgingCostPerM3: number
    averageMotorPower: number
    productionSedimentTurnsFeatherTonnesPerMonth: number
    equivalentErosionTonPerHaPerYear: number
    erosionControlUSD: number
    productionSedimentTurnsFeatherTonnesPerMonthGold: number
    siltingPercentage: number
    theAmountOfSedimentPer1DredgeM3PerHour: number
    transportCost1DredgeUSD: number
  }
  
  export interface CavaGroundingCostAuNormProps {
    normalCavaGroundingCostUSD: number
  }
  
  export interface CavaGroundingCostAuFertile {
    groundingCostFertilePitUSD: number
  }
  
  export interface LossQIProps {
    birthRate: number
  }
  
  export interface NeuroSymptomsGarimpeiroProps {
    amountOfGoldminersYear: number
    neuroTreatmentCostPerGoldMinerUSD: number
  }
  
  export interface HeartAttack {
    proMenOver40ByPopTotal: number
    //accumulatedRiskMercuryInfarction: number
    annualInfarctTreatmentCostUSD: number
    propHomensAcima40AnosComInfartoporPopHomensAcima40anosRegiaoPais: number
    duracaoDaIncapacidadeInfarto: number
  }
  
  export interface SoilMercuryRemediationProps {
    lossPercentHgInSoil_conservative: number
    lossPercentHgInSoil: number
    HgContainedSoilinGrassPerTon: number
    DensidadeSolo: number
    DensidadeSedimento: number
    remediationCostUSDPerTonOfSoil: number
  }
  
  export interface HypertensionProps {
    propOfPeopleOver20YearsOfAgeByTotalPop: number
    AnnualHypertensionCostTreatamentUSD: number
    //accumulatedRiskMercuryHypertension: number
    propAcima20AnosComHipertensaoporPopAcima20anosRegiaoPais: number
    duracaoDaIncapacidadeHipertensao: number
  }
  
  export interface WoodAndNonWoodProductsProps {
    costPMNMPerHaYearUSD: number
    discountRate: number
  }
  
  export interface ProtecAreaMultiplier {
    value: number
  }
  
  
  export interface fixedValuesProps {
    general: generalProps | null
    carbon: CarbonProps | null
    bioprospecting: BioProspectingProps | null
    recoverOfTopSoll: RecoverOfTopSollProps | null
    erosionSiltingUp: ErosionSiltingUpProps | null
    dredgingAndRiverSediments: DredgingAndRiverSediments | null
    cavaGroundingCostAuNorm: CavaGroundingCostAuNormProps | null
    cavaGroundingCostAuFertile: CavaGroundingCostAuFertile | null
    lossQI: LossQIProps | null
    neuroSymptomsGarimpeiro: NeuroSymptomsGarimpeiroProps | null
    heartAttack: HeartAttack | null
    soilMercuryRemediation: SoilMercuryRemediationProps | null
    hypertension: HypertensionProps | null
    woodAndNonWoodProducts: WoodAndNonWoodProductsProps | null
    protectedAreaMultiplier: ProtecAreaMultiplier | null
  }
  