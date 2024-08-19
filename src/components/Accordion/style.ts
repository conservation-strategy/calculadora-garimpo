import { breakpoints } from '@/styles/global'
import styled from 'styled-components'

export const AccordionHeader = styled.div`
  width: 100%;
  height: 115px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  padding: 0;
`

export const AccordionTitle = styled.h3`
  font-size: 18px;
  line-height: 45px;
  font-weight: 500;
  color: #000;
  @media (min-width: ${breakpoints.md}) {
    font-size: 25px;
  }
`

export const AccordionIcon = styled.span`
  font-size: 24px;
`

export const AccordionBody = styled.div`
  max-height: 555px;
  padding: 30px 16px;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 20px;
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
    padding: 30px 50px;
  }
`
