import {
  analysisUnitTypes,
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

export default function useDeforestation() {
  const { getDistrictData } = useCountry()
  const {
    bioprospecting,
    carbon,
    general,
    recoverOfTopSoll,
    woodAndNonWoodProducts
  } = useFixedCalculator()
  const {
    hectareToGold,
    goldToHecatere,
    goldToHectarePorHe,
    convertAllinHectare,
    numberOfMachinesToGold,
    numberOfMachinesToHecare
  } = useConvertAll()

  const bioprospectingCalculator = useCallback(
    ({ dataCalculator }: DataCalculatoProps) => {
      const txPrevalence = Number(dataCalculator.valueHypothesis)
      const typemining = Number(dataCalculator.typeMining)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)
      const analysisUnit = Number(dataCalculator.analysisUnit)
      const { hectare } = convertAllinHectare({ dataCalculator })
      const pitHectare = recoverOfTopSoll ? recoverOfTopSoll.hectare : 0

      //console.log('bioprospecting', bioprospectingCostByUSD_conservative, bioprospectingCostByUSD, discountRate)

      //const bioprospectingCostByBRL = txPrevalence === CONSERVATIVE ? 68.19 : 116.95
      const bioprospectingCostByUSDValue =
        txPrevalence === valueHypothesisTypes.CONSERVATIVE
          ? bioprospecting?.bioprospectingCostByUSD_conservative
          : bioprospecting?.bioprospectingCostByUSD
      //const discountRate = 0.03;

      const amounts = calcMontante(bioprospectingCostByUSDValue)
      const VPLBioprospecting = vpl(bioprospecting?.discountRate, amounts)

      if (typemining === typeMiningTypes.FERRY) {
        return 0
      } else if (typemining === typeMiningTypes.PIT) {
        const valorTotalBioprospeccao = VPLBioprospecting * pitHectare * 12
        return valorTotalBioprospeccao
      } else if (
        typemining === typeMiningTypes.ALLUVION &&
        analysisUnit === analysisUnitTypes.AMOUNT_GOLD
      ) {
        const valorTotalBioprospeccao = VPLBioprospecting * hectare * 12
        return valorTotalBioprospeccao
      } else if (
        typemining === typeMiningTypes.ALLUVION &&
        analysisUnit === analysisUnitTypes.IMPACTED_AREA
      ) {
        const valorTotalBioprospeccao = VPLBioprospecting * hectare
        return valorTotalBioprospeccao
      } else if (
        typemining === typeMiningTypes.ALLUVION &&
        analysisUnit === analysisUnitTypes.QTD_MACHINES
      ) {
        const valorTotalBioprospeccao = VPLBioprospecting * hectare
        return valorTotalBioprospeccao
      }
      else {
        return 0
      }
    },
    [bioprospecting, convertAllinHectare, recoverOfTopSoll]
  )

  const carbonCalculator = useCallback(
    ({ dataCalculator }: DataCalculatoProps) => {
      const typemining = Number(dataCalculator.typeMining)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)
      const analysisUnit = Number(dataCalculator.analysisUnit)
      const { hectare } = convertAllinHectare({ dataCalculator })
      const pitHectare = recoverOfTopSoll ? recoverOfTopSoll.hectare : 0
      //console.log('carbon', carbonCostPerHaUSD)

      const txDiscount = 0.03
      //const carbonCostPerHaUSD = 887.74;

      const amounts = calcMontante(carbon?.carbonCostPerHaUSD)
      const VPLCarbon = vpl(txDiscount, amounts)

      if (typemining === typeMiningTypes.FERRY) {
        return 0
      } else if (typemining === typeMiningTypes.PIT) {
        const valorTotalCarbono = VPLCarbon * pitHectare * 12
        return valorTotalCarbono
      } else if (
        typemining === typeMiningTypes.ALLUVION &&
        analysisUnit === analysisUnitTypes.AMOUNT_GOLD
      ) {
        const valorTotalCarbono = VPLCarbon * hectare * 12
        return valorTotalCarbono
      } else if (
        typemining === typeMiningTypes.ALLUVION &&
        analysisUnit === analysisUnitTypes.IMPACTED_AREA
      ) {
        const valorTotalCarbono = VPLCarbon * hectare
        return valorTotalCarbono
      } else if (
        typemining === typeMiningTypes.ALLUVION &&
        analysisUnit === analysisUnitTypes.QTD_MACHINES
      ) {
        const valorTotalCarbono = VPLCarbon * hectare
        return valorTotalCarbono
      } else {
        return 0
      }
    },
    [carbon, convertAllinHectare, recoverOfTopSoll]
  )

  const culturedAndSpeciesCalculator = useCallback(
    ({ dataCalculator }: DataCalculatorProps) => {
      const typemining = Number(dataCalculator.typeMining)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)
      const analysisUnit = Number(dataCalculator.analysisUnit)
      const currentDistrict = getDistrictData(Number(dataCalculator.district))
      const { hectare } = convertAllinHectare({ dataCalculator })
      const pitHectare = recoverOfTopSoll ? recoverOfTopSoll.hectare : 0

      const densidadePop2010 = currentDistrict?.densidadePop2010
      const perCapitaPIBPaisUSD = general ? general.GDPperCapitaBrazilUSD : 0
      const temperaturaEmCelcius = general ? general.celciusTemperature : 0
      const especiesPorMunicipio = currentDistrict.Especies_por_Municipio

      const calc1 = 0.643 * Math.log(densidadePop2010)
      const calc2 = 1.655 * Math.log(perCapitaPIBPaisUSD)
      const calc3 = 0.234 * temperaturaEmCelcius
      const calc4 = 2.145 * Math.log(especiesPorMunicipio)
      const calc5 = calc1 + calc2 - calc3 + calc4
      const calc6 = calc5 - 20.85
      const speciesCostPerHaUSD = Math.exp(calc6)
      //const speciesCostPerHaBRL = speciesCostPerHaUSD * exchangeTax;

      const amounts = calcMontante(speciesCostPerHaUSD)
      const VPLHectareCulturedAndSpecies = vpl(
        bioprospecting?.discountRate,
        amounts
      )

      if (typemining === typeMiningTypes.FERRY) {
        return 0
      } else if (typemining === typeMiningTypes.PIT) {
        return VPLHectareCulturedAndSpecies * pitHectare * 12
      } else if (
        typemining === typeMiningTypes.ALLUVION &&
        analysisUnit === analysisUnitTypes.AMOUNT_GOLD
      ) {
        return VPLHectareCulturedAndSpecies * hectare * 12
      } else if (
        typemining === typeMiningTypes.ALLUVION &&
        analysisUnit === analysisUnitTypes.IMPACTED_AREA
      ) {
        return VPLHectareCulturedAndSpecies * hectare
      } else if (
        typemining === typeMiningTypes.ALLUVION &&
        analysisUnit === analysisUnitTypes.QTD_MACHINES
      ) {
        return VPLHectareCulturedAndSpecies * hectare
      } else {
        return 0
      }
    },
    [
      general,
      bioprospecting,
      getDistrictData,
      convertAllinHectare,
      recoverOfTopSoll
    ]
  )

  const recoveryOfTopsoilCalculator = useCallback(
    ({ dataCalculator }: DataCalculatoProps) => {
      const txPrevalence = Number(dataCalculator.valueHypothesis)
      const typemining = Number(dataCalculator.typeMining)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)
      const analysisUnit = Number(dataCalculator.analysisUnit)

      const currentDistrict = getDistrictData(Number(dataCalculator.district))

      const gold =
        analysisUnit === analysisUnitTypes.IMPACTED_AREA
          ? hectareToGold({ dataCalculator })
          : analysisUnit === analysisUnitTypes.QTD_MACHINES
            ? numberOfMachinesToGold({ dataCalculator })
            : qtdAnalysis
      const valueHeCtare =
        analysisUnit === analysisUnitTypes.AMOUNT_GOLD
          ? goldToHecatere({ dataCalculator })
          : analysisUnit === analysisUnitTypes.QTD_MACHINES
            ? numberOfMachinesToHecare({ dataCalculator })
            : qtdAnalysis
      const goldeGramPerHa = goldToHectarePorHe(valueHeCtare, gold)

      const soilSurfaceRecPerHa_conservative = recoverOfTopSoll
        ? recoverOfTopSoll.soilSurfaceRecPerHa_conservative
        : 0
      const soilSurfaceRecPerHa = recoverOfTopSoll
        ? recoverOfTopSoll.soilSurfaceRecPerHa
        : 0
      const pitHectare = recoverOfTopSoll ? recoverOfTopSoll.hectare : 0
      const superficialMudasPerHa = recoverOfTopSoll
        ? recoverOfTopSoll.superficialSeedlingsPerHa
        : 0
      const capacidadeDoCaminhaodeCargaNumerodeMudas = recoverOfTopSoll
        ? recoverOfTopSoll.capacityLoadTruckNumberOfSeedlings
        : 0
      const transportCostChangesPerKm = recoverOfTopSoll
        ? recoverOfTopSoll.transportCostChangesPerKm
        : 0
      const distanciaGarimpoCentro = currentDistrict.Distancia_Garimpo_Centro
      const kmRodadoPorLitro = general ? general.kmRotatedPerLiter : 0
      const precoLitroDieselUSD = general ? general.priceLiterDieselUSD : 0
      const precoMotoristaPorKMRodadoUSD = general
        ? general.averageDriverSalaryFreightPerKmUSD
        : 0

      const soilSurfaceRecPerHaValue =
        txPrevalence === valueHypothesisTypes.CONSERVATIVE
          ? soilSurfaceRecPerHa_conservative
          : soilSurfaceRecPerHa

      let hectareValue
      if (typemining === typeMiningTypes.PIT) {
        hectareValue = pitHectare
      } else {
        hectareValue = goldeGramPerHa * gold
      }

      const numberOfPathsSuperficialSeddlindRecovery =
        (hectareValue * superficialMudasPerHa) /
          capacidadeDoCaminhaodeCargaNumerodeMudas <
        0.9999999999999
          ? 1
          : Math.ceil(
              (hectareValue * superficialMudasPerHa) /
                capacidadeDoCaminhaodeCargaNumerodeMudas
            )
      const totalSurfaceFreightCostChances =
        distanciaGarimpoCentro * transportCostChangesPerKm
      const quantityOfLitersConsumedDieselSurfaceRecovery =
        distanciaGarimpoCentro / kmRodadoPorLitro
      const fuelCostFreightSurfaceRecovery =
        precoLitroDieselUSD * quantityOfLitersConsumedDieselSurfaceRecovery
      const costFreightWithDriverSurfaceRecovery =
        precoMotoristaPorKMRodadoUSD * distanciaGarimpoCentro
      const toSurfaceFreightCostOneWay =
        costFreightWithDriverSurfaceRecovery +
        fuelCostFreightSurfaceRecovery +
        totalSurfaceFreightCostChances
      const toSurfaceFreightCostRoundTrip = toSurfaceFreightCostOneWay * 2
      const toCostFreightFinalSurfaceRecovery =
        toSurfaceFreightCostRoundTrip * numberOfPathsSuperficialSeddlindRecovery

      if (
        typemining === typeMiningTypes.ALLUVION &&
        (analysisUnit === analysisUnitTypes.IMPACTED_AREA || analysisUnit === analysisUnitTypes.QTD_MACHINES)
      ) {
        const surfaceSoilRecoveryWithoutFreight =
          soilSurfaceRecPerHaValue * hectareValue
        const toSurfaceRecoveryCostWithFreight =
          toCostFreightFinalSurfaceRecovery + surfaceSoilRecoveryWithoutFreight
        return toSurfaceRecoveryCostWithFreight
      } else if (typemining === typeMiningTypes.FERRY) {
        const toSurfaceRecoveryCostWithFreight = 0
        return toSurfaceRecoveryCostWithFreight
      } else {
        const surfaceSoilRecoveryWithoutFreight =
          soilSurfaceRecPerHaValue * hectareValue * 12
        const toSurfaceRecoveryCostWithFreight =
          toCostFreightFinalSurfaceRecovery + surfaceSoilRecoveryWithoutFreight
        return toSurfaceRecoveryCostWithFreight
      }
    },
    [
      general,
      getDistrictData,
      goldToHecatere,
      goldToHectarePorHe,
      hectareToGold,
      recoverOfTopSoll
    ]
  )

  const recreationCalculator = useCallback(
    ({ dataCalculator }: DataCalculatoProps) => {
      //console.log('recreation', GDPperCapitaBrazilUSD, celciusTemperature)

      //const GDPperCapitaBrazilUSD = 8717.18;
      //const celciusTemperature = 26.8;
      const discountRate = 0.03

      const typemining = Number(dataCalculator.typeMining)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)
      const analysisUnit = Number(dataCalculator.analysisUnit)
      const { hectare } = convertAllinHectare({ dataCalculator })
      const pitHectare = recoverOfTopSoll ? recoverOfTopSoll.hectare : 0

      const currentDistrict = getDistrictData(Number(dataCalculator.district))

      const densidadePop2010 = currentDistrict?.densidadePop2010
      const perCapitaPIBPaisUSD = general ? general.GDPperCapitaBrazilUSD : 0
      const temperaturaEmCelcius = general ? general.celciusTemperature : 0
      const especiesPorMunicipio = currentDistrict.Especies_por_Municipio

      const calculation1 = 0.562 * Math.log(densidadePop2010)
      const calculation2 = 0.566 * Math.log(perCapitaPIBPaisUSD)
      const calculation3 = 0.0178 * temperaturaEmCelcius
      const calculation4 = 1.133 * Math.log(especiesPorMunicipio)
      const calculation5 =
        calculation1 + calculation2 + calculation3 + calculation4
      const calculation6 = calculation5 - 8.375
      const recreationCostPerHaUSD = Math.exp(calculation6)
      //const recreationCostPerHaBRL = recreationCostPerHaUSD * exchangeTax;

      const amounts = calcMontante(recreationCostPerHaUSD)

      const VPLHaRecreation = vpl(discountRate, amounts)

      if (typemining === typeMiningTypes.FERRY) {
        return 0
      } else if (typemining === typeMiningTypes.PIT) {
        return VPLHaRecreation * pitHectare * 12
      } else if (
        typemining === typeMiningTypes.ALLUVION &&
        analysisUnit === analysisUnitTypes.AMOUNT_GOLD
      ) {
        return VPLHaRecreation * hectare * 12
      } else if (
        typemining === typeMiningTypes.ALLUVION &&
        (analysisUnit === analysisUnitTypes.IMPACTED_AREA || analysisUnit === analysisUnitTypes.QTD_MACHINES)
      ) {
        return VPLHaRecreation * hectare
      } else {
        return 0
      }
    },
    [convertAllinHectare, recoverOfTopSoll, getDistrictData, general]
  )

  const woodAndNonWoodProductsCalculator = useCallback(
    ({ dataCalculator }: DataCalculatoProps) => {
      //console.log('woodAndNonWoodProducts', costPMNMPerHaYearUSD, discountRate)

      //const costPMNMPerHaYearBRl = 764.00
      //const discountRate = 0.03;

      const typemining = Number(dataCalculator.typeMining)
      const qtdAnalysis = Number(dataCalculator.qtdAnalysis)
      const analysisUnit = Number(dataCalculator.analysisUnit)
      const { hectare } = convertAllinHectare({ dataCalculator })
      const pitHectare = recoverOfTopSoll ? recoverOfTopSoll.hectare : 0

      const custoHaProdutosMadeireirosENaoMadeirosUSD = woodAndNonWoodProducts
        ? woodAndNonWoodProducts.costPMNMPerHaYearUSD
        : 0
      const taxaDisconto = woodAndNonWoodProducts
        ? woodAndNonWoodProducts.discountRate
        : 0

      const amounts = calcMontante(custoHaProdutosMadeireirosENaoMadeirosUSD)
      const VPLwoodAndNonWoodProducts = vpl(taxaDisconto, amounts)

      if (typemining === typeMiningTypes.FERRY) {
        return 0
      } else if (typemining === typeMiningTypes.PIT) {
        return VPLwoodAndNonWoodProducts * pitHectare * 12
      } else if (
        typemining === typeMiningTypes.ALLUVION &&
        analysisUnit === analysisUnitTypes.AMOUNT_GOLD
      ) {
        return VPLwoodAndNonWoodProducts * hectare * 12
      } else if (
        typemining === typeMiningTypes.ALLUVION &&
        (analysisUnit === analysisUnitTypes.IMPACTED_AREA || analysisUnit === analysisUnitTypes.QTD_MACHINES)
      ) {
        return VPLwoodAndNonWoodProducts * hectare
      } else {
        return 0
      }
    },
    [woodAndNonWoodProducts, convertAllinHectare, recoverOfTopSoll]
  )

  return {
    bioprospectingCalculator,
    carbonCalculator,
    culturedAndSpeciesCalculator,
    recoveryOfTopsoilCalculator,
    recreationCalculator,
    woodAndNonWoodProductsCalculator
  }
}
