import { FormInputs } from '@/components/FormCalculator'
import { countryCodes, currency, retortTypes, typeMiningTypes } from '@/enums'
import convertGramsToKg from '@/utils/convertGramsToKg'
import roundValue from '@/utils/roundValue'
import roundPercent from '@/utils/roundPercent'
import { useCallback, useEffect, useState } from 'react'
import useAppContext from '../useAppContext'
import useConvertAll from '../useConvertAll'
import useCountry from '../useCountry'
import useDeforestation from './useDeforesation'
import useMercury from './useMercury/indext'
import useSiltingOfRivers from './useSiltingOfRivers/indext'
import { usePriceData } from '@/store/api'
import { inflationBackupValues } from '@/lib/api'

export interface DataCalculatorProps {
  dataCalculator: FormInputs
}

export interface DataImpacts {
  name: string
  value: number
  lossyVolume?: number
}

export interface DataImpactsNoMonetary {
  label: string
  value: number
  measure: string
}

export default function useCalculator() {
  const [deforestationImpacts, setDeforestation] = useState<DataImpacts[]>([])
  const [siltingOfRiversImpacts, setSiltingOfRivers] = useState<DataImpacts[]>(
    []
  )
  const [mercuryImpacts, setMercury] = useState<DataImpacts[]>([])
  const [impactsNotMonetary, setNoMonetary] = useState<DataImpactsNoMonetary[]>(
    []
  )
  const { isBrazil, getValueToCountry, currentCountry } = useCountry();
  // const inflationData = useInflation(currentCountry?.country);
  // const yearOfRef = useMemo(
  //   () => currentCountry?.country === countryCodes.BR
  //     ? 2022
  //     : (
  //         currentCountry?.country === countryCodes.CO ||
  //         currentCountry?.country === countryCodes.PE ||
  //         currentCountry?.country === countryCodes.EC
  //       )
  //       ? 2023
  //       : 2024,
  //   [currentCountry]
  // );

  // const dolarData = useDollar();
  // console.log('inflation--Data', inflationData)
  const { inflationData, dollarPriceData } = usePriceData();

  const {
    bioprospectingCalculator,
    carbonCalculator,
    culturedAndSpeciesCalculator,
    recoveryOfTopsoilCalculator,
    recreationCalculator,
    woodAndNonWoodProductsCalculator
  } = useDeforestation()

  const {
    cavaGroundingCostAuNormCalculator,
    cavaGroundingCostAuFertileCalculator,
    dredgingAndRiverSedimentsCalculator,
    erosionSiltingUpCalculator
  } = useSiltingOfRivers()

  const {
    neuroSymptomsGarimpeiroCalculator,
    lossQICalculator,
    hypertensionCalculator,
    heartAttackCalculator,
    soilMercuryRemediationCalculator,
    waterMercuryRemediationCalculator
  } = useMercury()

  const { convertAllinGold, convertAllinHectare, proporcaoGramaPorHectare } =
    useConvertAll()
  const { changeResults } = useAppContext()
  const { state } = useAppContext()
  const { language, dataCalculator } = state

  const sumTotal = useCallback((totalValues: DataImpacts[]) => {
    const reducer = (acc: number, current: DataImpacts) => acc + current.value
    const totalValue = totalValues.reduce(reducer, 0)
    return totalValue
  }, [])

  const calculateInflation = useCallback((inflation: number | undefined, total: number) => {
    if (inflation) {
      return (inflation / 100) * total
    }
    return 0
  }, [])

  // const totalWithInflation = useCallback(
  //   (inflation: number, total: number) => {
  //     if (isBrazil) {
  //       const valueInflation2020at2021 = calculateInflation(14.58, total)
  //       const valueInflation = calculateInflation(inflation, total)
  //       const totalInflation = valueInflation2020at2021 + valueInflation + total
  //       return totalInflation
  //     } else {
  //       const valueInflation = calculateInflation(inflation, total)
  //       const totalInflation = valueInflation + total
  //       return totalInflation
  //     }
  //   },
  //   [isBrazil, calculateInflation]
  // )

  const totalWithInflation = useCallback(
    (total: number) => {
      if (isBrazil) {
        // const valueInflation2020at2021 = calculateInflation(14.58, total)
        const valueInflation = calculateInflation(inflationData.data || inflationBackupValues[countryCodes.BR], total)        
        if(!inflationData.data) console.warn('Using backup harcoded value for inflation');
        const totalInflation = valueInflation + total
        return totalInflation
      } else {
        const valueInflation = inflationData.data
          ? calculateInflation(inflationData.data, total)
          : calculateInflation(currentCountry? inflationBackupValues[currentCountry.country] : 0, total)
        if(!inflationData.data) console.warn('Using backup harcoded value for inflation');
        const totalInflation = valueInflation + total
        return totalInflation
      }
    },
    [isBrazil, calculateInflation, inflationData.data]
  )

  const calculatorTotalImpact = useCallback(
    (total: number) => {
      const totalWithDolar = getValueToCountry(total, dollarPriceData.value ?? currency.dolar)
      if(!dollarPriceData.value) console.warn('Using backup hardcoded value for dollarPrice')
      return totalWithInflation(totalWithDolar)
    },
    [totalWithInflation, getValueToCountry, dollarPriceData.value]
  )

  const calculatorDeforestation = useCallback(
    (data: FormInputs) => {
      const bio = bioprospectingCalculator({ dataCalculator: data })
      const totalBio = calculatorTotalImpact(bio)

      const carbon = carbonCalculator({ dataCalculator: data })
      const totalCarbon = calculatorTotalImpact(carbon)

      const culturedAndSpecies = culturedAndSpeciesCalculator({
        dataCalculator: data
      })
      const totalCulturedAndSpecies = calculatorTotalImpact(
        culturedAndSpecies,
        
      )

      const recoveryOfTopsoil = recoveryOfTopsoilCalculator({
        dataCalculator: data
      })
      const totalRecoveryOfTopsoil = calculatorTotalImpact(
        recoveryOfTopsoil        
      )

      const recreation = recreationCalculator({ dataCalculator: data })
      const totalRecreation = calculatorTotalImpact(
        recreation        
      )

      const woodAndNonWoodProducts = woodAndNonWoodProductsCalculator({
        dataCalculator: data
      })
      const totalWoodAndNonWoodProducts = calculatorTotalImpact(
        woodAndNonWoodProducts,
        
      )

      const totalImpacts = [
        {
          name: language.calculator.impacts.deforestation
            .sub_impact_Bioprospecting,
          value: totalBio
        },
        {
          name: language.calculator.impacts.deforestation.sub_impact_Carbon,
          value: totalCarbon
        },
        {
          name: language.calculator.impacts.deforestation
            .sub_impact_reforestation,
          value: totalRecoveryOfTopsoil
        },
        {
          name: language.calculator.impacts.deforestation.sub_impact_recreation,
          value: totalRecreation
        },
        {
          name: language.calculator.impacts.deforestation
            .sub_impact_forest_products,
          value: totalWoodAndNonWoodProducts
        },
        {
          name: language.calculator.impacts.deforestation
            .sub_impact_culture_and_species,
          value: totalCulturedAndSpecies
        }
      ]
      // console.log('deforestation', totalImpacts)

      setDeforestation(totalImpacts)
    },
    [
      bioprospectingCalculator,
      carbonCalculator,
      calculatorTotalImpact,
      culturedAndSpeciesCalculator,
      recoveryOfTopsoilCalculator,
      recreationCalculator,
      woodAndNonWoodProductsCalculator,
      language
    ]
  )

  const calculatorSiltingOfRivers = useCallback(
    (data: FormInputs) => {
      const cavaGroundingCostAuNorm = cavaGroundingCostAuNormCalculator({
        dataCalculator: data
      })
      const totalcavaGroundingCostAuNorm = calculatorTotalImpact(
        cavaGroundingCostAuNorm
      )

      const { value: cavaGroundingCostAuFertile, lossyVolume } =
        cavaGroundingCostAuFertileCalculator({ dataCalculator: data })
      const totalcavaGroundingCostAuFertile = calculatorTotalImpact(
        cavaGroundingCostAuFertile
      )

      const dredgingAndRiverSediments = dredgingAndRiverSedimentsCalculator({
        dataCalculator: data
      })
      const totalDredgingAndRiverSediments = calculatorTotalImpact(
        dredgingAndRiverSediments
      )

      const erosionSiltingUp = erosionSiltingUpCalculator({
        dataCalculator: data
      })
      const totalErosionSiltingUp = calculatorTotalImpact(
        erosionSiltingUp
      )

      const totalImpacts: DataImpacts[] = []
      const impactNotMonetary: DataImpactsNoMonetary[] = []

      if (Number(data.typeMining) !== typeMiningTypes.FERRY) {
        totalImpacts.push({
          name: language.calculator.impacts.siltingOfRivers
            .sub_impact_pit_grounding,
          value: totalcavaGroundingCostAuNorm + totalcavaGroundingCostAuFertile
        })
        impactNotMonetary.push({
          label: language.calculator.impacts.notMonetary.lossyVolume,
          value: roundValue(lossyVolume),
          measure: 'm3'
        })
      }

      totalImpacts.push({
        name: language.calculator.impacts.siltingOfRivers
          .sub_impact_dredging_of_sediments_in_the_river,
        value: totalDredgingAndRiverSediments
      })
      totalImpacts.push({
        name: language.calculator.impacts.siltingOfRivers.sub_impact_erosion,
        value: totalErosionSiltingUp
      })

      console.log('silting of rivers', totalImpacts)

      setSiltingOfRivers(totalImpacts)
      return {
        impactNotMonetary
      }
    },
    [
      cavaGroundingCostAuNormCalculator,
      calculatorTotalImpact,
      cavaGroundingCostAuFertileCalculator,
      dredgingAndRiverSedimentsCalculator,
      erosionSiltingUpCalculator,
      language.calculator.impacts.siltingOfRivers
        .sub_impact_dredging_of_sediments_in_the_river,
      language.calculator.impacts.siltingOfRivers.sub_impact_erosion,
      language.calculator.impacts.siltingOfRivers.sub_impact_pit_grounding,
      language.calculator.impacts.notMonetary.lossyVolume
    ]
  )

  const calculatorMercury = useCallback(
    (data: FormInputs) => {
      const { value: neuroSymptomsGarimpeiro, qtdOfMinersAffected } =
        neuroSymptomsGarimpeiroCalculator({ dataCalculator: data })
      const totalNeuroSymptomsGarimpeiro = calculatorTotalImpact(
        neuroSymptomsGarimpeiro        
      )

      const {
        value: lossQI,
        concentrationMediaMercuryHair,
        porcentNascidosVivosPerdaQIAcimaDe2Pts
      } = lossQICalculator({ dataCalculator: data })
      const totalLossQI = calculatorTotalImpact(lossQI )

      const { value: hypertension, peopleAbove20YearsoldInTheRegionIn52Years } =
        hypertensionCalculator({ dataCalculator: data })
      const totalHypertension = calculatorTotalImpact(
        hypertension        
      )

      const {
        value: heartAttack,
        toMethylatedWater,
        toPopulationAffectedMercuryHair,
        menOver40InTheRegionIn27Years
      } = heartAttackCalculator({ dataCalculator: data })
      const totalHeartAttack = calculatorTotalImpact(
        heartAttack        
      )

      const soilMercuryRemediation = soilMercuryRemediationCalculator({
        dataCalculator: data
      })
      const totalSoilMercuryRemediation = calculatorTotalImpact(
        soilMercuryRemediation        
      )

      const waterMercuryRemediation = waterMercuryRemediationCalculator({
        dataCalculator: data
      }) 

      const totalWaterMercuryRemediation = calculatorTotalImpact(
        waterMercuryRemediation        
      )

      const totalImpacts: DataImpacts[] = []

      const impactNotMonetary: DataImpactsNoMonetary[] = []

      impactNotMonetary.push({
        label:
          language.calculator.impacts.notMonetary.concentrationMediaMercuryHair,
        value: roundValue(concentrationMediaMercuryHair),
        measure: 'μg/g'
      })

      impactNotMonetary.push({
        label:
          language.calculator.impacts.notMonetary
            .porcentNascidosVivosPerdaQIAcimaDe2Pts,
        value: roundPercent(porcentNascidosVivosPerdaQIAcimaDe2Pts),
        measure: '%'
      })

      impactNotMonetary.push({
        label: language.calculator.impacts.notMonetary.toMethylatedWater,
        value: roundValue(toMethylatedWater),
        measure: language.calculator.impacts.notMonetary.GInHg
      })

      impactNotMonetary.push({
        label:
          language.calculator.impacts.notMonetary
            .toPopulationAffectedMercuryHair,
        value: Math.ceil(toPopulationAffectedMercuryHair),
        measure: language.calculator.impacts.notMonetary.people
      })

      impactNotMonetary.push({
        label:
          language.calculator.impacts.notMonetary.menOver40InTheRegionIn27Years,
        value: Math.ceil(menOver40InTheRegionIn27Years),
        measure: language.calculator.impacts.notMonetary.people
      })

      impactNotMonetary.push({
        label:
          language.calculator.impacts.notMonetary
            .peopleAbove20YearsoldInTheRegionIn52Years,
        value: Math.ceil(peopleAbove20YearsoldInTheRegionIn52Years),
        measure: language.calculator.impacts.notMonetary.people
      })

      totalImpacts.push({
        name: language.calculator.impacts.mercuryContamination
          .sub_impact_loss_of_Qi_in_Fetuses,
        value: totalLossQI
      })
      totalImpacts.push({
        name: language.calculator.impacts.mercuryContamination
          .sub_impact_cardiovascular_diseases,
        value: totalHypertension + totalHeartAttack
      })

      if (Number(data.retort) === retortTypes.NO) {
        totalImpacts.push({
          name: language.calculator.impacts.mercuryContamination
            .sub_impact_neuropsychological_symptoms,
          value: totalNeuroSymptomsGarimpeiro
        })
        impactNotMonetary.push({
          label: language.calculator.impacts.notMonetary.qtdOfMinersAffected,
          value: Math.ceil(qtdOfMinersAffected),
          measure: language.calculator.impacts.notMonetary.people
        })
      }
      totalImpacts.push({
        name: language.calculator.impacts.mercuryContamination
          .sub_impact_soil_remediation,
        value: totalSoilMercuryRemediation
      })

      if(totalWaterMercuryRemediation) {
        totalImpacts.push({
          name: language.calculator.impacts.mercuryContamination.sub_impact_water_remediation,
          value: totalWaterMercuryRemediation
        })
      }

      setMercury(totalImpacts)
      return {
        impactNotMonetary
      }
    },
    [
      neuroSymptomsGarimpeiroCalculator,
      calculatorTotalImpact,
      lossQICalculator,
      hypertensionCalculator,
      heartAttackCalculator,
      soilMercuryRemediationCalculator,
      language.calculator.impacts.notMonetary.concentrationMediaMercuryHair,
      language.calculator.impacts.notMonetary
        .porcentNascidosVivosPerdaQIAcimaDe2Pts,
      language.calculator.impacts.notMonetary.toMethylatedWater,
      language.calculator.impacts.notMonetary.GInHg,
      language.calculator.impacts.notMonetary.toPopulationAffectedMercuryHair,
      language.calculator.impacts.notMonetary.people,
      language.calculator.impacts.notMonetary.menOver40InTheRegionIn27Years,
      language.calculator.impacts.notMonetary
        .peopleAbove20YearsoldInTheRegionIn52Years,
      language.calculator.impacts.notMonetary.qtdOfMinersAffected,
      language.calculator.impacts.mercuryContamination
        .sub_impact_loss_of_Qi_in_Fetuses,
      language.calculator.impacts.mercuryContamination
        .sub_impact_cardiovascular_diseases,
      language.calculator.impacts.mercuryContamination
        .sub_impact_soil_remediation,
      language.calculator.impacts.mercuryContamination
        .sub_impact_neuropsychological_symptoms
    ]
  )

  const getcalculator = useCallback(
    (data: FormInputs) => {
      if (data) {
        const goldGrass = convertAllinGold({ dataCalculator: data })
        const proporcaoGramaPorHectareValue = proporcaoGramaPorHectare({
          dataCalculator: data
        })
        const { value: hecatereGrass } = convertAllinHectare({
          dataCalculator: data
        })

        const impactsNotMonetaryWithoutImpacts: DataImpactsNoMonetary[] = [
          {
            label: language.calculator.impacts.notMonetary.goldGrass,
            value: convertGramsToKg(goldGrass),
            measure: language.calculator.impacts.notMonetary.kgDeAu
          },
          {
            label:
              language.calculator.impacts.notMonetary.proporcaoKgporHectare,
            value: convertGramsToKg(proporcaoGramaPorHectareValue),
            measure: language.calculator.impacts.notMonetary.kgDeAu_ha
          },
          {
            label: language.calculator.impacts.notMonetary.hecatereGrass,
            value: roundValue(hecatereGrass),
            measure: 'ha'
          }
        ]

        if (Number(data.typeMining) !== typeMiningTypes.FERRY) {
          calculatorDeforestation(data)
        }

        const { impactNotMonetary: siltingOfRiversNotMonetary } =
          calculatorSiltingOfRivers(data)
        const { impactNotMonetary: mercuryNotMonetary } =
          calculatorMercury(data)

        const impactsNotMonetary = impactsNotMonetaryWithoutImpacts
          .concat(siltingOfRiversNotMonetary)
          .concat(mercuryNotMonetary)
        setNoMonetary(impactsNotMonetary)
      }
    },
    [
      calculatorDeforestation,
      calculatorSiltingOfRivers,
      calculatorMercury,
      convertAllinGold,
      proporcaoGramaPorHectare,
      convertAllinHectare,
      language
    ]
  )

  const excludeValuesBelowOnePercent = useCallback(
    (data: DataImpacts[]) => {
      const totalValues = sumTotal(data)
      const dataFilted = data.filter((d) => {
        const percent = Math.round((100 * d.value) / totalValues)
        if (percent >= 1) {
          return true
        }
        return false
      })
      return dataFilted
    },
    [sumTotal]
  )

  useEffect(() => {
    if (dataCalculator) {
      getcalculator(dataCalculator)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  useEffect(() => {
    if (
      siltingOfRiversImpacts.length > 0 &&
      mercuryImpacts.length > 0 &&
      impactsNotMonetary.length > 0
    ) {
      changeResults({
        deforestation: excludeValuesBelowOnePercent(deforestationImpacts),
        siltingOfRivers: excludeValuesBelowOnePercent(siltingOfRiversImpacts),
        mercury: excludeValuesBelowOnePercent(mercuryImpacts),
        impactsNotMonetary: impactsNotMonetary
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    deforestationImpacts,
    siltingOfRiversImpacts,
    mercuryImpacts,
    impactsNotMonetary
  ])

  return {
    getcalculator,
    calculatorDeforestation,
    sumTotal,
    impacts: {
      deforestationImpacts,
      siltingOfRiversImpacts,
      mercuryImpacts,
      impactsNotMonetary
    }
  }
}
