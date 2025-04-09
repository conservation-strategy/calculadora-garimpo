import { breakpoints, Input, Select } from '@/styles/global'
import styled from 'styled-components'

export const WrapperButton = styled.div`
  width: 450px;
  position: absolute;
  bottom: 370px;
`

export const WrapperCalculator = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: auto;
  margin-bottom: 3.125em;
  padding: 0 1.875em;
  gap: 1.25em;
  justify-content: space-between;
  align-items: flex-start;
  @media (max-width: ${breakpoints.md}) {
    form {
      margin-top: 1.25em;
    }
  }

  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: 60% 40%;
    form {
      margin-bottom: 0;
    }
  }
`

export const Guide = styled.div`
  max-width: 100%;
  padding: 3.125em 2em 0 2em;
  background: #ffffff;
  box-shadow: 0px 0px 41.8133px rgba(0, 0, 0, 0.15);

  @media (min-width: ${breakpoints.lg}) {
    max-width: 90%;
  }
`

export const Box = styled.div`
  background: #ffffff;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.15);
  border-radius: 15px;
  padding: 24px 40px;
  margin-bottom: 50px;
`

export const Form = styled.form`
  min-height: 985px;
  padding: 24px;
  background: #ffffff;
  box-shadow: 0px 0px 41.8133px rgba(0, 0, 0, 0.15);
  margin-top: 48px;
  border-radius: 20px;
  display: grid;
  gap: 16px;
  align-items: flex-start;
  grid-template-columns: repeat(1, 1fr);
  grid-template-areas:
    'country'
    'knowRegion'
    'state'
    'city'
    'typeMIning'
    'retort'
    'unitAnalysis'
    'hectare'
    'pitDepth'
    'machineCapacity'
    'valueHypothesis'
    'inflation'
    'useTypes'
    'submit';
  @media (min-width: ${breakpoints.md}) {
    padding: 35px 30px;
    grid-template-columns: repeat(4, 1fr);
    grid-template-areas:
      'country country country country'
      'knowRegion knowRegion knowRegion knowRegion'
      'state state city city'
      'typeMIning typeMIning typeMIning typeMIning'
      'retort retort retort retort'
      'unitAnalysis unitAnalysis unitAnalysis unitAnalysis'
      'hectare hectare pitDepth pitDepth'
      'machineCapacity machineCapacity machineCapacity machineCapacity'
      'valueHypothesis valueHypothesis valueHypothesis valueHypothesis'
      'inflation inflation inflation inflation'
      'useTypes useTypes useTypes useTypes'
      'submit submit submit submit';
  }
  @media (min-width: ${breakpoints.lg}) {
    margin-top: -120px;
  }
  & select {
    margin-top: 8px;
  }
  & input {
    margin-top: 8px;
  }
`
