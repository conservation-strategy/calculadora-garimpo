import { breakpoints, Input, Select } from '@/styles/global'
import styled, { css } from 'styled-components'

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
  padding: 0 0 0 1.875em;
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
  padding: 2.5em 2em 0 2em;
  background: #ffffff;
  box-shadow: 0px 0px 41.8133px rgba(0, 0, 0, 0.15);

  display: none;
  @media (min-width: ${breakpoints.md}) {
    
  }

  @media (min-width: ${breakpoints.lg}) {
    display: block;
    max-width: 90%;
  }
`
interface DropdownProps {
  isOpen: boolean;
}
export const MobileGuide = styled.div`
  max-width: 100%;
  padding: 1em 2em 0 2em;
  background: #ffffff;
  box-shadow: 0px 0px 41.8133px rgba(0, 0, 0, 0.15);
  border-radius: 12px;

  @media (min-width: ${breakpoints.lg}) {
    display: none;
  }
`
export const DropdownButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const DropdownContent = styled.div<DropdownProps>`
  overflow: hidden;
  transition: all 500ms ease-out;
  max-height: ${({ isOpen }) => (isOpen ? '1000px' : '0')};
`

export const Box = styled.div`
  background: #ffffff;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.15);
  border-radius: 15px;
  padding: 24px 40px;
  margin-bottom: 50px;
`

interface FormProps {
  knowRegion: boolean
  hasUF: boolean;
  isProtectedAreaVisible?: boolean;
}

export const Form = styled.form<FormProps>`
  padding: 24px;
  background: #ffffff;
  box-shadow: 0px 0px 41.8133px rgba(0, 0, 0, 0.15);
  margin-top: 24px;
  border-radius: 20px;
  display: grid;
  gap: 10px;
  align-items: flex-end;
  grid-template-columns: repeat(1, 1fr);
   grid-template-areas:
    'country'
    ${({ isProtectedAreaVisible }) => isProtectedAreaVisible 
      ? `
        'knowRegion'
        'isProtectedArea'
      ` 
      : `
        'knowRegion'
      `
    }
    ${({ knowRegion, hasUF }) => knowRegion
      ? hasUF
        ? `
          'state'
          'city'
          'typeMIning'        
        `
        : `
          'city'
          'typeMIning'          
        `
      : `
        'typeMIning'
      `        
    }
    'retort'
    'unitAnalysis'
    'hectare'
    'pitDepth'
    'machineCapacity'
    'valueHypothesis'
    'useTypes'
    'submit';

  @media (min-width: ${breakpoints.md}) {
    padding: 20px 24px;
    grid-template-columns: repeat(4, 1fr);
    grid-template-areas:
      'country country country country'
      ${({ isProtectedAreaVisible }) => isProtectedAreaVisible 
        ? `'knowRegion knowRegion isProtectedArea isProtectedArea'` 
        : `'knowRegion knowRegion knowRegion knowRegion'`
      }
      ${({ knowRegion, hasUF }) => knowRegion
        ?  hasUF 
          ? `
            'state state city city'
            'typeMIning typeMIning typeMIning typeMIning'
          ` 
          : `
            'city city city city'
            'typeMIning typeMIning typeMIning typeMIning'
          `
        : `
          'typeMIning typeMIning typeMIning typeMIning'
        `
      }
      'unitAnalysis unitAnalysis retort retort'
      'hectare hectare pitDepth pitDepth'
      'machineCapacity machineCapacity machineCapacity machineCapacity'
      'valueHypothesis valueHypothesis useTypes useTypes'
      'submit submit submit submit';
  }
  @media (min-width: 1440px) {
    padding: 20px 24px;
    grid-template-columns: repeat(4, 1fr);
    grid-template-areas:
      'country country country country'
      ${({ isProtectedAreaVisible }) => isProtectedAreaVisible 
        ? `'knowRegion knowRegion isProtectedArea isProtectedArea'` 
        : `'knowRegion knowRegion knowRegion knowRegion'`
      }
      ${({ knowRegion, hasUF }) => knowRegion
        ?  hasUF 
          ? `
            'state state city city'
            'typeMIning typeMIning typeMIning typeMIning'
          ` 
          : `
            'city city city city'
            'typeMIning typeMIning typeMIning typeMIning'
            `
        : `'typeMIning typeMIning typeMIning typeMIning'`
      }
      'unitAnalysis unitAnalysis retort retort'
      'hectare hectare pitDepth pitDepth'
      'machineCapacity machineCapacity machineCapacity machineCapacity'
      'valueHypothesis valueHypothesis useTypes useTypes'
      'submit submit submit submit';
  }
  @media(min-width: 1680px) {
    padding: 28px 30px;
    grid-template-areas:
      'country country country country'
      ${({ isProtectedAreaVisible }) => isProtectedAreaVisible 
        ? `'knowRegion knowRegion isProtectedArea isProtectedArea '` 
        : `'knowRegion knowRegion knowRegion knowRegion'`
      }
      ${({ knowRegion, hasUF }) => knowRegion
        ?  hasUF 
          ? `
            'state state city city'
            'typeMIning typeMIning typeMIning typeMIning'
          ` 
          : `
            'city city city city'
            'typeMIning typeMIning typeMIning typeMIning'
            `
        : `'typeMIning typeMIning typeMIning typeMIning'`
      }
      'unitAnalysis unitAnalysis retort retort'
      'hectare hectare pitDepth pitDepth'
      'machineCapacity machineCapacity machineCapacity machineCapacity'
      'valueHypothesis valueHypothesis valueHypothesis valueHypothesis'
      'useTypes useTypes useTypes useTypes'
      'submit submit submit submit';  
  }

  @media (min-width: ${breakpoints.lg}) {
    margin-top: 0;
    transform: translateY(-30px);
  }

  & select {
    margin-top: 4px;
  }
  & input {
    margin-top: 4px;
  }
  @media(min-width: 1600px){
    & select {
      margin-top: 8px;
    }
    & input {
      margin-top: 8px;
    }
  }
`