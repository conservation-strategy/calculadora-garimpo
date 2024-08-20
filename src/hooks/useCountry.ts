import { useCallback, useEffect, useMemo, useState } from 'react'
import useAppContext from './useAppContext'

import cantonsEquador from '@/mocks/cantonsEquador.json'
import departamentosColombia from '@/mocks/departamentosColombia.json'
import departamentosGuiana from '@/mocks/departamentosGuiana.json'
import departamentosSuriname from '@/mocks/departamentosSuriname.json'
import MunicipiosCalculadora from '@/mocks/municipios_calculadora.json'
import MunicipiosReferencia from '@/mocks/municipios_referencia.json'
import provinciasPeru from '@/mocks/provinciasPeru.json'
import stateBrazil from '@/mocks/state.json'

interface useCountryProps {
  initialState?: {
    district?: (value: any) => void
  }
}

export default function useCountry({ initialState }: useCountryProps = {}) {
  const [district, setDistrict] = useState<any[]>([])
  const { state } = useAppContext()
  const { country } = state

  const isBrazil = useMemo(() => country && country.country === 'BR', [country])
  const isPeru = useMemo(() => country && country.country === 'PE', [country])
  const isEquador = useMemo(() => country && country.country === 'EC', [country])
  const isColombia = useMemo(() => country && country.country === 'CO', [country])
  const isGuiana = useMemo(() => country && country.country === 'GU', [country])
  const isSuriname = useMemo(() => country && country.country === 'SU', [country])

  const getDistrictData = useCallback(
    (id: number): any => {
      if (isBrazil) {
        const data = MunicipiosCalculadora.filter(
          (municipio) => municipio.id === id
        )
        return data[0]
      } else if (isPeru) {
        const data = provinciasPeru.filter((provincia) => provincia.id === id)
        return data[0]
      } else if (isEquador) {
        const data = cantonsEquador.filter((canton) => canton.id === id)
        return data[0]
      } else if (isColombia) {
        const data = departamentosColombia.filter(
          (departamento) => departamento.id === id
        )
        return data[0]
      } else if (isGuiana) {
        const data = departamentosGuiana.filter(
          (departamento) => departamento.id === id
        )
        return data[0]
      } else if (isSuriname) {
        const data = departamentosSuriname.filter(
          (departamento) => departamento.id === id
        )
        return data[0]
      } else {
        return {}
      }
    },
    [isBrazil, isPeru, isEquador, isColombia, isGuiana, isSuriname]
  )

  const getDistrictForState = useCallback(
    (uf: number) => {
      const dataDistrict: any[] = []
      if (isPeru) {
        provinciasPeru.forEach((m) => {
          if (Number(m.uf) === uf) {
            dataDistrict.push(m)
          }
        })
      } else if (isEquador) {
        cantonsEquador.forEach((m) => {
          if (Number(m.uf) === uf) {
            dataDistrict.push(m)
          }
        })
      } else {
        console.log('aqui tbm')
        MunicipiosReferencia.forEach((m) => {
          if (m.microrregiao.mesorregiao.UF.id === uf) {
            dataDistrict.push(m)
          }
        })

        MunicipiosCalculadora.forEach((country) => {
          dataDistrict.forEach((District) => {
            if (country.id === District.id) {
              District.popDensity2010 = country.densidadePop2010
              District.popDensity2060 = country.densidadePop2060
              District.urbanPopMunicipality = country.PopUrbMunicipio
              District.ruralPopMunicipality = country.PopRuralMunicipio
              District.distanceanningCenter = country.Distancia_Garimpo_Centro
              District.species = country.Especies_por_Municipio
            }
          })
        })
      }

      setDistrict(dataDistrict)
    },
    [isPeru, isEquador]
  )

  const getDistrict = useCallback(
    (mock: any[]) => {
      if (isBrazil) {
        MunicipiosCalculadora.forEach((country) => {
          mock.forEach((District) => {
            if (country.id === District.id) {
              District.popDensity2010 = country.densidadePop2010
              District.popDensity2060 = country.densidadePop2060
              District.urbanPopMunicipality = country.PopUrbMunicipio
              District.ruralPopMunicipality = country.PopRuralMunicipio
              District.distanceanningCenter = country.Distancia_Garimpo_Centro
              District.species = country.Especies_por_Municipio
            }
          })
        })
      } else {
        mock.forEach((District) => {
          District.popDensity2010 = District.densidadePop2010
          District.popDensity2060 = District.densidadePop2060
          District.urbanPopMunicipality = District.PopUrbMunicipio
          District.ruralPopMunicipality = District.PopRuralMunicipio
          District.distanceanningCenter = District.Distancia_Garimpo_Centro
          District.species = District.Especies_por_Municipio
        })
      }
      return mock
    },
    [isBrazil]
  )

  useEffect(() => {
    if (isBrazil) {
      const dataDistrict: any[] = []
      MunicipiosReferencia.forEach((m) => {
        if (m.microrregiao.mesorregiao.UF.id === Number(stateBrazil[0].id)) {
          dataDistrict.push(m)
        }
      })

      const districttsFilter = getDistrict(dataDistrict)
      setDistrict(districttsFilter)
      if (initialState && initialState.district) {
        initialState.district(districttsFilter[0])
      }
    } else if (isPeru) {
      const dataDistrict: any[] = []
      provinciasPeru.forEach((m) => {
        if (m.uf === '001') {
          dataDistrict.push(m)
        }
      })
      const districttsFilter = getDistrict(dataDistrict)
      setDistrict(districttsFilter)
      if (initialState && initialState.district) {
        initialState.district(districttsFilter[0])
      }
    } else if (isEquador) {
      const dataDistrict: any[] = []
      cantonsEquador.forEach((m) => {
        if (m.uf === '0001') {
          dataDistrict.push(m)
        }
      })
      const districttsFilter = getDistrict(dataDistrict)
      setDistrict(districttsFilter)
      if (initialState && initialState.district) {
        initialState.district(districttsFilter[0])
      }
    } else if (isColombia) {
      const districttsFilter = getDistrict(departamentosColombia)
      setDistrict(districttsFilter)
      if (initialState && initialState.district) {
        initialState.district(districttsFilter[0])
      }
    } else if (isGuiana) {
      const districttsFilter = getDistrict(departamentosGuiana)
      setDistrict(districttsFilter)
      if (initialState && initialState.district) {
        initialState.district(districttsFilter[0])
      }
    } else if (isSuriname) {
      const districttsFilter = getDistrict(departamentosSuriname)
      setDistrict(districttsFilter)
      if (initialState && initialState.district) {
        initialState.district(districttsFilter[0])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBrazil, isPeru, isEquador, isColombia, isGuiana, isSuriname])

  const getValueToCountry = useCallback(
    (total: number, dolarReal: number) => {
      const value = isBrazil ? total * dolarReal : total
      return value
    },
    [isBrazil]
  )

  return {
    currentCountry: country,
    isBrazil,
    isPeru,
    isEquador,
    isColombia,
    isGuiana,
    isSuriname,
    district,
    getDistrictForState,
    getDistrictData,
    getValueToCountry
  }
}
