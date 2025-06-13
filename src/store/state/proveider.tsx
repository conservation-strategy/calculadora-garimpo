import { FormInputs } from '@/components/FormCalculator'
import { countryCodes, dispatchTypes } from '@/enums'
import { DataImpacts, DataImpactsNoMonetary } from '@/hooks/useCalculator'
import { ReactNode, useCallback, useReducer } from 'react'
import { AppContext, INITIAL_STATE } from '.'
import { AppContextReducer } from './reducer'

interface ProviderProps {
  children: ReactNode
}

export type languageTypes = 'pt_BR' | 'en_US' | 'es_ES' | string

export interface CountryProps {
  country: countryCodes | 'BO'
  label: 'Brasil' | 'Ecuador' | 'Perú' | 'Colombia' | 'Guiana' | 'Suriname' | 'Bolivia'
}


export interface ResultsProps {
  deforestation: DataImpacts[]
  siltingOfRivers: DataImpacts[]
  mercury: DataImpacts[]
  impactsNotMonetary: DataImpactsNoMonetary[]
}

export type CountryTypes = CountryProps | null
export type dataCalculatorTypes = FormInputs | null
export type resultsType = ResultsProps | null

export const AppContextProvider = ({ children }: ProviderProps) => {
  const [state, dispatch] = useReducer(AppContextReducer, INITIAL_STATE)

  const changeLanguage = useCallback(
    (language: languageTypes) => {
      dispatch({
        type: dispatchTypes.changeLanguage,
        payload: language
      })
    },
    [dispatch]
  )

  const changeDataCalculator = useCallback(
    (data: dataCalculatorTypes) => {
      dispatch({
        type: dispatchTypes.changeCalculator,
        payload: data
      })
    },
    [dispatch]
  )

  const changeResults = useCallback(
    (data: resultsType) => {
      dispatch({
        type: dispatchTypes.changeResults,
        payload: data
      })
    },
    [dispatch]
  )

  const changeCountry = useCallback(
    (country: CountryProps) => {
      dispatch({
        type: dispatchTypes.changeCountry,
        payload: country
      })
    },
    [dispatch]
  )

  return (
    <AppContext.Provider
      value={{
        state,
        changeLanguage,
        changeCountry,
        changeDataCalculator,
        changeResults
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
