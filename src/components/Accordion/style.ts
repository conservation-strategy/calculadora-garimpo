import { breakpoints } from '@/styles/global'
import styled from 'styled-components'

export const AccordionHeader = styled.div<{ showBorderBottom: boolean }>`
  width: 100%;
  height: 7.1875em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-bottom: ${({ showBorderBottom }) => (showBorderBottom ? '1px solid rgba(0, 0, 0, 0.3)' : 'none')};
  padding: 0;
`

export const AccordionTitle = styled.h3`
  font-size: 1.125em;
  line-height: 2.8125em;
  font-weight: 500;
  color: #000;
  @media (min-width: ${breakpoints.md}) {
    font-size: 1.5625em;
  }
`

export const AccordionIcon = styled.span`
  font-size: 1.5em;
`

export const AccordionBody = styled.div`
  max-height: 34.6875em;
  padding: 1.875em 1em;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 1.25em;
    background-color: #d9d9d9;
    border-radius: 8px;
  }

  ::-webkit-scrollbar-track {
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: #a0a0a0;
    border-radius: 8px;
  }
  @media (min-width: ${breakpoints.lg}) {
    padding: 1.875em 3.125em;
  }
`
