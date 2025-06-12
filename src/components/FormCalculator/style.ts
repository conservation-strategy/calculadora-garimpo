import { Button } from '@/styles/global'
import styled from 'styled-components'

export const FormControl = styled.div`
  width: 100%;
  > label {
    font-weight: 600;
    font-size: 13px;
  }
  @media(min-width: 1440px) {
    > label {
      font-size: 14px
  }
  @media(min-width: 1600px) {
    > label {
      font-size: 15px
  }  
  }
`

export const FormControlCountry = styled(FormControl)`
  grid-area: country;
`

export const FormControlKnowRegion = styled(FormControl)`
  grid-area: knowRegion;
`
export const FormControlProtectedArea = styled(FormControl)`
  grid-area: isProtectedArea;
`
export const FormControlState = styled(FormControl)`
  grid-area: state;
`
export const FormControlCity = styled(FormControl)`
  grid-area: city;
`

export const FormControlTypeMining = styled(FormControl)`
  grid-area: typeMIning;
`

export const FormControlRetort = styled(FormControl)`
  grid-area: retort;
`

export const FormControlUnitAnalysis = styled(FormControl)`
  grid-area: unitAnalysis;
`

export const FormControlHectare = styled(FormControl)`
  grid-area: hectare;
`

export const FormControlPitDepthOrMotorPower = styled(FormControl)`
  grid-area: pitDepth;
`

export const FormControlValueHypothesis = styled(FormControl)`
  grid-area: valueHypothesis;
`

export const FormControlKnowMachineCapacity = styled(FormControl)`
grid-area: knowMachineCapacity;
align-self: end
`
export const FormControlMachineCapacity = styled(FormControl)`
grid-area: machineCapacity;
align-self: end
`

export const FormControlInflation = styled(FormControl)`
  grid-area: inflation;
`

export const FormControlUsesTypes = styled(FormControl)`
  grid-area: useTypes;
`

export const ButtonSubmit = styled(Button)`
  grid-area: submit;
  margin-top: 4px;

  @media(min-width: 1440px) {
    margin-top: 8px
  }

  @media(min-width: 1680px) {
    margin-top: 14px
  }
`

export const MessageError = styled.span`
  font-size: 12px;
  color: red;
  font-weight: bold;
`
