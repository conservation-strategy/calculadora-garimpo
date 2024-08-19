import { createContext } from 'react'
import translates from '@/mocks/language.json'
import {
  CountryProps,
  CountryTypes,
  dataCalculatorTypes,
  languageTypes,
  resultsType
} from './proveider'

export const Portuguese = 'pt_BR'
export const Espanhol = 'es_ES'
export const English = 'en_US'

export const findLanguage = (type: languageTypes) => {
  const find = translates.data.filter((language) => language.id === type)
  return find[0]
}

export type LanguageTypeProps = (typeof translates.data)[0]

export type initialStateType = {
  language: LanguageTypeProps
  country: CountryTypes
  dataCalculator: dataCalculatorTypes
  results: resultsType
}

export const INITIAL_STATE: initialStateType = {
  language: findLanguage('pt_BR'),
  country: null,
  dataCalculator: null,
  results: null
}

export const AppContext = createContext({
  state: INITIAL_STATE,
  changeLanguage: (language: languageTypes) => {},
  changeCountry: (country: CountryProps) => {},
  changeDataCalculator: (data: dataCalculatorTypes) => {},
  changeResults: (data: resultsType) => {}
})
