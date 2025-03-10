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
  gap: 70px;
  margin-bottom: 50px;
  align-items: flex-start;
  @media (max-width: ${breakpoints.md}) {
    form {
      margin-top: 20px;
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
  padding: 50px 32px 0 32px;
  background: #ffffff;
  box-shadow: 0px 0px 41.8133px rgba(0, 0, 0, 0.15);
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
  padding: 30px;
  background: #ffffff;
  box-shadow: 0px 0px 41.8133px rgba(0, 0, 0, 0.15);
  margin-top: -150px;
  border-radius: 20px 20px 0px 0px;
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
    padding: 50px;
    grid-template-columns: repeat(4, 1fr);
    grid-template-areas:
      'country country country country'
      'knowRegion knowRegion knowRegion knowRegion'
      'state state city city'
      'typeMIning typeMIning retort retort'
      'unitAnalysis unitAnalysis unitAnalysis unitAnalysis'
      'hectare hectare pitDepth pitDepth'
      'machineCapacity machineCapacity machineCapacity machineCapacity'
      'valueHypothesis valueHypothesis valueHypothesis valueHypothesis'
      'inflation inflation inflation inflation'
      'useTypes useTypes useTypes useTypes'
      'submit submit submit submit';
  }
`
