import * as S from './style'
import * as SG from '@/styles/global'
import { CountryProps } from '@/store/proveider'
import useAppContext from '@/hooks/useAppContext'
import { FormEvent, useCallback, useEffect, useState } from 'react'
import { event as gaEvent } from "nextjs-google-analytics";

export const CountryList: CountryProps[] = [
  {
    country: 'BR',
    label: 'Brasil'
  },
  {
    country: 'EC',
    label: 'Ecuador'
  },
  {
    country: 'PE',
    label: 'Perú'
  },
  {
    country: 'CO',
    label: 'Colombia'
  },
  {
    country: 'GU',
    label: 'Guiana'
  },
  {
    country: 'SU',
    label: 'Suriname'
  },
  {
    country: 'BO',
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
      category: "Form",
      label: event.currentTarget.value,
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
