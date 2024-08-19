import { FormInputs } from '@/components/FormCalculator'
import { analysisUnitTypes, typeMiningTypes } from '@/enums'
import { useCallback } from 'react'
import useAppContext from './useAppContext'
import useFixedCalculator from './useFixedCalculator'

export interface DataCalculatoProps {
  dataCalculator: FormInputs
}

export default function useConvertAll() {
  const { general, dredgingAndRiverSediments, recoverOfTopSoll } =
    useFixedCalculator()

  const convertAllinGold = useCallback(
    ({ dataCalculator }: DataCalculatoProps) => {
      //console.log(quantityOfGoldGramsPerYearWell)
      let goldGrass

      const typeMining = Number(dataCalculator.typeMining)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)
      const analysisUnit = Number(dataCalculator.analysisUnit)
      const pitDepth = Number(dataCalculator.pitdepth)
      const motorPower = Number(dataCalculator.motorPower)

      const prodOuroKgporMes = dredgingAndRiverSediments
        ? dredgingAndRiverSediments.prodOuroKgporMes
        : 0
      const densityGold = general ? general.densityGold : 0
      const excavationGoldLoss = general ? general.excavationGoldLoss : 0
      const quantityOfGoldGramsPerYearWell = general
        ? general.quantityOfGoldGramsPerYearWell
        : 0
      const cavaAverageProductivity = general
        ? general.cavaAverageProductivity
        : 0

      if (
        typeMining === typeMiningTypes.PIT &&
        analysisUnit === analysisUnitTypes.YEARS_OF_MINING
      ) {
        //const quantityOfGoldGramsPerYearWell = 23700;

        goldGrass = quantityOfGoldGramsPerYearWell * qtdAnalysis
        //console.log('grama de ouro', goldGrass)
        return goldGrass
      } else if (
        typeMining === typeMiningTypes.ALLUVION &&
        analysisUnit === analysisUnitTypes.IMPACTED_AREA
      ) {
        const sterileOreRatio = 7
        //const densityGold = 2.76;
        //const excavationGoldLoss = 2;
        // const cavaAverageProductivity = 0.4;
        const affectedAreaM2 = qtdAnalysis * 10000
        const lossyVolume = pitDepth * affectedAreaM2
        const volumeWithoutLoss = lossyVolume / excavationGoldLoss
        const toSoilUpturned = densityGold * volumeWithoutLoss
        const calculationBaseTon = toSoilUpturned / (sterileOreRatio + 1)
        const revolvedMineralTon = calculationBaseTon * 1
        const goldGrass = cavaAverageProductivity * revolvedMineralTon
        //console.log('grama de ouro', goldGrass)
        return goldGrass
      } else if (
        typeMining === typeMiningTypes.FERRY &&
        analysisUnit === analysisUnitTypes.QTD_FERRY
      ) {
        //input por meses TROCAR POR QUANTIDADE DE BALSAS

        /*Padrão por número de balsas fixo a 1 ano de garimpo*/

        const tempoFixo1Ano = 12
        const prodOuroGrporMes = prodOuroKgporMes * 1000
        const goldGrass =
          motorPower * tempoFixo1Ano * prodOuroGrporMes * qtdAnalysis //valueLikemining = Quantidade de BALSAS
        //const goldGrass =  valueLikeMining * prodGoldMonthFerry;
        return goldGrass
      } else {
        const goldGrass = qtdAnalysis
        //console.log('grama de ouro', goldGrass)
        return goldGrass
      }
    },
    [general, dredgingAndRiverSediments]
  )

  const convertAllinHectare = useCallback(
    ({ dataCalculator }: DataCalculatoProps) => {
      const sterileMineralRelation = 7
      const overflow = 12

      const typeMining = Number(dataCalculator.typeMining)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)
      const analysisUnit = Number(dataCalculator.analysisUnit)
      const pitDepth = Number(dataCalculator.pitdepth)

      const hectare = recoverOfTopSoll ? recoverOfTopSoll.hectare : 0
      const excavationGoldLoss = general ? general.excavationGoldLoss : 0
      const densityGold = general ? general.densityGold : 0
      const cavaAverageProductivity = general
        ? general.cavaAverageProductivity
        : 0

      if (typeMining === typeMiningTypes.PIT) {
        const hectareOverflow = hectare * overflow
        //console.log('hectare', hectare)
        //console.log('hectareOverflow', hectareOverflow)
        return {
          hectare,
          value: hectareOverflow
        }
      } else if (analysisUnit === analysisUnitTypes.AMOUNT_GOLD) {
        const turnedSoilTon = qtdAnalysis / cavaAverageProductivity
        const turnedSterileTon = turnedSoilTon * sterileMineralRelation
        const toSoilUpTurned = turnedSoilTon + turnedSterileTon
        const volumeWithoutLoss = toSoilUpTurned / densityGold
        const lossyVolume = volumeWithoutLoss * excavationGoldLoss
        const affectedAreaM2 = lossyVolume / pitDepth
        const hectare = affectedAreaM2 / 10000
        const hectareOverflow = hectare * overflow
        //console.log('hectareOverflow', hectareOverflow)
        return {
          hectare,
          value: hectareOverflow
        }
      } else if (typeMining === typeMiningTypes.FERRY) {
        return {
          hectare,
          value: 0
        }
      } else {
        const hectare = qtdAnalysis
        const hectareOverflow = hectare * overflow
        //console.log('hectare', hectare)
        //console.log('hectareOverflow', hectareOverflow)
        return {
          hectare,
          value: hectareOverflow
        }
      }
    },
    [general, recoverOfTopSoll]
  )

  const cubicMeters = useCallback(
    ({ dataCalculator }: DataCalculatoProps) => {
      if (dataCalculator && general && dredgingAndRiverSediments) {
        const {
          densityGold,
          excavationGoldLoss,
          quantityOfGoldGramsPerYearWell
        } = general
        const {
          prodOuroKgporMes,
          productionSedimentTurnsFeatherTonnesPerMonthGold
        } = dredgingAndRiverSediments

        const sterileOreEnhancement = 7
        //const densityGold = 2.76;
        // const excavationGoldLoss = 2;
        const productivityGoldMiningTon = 0.4
        //const quantityOfGoldGramsPerYearWell = 23700;
        let volumeM3

        const typeMining = Number(dataCalculator.typeMining)
        const qtdAnalysis = Number(dataCalculator.qtdAnalysis)
        const analysisUnit = Number(dataCalculator.analysisUnit)
        const pitDepth = Number(dataCalculator.pitdepth)
        const motorPower = Number(dataCalculator.motorPower)

        const cavaAverageProductivity = general
          ? general.cavaAverageProductivity
          : 0

        if (
          typeMining === typeMiningTypes.PIT &&
          analysisUnit === analysisUnitTypes.YEARS_OF_MINING
        ) {
          const toGoldGramQuantityWell =
            quantityOfGoldGramsPerYearWell * qtdAnalysis
          const revolvedSoloTon =
            toGoldGramQuantityWell / productivityGoldMiningTon
          const upturnedSterileTon = revolvedSoloTon * sterileOreEnhancement
          const toUpturnedSoil = upturnedSterileTon + revolvedSoloTon
          const losslessVolume = toUpturnedSoil / densityGold
          volumeM3 = losslessVolume * excavationGoldLoss
          return `${Math.round(volumeM3)} m³`
        } else if (
          typeMining === typeMiningTypes.PIT &&
          analysisUnit === analysisUnitTypes.AMOUNT_GOLD
        ) {
          const revolvedSoloTon = qtdAnalysis / cavaAverageProductivity
          const upturnedSterileTon = revolvedSoloTon * sterileOreEnhancement
          const toUpturnedSoil = revolvedSoloTon + upturnedSterileTon
          const losslessVolume = toUpturnedSoil / densityGold
          volumeM3 = losslessVolume * excavationGoldLoss
          return `${Math.round(volumeM3 * 100) / 100} m³`
        } else if (
          typeMining === typeMiningTypes.ALLUVION &&
          analysisUnit === analysisUnitTypes.AMOUNT_GOLD
        ) {
          const revolvedSoloTon = qtdAnalysis / cavaAverageProductivity
          const upturnedSterileTon = revolvedSoloTon * sterileOreEnhancement
          const toUpturnedSoil = revolvedSoloTon + upturnedSterileTon
          const losslessVolume = toUpturnedSoil / densityGold
          volumeM3 = losslessVolume * excavationGoldLoss
          return `${Math.round(volumeM3 * 100) / 100} m³`
        } else if (
          typeMining === typeMiningTypes.ALLUVION &&
          analysisUnit === analysisUnitTypes.IMPACTED_AREA
        ) {
          const affectedAreaM2 = qtdAnalysis * 10000
          volumeM3 = pitDepth * affectedAreaM2
          return `${Math.round(volumeM3 * 100) / 100} m³`
        } else if (
          typeMining === typeMiningTypes.FERRY &&
          analysisUnit === analysisUnitTypes.AMOUNT_GOLD
        ) {
          //const productionSedimentTurnsFeatherTonnesPerMonthGold = 6.262;
          const prodSedimentoViraPlumaTon =
            productionSedimentTurnsFeatherTonnesPerMonthGold * qtdAnalysis
          return `${Math.round(prodSedimentoViraPlumaTon * 100) / 100} ton`
        } else if (
          typeMining === typeMiningTypes.FERRY &&
          analysisUnit === analysisUnitTypes.QTD_FERRY
        ) {
          /*Padrão por mês de garimpo*/

          // //const prodOuroKgporMes = 0.00604;
          // //const averageMotorPower = 54.4;
          // //const productionSedimentTurnsFeatherTonnesPerMonthGold = 6.262;
          // const prodOuroGrporMes = prodOuroKgporMes * 1000;
          // const prodOuroTotalBalsaDragagem = motorPower * valueLikeMining * prodOuroGrporMes;
          // const prodSedimentoViraPlumaTon = productionSedimentTurnsFeatherTonnesPerMonthGold * prodOuroTotalBalsaDragagem * valueLikeMining;

          /*Padrão por número de balsas fixo a 1 ano de garimpo*/

          //const prodOuroKgporMes = 0.00604;
          //const averageMotorPower = 54.4;
          //const productionSedimentTurnsFeatherTonnesPerMonthGold = 6.262;

          const tempoFixo1Ano = 12
          const ProducaoSedimentoViraPlumaTonporMes = 38.82
          const prodOuroGrporMes = prodOuroKgporMes * 1000
          const prodOuroTotalBalsaDragagem =
            motorPower * tempoFixo1Ano * prodOuroGrporMes
          const prodSedimentoViraPlumaTon =
            ProducaoSedimentoViraPlumaTonporMes *
            prodOuroTotalBalsaDragagem *
            qtdAnalysis

          return `${Math.round(prodSedimentoViraPlumaTon * 100) / 100} ton`
        }
      }
      return ''
    },
    [general, dredgingAndRiverSediments]
  )

  const goldToHecatere = useCallback(
    ({ dataCalculator }: DataCalculatoProps) => {
      const sterileMineralRelation = 7
      //const densityGold = 2.76;
      //const excavationGoldLoss = 2;
      //const cavaAverageProductivity = 0.4;
      const pitDepth = Number(dataCalculator.pitdepth)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)

      const cavaAverageProductivity = general
        ? general.cavaAverageProductivity
        : 0
      const densityGold = general ? general.densityGold : 0
      const excavationGoldLoss = general ? general.excavationGoldLoss : 0

      const turnedSoilTon = qtdAnalysis / cavaAverageProductivity
      const turnedSterileTon = turnedSoilTon * sterileMineralRelation
      const toSoilUpTurned = turnedSoilTon + turnedSterileTon
      const volumeWithoutLoss = toSoilUpTurned / densityGold
      const lossyVolume = volumeWithoutLoss * excavationGoldLoss
      const affectedAreaM2 = lossyVolume / pitDepth
      const hectare = affectedAreaM2 / 10000

      return Math.round(hectare * 100) / 100
    },
    [general]
  )

  const hectareToGold = useCallback(
    ({ dataCalculator }: DataCalculatoProps) => {
      const sterileOreRatio = 7
      //const densityGold = 2.76;
      //const excavationGoldLoss = 2;
      //const cavaAverageProductivity = 0.4;
      const pitDepth = Number(dataCalculator.pitdepth)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)

      const cavaAverageProductivity = general
        ? general.cavaAverageProductivity
        : 0
      const densityGold = general ? general.densityGold : 0
      const excavationGoldLoss = general ? general.excavationGoldLoss : 0

      const affectedAreaM2 = qtdAnalysis * 10000
      const lossyVolume = pitDepth * affectedAreaM2
      const volumeWithoutLoss = lossyVolume / excavationGoldLoss
      const toSoilUpturned = densityGold * volumeWithoutLoss
      const calculationBaseTon = toSoilUpturned / (sterileOreRatio + 1)
      const revolvedMineralTon = calculationBaseTon * 1
      const goldGrass = cavaAverageProductivity * revolvedMineralTon
      return goldGrass
    },
    [general]
  )

  const goldToHectarePorHe = useCallback((hectare: number, gold: number) => {
    const goldenGramForHectare = hectare / gold
    return goldenGramForHectare
  }, [])

  const proporcaoKgporHectare = useCallback(
    ({ dataCalculator }: DataCalculatoProps) => {
      const sterileMineralRelation = 7

      const typeMining = Number(dataCalculator.typeMining)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)
      const analysisUnit = Number(dataCalculator.analysisUnit)
      const pitDepth = Number(dataCalculator.pitdepth)

      const quantityOfGoldGramsPerYearWell = general
        ? general.quantityOfGoldGramsPerYearWell
        : 0
      const cavaAverageProductivity = general
        ? general.cavaAverageProductivity
        : 0
      const densityGold = general ? general.densityGold : 0
      const excavationGoldLoss = general ? general.excavationGoldLoss : 0
      const hectare = recoverOfTopSoll ? recoverOfTopSoll.hectare : 0

      if (
        typeMining === typeMiningTypes.PIT &&
        analysisUnit === analysisUnitTypes.YEARS_OF_MINING
      ) {
        const goldGrass = quantityOfGoldGramsPerYearWell * qtdAnalysis
        const turnedSoilTon = goldGrass / cavaAverageProductivity
        const turnedSterileTon = turnedSoilTon * sterileMineralRelation
        const toSoilUpTurned = turnedSoilTon + turnedSterileTon
        const volumeWithoutLoss = toSoilUpTurned / densityGold
        const lossyVolume = volumeWithoutLoss * excavationGoldLoss
        const affectedAreaM2 = lossyVolume / pitDepth
        const hectare = affectedAreaM2 / 10000
        const proporcaoKgporHectare = goldGrass / hectare
        //console.log('proporcaoKgporHectare', proporcaoKgporHectare)
        return proporcaoKgporHectare
      } else if (
        typeMining === typeMiningTypes.PIT &&
        analysisUnit === analysisUnitTypes.AMOUNT_GOLD
      ) {
        const proporcaoKgporHectare = qtdAnalysis / hectare
        return proporcaoKgporHectare
      } else if (analysisUnit === analysisUnitTypes.AMOUNT_GOLD) {
        const turnedSoilTon = qtdAnalysis / cavaAverageProductivity
        const turnedSterileTon = turnedSoilTon * sterileMineralRelation
        const toSoilUpTurned = turnedSoilTon + turnedSterileTon
        const volumeWithoutLoss = toSoilUpTurned / densityGold
        const lossyVolume = volumeWithoutLoss * excavationGoldLoss
        const affectedAreaM2 = lossyVolume / pitDepth
        const hectare = affectedAreaM2 / 10000
        const proporcaoKgporHectare = qtdAnalysis / hectare

        return proporcaoKgporHectare
      } else if (typeMining === typeMiningTypes.FERRY) {
        return 0
      } else {
        const hectare = qtdAnalysis
        const affectedAreaM2 = hectare * 10000
        const lossyVolume = pitDepth * affectedAreaM2
        const volumeWithoutLoss = lossyVolume / excavationGoldLoss
        const toSoilUpturned = densityGold * volumeWithoutLoss
        const calculationBaseTon = toSoilUpturned / (sterileMineralRelation + 1)
        const revolvedMineralTon = calculationBaseTon * 1
        const goldGrass = cavaAverageProductivity * revolvedMineralTon
        const proporcaoKgporHectare = goldGrass / hectare

        return proporcaoKgporHectare
      }
    },
    [general, recoverOfTopSoll]
  )

  return {
    convertAllinGold,
    convertAllinHectare,
    cubicMeters,
    goldToHecatere,
    hectareToGold,
    goldToHectarePorHe,
    proporcaoKgporHectare
  }
}
