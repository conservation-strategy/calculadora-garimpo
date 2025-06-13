import * as S from './style'
import * as SG from '@/styles/global'
import { CountryProps } from '@/store/state/proveider'
import useAppContext from '@/hooks/useAppContext'
import { FormEvent, useCallback, useState } from 'react'
import { event as gaEvent } from "nextjs-google-analytics";
import { countryCodes } from '@/enums'

export const CountryList: CountryProps[] = [
  {
    country: countryCodes.BR,
    label: 'Brasil'
  },
  {
    country: countryCodes.EC,
    label: 'Ecuador'
  },
  {
    country: countryCodes.PE,
    label: 'Perú'
  },
  {
    country: countryCodes.CO,
    label: 'Colombia'
  },
  {
    country: countryCodes.GU,
    label: 'Guiana'
  },
  {
    country: countryCodes.SU,
    label: 'Suriname'
  },
  {
    country: countryCodes.BO,
    label: 'Bolivia'
  }
]

export default function SelectCountry() {
  const [country, setCountry] = useState<CountryProps>(CountryList[0])
  const { changeCountry } = useAppContext()
  const { state } = useAppContext()
  const { language } = state
  const { home } = language
  const { popUpHome } = home

  const handleCountry = useCallback((event: FormEvent<HTMLSelectElement>) => {
    const findCountry = CountryList.filter(
      (country) => country.country === event.currentTarget.value
    )
    setCountry(findCountry[0])
    gaEvent("select_country", {
      country: event.currentTarget.value,
    });
  }, [])

  return (
    <>
      <SG.OverLay />
      <S.Container>
        <S.Modal>
          <S.Headerline>{popUpHome.headline}</S.Headerline>
          <S.Text>{popUpHome.paragraphy_01}</S.Text>
          <SG.Select value={country.country} onChange={handleCountry}>
            {CountryList.map((country) => (
              <option key={country.label} value={country.country}>
                {country.label}
              </option>
            ))}
          </SG.Select>
          <SG.Button onClick={() => changeCountry(country)} variant="primary">
            Continuar
          </SG.Button>
        </S.Modal>
      </S.Container>
    </>
  )
}
