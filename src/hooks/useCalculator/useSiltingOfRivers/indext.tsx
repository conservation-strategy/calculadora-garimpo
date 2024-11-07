import {
  analysisUnitTypes,
  knowRegionTypes,
  typeMiningTypes,
  valueHypothesisTypes
} from '@/enums'
import useCountry from '@/hooks/useCountry'
import calcMontante from '@/utils/calcMontante'
import vpl from '@/utils/vpl'
import { useCallback } from 'react'
import { DataCalculatorProps } from '..'
import useConvertAll, { DataCalculatoProps } from '../../useConvertAll'
import useFixedCalculator from '../../useFixedCalculator'

export default function useSiltingOfRivers() {
  const { getDistrictData } = useCountry()
  const {
    general,
    cavaGroundingCostAuNorm,
    cavaGroundingCostAuFertile,
    dredgingAndRiverSediments,
    erosionSiltingUp
  } = useFixedCalculator()
  const { hectareToGold, goldToHecatere, numberOfMachinesToGold, numberOfMachinesToHecare } = useConvertAll()

  const cavaGroundingCostAuFertileCalculator = useCallback(
    ({ dataCalculator }: DataCalculatoProps) => {
      const daysInTheYear = 365
      const sterileOreEnhancement = 7
      const pitProductivity = 0.4

      const typemining = Number(dataCalculator.typeMining)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)
      const analysisUnit = Number(dataCalculator.analysisUnit)
      const pitDepth = Number(dataCalculator.pitdepth)

      const gold =
        analysisUnit === analysisUnitTypes.IMPACTED_AREA
          ? hectareToGold({ dataCalculator })
          : analysisUnit === analysisUnitTypes.QTD_MACHINES
            ? numberOfMachinesToGold({ dataCalculator })
            : qtdAnalysis
      const currentDistrict = getDistrictData(Number(dataCalculator.district))

      const distanciaGarimpoCentro = currentDistrict.Distancia_Garimpo_Centro

      const distanceanningCenter =
        dataCalculator.knowRegion === knowRegionTypes.YES
          ? distanciaGarimpoCentro
          : 212.74

      const quantityOfGoldGramsPerYearWell = general
        ? general.quantityOfGoldGramsPerYearWell
        : 0
      const cavaAverageProductivity = general
        ? general.cavaAverageProductivity
        : 0
      const densityGold = general ? general.densityGold : 0
      const excavationGoldLoss = general ? general.excavationGoldLoss : 0
      const hollowMediumDepth = general ? general.hollowMediumDepth : 0
      const averageDepthOfFertileEarth = general
        ? general.averageDepthOfFertileEarth
        : 0
      const groundingCostFertilePitUSD = cavaGroundingCostAuFertile
        ? cavaGroundingCostAuFertile.groundingCostFertilePitUSD
        : 0
      const excavatorHoursDays = general ? general.excavatorHoursDays : 0
      const quantitOfM3ExcavatorPerHour = general
        ? general.quantitOfM3ExcavatorPerHour
        : 0
      const excavatorCostPerKMUSD = general ? general.excavatorCostPerKMUSD : 0
      const kmRotatedPerLiter = general ? general.kmRotatedPerLiter : 0
      const priceLiterDieselUSD = general ? general.priceLiterDieselUSD : 0
      const averageDriverSalaryFreightPerKmUSD = general
        ? general.averageDriverSalaryFreightPerKmUSD
        : 0

      if (typemining === typeMiningTypes.FERRY) {
        const toCostOfFertileGroundingWithFreight = 0
        return {
          lossyVolume: toCostOfFertileGroundingWithFreight,
          value: toCostOfFertileGroundingWithFreight
        }
      } else if (
        typemining === typeMiningTypes.PIT &&
        analysisUnit === analysisUnitTypes.YEARS_OF_MINING
      ) {
        const toGoldGramQuantityWell =
          quantityOfGoldGramsPerYearWell * qtdAnalysis
        const revolvedSoloTon = toGoldGramQuantityWell / cavaAverageProductivity

        const upturnedSterileTon = revolvedSoloTon * sterileOreEnhancement
        const toUpturnedSoil = upturnedSterileTon + revolvedSoloTon
        const losslessVolume = toUpturnedSoil / densityGold
        const lossyVolume = losslessVolume * excavationGoldLoss
        //console.log('volume com perda', lossyVolume)
        const affectedAreaM2 = lossyVolume / hollowMediumDepth
        const fertileLandVolume = averageDepthOfFertileEarth * affectedAreaM2
        const toCostGroundingFertileLandWithoutFreight =
          fertileLandVolume * groundingCostFertilePitUSD
        const excavatorQuantityM3PerYearFertileLand =
          daysInTheYear * excavatorHoursDays * quantitOfM3ExcavatorPerHour
        const excavatornsQuantityFertil =
          fertileLandVolume / excavatorQuantityM3PerYearFertileLand < 1
            ? 1
            : Math.ceil(
                fertileLandVolume / excavatorQuantityM3PerYearFertileLand
              ) //ok
        const transportCostTotalFreightFertileExcavator =
          distanceanningCenter * excavatorCostPerKMUSD
        const qtLitersDieselConsumedFertil =
          distanceanningCenter / kmRotatedPerLiter
        const fuelCostFertileFreight =
          priceLiterDieselUSD * qtLitersDieselConsumedFertil
        const freightCostWithFertilDriver =
          averageDriverSalaryFreightPerKmUSD * distanceanningCenter
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
      } else if (
        typemining === typeMiningTypes.PIT &&
        analysisUnit === analysisUnitTypes.AMOUNT_GOLD
      ) {
        const revolvedSoloTon = qtdAnalysis / pitProductivity
        const upturnedSterileTon = revolvedSoloTon * sterileOreEnhancement
        const toUpturnedSoil = revolvedSoloTon + upturnedSterileTon
        const losslessVolume = toUpturnedSoil / densityGold
        const lossyVolume = losslessVolume * excavationGoldLoss
        //console.log('volume com perda', lossyVolume)
        const affectedAreaM2 = lossyVolume / hollowMediumDepth

        const fertileLandVolume = averageDepthOfFertileEarth * affectedAreaM2
        const toCostGroundingFertileLandWithoutFreight =
          fertileLandVolume * groundingCostFertilePitUSD
        const excavatorQuantityM3PerYearFertileLand =
          daysInTheYear * excavatorHoursDays * quantitOfM3ExcavatorPerHour
        const excavatornsQuantityFertil =
          fertileLandVolume / excavatorQuantityM3PerYearFertileLand < 1
            ? 1
            : Math.ceil(
                fertileLandVolume / excavatorQuantityM3PerYearFertileLand
              ) //ok
        const transportCostTotalFreightFertileExcavator =
          distanceanningCenter * excavatorCostPerKMUSD
        const qtLitersDieselConsumedFertil =
          distanceanningCenter / kmRotatedPerLiter
        const fuelCostFertileFreight =
          priceLiterDieselUSD * qtLitersDieselConsumedFertil
        const freightCostWithFertilDriver =
          averageDriverSalaryFreightPerKmUSD * distanceanningCenter
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
      } else {
        const revolvedSoloTon = gold / pitProductivity
        const upturnedSterileTon = revolvedSoloTon * sterileOreEnhancement
        const toUpturnedSoil = revolvedSoloTon + upturnedSterileTon
        const losslessVolume = toUpturnedSoil / densityGold
        const lossyVolume = losslessVolume * excavationGoldLoss
        //console.log('volume com perda', lossyVolume)
        const affectedAreaM2 = lossyVolume / pitDepth

        const fertileLandVolume = averageDepthOfFertileEarth * affectedAreaM2
        const toCostGroundingFertileLandWithoutFreight =
          fertileLandVolume * groundingCostFertilePitUSD
        const excavatorQuantityM3PerYearFertileLand =
          daysInTheYear * excavatorHoursDays * quantitOfM3ExcavatorPerHour
        const excavatornsQuantityFertil =
          fertileLandVolume / excavatorQuantityM3PerYearFertileLand < 1
            ? 1
            : Math.ceil(
                fertileLandVolume / excavatorQuantityM3PerYearFertileLand
              ) //ok
        const transportCostTotalFreightFertileExcavator =
          distanceanningCenter * excavatorCostPerKMUSD
        const qtLitersDieselConsumedFertil =
          distanceanningCenter / kmRotatedPerLiter
        const fuelCostFertileFreight =
          priceLiterDieselUSD * qtLitersDieselConsumedFertil
        const freightCostWithFertilDriver =
          averageDriverSalaryFreightPerKmUSD * distanceanningCenter
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
    },
    [hectareToGold, getDistrictData, general, cavaGroundingCostAuFertile]
  )

  const cavaGroundingCostAuNormCalculator = useCallback(
    ({ dataCalculator }: DataCalculatoProps) => {
      const typemining = Number(dataCalculator.typeMining)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)
      const analysisUnit = Number(dataCalculator.analysisUnit)
      const pitDepth = Number(dataCalculator.pitdepth)

      const valueHeCtare =
        analysisUnit === analysisUnitTypes.AMOUNT_GOLD
          ? goldToHecatere({ dataCalculator })
          : analysisUnit === analysisUnitTypes.QTD_MACHINES
            ? numberOfMachinesToHecare({ dataCalculator })
            : qtdAnalysis

      const currentDistrict = getDistrictData(Number(dataCalculator.district))

      // const urbanPopMunicipality = dataCalculator.knowRegion === knowRegionTypes.YES ? currentDistrict.PopUrbMunicipio : 0.7353;
      // const ruralPopMunicipality = dataCalculator.knowRegion === knowRegionTypes.YES ? currentDistrict.PopRuralMunicipio : 0.2647;
      const distanceanningCenter =
        dataCalculator.knowRegion === knowRegionTypes.YES
          ? currentDistrict.Distancia_Garimpo_Centro
          : 212.74

      const normalCavaGroundingCostUSD = cavaGroundingCostAuNorm
        ? cavaGroundingCostAuNorm.normalCavaGroundingCostUSD
        : 0
      const quantityOfGoldGramsPerYearWell = general
        ? general.quantityOfGoldGramsPerYearWell
        : 0
      const densityGold = general ? general.densityGold : 0
      const excavationGoldLoss = general ? general.excavationGoldLoss : 0
      const hollowMediumDepth = general ? general.hollowMediumDepth : 0
      const averageDepthOfFertileEarth = general
        ? general.averageDepthOfFertileEarth
        : 0
      const excavatorHoursDays = general ? general.excavatorHoursDays : 0
      const quantitOfM3ExcavatorPerHour = general
        ? general.quantitOfM3ExcavatorPerHour
        : 0
      const excavatorCostPerKMUSD = general ? general.excavatorCostPerKMUSD : 0
      const kmRotatedPerLiter = general ? general.kmRotatedPerLiter : 0
      const priceLiterDieselUSD = general ? general.priceLiterDieselUSD : 0
      const averageDriverSalaryFreightPerKmUSD = general
        ? general.averageDriverSalaryFreightPerKmUSD
        : 0

      const daysInTheYear = 365
      const sterileOre = 7

      if (typemining === typeMiningTypes.ALLUVION) {
        // Input por Ouro/Hectare
        const normalGroundDepth = pitDepth - averageDepthOfFertileEarth
        const affectedAreaM2 = valueHeCtare * 10000
        const normalGroundVolume = normalGroundDepth * affectedAreaM2

        const toCostNormalGroundingWithoutShipping =
          normalGroundVolume * normalCavaGroundingCostUSD
        const excavatorQuantityM3PerYear =
          daysInTheYear * excavatorHoursDays * quantitOfM3ExcavatorPerHour
        const normalExcavatorsQuantity =
          normalGroundVolume / excavatorQuantityM3PerYear < 1
            ? 1
            : Math.ceil(normalGroundVolume / excavatorQuantityM3PerYear)
        const transportCostTotalFreightNormalExcavator =
          distanceanningCenter * excavatorCostPerKMUSD
        const AmountOfLitersDieselConsumed =
          distanceanningCenter / kmRotatedPerLiter
        const freightCostWithNormalDriver =
          averageDriverSalaryFreightPerKmUSD * distanceanningCenter
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
      } else if (
        typemining === typeMiningTypes.PIT &&
        analysisUnit == analysisUnitTypes.AMOUNT_GOLD
      ) {
        // Input por Ouro
        const normalGroundDepth = hollowMediumDepth - averageDepthOfFertileEarth
        const revolvedSoloTon = qtdAnalysis / hollowMediumDepth
        const revolvedSterileTon = revolvedSoloTon * sterileOre
        const totalSoloRevolved = revolvedSoloTon + revolvedSterileTon
        const losslessVolume = totalSoloRevolved / densityGold
        const lossyVolume = losslessVolume * excavationGoldLoss
        const affectedAreaM2 = lossyVolume / hollowMediumDepth
        const normalGroundVolume = normalGroundDepth * affectedAreaM2
        const toCostNormalGroundingWithoutShipping =
          normalGroundVolume * normalCavaGroundingCostUSD
        const excavatorQuantityM3PerYear =
          daysInTheYear * excavatorHoursDays * quantitOfM3ExcavatorPerHour
        const normalExcavatorsQuantity =
          normalGroundVolume / excavatorQuantityM3PerYear < 1
            ? 1
            : Math.ceil(normalGroundVolume / excavatorQuantityM3PerYear)
        const transportCostTotalFreightNormalExcavator =
          distanceanningCenter * excavatorCostPerKMUSD
        const AmountOfLitersDieselConsumed =
          distanceanningCenter / kmRotatedPerLiter
        const freightCostWithNormalDriver =
          averageDriverSalaryFreightPerKmUSD * distanceanningCenter
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
      } else if (
        typemining === typeMiningTypes.PIT &&
        analysisUnit == analysisUnitTypes.YEARS_OF_MINING
      ) {
        //Input Anos de Garimpo

        const quantityOfGramsGoldTotalWell =
          quantityOfGoldGramsPerYearWell * qtdAnalysis
        const revolvedSoloTon = quantityOfGramsGoldTotalWell / 0.4
        const revolvedSterileTon = revolvedSoloTon * sterileOre
        const totalSoloRevolved = revolvedSterileTon + revolvedSoloTon
        const losslessVolume = totalSoloRevolved / densityGold
        const lossyVolume = losslessVolume * excavationGoldLoss
        const affectedAreaM2 = lossyVolume / hollowMediumDepth
        const normalGroundDepth = hollowMediumDepth - averageDepthOfFertileEarth
        const normalGroundVolume = normalGroundDepth * affectedAreaM2
        const toCostNormalGroundingWithoutShipping =
          normalCavaGroundingCostUSD * normalGroundDepth * affectedAreaM2
        const excavatorQuantityM3PerYear =
          daysInTheYear * excavatorHoursDays * quantitOfM3ExcavatorPerHour
        const normalExcavatorsQuantity =
          normalGroundVolume / excavatorQuantityM3PerYear < 1
            ? 1
            : Math.ceil(normalGroundVolume / excavatorQuantityM3PerYear)
        const transportCostTotalFreightNormalExcavator =
          distanceanningCenter * excavatorCostPerKMUSD
        const AmountOfLitersDieselConsumed =
          distanceanningCenter / kmRotatedPerLiter
        const freightCostWithNormalDriver =
          averageDriverSalaryFreightPerKmUSD * distanceanningCenter
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
      } else if (typemining === typeMiningTypes.FERRY) {
        //input por Ouro/Hectare e meses de garimpo
        const toCostNormalGroundingWithFreight = 0
        return toCostNormalGroundingWithFreight
      } else {
        return 0
      }
    },
    [goldToHecatere, getDistrictData, cavaGroundingCostAuNorm, general]
  )

  const dredgingAndRiverSedimentsCalculator = useCallback(
    ({ dataCalculator }: DataCalculatoProps) => {
      const typemining = Number(dataCalculator.typeMining)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)
      const analysisUnit = Number(dataCalculator.analysisUnit)
      const pitDepth = Number(dataCalculator.pitdepth)
      const motorPower = Number(dataCalculator.motorPower)

      const valueHeCtare =
        analysisUnit === analysisUnitTypes.AMOUNT_GOLD
          ? goldToHecatere({ dataCalculator })
          : qtdAnalysis

      const currentDistrict = getDistrictData(Number(dataCalculator.district))

      const distanciaGarimpoCentro = currentDistrict.Distancia_Garimpo_Centro

      const distanceanningCenter =
        dataCalculator.knowRegion === knowRegionTypes.YES
          ? distanciaGarimpoCentro
          : 212.74

      const hoursWorkedByDredgePerDay = 24
      const daysInTheYear = 365
      const relationshipWithSterileOre = 7

      const productionSedimentTurnsFeatherTonnesPerMonthGold =
        dredgingAndRiverSediments
          ? dredgingAndRiverSediments.productionSedimentTurnsFeatherTonnesPerMonthGold
          : 0
      const equivalentErosionTonPerHaPerYear = dredgingAndRiverSediments
        ? dredgingAndRiverSediments.equivalentErosionTonPerHaPerYear
        : 0
      const erosionControlUSD = dredgingAndRiverSediments
        ? dredgingAndRiverSediments.erosionControlUSD
        : 0
      const averageMotorPower = dredgingAndRiverSediments
        ? dredgingAndRiverSediments.averageMotorPower
        : 0
      const productionSedimentTurnsFeatherTonnesPerMonth =
        dredgingAndRiverSediments
          ? dredgingAndRiverSediments.productionSedimentTurnsFeatherTonnesPerMonth
          : 0
      const cavaAverageProductivity = general
        ? general.cavaAverageProductivity
        : 0
      const quantityOfGoldGramsPerYearWell = general
        ? general.quantityOfGoldGramsPerYearWell
        : 0
      const densityGold = general ? general.densityGold : 0
      const excavationGoldLoss = general ? general.excavationGoldLoss : 0
      const kmRotatedPerLiter = general ? general.kmRotatedPerLiter : 0
      const priceLiterDieselUSD = general ? general.priceLiterDieselUSD : 0
      const averageDriverSalaryFreightPerKmUSD = general
        ? general.averageDriverSalaryFreightPerKmUSD
        : 0
      const siltingPercentage = dredgingAndRiverSediments
        ? dredgingAndRiverSediments.siltingPercentage
        : 0
      const dredgingCostPerM3 = dredgingAndRiverSediments
        ? dredgingAndRiverSediments.dredgingCostPerM3
        : 0
      const theAmountOfSedimentPer1DredgeM3PerHour = dredgingAndRiverSediments
        ? dredgingAndRiverSediments.theAmountOfSedimentPer1DredgeM3PerHour
        : 0
      const transportCost1DredgeUSD = dredgingAndRiverSediments
        ? dredgingAndRiverSediments.transportCost1DredgeUSD
        : 0

      if (
        typemining === typeMiningTypes.FERRY &&
        analysisUnit === analysisUnitTypes.AMOUNT_GOLD
      ) {
        //input ouro
        const productionSedimentturnsTonFeather =
          productionSedimentTurnsFeatherTonnesPerMonthGold * qtdAnalysis
        const equivalenceHaImpacted =
          productionSedimentturnsTonFeather / equivalentErosionTonPerHaPerYear
        const ferryDredgingDamageValue =
          equivalenceHaImpacted * erosionControlUSD

        return ferryDredgingDamageValue
      } else if (
        typemining === typeMiningTypes.FERRY &&
        analysisUnit === analysisUnitTypes.QTD_FERRY
      ) {
        //input meses de garimpo TROCAR POR QUANTIDADE DE BALSAS
        //const productionGoldBalsa = averageMotorPower * valueLikeMining * prodOuroKgporMes
        /*Padrão por mês de garimpo*/
        // const productionSedimentturnsTonFeather = averageMotorPower * productionSedimentTurnsFeatherTonnesPerMonth * valueLikeMining;
        // const equivalenceHaImpacted = productionSedimentturnsTonFeather / equivalentErosionTonPerHaPerYear;
        // const ferryDredgingDamageValue = equivalenceHaImpacted * erosionControlUSD;

        /*Padrão por número de balsas fixo a 1 ano de garimpo*/
        const tempoFixo1Ano = 12
        const productionSedimentturnsTonFeather =
          motorPower *
          productionSedimentTurnsFeatherTonnesPerMonth *
          tempoFixo1Ano
        const equivalenceHaImpacted =
          productionSedimentturnsTonFeather / equivalentErosionTonPerHaPerYear
        const ferryDredgingDamageValue =
          equivalenceHaImpacted * erosionControlUSD * qtdAnalysis // valuelikemining = QUANTIA DE BALSAS

        //console.log('ferryDredgingDamageValue', ferryDredgingDamageValue)

        return ferryDredgingDamageValue
      } else if (
        typemining === typeMiningTypes.PIT &&
        analysisUnit === analysisUnitTypes.AMOUNT_GOLD
      ) {
        //input ouro
        const upturnedGroundTon = qtdAnalysis / cavaAverageProductivity
        const revolvedSterileTon =
          upturnedGroundTon * relationshipWithSterileOre
        const toSoloRevolved = upturnedGroundTon + revolvedSterileTon
        const losslesVolume = toSoloRevolved / densityGold
        const volumeWithLoss = losslesVolume * excavationGoldLoss
        const volumeLandSiltingRiver = volumeWithLoss * siltingPercentage
        const dredgingCostWithoutFreight =
          dredgingCostPerM3 * volumeLandSiltingRiver
        const amountOfSedimentPer1M3DredgePerYear =
          daysInTheYear *
          hoursWorkedByDredgePerDay *
          theAmountOfSedimentPer1DredgeM3PerHour
        const dredgerQuantity1Year =
          volumeLandSiltingRiver / amountOfSedimentPer1M3DredgePerYear < 1
            ? 1
            : Math.round(
                volumeLandSiltingRiver / amountOfSedimentPer1M3DredgePerYear
              )
        const shippingCostDredgeBRL =
          distanceanningCenter * transportCost1DredgeUSD
        const quantityOfLitersConsumedDiesel =
          distanceanningCenter / kmRotatedPerLiter
        const fuelCostFreightDredging =
          priceLiterDieselUSD * quantityOfLitersConsumedDiesel
        const shippingCostWithDredgingDriver =
          averageDriverSalaryFreightPerKmUSD * distanceanningCenter
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
      } else if (
        typemining === typeMiningTypes.PIT &&
        analysisUnit === analysisUnitTypes.YEARS_OF_MINING
      ) {
        //anos de garimpo no poço
        const quantityOfGramsGoldTotalWell =
          quantityOfGoldGramsPerYearWell * qtdAnalysis
        const upturnedGroundTon =
          quantityOfGramsGoldTotalWell / cavaAverageProductivity
        const revolvedSterileTon =
          upturnedGroundTon * relationshipWithSterileOre
        const toSoloRevolved = revolvedSterileTon + upturnedGroundTon
        const losslesVolume = toSoloRevolved / densityGold
        const volumeWithLoss = losslesVolume * excavationGoldLoss
        const volumeLandSiltingRiver = siltingPercentage * volumeWithLoss
        const dredgingCostWithoutFreight =
          dredgingCostPerM3 * volumeLandSiltingRiver
        const amountOfSedimentPer1M3DredgePerYear =
          daysInTheYear *
          hoursWorkedByDredgePerDay *
          theAmountOfSedimentPer1DredgeM3PerHour
        const dredgerQuantity1Year =
          volumeLandSiltingRiver / amountOfSedimentPer1M3DredgePerYear < 1
            ? 1
            : Math.round(
                volumeLandSiltingRiver / amountOfSedimentPer1M3DredgePerYear
              )
        const shippingCostDredgeBRL =
          distanceanningCenter * transportCost1DredgeUSD
        const quantityOfLitersConsumedDiesel =
          distanceanningCenter / kmRotatedPerLiter
        const fuelCostFreightDredging =
          priceLiterDieselUSD * quantityOfLitersConsumedDiesel
        const shippingCostWithDredgingDriver =
          averageDriverSalaryFreightPerKmUSD * distanceanningCenter
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
      } else if (typemining === typeMiningTypes.ALLUVION) {
        // input ouro/hectare
        const affectedAreaM2 = valueHeCtare * 10000
        const volumeWithLoss = pitDepth * affectedAreaM2
        const volumeLandSiltingRiver = siltingPercentage * volumeWithLoss
        const dredgingCostWithoutFreight =
          dredgingCostPerM3 * volumeLandSiltingRiver
        const amountOfSedimentPer1M3DredgePerYear =
          daysInTheYear *
          hoursWorkedByDredgePerDay *
          theAmountOfSedimentPer1DredgeM3PerHour
        const dredgerQuantity1Year =
          volumeLandSiltingRiver / amountOfSedimentPer1M3DredgePerYear < 1
            ? 1
            : Math.round(
                volumeLandSiltingRiver / amountOfSedimentPer1M3DredgePerYear
              )
        const shippingCostDredgeBRL =
          distanceanningCenter * transportCost1DredgeUSD
        const quantityOfLitersConsumedDiesel =
          distanceanningCenter / kmRotatedPerLiter
        const fuelCostFreightDredging =
          priceLiterDieselUSD * quantityOfLitersConsumedDiesel
        const shippingCostWithDredgingDriver =
          averageDriverSalaryFreightPerKmUSD * distanceanningCenter
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
      } else {
        return 0
      }
    },
    [goldToHecatere, getDistrictData, dredgingAndRiverSediments, general]
  )

  const erosionSiltingUpCalculator = useCallback(
    ({ dataCalculator }: DataCalculatoProps) => {
      const txPrevalence = Number(dataCalculator.valueHypothesis)
      const typemining = Number(dataCalculator.typeMining)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)
      const analysisUnit = Number(dataCalculator.analysisUnit)

      const siltingUpCostPerHaUSD = erosionSiltingUp
        ? erosionSiltingUp.siltingUpCostPerHaUSD
        : 0
      const GDPperCapitaBrazilUSD = general ? general.GDPperCapitaBrazilUSD : 0

      const valueHeCtare =
        analysisUnit === analysisUnitTypes.AMOUNT_GOLD
          ? goldToHecatere({ dataCalculator })
          : qtdAnalysis

      if (txPrevalence === valueHypothesisTypes.CONSERVATIVE) {
        const discountRate = 0.03

        const amounts = calcMontante(siltingUpCostPerHaUSD)
        const VPLhectareSilting = vpl(discountRate, amounts)

        if (typemining === typeMiningTypes.FERRY) {
          return 0
        } else if (typemining === typeMiningTypes.PIT) {
          return VPLhectareSilting * 0.31 * 12
        } else if (
          typemining === typeMiningTypes.ALLUVION &&
          analysisUnit === analysisUnitTypes.AMOUNT_GOLD
        ) {
          return VPLhectareSilting * valueHeCtare * 12
        } else if (
          typemining === typeMiningTypes.ALLUVION &&
          analysisUnit === analysisUnitTypes.IMPACTED_AREA
        ) {
          return VPLhectareSilting * valueHeCtare
        } else {
          return 0
        }
      } else {
        const discountRate = 0.03
        const calc1 = Math.log(GDPperCapitaBrazilUSD)
        const calc2 = Math.pow(calc1, 2)
        const calc3 = 13.32 * calc1
        const calc4 = 0.623 * calc2
        const calc5 = calc3 - 65.64 - calc4
        const siltingUpCostPerHaUSD = Math.exp(calc5)
        //const siltingUpCostPerHaUSD = siltingUpCostPerHaUSD * txCambio;

        const amounts = calcMontante(siltingUpCostPerHaUSD)
        const VPLhectareSilting = vpl(discountRate, amounts)

        if (typemining === typeMiningTypes.FERRY) {
          return 0
        } else if (typemining === typeMiningTypes.PIT) {
          return VPLhectareSilting * 0.31 * 12
        } else if (
          typemining === typeMiningTypes.ALLUVION &&
          analysisUnit === analysisUnitTypes.AMOUNT_GOLD
        ) {
          return VPLhectareSilting * valueHeCtare * 12
        } else if (
          typemining === typeMiningTypes.ALLUVION &&
          analysisUnit === analysisUnitTypes.IMPACTED_AREA
        ) {
          return VPLhectareSilting * valueHeCtare
        } else {
          return 0
        }
      }
    },
    [erosionSiltingUp, general, goldToHecatere]
  )

  return {
    cavaGroundingCostAuNormCalculator,
    cavaGroundingCostAuFertileCalculator,
    dredgingAndRiverSedimentsCalculator,
    erosionSiltingUpCalculator
  }
}
