import { dispatchTypes } from '@/enums'
import { findLanguage, initialStateType, INITIAL_STATE } from '.'
import {
  CountryTypes,
  dataCalculatorTypes,
  languageTypes,
  resultsType
} from './proveider'

interface actionType {
  [dispatchTypes.changeCountry]: CountryTypes
  [dispatchTypes.changeLanguage]: languageTypes
  [dispatchTypes.changeCalculator]: dataCalculatorTypes
  [dispatchTypes.changeResults]: resultsType
}

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key
      }
    : {
        type: Key
        payload: M[Key]
      }
}

type Actions = ActionMap<actionType>[keyof ActionMap<actionType>]

export const AppContextReducer = (
  state = INITIAL_STATE,
  action: Actions
): initialStateType => {
  switch (action.type) {
    case dispatchTypes.changeLanguage:
      sessionStorage.setItem('language', action.payload)
      return { ...state, language: findLanguage(action.payload) }
    case dispatchTypes.changeCountry:
      sessionStorage.setItem('country', JSON.stringify(action.payload))
      return { ...state, country: action.payload }
    case dispatchTypes.changeCalculator:
      sessionStorage.setItem('dataCalculator', JSON.stringify(action.payload))
      return { ...state, dataCalculator: action.payload }
    case dispatchTypes.changeResults:
      sessionStorage.setItem('results', JSON.stringify(action.payload))
      return { ...state, results: action.payload }
    default:
      return state
  }
}
