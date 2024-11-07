import {
  analysisUnitTypes,
  knowRegionTypes,
  typeMiningTypes,
  valueHypothesisTypes
} from '@/enums'
import useCountry from '@/hooks/useCountry'
import calcMontante from '@/utils/calcMontante'
import normDist from '@/utils/normDist'
import vpl from '@/utils/vpl'
import { useCallback } from 'react'
import { DataCalculatorProps } from '..'
import useConvertAll, { DataCalculatoProps } from '../../useConvertAll'
import useFixedCalculator from '../../useFixedCalculator'

export default function useMercury() {
  const { getDistrictData } = useCountry()
  const {
    general,
    neuroSymptomsGarimpeiro,
    lossQI,
    hypertension,
    heartAttack,
    soilMercuryRemediation
  } = useFixedCalculator()
  const { hectareToGold, convertAllinGold, numberOfMachinesToGold } = useConvertAll()

  const neuroSymptomsGarimpeiroCalculator = useCallback(
    ({ dataCalculator }: DataCalculatoProps) => {
      const txPrevalence = Number(dataCalculator.valueHypothesis)
      const typemining = Number(dataCalculator.typeMining)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)
      const analysisUnit = Number(dataCalculator.analysisUnit)

      //Variáveis de chamada Globais
      const qtdGramasDeOuroEmUmAno = general
        ? general.quantityOfGoldGramsPerYearWell
        : 0
      const qtdDeOuroEmAnoPorGarimpeiro = neuroSymptomsGarimpeiro
        ? neuroSymptomsGarimpeiro.amountOfGoldminersYear
        : 0
      const custoTratamentoNeuroGarimpeiroEmUSD = neuroSymptomsGarimpeiro
        ? neuroSymptomsGarimpeiro.neuroTreatmentCostPerGoldMinerUSD
        : 0
      const prodOuroBalsaMes = general ? general.prodGoldMonthFerry : 0
      const custoDalyUSD = general ? general.aDALYUSD : 0
      const gramasOuro = convertAllinGold({ dataCalculator })

      const gold =
        analysisUnit === analysisUnitTypes.IMPACTED_AREA
          ? hectareToGold({ dataCalculator })
          : analysisUnit === analysisUnitTypes.QTD_MACHINES
            ? numberOfMachinesToGold({ dataCalculator })
            : qtdAnalysis

      const weightNeuroDisabilityGoldminers = 0.368

      if (
        typemining === typeMiningTypes.PIT &&
        analysisUnit === analysisUnitTypes.YEARS_OF_MINING
      ) {
        //Input Anos de garimpo
        const goldenGrass = qtdGramasDeOuroEmUmAno * qtdAnalysis
        const qtdTotalGoldMiners = goldenGrass / qtdDeOuroEmAnoPorGarimpeiro
        const qtdOfMinersAffected = txPrevalence * qtdTotalGoldMiners
        //console.log('Quantidade de garimpeiros afetados', qtdOfMinersAffected)
        const neuroGoldMinersTreatmentCost =
          custoTratamentoNeuroGarimpeiroEmUSD * qtdOfMinersAffected

        const weightNeuroDisabilityGoldminersQtdGoldDiggers =
          weightNeuroDisabilityGoldminers * qtdTotalGoldMiners
        const dalyYearsProspectors =
          txPrevalence * weightNeuroDisabilityGoldminersQtdGoldDiggers
        const toCostDALYGoldDigger = custoDalyUSD * dalyYearsProspectors
        const toGoldMinersCost =
          toCostDALYGoldDigger + neuroGoldMinersTreatmentCost
        return {
          qtdOfMinersAffected,
          value: toGoldMinersCost
        }
      } else if (
        typemining === typeMiningTypes.FERRY &&
        analysisUnit === analysisUnitTypes.QTD_FERRY
      ) {
        //Input Meses de garimpo TROCAR POR QUANTIDADE DE BALSAS

        /*Padrão por mês de garimpo*/

        // const goldenGrass = prodGoldMonthFerry * valueLikeMining;
        // const tonumberOfGoldMiners = goldenGrass / amountOfGoldminersYear;
        // const qtdOfMinersAffected = txPrevalence * tonumberOfGoldMiners;
        // //console.log('Quantidade de garimpeiros afetados', qtdOfMinersAffected)
        // const neuroGoldMinersTreatmentCost = neuroTreatmentCostPerGoldMinerUSD * qtdOfMinersAffected;

        // const weightNeuroDisabilityGoldminers_QtdGarimpeiros = weightNeuroDisabilityGoldminers  * tonumberOfGoldMiners;
        // const DALYyearsGoldMiner = txPrevalence * weightNeuroDisabilityGoldminers_QtdGarimpeiros;
        // const toCostDALYGoldMiners =  aDALYUSD  * DALYyearsGoldMiner;
        // const toCostGoldMiners = toCostDALYGoldMiners  + neuroGoldMinersTreatmentCost;
        // console.log('toCostGoldMiners', toCostGoldMiners)

        /*Padrão por número de balsas fixo a 1 ano de garimpo*/

        //const tempoFixo1Ano = 12
        //const goldenGrass = prodOuroBalsaMes * tempoFixo1Ano;

        const tonumberOfGoldMiners = gramasOuro / qtdDeOuroEmAnoPorGarimpeiro
        const qtdOfMinersAffected = txPrevalence * tonumberOfGoldMiners
        //console.log('Quantidade de garimpeiros afetados', qtdOfMinersAffected)
        const neuroGoldMinersTreatmentCost =
          custoTratamentoNeuroGarimpeiroEmUSD * qtdOfMinersAffected

        const weightNeuroDisabilityGoldminers_QtdGarimpeiros =
          weightNeuroDisabilityGoldminers * tonumberOfGoldMiners
        const DALYyearsGoldMiner =
          txPrevalence * weightNeuroDisabilityGoldminers_QtdGarimpeiros
        const toCostDALYGoldMiners = custoDalyUSD * DALYyearsGoldMiner
        const somaCostDALYeNeuroGoldMiners =
          toCostDALYGoldMiners + neuroGoldMinersTreatmentCost
        const toCostGoldMiners = somaCostDALYeNeuroGoldMiners // qtdAnalysis = QUANTIA DE BALSAS
        //console.log('toCostGoldMiners', toCostGoldMiners)

        return {
          qtdOfMinersAffected,
          value: toCostGoldMiners
        }
      } else {
        const qtdTotalGoldMiners = gold / qtdDeOuroEmAnoPorGarimpeiro
        const qtdOfMinersAffected = qtdTotalGoldMiners * txPrevalence
        //console.log('Quantidade de garimpeiros afetados', qtdOfMinersAffected)
        const neuroGoldMinersTreatmentCost =
          qtdOfMinersAffected * custoTratamentoNeuroGarimpeiroEmUSD

        const weightNeuroDisabilityGoldminersQtdGoldDiggers =
          weightNeuroDisabilityGoldminers * qtdTotalGoldMiners
        const dalyYearsProspectors =
          txPrevalence * weightNeuroDisabilityGoldminersQtdGoldDiggers
        const toCostDALYGoldDigger = dalyYearsProspectors * custoDalyUSD
        const toGoldMinersCost =
          toCostDALYGoldDigger + neuroGoldMinersTreatmentCost
        return {
          qtdOfMinersAffected,
          value: toGoldMinersCost
        }
      }
    },
    [general, neuroSymptomsGarimpeiro, convertAllinGold, hectareToGold]
  )

  const lossQICalculator = useCallback(
    ({ dataCalculator }: DataCalculatoProps) => {
      const txPrevalence = Number(dataCalculator.valueHypothesis)
      const typemining = Number(dataCalculator.typeMining)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)
      const analysisUnit = Number(dataCalculator.analysisUnit)

      const gold =
        analysisUnit === analysisUnitTypes.IMPACTED_AREA
          ? hectareToGold({ dataCalculator })
          : analysisUnit === analysisUnitTypes.QTD_MACHINES
            ? numberOfMachinesToGold({ dataCalculator })
            : qtdAnalysis
      const currentDistrict = getDistrictData(Number(dataCalculator.district))
      const { PopUrbMunicipio, PopRuralMunicipio, densidadePop2060 } =
        currentDistrict

      const methyladPercent_conservative = general
        ? general.methyladPercent_conservative
        : 0
      const methyladPercent = general ? general.methyladPercent : 0
      const percentLossHgInWater_convervative = general
        ? general.percentLossHgInWater_convervative
        : 0
      const percentLossHgInWater = general ? general.percentLossHgInWater : 0
      const quantityOfGoldGramsPerYearWell = general
        ? general.quantityOfGoldGramsPerYearWell
        : 0
      const HgAuRatio = general ? general.HgAuRatio : 0
      const percentLossHgInWater_ferry__convervative = general
        ? general.percentLossHgInWater_ferry__convervative
        : 0
      const percentLossHgInWater_ferry = general
        ? general.percentLossHgInWater_ferry
        : 0
      const prodGoldMonthFerry = general ? general.prodGoldMonthFerry : 0
      const isRegion = dataCalculator.knowRegion === knowRegionTypes.YES
      const ruralIndividualWeight = general ? general.ruralIndividualWeight : 0
      const urbanindividualWeight = general ? general.urbanindividualWeight : 0
      const consumptionMediumFishByDayInGramsUrban = general
        ? general.consumptionMediumFishByDayInGramsUrban
        : 0
      const levelMediumContaminationFish = general
        ? general.levelMediumContaminationFish
        : 0
      const AverageFishConsumptionPerDayInRuralGrams = general
        ? general.AverageFishConsumptionPerDayInRuralGrams
        : 0
      const densityPopulationalRegionNorth2060 = general
        ? general.densityPopulationalRegionNorth2060
        : 0
      const birthRate = lossQI ? lossQI.birthRate : 0
      const aDALYUSD = general ? general.aDALYUSD : 0
      const gramasOuro = convertAllinGold({ dataCalculator })

      const methyladPercentValue =
        txPrevalence === valueHypothesisTypes.CONSERVATIVE
          ? methyladPercent_conservative
          : methyladPercent
      let gramsHgReleasedinWater

      if (
        typemining === typeMiningTypes.PIT &&
        analysisUnit === analysisUnitTypes.YEARS_OF_MINING
      ) {
        //input anos de garimpo
        const percentLossHgInWaterValue =
          txPrevalence === valueHypothesisTypes.CONSERVATIVE
            ? percentLossHgInWater_convervative
            : percentLossHgInWater
        const amountOfTotalGoldWellValue =
          quantityOfGoldGramsPerYearWell * qtdAnalysis
        gramsHgReleasedinWater =
          percentLossHgInWaterValue * HgAuRatio * amountOfTotalGoldWellValue
      } else if (
        typemining === typeMiningTypes.PIT &&
        analysisUnit === analysisUnitTypes.AMOUNT_GOLD
      ) {
        //input gramas de ouro
        const percentLossHgInWaterValue =
          txPrevalence === valueHypothesisTypes.CONSERVATIVE
            ? percentLossHgInWater_convervative
            : percentLossHgInWater
        gramsHgReleasedinWater =
          percentLossHgInWaterValue * HgAuRatio * qtdAnalysis
      } else if (
        typemining === typeMiningTypes.FERRY &&
        analysisUnit === analysisUnitTypes.QTD_FERRY
      ) {
        //input Meses de garimpo TROCAR POR QUANTIDADE DE BALSAS

        //Padrão por mês de garimpo

        // const percentLossHgInWaterValue = txPrevalence === CONSERVATIVE ? percentLossHgInWater_ferry__convervative : percentLossHgInWater_ferry;
        // const toFerryGoldProductivy = valueLikeMining * prodGoldMonthFerry;
        // gramsHgReleasedinWater = percentLossHgInWaterValue * HgAuRatio * toFerryGoldProductivy;
        // console.log('gramsHgReleasedinWater', gramsHgReleasedinWater)

        //Padrão por número de balsas fixo a 1 ano de garimpo

        //const tempoFixo1Ano = 12
        const percentLossHgInWaterValue =
          txPrevalence === valueHypothesisTypes.CONSERVATIVE
            ? percentLossHgInWater_ferry__convervative
            : percentLossHgInWater_ferry
        //const toFerryGoldProductivy = tempoFixo1Ano * prodGoldMonthFerry;
        const somaLossHgHgAuRatioFerryGoldProd =
          percentLossHgInWaterValue * HgAuRatio * gramasOuro
        gramsHgReleasedinWater = somaLossHgHgAuRatioFerryGoldProd // valuelikemining = QUANTIA DE BALSAS
        //console.log('gramasOuro', gramasOuro)
      } else if (
        typemining === typeMiningTypes.FERRY &&
        analysisUnit === analysisUnitTypes.AMOUNT_GOLD
      ) {
        //input gramas de ouro
        const percentLossHgInWaterValue =
          txPrevalence === valueHypothesisTypes.CONSERVATIVE
            ? percentLossHgInWater_ferry__convervative
            : percentLossHgInWater_ferry
        gramsHgReleasedinWater =
          percentLossHgInWaterValue * HgAuRatio * qtdAnalysis
      } else if (typemining === typeMiningTypes.ALLUVION) {
        //input gramas de ouro/hectare
        const percentLossHgInWaterValue =
          txPrevalence === valueHypothesisTypes.CONSERVATIVE
            ? percentLossHgInWater_convervative
            : percentLossHgInWater
        gramsHgReleasedinWater = percentLossHgInWaterValue * HgAuRatio * gold
      }

      const qtdMercurioPerdidoNaAgua = gramsHgReleasedinWater
        ? gramsHgReleasedinWater
        : 0
      const toMethylatedWater = methyladPercentValue * qtdMercurioPerdidoNaAgua

      const years = 50
      //const birthRate = 18.8;
      //const ruralIndividualWeight = 59.1;
      //const urbanindividualWeight = 70;
      //const levelMediumContaminationFish = 0.5;
      //const AverageFishConsumptionPerDayInRuralGrams = 144.5;
      //const consumptionMediumFishByDayInGramsUrban = 57;
      //const densityPopulationalRegionNorth2060 = 6.00696;

      const individualAverageWeight =
        PopRuralMunicipio * ruralIndividualWeight +
        PopUrbMunicipio * urbanindividualWeight
      const ingestionMediaDailyMicrogramMercuryUrban =
        (consumptionMediumFishByDayInGramsUrban *
          levelMediumContaminationFish) /
        urbanindividualWeight
      const ingestionMediaDailyMicrogramMercuryRural =
        (AverageFishConsumptionPerDayInRuralGrams *
          levelMediumContaminationFish) /
        ruralIndividualWeight
      const ingestionMediaMercuryDaily1IndividualInMicrogramsPerKG =
        PopRuralMunicipio * ingestionMediaDailyMicrogramMercuryRural +
        PopUrbMunicipio * ingestionMediaDailyMicrogramMercuryUrban
      const ingestionMediaMercuryDaily1IndividualInGramsPerKGperDay =
        ingestionMediaMercuryDaily1IndividualInMicrogramsPerKG / 1000000
      const ingestionMediaDailyIndividualInGramsPerDaily =
        ingestionMediaMercuryDaily1IndividualInGramsPerKGperDay *
        individualAverageWeight
      const ingestionMediaMercuryIn50years =
        365 * years * ingestionMediaDailyIndividualInGramsPerDaily

      const concentrationMediaMercuryHair =
        ingestionMediaMercuryDaily1IndividualInMicrogramsPerKG / 0.1
      //console.log('concentração médio de mercurio no cabelo', concentrationMediaMercuryHair)
      const deflectionPatternAverageMercury = concentrationMediaMercuryHair / 2
      const rAoQuadrado = Math.pow(100, 2)
      const popSize100kmRadius = isRegion
        ? densidadePop2060 * (Math.PI * rAoQuadrado)
        : densityPopulationalRegionNorth2060 * (Math.PI * rAoQuadrado)

      const affectedPeople = toMethylatedWater / ingestionMediaMercuryIn50years

      const toPopulationAffectedMercuryHair =
        affectedPeople < popSize100kmRadius
          ? affectedPeople
          : popSize100kmRadius

      const affectedLiveBirths = toPopulationAffectedMercuryHair * birthRate
      const liveBornPop = affectedLiveBirths / 1000

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
    },
    [hectareToGold, getDistrictData, general, lossQI, convertAllinGold]
  )

  const hypertensionCalculator = useCallback(
    ({ dataCalculator }: DataCalculatorProps) => {
      const txPrevalence = Number(dataCalculator.valueHypothesis)
      const typemining = Number(dataCalculator.typeMining)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)
      const analysisUnit = Number(dataCalculator.analysisUnit)

      const gold =
        analysisUnit === analysisUnitTypes.IMPACTED_AREA
          ? hectareToGold({ dataCalculator })
          : analysisUnit === analysisUnitTypes.QTD_MACHINES
            ? numberOfMachinesToGold({ dataCalculator })
            : qtdAnalysis

      const currentDistrict = getDistrictData(Number(dataCalculator.district))
      const { PopUrbMunicipio, PopRuralMunicipio, densidadePop2060 } =
        currentDistrict

      const methyladPercent_conservative = general
        ? general.methyladPercent_conservative
        : 0
      const methyladPercent = general ? general.methyladPercent : 0
      const percentLossHgInWater_convervative = general
        ? general.percentLossHgInWater_convervative
        : 0
      const percentLossHgInWater = general ? general.percentLossHgInWater : 0
      const quantityOfGoldGramsPerYearWell = general
        ? general.quantityOfGoldGramsPerYearWell
        : 0
      const HgAuRatio = general ? general.HgAuRatio : 0
      const percentLossHgInWater_ferry__convervative = general
        ? general.percentLossHgInWater_ferry__convervative
        : 0
      const percentLossHgInWater_ferry = general
        ? general.percentLossHgInWater_ferry
        : 0
      const prodGoldMonthFerry = general ? general.prodGoldMonthFerry : 0
      const isRegion = dataCalculator.knowRegion === knowRegionTypes.YES
      const ruralIndividualWeight = general ? general.ruralIndividualWeight : 0
      const urbanindividualWeight = general ? general.urbanindividualWeight : 0
      const consumptionMediumFishByDayInGramsUrban = general
        ? general.consumptionMediumFishByDayInGramsUrban
        : 0
      const levelMediumContaminationFish = general
        ? general.levelMediumContaminationFish
        : 0
      const AverageFishConsumptionPerDayInRuralGrams = general
        ? general.AverageFishConsumptionPerDayInRuralGrams
        : 0
      const densityPopulationalRegionNorth2060 = general
        ? general.densityPopulationalRegionNorth2060
        : 0
      const aDALYUSD = general ? general.aDALYUSD : 0
      const propOfPeopleOver20YearsOfAgeByTotalPop = hypertension
        ? hypertension.propOfPeopleOver20YearsOfAgeByTotalPop
        : 0
      const AnnualHypertensionCostTreatamentUSD = hypertension
        ? hypertension.AnnualHypertensionCostTreatamentUSD
        : 0
      const propAcima20AnosComHipertensaoporPopAcima20anosRegiaoPais =
        hypertension
          ? hypertension.propAcima20AnosComHipertensaoporPopAcima20anosRegiaoPais
          : 0
      const duracaoDaIncapacidadeHipertensao = hypertension
        ? hypertension.duracaoDaIncapacidadeHipertensao
        : 0
      const gramasOuro = convertAllinGold({ dataCalculator })

      let gramsHgReleasedInWater
      if (
        typemining === typeMiningTypes.PIT &&
        analysisUnit === analysisUnitTypes.YEARS_OF_MINING
      ) {
        //Input Anos de Garimpo
        const lossPercentHgInWater =
          txPrevalence === valueHypothesisTypes.CONSERVATIVE
            ? percentLossHgInWater_convervative
            : percentLossHgInWater
        //const quantityOfGoldGramsPerYearWell = 23700;
        const amountOfTotalGoldWell =
          quantityOfGoldGramsPerYearWell * qtdAnalysis
        gramsHgReleasedInWater =
          lossPercentHgInWater * HgAuRatio * amountOfTotalGoldWell
      } else if (
        typemining === typeMiningTypes.PIT &&
        analysisUnit === analysisUnitTypes.AMOUNT_GOLD
      ) {
        //input Ouro
        const lossPercentHgInWater =
          txPrevalence === valueHypothesisTypes.CONSERVATIVE
            ? percentLossHgInWater_convervative
            : percentLossHgInWater
        gramsHgReleasedInWater = lossPercentHgInWater * HgAuRatio * qtdAnalysis
      } else if (
        typemining === typeMiningTypes.FERRY &&
        analysisUnit === analysisUnitTypes.QTD_FERRY
      ) {
        //input Meses de garimpo TROCAR POR QUANTIDADE DE BALSAS

        /*Padrão por mês de garimpo*/

        // const lossPercentHgInWater = txPrevalence === CONSERVATIVE ? percentLossHgInWater_ferry__convervative : percentLossHgInWater_ferry;
        // const toFerryGoldProductivity = valueLikeMining * prodGoldMonthFerry;
        // gramsHgReleasedInWater = lossPercentHgInWater * HgAuRatio * toFerryGoldProductivity;

        /*Padrão por número de balsas fixo a 1 ano de garimpo*/

        //const tempoFixo1Ano = 12
        const lossPercentHgInWater =
          txPrevalence === valueHypothesisTypes.CONSERVATIVE
            ? percentLossHgInWater_ferry__convervative
            : percentLossHgInWater_ferry
        //const toFerryGoldProductivity = tempoFixo1Ano * prodGoldMonthFerry;
        const somaLossHgHgAuRatioFerryGoldProd =
          lossPercentHgInWater * HgAuRatio * gramasOuro
        gramsHgReleasedInWater = somaLossHgHgAuRatioFerryGoldProd // valuelikemining = QUANTIA DE BALSAS
        //console.log('gramasOuro', gramasOuro)

        //console.log('gramsHgReleasedInWater', gramsHgReleasedInWater)
      } else if (
        typemining === typeMiningTypes.FERRY &&
        analysisUnit === analysisUnitTypes.AMOUNT_GOLD
      ) {
        //input Ouro
        const lossPercentHgInWater =
          txPrevalence === valueHypothesisTypes.CONSERVATIVE
            ? percentLossHgInWater_ferry__convervative
            : percentLossHgInWater_ferry
        gramsHgReleasedInWater = lossPercentHgInWater * HgAuRatio * qtdAnalysis
      } else if (typemining === typeMiningTypes.ALLUVION) {
        //input Ouro/Hectare
        const lossPercentHgInWater =
          txPrevalence === valueHypothesisTypes.CONSERVATIVE
            ? percentLossHgInWater_convervative
            : percentLossHgInWater
        gramsHgReleasedInWater = lossPercentHgInWater * HgAuRatio * gold
      }

      const methyladPercentValue =
        txPrevalence === valueHypothesisTypes.CONSERVATIVE
          ? methyladPercent_conservative
          : methyladPercent
      const qtdMercurioPerdidoNaAgua = gramsHgReleasedInWater
        ? gramsHgReleasedInWater
        : 0
      const toMethylatedWater = methyladPercentValue * qtdMercurioPerdidoNaAgua

      const years = 50

      const durationOfDisabilityHypertension = 52
      const weightOgDisabilityHypertension = 0.246
      const agwt = 1
      const discountRate = 0.03
      const bplusr = -0.07
      const yearBeginningOfDisabilityHypertension = 20
      const constant = 0.1658

      const individualAverageWeight =
        PopRuralMunicipio * ruralIndividualWeight +
        PopUrbMunicipio * urbanindividualWeight
      const daysIn50years = 365 * years

      const ingestionMediaDailyMicrogramMercuryUrban =
        (consumptionMediumFishByDayInGramsUrban *
          levelMediumContaminationFish) /
        urbanindividualWeight
      const ingestionMediaDailyMicrogramMercuryRural =
        (AverageFishConsumptionPerDayInRuralGrams *
          levelMediumContaminationFish) /
        ruralIndividualWeight
      const ingestionMediaMercuryDaily1IndividualInMicrogramsPerKG =
        PopRuralMunicipio * ingestionMediaDailyMicrogramMercuryRural +
        PopUrbMunicipio * ingestionMediaDailyMicrogramMercuryUrban
      const ingestionMediaMercuryDaily1IndividualInGramsPerKG =
        ingestionMediaMercuryDaily1IndividualInMicrogramsPerKG / 1000000
      const ingestionMediaDailyIndividualInGramsPerDaily =
        ingestionMediaMercuryDaily1IndividualInGramsPerKG *
        individualAverageWeight
      const ingestionMediaMercuryEmyears =
        daysIn50years * ingestionMediaDailyIndividualInGramsPerDaily
      const concentrationMediaMercuryHair =
        ingestionMediaMercuryDaily1IndividualInMicrogramsPerKG / 0.1
      const deflectionPatternAverageMercury = concentrationMediaMercuryHair / 2

      const rAoQuadrado = Math.pow(100, 2)
      const popSize100kmRadius = isRegion
        ? densidadePop2060 * (Math.PI * rAoQuadrado)
        : densityPopulationalRegionNorth2060 * (Math.PI * rAoQuadrado)
      const affectedPeople = toMethylatedWater / ingestionMediaMercuryEmyears
      const toPopulationAffectedMercuryHair =
        affectedPeople < popSize100kmRadius
          ? affectedPeople
          : popSize100kmRadius
      const popPeopleAbove20YearsOldinTheRegion =
        toPopulationAffectedMercuryHair * propOfPeopleOver20YearsOfAgeByTotalPop

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
        propAcima20AnosComHipertensaoporPopAcima20anosRegiaoPais

      const hypertensionSurvivalProbability = 1 - annualHypertensionRisk
      const productHypertension = Math.pow(
        hypertensionSurvivalProbability,
        duracaoDaIncapacidadeHipertensao
      )
      const riscoAcumuladoHipertensaoMercurio = 1 - productHypertension

      const peopleAbove20YearsoldInTheRegionIn52Years =
        riscoAcumuladoHipertensaoMercurio * popPeopleAbove20YearsOldinTheRegion

      const hypertensionAttributableFraction =
        (peopleAbove20YearsoldInTheRegionIn52Years * 1000) /
        toPopulationAffectedMercuryHair
      const hypertensionIncidence =
        (hypertensionAttributableFraction * toPopulationAffectedMercuryHair) /
        1000

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
        hypertensionIncidence * weightOgDisabilityHypertension
      const calculation1 =
        (constant *
          Math.exp(discountRate * yearBeginningOfDisabilityHypertension)) /
        Math.pow(bplusr, 2)
      const calculation2 =
        bplusr *
        (durationOfDisabilityHypertension +
          yearBeginningOfDisabilityHypertension)
      const calculation3 =
        bplusr *
          (durationOfDisabilityHypertension +
            yearBeginningOfDisabilityHypertension) -
        1
      const calculation4 =
        Math.exp(bplusr * yearBeginningOfDisabilityHypertension) *
        (bplusr * yearBeginningOfDisabilityHypertension - 1)
      const calculation5 = (1 - agwt) / discountRate
      const calculation6 =
        1 - Math.exp(-discountRate * durationOfDisabilityHypertension)

      const dalyHypertension =
        calculation0 *
        (agwt *
          calculation1 *
          (Math.exp(calculation2) * calculation3 - calculation4) +
          calculation5 * calculation6)
      const DALY1HypertensionCost = dalyHypertension * aDALYUSD

      //const AnnualHypertensionCostTreatamentUSD = 292;
      const incidenceHypertensionTreatament =
        (hypertensionIncidence * toPopulationAffectedMercuryHair) / 1000
      const toCostHypertensionTreatamentInYears =
        incidenceHypertensionTreatament *
        durationOfDisabilityHypertension *
        AnnualHypertensionCostTreatamentUSD
      const toDALYCostAndHypertensionTreatment =
        toCostHypertensionTreatamentInYears + DALY1HypertensionCost

      //console.log('toDALYCostAndHypertensionTreatment', toDALYCostAndHypertensionTreatment)

      return {
        peopleAbove20YearsoldInTheRegionIn52Years,
        value: toDALYCostAndHypertensionTreatment
      }
    },
    [hectareToGold, getDistrictData, general, hypertension, convertAllinGold]
  )

  const heartAttackCalculator = useCallback(
    ({ dataCalculator }: DataCalculatoProps) => {
      const txPrevalence = Number(dataCalculator.valueHypothesis)
      const typemining = Number(dataCalculator.typeMining)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)
      const analysisUnit = Number(dataCalculator.analysisUnit)

      const gold =
        analysisUnit === analysisUnitTypes.IMPACTED_AREA
          ? hectareToGold({ dataCalculator })
          : analysisUnit === analysisUnitTypes.QTD_MACHINES
            ? numberOfMachinesToGold({ dataCalculator })
            : qtdAnalysis

      const currentDistrict = getDistrictData(Number(dataCalculator.district))
      const { PopUrbMunicipio, PopRuralMunicipio, densidadePop2060 } =
        currentDistrict

      const methyladPercent_conservative = general
        ? general.methyladPercent_conservative
        : 0
      const methyladPercent = general ? general.methyladPercent : 0
      const percentLossHgInWater_convervative = general
        ? general.percentLossHgInWater_convervative
        : 0
      const percentLossHgInWater = general ? general.percentLossHgInWater : 0
      const quantityOfGoldGramsPerYearWell = general
        ? general.quantityOfGoldGramsPerYearWell
        : 0
      const HgAuRatio = general ? general.HgAuRatio : 0
      const percentLossHgInWater_ferry__convervative = general
        ? general.percentLossHgInWater_ferry__convervative
        : 0
      const percentLossHgInWater_ferry = general
        ? general.percentLossHgInWater_ferry
        : 0
      const prodGoldMonthFerry = general ? general.prodGoldMonthFerry : 0
      const isRegion = dataCalculator.knowRegion === knowRegionTypes.YES
      const ruralIndividualWeight = general ? general.ruralIndividualWeight : 0
      const urbanindividualWeight = general ? general.urbanindividualWeight : 0
      const consumptionMediumFishByDayInGramsUrban = general
        ? general.consumptionMediumFishByDayInGramsUrban
        : 0
      const levelMediumContaminationFish = general
        ? general.levelMediumContaminationFish
        : 0
      const AverageFishConsumptionPerDayInRuralGrams = general
        ? general.AverageFishConsumptionPerDayInRuralGrams
        : 0
      const densityPopulationalRegionNorth2060 = general
        ? general.densityPopulationalRegionNorth2060
        : 0
      const aDALYUSD = general ? general.aDALYUSD : 0
      const proMenOver40ByPopTotal = heartAttack
        ? heartAttack.proMenOver40ByPopTotal
        : 0
      const annualInfarctTreatmentCostUSD = heartAttack
        ? heartAttack.annualInfarctTreatmentCostUSD
        : 0
      const propHomensAcima40AnosComInfartoporPopHomensAcima40anosRegiaoPais =
        heartAttack
          ? heartAttack.propHomensAcima40AnosComInfartoporPopHomensAcima40anosRegiaoPais
          : 0
      const duracaoDaIncapacidadeInfarto = heartAttack
        ? heartAttack.duracaoDaIncapacidadeInfarto
        : 0
      const gramasOuro = convertAllinGold({ dataCalculator })

      let HgGrassReleasedInWater
      if (
        typemining === typeMiningTypes.PIT &&
        analysisUnit === analysisUnitTypes.YEARS_OF_MINING
      ) {
        //Input Anos de Garimpo
        const lossPercentHgInWater =
          txPrevalence === valueHypothesisTypes.CONSERVATIVE
            ? percentLossHgInWater_convervative
            : percentLossHgInWater
        //const quantityOfGoldGramsPerYearWell = 23700;
        const amountOfTotalGoldWell =
          quantityOfGoldGramsPerYearWell * qtdAnalysis
        HgGrassReleasedInWater =
          lossPercentHgInWater * HgAuRatio * amountOfTotalGoldWell
      } else if (
        typemining === typeMiningTypes.PIT &&
        analysisUnit === analysisUnitTypes.AMOUNT_GOLD
      ) {
        //input Ouro
        const lossPercentHgInWater =
          txPrevalence === valueHypothesisTypes.CONSERVATIVE
            ? percentLossHgInWater_convervative
            : percentLossHgInWater
        HgGrassReleasedInWater = lossPercentHgInWater * HgAuRatio * qtdAnalysis
      } else if (
        typemining === typeMiningTypes.FERRY &&
        analysisUnit === analysisUnitTypes.QTD_FERRY
      ) {
        //input Meses de garimpo

        /*Padrão por mês de garimpo*/

        // const lossPercentHgInWater = txPrevalence === CONSERVATIVE ? percentLossHgInWater_ferry__convervative : percentLossHgInWater_ferry;
        // const toGoldFerryProduction = valueLikeMining * prodGoldMonthFerry;
        // HgGrassReleasedInWater = lossPercentHgInWater * HgAuRatio * toGoldFerryProduction;

        /*Padrão por número de balsas fixo a 1 ano de garimpo*/

        //const tempoFixo1Ano = 12
        const lossPercentHgInWater =
          txPrevalence === valueHypothesisTypes.CONSERVATIVE
            ? percentLossHgInWater_ferry__convervative
            : percentLossHgInWater_ferry
        //const toFerryGoldProductivity = tempoFixo1Ano * prodGoldMonthFerry;
        const somaLossHgHgAuRatioFerryGoldProd =
          lossPercentHgInWater * HgAuRatio * gramasOuro
        HgGrassReleasedInWater = somaLossHgHgAuRatioFerryGoldProd // valuelikemining = QUANTIA DE BALSAS

        //console.log('HgGrassReleasedInWater', HgGrassReleasedInWater)
      } else if (
        typemining === typeMiningTypes.FERRY &&
        analysisUnit === analysisUnitTypes.AMOUNT_GOLD
      ) {
        //input Ouro
        const lossPercentHgInWater =
          txPrevalence === valueHypothesisTypes.CONSERVATIVE
            ? percentLossHgInWater_ferry__convervative
            : percentLossHgInWater_ferry
        HgGrassReleasedInWater = lossPercentHgInWater * HgAuRatio * qtdAnalysis
      } else if (typemining === typeMiningTypes.ALLUVION) {
        //input Ouro/Hectare
        const lossPercentHgInWater =
          txPrevalence === valueHypothesisTypes.CONSERVATIVE
            ? percentLossHgInWater_convervative
            : percentLossHgInWater
        HgGrassReleasedInWater = lossPercentHgInWater * HgAuRatio * gold
      }

      const methyladPercentValue =
        txPrevalence === valueHypothesisTypes.CONSERVATIVE
          ? methyladPercent_conservative
          : methyladPercent
      const qtdMercurioPerdidoNaAgua = HgGrassReleasedInWater
        ? HgGrassReleasedInWater
        : 0
      const toMethylatedWater = methyladPercentValue * qtdMercurioPerdidoNaAgua
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
        PopRuralMunicipio * ruralIndividualWeight +
        PopUrbMunicipio * urbanindividualWeight
      const daysIn50years = 365 * years

      const ingestionMediaDailyMicrogramMercuryUrban =
        (consumptionMediumFishByDayInGramsUrban *
          levelMediumContaminationFish) /
        urbanindividualWeight
      const ingestionMediaDailyMicrogramMercuryRural =
        (AverageFishConsumptionPerDayInRuralGrams *
          levelMediumContaminationFish) /
        ruralIndividualWeight
      const ingestionMediaMercuryDaily1IndividualInMicrogramsPerKG =
        PopRuralMunicipio * ingestionMediaDailyMicrogramMercuryRural +
        PopUrbMunicipio * ingestionMediaDailyMicrogramMercuryUrban
      const ingestionMediaMercuryDaily1IndividualInGramsPerKGDay =
        ingestionMediaMercuryDaily1IndividualInMicrogramsPerKG / 1000000
      const ingestionMediaDaily1IndividualInGrams =
        ingestionMediaMercuryDaily1IndividualInGramsPerKGDay *
        individualAverageWeight
      const ingestionMediaMercuryEmyears =
        daysIn50years * ingestionMediaDaily1IndividualInGrams
      const concentrationMediaMercuryHair =
        ingestionMediaMercuryDaily1IndividualInMicrogramsPerKG / 0.1
      const deflectionPatternAverageMercury = concentrationMediaMercuryHair / 2

      //const rAoQuadrado = Math.pow(100, 2)
      //const popSize100kmRadius = isRegion ? (popDensity2060 * (Math.PI * rAoQuadrado)) : (densityPopulationalRegionNorth2060 * (Math.PI * rAoQuadrado));
      const popSize100kmRadius = isRegion
        ? densidadePop2060 * Math.pow(Math.PI * 100, 2)
        : densityPopulationalRegionNorth2060 * Math.pow(Math.PI * 100, 2)

      const affectedPeople = toMethylatedWater / ingestionMediaMercuryEmyears
      const toPopulationAffectedMercuryHair =
        affectedPeople < popSize100kmRadius
          ? affectedPeople
          : popSize100kmRadius
      //console.log('População afetada com mercurio no cabelo', toPopulationAffectedMercuryHair)
      const popMenOver40inTheRegion =
        toPopulationAffectedMercuryHair * proMenOver40ByPopTotal

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
        ((1 - disnorm4 - (1 - disnorm6)) * (1.69 - 1)) / 1.69
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

      const annualHeartAttackRisk =
        attributableFraction *
        propHomensAcima40AnosComInfartoporPopHomensAcima40anosRegiaoPais
      const heartAttackSurvivalProbability = 1 - annualHeartAttackRisk
      const productHeartAttack = Math.pow(
        heartAttackSurvivalProbability,
        duracaoDaIncapacidadeInfarto
      )
      const riscoAcumuladoInfartoMercurio = 1 - productHeartAttack

      const menOver40InTheRegionIn27Years =
        riscoAcumuladoInfartoMercurio * popMenOver40inTheRegion
      //console.log("riscoAcumuladoInfartoMercurio", riscoAcumuladoInfartoMercurio,"popMenOver40inTheRegion", popMenOver40inTheRegion)
      //console.log('Homens acima de 40anos', menOver40InTheRegionIn27Years)

      const infarctionAttributableFraction =
        (menOver40InTheRegionIn27Years * 1000) / toPopulationAffectedMercuryHair
      const infarctionIncidence =
        (infarctionAttributableFraction * toPopulationAffectedMercuryHair) /
        1000

      const calculation0 = infarctionIncidence * weightOfDisabilityDisease
      const calculation1 =
        (constant * Math.exp(discountRate * yearStartOfDisabilityInfarction)) /
        Math.pow(bplusr, 2)
      const calculation2 =
        bplusr *
        (durationDisabilityInfarction + yearStartOfDisabilityInfarction)
      const calculation3 =
        bplusr *
          (durationDisabilityInfarction + yearStartOfDisabilityInfarction) -
        1
      const calculation4 =
        Math.exp(bplusr * yearStartOfDisabilityInfarction) *
        (bplusr * yearStartOfDisabilityInfarction - 1)
      const calculation5 = (1 - agwt) / discountRate
      const calculation6 =
        1 - Math.exp(-discountRate * durationDisabilityInfarction)

      const dalyInfarInfarto =
        calculation0 *
        (agwt *
          calculation1 *
          (Math.exp(calculation2) * calculation3 - calculation4) +
          calculation5 * calculation6)
      const DALYInfarction = dalyInfarInfarto * aDALYUSD

      //const annualInfarctTreatmentCostUSD = 2300;
      const infarctionIncidenceTreatment =
        (infarctionAttributableFraction * toPopulationAffectedMercuryHair) /
        1000
      const toCostOfInfarctionTreatmentYears =
        infarctionIncidenceTreatment *
        durationDisabilityInfarction *
        annualInfarctTreatmentCostUSD
      const toDALYCostAndInfarctionTreatment =
        toCostOfInfarctionTreatmentYears + DALYInfarction

      //console.log('toDALYCostAndInfarctionTreatment', toDALYCostAndInfarctionTreatment)

      return {
        toMethylatedWater,
        toPopulationAffectedMercuryHair,
        menOver40InTheRegionIn27Years,
        value: toDALYCostAndInfarctionTreatment
      }
    },
    [hectareToGold, getDistrictData, general, heartAttack, convertAllinGold]
  )

  const soilMercuryRemediationCalculator = useCallback(
    ({ dataCalculator }: DataCalculatoProps) => {
      const txPrevalence = Number(dataCalculator.valueHypothesis)
      const typemining = Number(dataCalculator.typeMining)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)
      const analysisUnit = Number(dataCalculator.analysisUnit)

      const gold =
        analysisUnit === analysisUnitTypes.IMPACTED_AREA
          ? hectareToGold({ dataCalculator })
          : analysisUnit === analysisUnitTypes.QTD_MACHINES
            ? numberOfMachinesToGold({ dataCalculator })
            : qtdAnalysis

      const quantityOfGoldGramsPerYearWell = general
        ? general.quantityOfGoldGramsPerYearWell
        : 0
      const HgAuRatio = general ? general.HgAuRatio : 0
      const lossPercentHgInSoil = soilMercuryRemediation
        ? soilMercuryRemediation.lossPercentHgInSoil
        : 0
      const lossPercentHgInSoil_conservative = soilMercuryRemediation
        ? soilMercuryRemediation.lossPercentHgInSoil_conservative
        : 0
      const HgContainedSoilinGrassPerTon = soilMercuryRemediation
        ? soilMercuryRemediation.HgContainedSoilinGrassPerTon
        : 0
      const DensidadeSolo = soilMercuryRemediation
        ? soilMercuryRemediation.DensidadeSolo
        : 0
      const remediationCostUSDPerTonOfSoil = soilMercuryRemediation
        ? soilMercuryRemediation.remediationCostUSDPerTonOfSoil
        : 0

      const lossPercentHgInSoilValue =
        txPrevalence === valueHypothesisTypes.CONSERVATIVE
          ? lossPercentHgInSoil_conservative
          : lossPercentHgInSoil
      const amountOfHgDumpedintoSoilerGold =
        lossPercentHgInSoilValue * HgAuRatio

      if (
        typemining === typeMiningTypes.PIT &&
        analysisUnit === analysisUnitTypes.YEARS_OF_MINING
      ) {
        //Input anos de garimpo
        const amountOfTotalGoldWell =
          quantityOfGoldGramsPerYearWell * qtdAnalysis
        const amountOfHgDumpedintoSoilerGoldInGrams =
          amountOfHgDumpedintoSoilerGold * amountOfTotalGoldWell
        const contaminatedSoilTon =
          amountOfHgDumpedintoSoilerGoldInGrams / HgContainedSoilinGrassPerTon
        const M3solocontaminadoHg = contaminatedSoilTon / DensidadeSolo
        const toCostOfSoilHgRemediation =
          remediationCostUSDPerTonOfSoil * M3solocontaminadoHg
        return toCostOfSoilHgRemediation
      } else if (typemining === typeMiningTypes.FERRY) {
        const toCostOfSoilHgRemediation = 0
        return toCostOfSoilHgRemediation
      } else {
        const toQuantityHgDumpedSoil = amountOfHgDumpedintoSoilerGold * gold
        const contaminatedSoilTon =
          toQuantityHgDumpedSoil / HgContainedSoilinGrassPerTon
        const M3SoloContaminadoHg = contaminatedSoilTon / DensidadeSolo

        const toCostOfSoilHgRemediation =
          remediationCostUSDPerTonOfSoil * M3SoloContaminadoHg
        return toCostOfSoilHgRemediation
      }
    },
    [general, hectareToGold, soilMercuryRemediation]
  )

  return {
    neuroSymptomsGarimpeiroCalculator,
    lossQICalculator,
    hypertensionCalculator,
    heartAttackCalculator,
    soilMercuryRemediationCalculator
  }
}
