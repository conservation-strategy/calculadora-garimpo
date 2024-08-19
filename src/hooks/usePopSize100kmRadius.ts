import { FormInputs } from '@/components/FormCalculator'
import { knowRegionTypes } from '@/enums'
import { useCallback } from 'react'
import useFixedCalculator from './useFixedCalculator'

interface usePopProp {
  dataCalculator: FormInputs
  currentDistrict: any
}

export default function usePopSize100kmRadius() {
  const { general } = useFixedCalculator()

  const getPopSize100kmRadius = useCallback(
    ({ dataCalculator, currentDistrict }: usePopProp) => {
      if (dataCalculator) {
        const densityPopulationalRegionNorth2060 = general
          ? general.densityPopulationalRegionNorth2060
          : 0
        const isRegion = dataCalculator.knowRegion === knowRegionTypes.YES
        const popDensity2060 = isRegion
          ? currentDistrict.densidadePop2060
          : densityPopulationalRegionNorth2060
        //const densityPopulationalRegionNorth2060 = 6.00696;
        const rAoQuadrado = Math.pow(100, 2)

        const result = isRegion
          ? popDensity2060 * (Math.PI * rAoQuadrado)
          : densityPopulationalRegionNorth2060 * (Math.PI * rAoQuadrado)
        return result
      }
      return 0
    },
    [general]
  )

  return {
    getPopSize100kmRadius
  }
}
