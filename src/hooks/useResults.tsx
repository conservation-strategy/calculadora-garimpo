import { DataImpactChartProps } from '@/components/Charts/Impact'
import { ResumeChartsProps } from '@/components/Charts/Resume'
import { FormInputs } from '@/components/FormCalculator'
import {
  analysisUnitTypes,
  currency,
  knowRegionTypes,
  retortTypes,
  typeMiningTypes,
  usesValuesTypes,
  valueHypothesisTypes
} from '@/enums'
import { LanguageTypeProps } from '@/store/state'
import { dataCalculatorTypes, resultsType } from '@/store/state/proveider'
import roundPercent from '@/utils/roundPercent'
import roundValue from '@/utils/roundValue'
import ToBRL from '@/utils/toBRL'
import toUSD from '@/utils/toUSD'
import { useCallback, useEffect, useState } from 'react'
import useCalculator from './useCalculator'
import useConvertAll from './useConvertAll'
import useCountry from './useCountry'
import useFixedCalculator from './useFixedCalculator'
import usePopSize100kmRadius from './usePopSize100kmRadius'
// import { getGoldPrice } from '@/lib/api/gold'
import { usePriceData } from '@/store/api'

export interface textImpactProps {
  paragraphy_01: string
  paragraphy_02: string
}

export interface textImpactMercuryProps {
  paragraphy_01: string
}

export enum Tabs {
  deforastation = 0,
  siltingOfRivers = 1,
  mercury = 2
}

interface useResultsProps {
  results: resultsType
  dataCalculator: dataCalculatorTypes
  language: LanguageTypeProps
}

export default function useResults({
  results,
  dataCalculator,
  language
}: useResultsProps) {
  const [textResume, setTextResume] = useState<string | null>(null)
  const [textDeforestation, setTextDeforestation] =
    useState<textImpactProps | null>(null)
  const [textSiltingOfRivers, setTextSiltingOfRivers] =
    useState<textImpactProps | null>(null)
  const [textMercury, setTextMercury] = useState<textImpactMercuryProps | null>(
    null
  )
  const [subTextTotalImpacts, setSubTextTotalImpacts] = useState<string | null>(
    null
  )
  const [textGold, setTextGold] = useState<string | null>(null)
  const [textUsesTypes, setTextUsesTypes] = useState<string | null>(null)
  const [infographicDeforestation, setInfographicDeforestation] = useState<
    string | null
  >(null)
  const [infographicSiltingOfRivers, setInfographicSiltingOfRivers] = useState<
    string | null
  >(null)
  const [infographicMercury, setInfographicMercury] = useState<string | null>(
    null
  )
  const [resumeDataChart, setResume] = useState<ResumeChartsProps[]>([])
  const [deforastationDataChart, setDeforastation] = useState<
    DataImpactChartProps[]
  >([])
  const [siltingOfRiversDataChart, setSiltingOfRivers] = useState<
    DataImpactChartProps[]
  >([])
  const [mercuryRiversDataChart, setmercury] = useState<DataImpactChartProps[]>(
    []
  )
  const [totalImpacts, setTotalImpacts] = useState<string>('')
  const [totalGold, setTotalGold] = useState<string>('')
  const [totalMonetary, setTotalMonetary] = useState<string>('')
  const [totalMercury, setTotalMercury] = useState<string>('')
  const [valueGold, setValueGold] = useState<number>(0)
  const [tabActive, settab] = useState<number | null>(null)
  const { sumTotal } = useCalculator()
  const { isBrazil, isPeru, isColombia, isEquador, getDistrictData } =
    useCountry()
  const { convertAllinGold, convertAllinHectare, cubicMeters } = useConvertAll()
  const { getPopSize100kmRadius } = usePopSize100kmRadius()
  const { general } = useFixedCalculator()
  // const { data: goldPriceData } = useGoldPrice();
  const { goldPriceData, dollarPriceData } = usePriceData();


  const convertCurrency = useCallback(
    (value: number) => {
      return isBrazil ? ToBRL(value) : toUSD(value)
    },
    [isBrazil]
  )

  const getValueGold = useCallback(async() => {
    const totalGold = convertAllinGold({
      dataCalculator: dataCalculator as FormInputs
    })
    // const goldPriceData = await getGoldPrice();
    const goldPrice = goldPriceData.data || currency.gold
    if(!goldPriceData.data) console.warn('Using backup hardcoded value for goldPrice')
    console.log('goldPrice in calculator', goldPrice)
    const totalGoldwithPrice = totalGold * goldPrice
    const totalGoldPriceWithCountry = isBrazil
      ? totalGoldwithPrice * (dollarPriceData.value || currency.dolar)
      : totalGoldwithPrice
    if(isBrazil && !dollarPriceData.value) console.warn('Using backup hardcoded value for gold');
    setValueGold(totalGoldPriceWithCountry)
  }, [isBrazil, dataCalculator, convertAllinGold])

  const getInfographic = useCallback(() => {
    const urlDeforestation = `/assets/infographic/deforestation_${language.id}.svg`
    const urlSiltingOfRivers = `/assets/infographic/siltingOfRivers_${language.id}.svg`
    const urlMercury = `/assets/infographic/mercury_${language.id}.svg`
    setInfographicDeforestation(urlDeforestation)
    setInfographicSiltingOfRivers(urlSiltingOfRivers)
    setInfographicMercury(urlMercury)
  }, [language])

  const getTextUsesTypes = useCallback(() => {
    let textUsesTypes = ''
    if (dataCalculator) {
      const usesTypes = dataCalculator.usesTypes
      const { calculator } = language
      const { valuation } = calculator

      if (usesTypes === usesValuesTypes.environmental) {
        textUsesTypes = valuation.environmental.replace('$value', totalMonetary)
      } else if (usesTypes === usesValuesTypes.planning) {
        textUsesTypes = valuation.planning.replace('$value', totalMonetary)
      } else if (usesTypes === usesValuesTypes.technology) {
        textUsesTypes = valuation.technology
          .replace('$valueImpact', totalImpacts)
          .replace('$valueMercury', totalMercury)
      }
    }
    setTextUsesTypes(textUsesTypes)
  }, [dataCalculator, totalMonetary, totalMercury, totalImpacts, language])

  const getTextResume = useCallback(() => {
    let textQtdAnalysis = ''
    let textTypeMining = ''
    let textPitDepthOrMotorPower = ''
    let textDistrict = ''
    let textRetort = ''
    let result = ''

    if (dataCalculator) {
      const analysisUnit = Number(dataCalculator.analysisUnit)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)
      const typeMining = Number(dataCalculator.typeMining)
      const retort = Number(dataCalculator.retort)
      const pitDepth = dataCalculator.pitdepth
      const motorPower = dataCalculator.motorPower
      const district = Number(dataCalculator.district)
      const knowRegion = dataCalculator.knowRegion
      const currentDistrict = getDistrictData(district)

      const { calculator } = language
      const { resume } = calculator
      const { TextResume } = resume

      if (dataCalculator.country === 'BR') {
        textDistrict = currentDistrict.município
      } else {
        textDistrict = currentDistrict.nome
      }

      if (retort === retortTypes.yes) {
        textRetort = TextResume.textRetort.yes
      } else {
        textRetort = TextResume.textRetort.no
      }

      if (typeMining === typeMiningTypes.ALLUVION) {
        textTypeMining = TextResume.typeMining.alluvion
        textPitDepthOrMotorPower =
          TextResume.textPitDepthOrMotorPower.pitdepth.replace(
            '$pitDepth$',
            pitDepth.replace('.', ',')
          )
      } else if (
        typeMining === typeMiningTypes.FERRY &&
        analysisUnit !== analysisUnitTypes.QTD_FERRY
      ) {
        textTypeMining = TextResume.typeMining.ferry
      } else if (typeMining === typeMiningTypes.FERRY) {
        textPitDepthOrMotorPower =
          TextResume.textPitDepthOrMotorPower.motorPower.replace(
            '$motorPower$',
            motorPower
          )
      } else if (typeMining === typeMiningTypes.PIT) {
        textTypeMining = TextResume.typeMining.pit
        textPitDepthOrMotorPower = ''
      }

      if (analysisUnit === analysisUnitTypes.AMOUNT_GOLD) {
        textQtdAnalysis = `${qtdAnalysis} ${
          qtdAnalysis > 1
            ? TextResume.analysisUnit.gold.plural
            : TextResume.analysisUnit.gold.single
        }`
      } else if (analysisUnit === analysisUnitTypes.IMPACTED_AREA) {
        textQtdAnalysis = `${qtdAnalysis} ${
          qtdAnalysis > 1
            ? TextResume.analysisUnit.hectare.plural
            : TextResume.analysisUnit.hectare.single
        }`
      } else if (analysisUnit === analysisUnitTypes.QTD_FERRY) {
        textQtdAnalysis = `${qtdAnalysis} ${
          qtdAnalysis > 1
            ? TextResume.analysisUnit.ferry.plural
            : TextResume.analysisUnit.ferry.single
        }`
      } else if (analysisUnit === analysisUnitTypes.YEARS_OF_MINING) {
        textQtdAnalysis = `${qtdAnalysis} ${
          qtdAnalysis > 1
            ? TextResume.analysisUnit.year.plural
            : TextResume.analysisUnit.year.single
        }`
      }
      let districtName = 'municipio'
      let districtInfo = ''
      let amazonRegion = ''

      if (isPeru && knowRegion === knowRegionTypes.NO) {
        amazonRegion = TextResume.amazonPeru
      } else if (isEquador && knowRegion === knowRegionTypes.NO) {
        amazonRegion = TextResume.amazonEcuador
      } else if (isColombia && knowRegion === knowRegionTypes.NO) {
        amazonRegion = TextResume.amazonColombia
      } else if (knowRegion === knowRegionTypes.NO) {
        amazonRegion = ` ${TextResume.amazonBrazil}`
      }

      if (isPeru) {
        districtName = 'provincia'
      } else if (isEquador) {
        districtName = 'cantón'
      } else if (isColombia) {
        districtName = 'departamento'
      }

      if (knowRegion === knowRegionTypes.YES) {
        districtInfo = TextResume.knowRegion.yes.district
          .replace('$districtName', districtName)
          .replace('$district', textDistrict)
      } else {
        districtInfo = TextResume.knowRegion.no.district
          .replace('$districtName', districtName)
          .replace('$district', textDistrict)
      }

      result = `${TextResume.first} ${textQtdAnalysis} ${TextResume.second} ${textTypeMining} ${textPitDepthOrMotorPower} ${districtInfo}${amazonRegion}, ${textRetort}`
    }
    setTextResume(result)
  }, [dataCalculator, getDistrictData, isColombia, isEquador, isPeru, language])

  const getTextDeforestation = useCallback(() => {
    let paragraphy_01 = ''
    let paragraphy_02 = ''
    if (dataCalculator) {
      const typeMining = Number(dataCalculator.typeMining)
      const analysisUnit = Number(dataCalculator.analysisUnit)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)

      const { hectare: hectareWithoutOverflow, value: hectare } =
        convertAllinHectare({ dataCalculator })
      const hectareValue = Math.round(hectare * 100) / 100
      const goldValue = roundValue(convertAllinGold({ dataCalculator }))

      let withoutOverflow = Math.round(hectareWithoutOverflow * 100) / 100

      let overflowText = language.calculator.impacts.deforestation.withOverflow

      if (
        typeMining === typeMiningTypes.ALLUVION &&
        analysisUnit === analysisUnitTypes.IMPACTED_AREA
      ) {
        withoutOverflow = qtdAnalysis
        overflowText = language.calculator.impacts.deforestation.withoutOverflow
      }

      paragraphy_01 = `${language.calculator.impacts.deforestation.paragraphy_01
        .replace('$grams', goldValue.toString())
        .replace('$hectare', hectareValue.toString())
        .replace(
          '$withoutOverflow',
          withoutOverflow.toString()
        )} ${overflowText}`
      paragraphy_02 =
        language.calculator.impacts.deforestation.paragraphy_02.replace(
          '$hectare',
          hectareValue.toString()
        )
    }
    setTextDeforestation({
      paragraphy_01,
      paragraphy_02
    })
  }, [
    dataCalculator,
    convertAllinHectare,
    convertAllinGold,
    language.calculator.impacts.deforestation.withOverflow,
    language.calculator.impacts.deforestation.paragraphy_01,
    language.calculator.impacts.deforestation.paragraphy_02,
    language.calculator.impacts.deforestation.withoutOverflow
  ])

  const getTextSiltingOfRivers = useCallback(() => {
    let paragraphy_01 = ''
    let paragraphy_02 = ''
    if (dataCalculator) {
      const goldValue = roundValue(convertAllinGold({ dataCalculator }))
      const volumeM3 = cubicMeters({ dataCalculator })

      paragraphy_01 = language.calculator.impacts.siltingOfRivers.paragraphy_01
        .replace('$grams', goldValue.toString())
        .replace('$volumeM3', volumeM3)
      paragraphy_02 =
        language.calculator.impacts.siltingOfRivers.paragraphy_02.replace(
          '$volumeM3',
          volumeM3
        )
    }
    setTextSiltingOfRivers({
      paragraphy_01,
      paragraphy_02
    })
  }, [dataCalculator, language, cubicMeters, convertAllinGold])

  const getTextMercury = useCallback(() => {
    let paragraphy_01 = ''
    if (dataCalculator) {
      const district = Number(dataCalculator.district)
      const txPrevalence = Number(dataCalculator.valueHypothesis)
      const currentDistrict = getDistrictData(district)
      const people = roundValue(
        getPopSize100kmRadius({ dataCalculator, currentDistrict })
      )
      const percentLossHgInWater_convervative = general
        ? general.percentLossHgInWater_convervative
        : 0
      const percentLossHgInWater = general ? general.percentLossHgInWater : 0
      const HgAuRatio = general ? general.HgAuRatio : 0
      const lossPercentHgInWater =
        txPrevalence === valueHypothesisTypes.CONSERVATIVE
          ? percentLossHgInWater_convervative
          : percentLossHgInWater

      paragraphy_01 =
        language.calculator.impacts.mercuryContamination.paragraphy_01
          .replace('$people', people.toLocaleString('pt-BR'))
          .replace('$HgAuRatio', `${HgAuRatio}kg`)
          .replace(
            '$lossPercentHgInWater',
            `${roundPercent(lossPercentHgInWater)}%`
          )
    }
    setTextMercury({
      paragraphy_01
    })
  }, [
    dataCalculator,
    getDistrictData,
    getPopSize100kmRadius,
    general,
    language.calculator.impacts.mercuryContamination.paragraphy_01
  ])

  const getSubTextTotalImpacts = useCallback(() => {
    let subTextTotalImpactsResult = ''
    if (dataCalculator) {
      const analysisUnit = Number(dataCalculator.analysisUnit)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)
      const { calculator } = language
      const { resume } = calculator
      const { TextTotalImpacts } = resume

      if (analysisUnit === analysisUnitTypes.IMPACTED_AREA) {
        subTextTotalImpactsResult = TextTotalImpacts.impactedArea.replace(
          '$value',
          qtdAnalysis.toString()
        )
      } else if (analysisUnit === analysisUnitTypes.AMOUNT_GOLD) {
        subTextTotalImpactsResult = TextTotalImpacts.amoutGold.replace(
          '$value',
          qtdAnalysis.toString()
        )
      } else if (analysisUnit === analysisUnitTypes.YEARS_OF_MINING) {
        subTextTotalImpactsResult = TextTotalImpacts.yearsOfMining.replace(
          '$value',
          qtdAnalysis.toString()
        )
      } else {
        subTextTotalImpactsResult = TextTotalImpacts.ferry.replace(
          '$value',
          qtdAnalysis.toString()
        )
      }
    }
    setSubTextTotalImpacts(subTextTotalImpactsResult)
  }, [dataCalculator, language])

  const getTextGold = useCallback(() => {
    let textGoldResult = ''
    if (dataCalculator) {
      const { calculator } = language
      const { resume } = calculator
      const { TextTotalImpacts } = resume
      const totalGold = convertAllinGold({ dataCalculator })
      textGoldResult = TextTotalImpacts.amoutGold.replace(
        '$value',
        Math.round(totalGold).toString()
      )
    }
    setTextGold(textGoldResult)
  }, [dataCalculator, language, convertAllinGold])

  useEffect(() => {
    if (dataCalculator && results) {
      getTextResume()
      getTextDeforestation()
      getTextSiltingOfRivers()
      getTextMercury()
      getSubTextTotalImpacts()
      getTextGold()
      getValueGold()
      getTextUsesTypes()
      getInfographic()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataCalculator, results, language])

  useEffect(() => {
    if (dataCalculator && results) {
      if (Number(dataCalculator.typeMining) !== typeMiningTypes.FERRY) {
        const totalDesmatamento = sumTotal(results.deforestation)
        const totalAssoreamento = sumTotal(results.siltingOfRivers)
        const totalMercurio = sumTotal(results.mercury)

        setTotalMercury(convertCurrency(totalMercurio))

        setDeforastation(results.deforestation)

        setSiltingOfRivers(results.siltingOfRivers)
        setmercury(results.mercury)

        const totalImpacts =
          totalDesmatamento + totalAssoreamento + totalMercurio
        setTotalImpacts(convertCurrency(totalImpacts))

        setTotalGold(convertCurrency(valueGold))

        const sumTotalMonetary = totalImpacts + valueGold
        setTotalMonetary(convertCurrency(sumTotalMonetary))

        setResume([
          {
            [language.calculator.resume.component_graphics_desforestation]:
              totalDesmatamento,
            [language.calculator.resume.component_graphics_silting]:
              totalAssoreamento,
            [language.calculator.resume.component_graphics_mercury]:
              totalMercurio,
            [language.calculator.resume.component_graphics_gold]: valueGold
          }
        ])

        settab(Tabs.deforastation)
      } else {
        const totalAssoreamento = sumTotal(results.siltingOfRivers)
        const totalMercurio = sumTotal(results.mercury)

        setDeforastation([])

        setSiltingOfRivers(results.siltingOfRivers)
        setmercury(results.mercury)

        const totalImpacts = totalAssoreamento + totalMercurio
        setTotalImpacts(convertCurrency(totalImpacts))

        setTotalGold(convertCurrency(valueGold))

        const sumTotalMonetary = totalImpacts + valueGold
        setTotalMonetary(convertCurrency(sumTotalMonetary))

        setResume([
          {
            [language.calculator.resume.component_graphics_silting]:
              totalAssoreamento,
            [language.calculator.resume.component_graphics_mercury]:
              totalMercurio,
            [language.calculator.resume.component_graphics_gold]: valueGold
          }
        ])

        settab(Tabs.siltingOfRivers)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueGold, results, language])

  return {
    dataCalculator,
    results,
    textResume,
    textDeforestation,
    textSiltingOfRivers,
    textMercury,
    subTextTotalImpacts,
    textGold,
    resumeDataChart,
    deforastationDataChart,
    siltingOfRiversDataChart,
    mercuryRiversDataChart,
    totalGold,
    totalImpacts,
    totalMonetary,
    totalMercury,
    valueGold,
    textUsesTypes,
    infographicDeforestation,
    infographicSiltingOfRivers,
    infographicMercury,
    tabActive,
    language,
    settab
  }
}
