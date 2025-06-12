import { breakpoints } from '@/styles/global'
import styled from 'styled-components'

interface TabHeaderItemProps {
  active?: boolean
}

export const Container = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-areas:
    'headline headline'
    'button_pdf button_pdf'
    'resume_graphic resume_graphic'
    'values values'
    'charts-preview charts-preview'
    'impacts_text_valuation impacts_text_valuation'
    'tab tab';
  column-gap: 50px;
  row-gap: 30px;
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: repeat(5, 1fr);
    grid-template-areas:
      'headline headline headline . button_pdf'
      'impacts_text_resume impacts_text_resume impacts_text_resume . .'
      'values values resume_graphic resume_graphic resume_graphic'
      'charts-preview charts-preview charts-preview charts-preview charts-preview'
      'impacts_text_valuation impacts_text_valuation impacts_text_valuation . .'
      'tab tab tab tab tab';
  }
`

export const ResultsHeadline = styled.div`
  grid-area: headline;
  display: flex;
  justify-content: start;
  @media (min-width: ${breakpoints.md}) {
    display: inline-block;
  }
`

export const ButtonPDF = styled.div`
  grid-area: button_pdf;
  padding: 0 24px;
  button {
    display: flex;
    gap: 16px;
    justify-content: center;
    align-items: center;
  }
  @media (min-width: ${breakpoints.lg}) {
    display: block;
  }
`

export const ImpactTextValuation = styled.div`
  grid-area: impacts_text_valuation;
  margin-bottom: 1rem;
  @media(min-width: ${breakpoints.lg}) {
    margin-top: 2rem;
    margin-bottom: 2.5rem;
  }
`

export const ImpactText = styled.div`
  grid-area: impacts_text_resume;
`

export const ValuesWrapper = styled.div`
  grid-area: values;
`

export const GraphicResume = styled.div`
  grid-area: resume_graphic;
  margin-top: 30px;
`

export const TapWrapper = styled.div`
  grid-area: tab;
`

export const TabHeader = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  @media (min-width: ${breakpoints.md}) {
    gap: 25px;
  }
  @media (min-width: ${breakpoints.lg}) {
    gap: 70px;
  }
`

export const TabHeaderItem = styled.div<TabHeaderItemProps>`
  width: ${({ active }) => (active ? '35%' : '30%')};
  height: ${({ active }) => (active ? '70px' : '35px')};
  background: #ffffff;
  box-shadow: -1px -20px 40px rgb(0 0 0 / 10%);
  padding: 20px 10px;
  align-self: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-self: flex-end;
  align-items: center;
  > p {
    font-size: 10px;
    text-transform: uppercase;
    margin-bottom: 0;
  }
  @media (min-width: ${breakpoints.md}) {
    padding: 32px 16px;
    > p {
      font-size: 16px;
      text-transform: initial;
    }
  }
  @media (min-width: ${breakpoints.lg}) {
    width: ${({ active }) => (active ? '35%' : '30%')};
    height: ${({ active }) => (active ? '150px' : '100px')};
    > p {
      font-size: 24px;
    }
  }
`

export const TabContent = styled.div`
  padding: 30px;
  background: #fff;
  box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.1);
  border-radius: 0px 0px 15px 15px;
  @media (min-width: ${breakpoints.lg}) {
    padding: 80px;
  }
`

export const TabContentITem = styled.div<TabHeaderItemProps>`
  display: ${({ active }) => (active ? 'grid' : 'none')};
  grid-template-columns: minmax(100%, 1fr);
  grid-template-areas:
    'content'
    'graphic'
    'infographic'
    'table';
  row-gap: 100px;
  align-items: center;
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: repeat(6, 1fr);
    grid-template-areas:
      'content content graphic graphic graphic graphic'
      'infographic infographic infographic infographic infographic infographic'
      'table table table table table table';
  }
`
export const TabContentItemText = styled.div`
  grid-area: content;
`

export const WrapperGraphic = styled.div`
  grid-area: graphic;
  height: 420px;
  display: flex;
  align-items: center;
`

export const Infographic = styled.img`
  max-width: 100%;
  width: 100%;
`

export const TableWrapper = styled.div`
  grid-area: table;
  padding: 0 0 50px;
  margin-top: -2rem;
  @media(min-width: ${breakpoints.lg}){
    margin-top: 0;
    padding: 50px 0;
  }
`

export const TableResponsive = styled.div`
  overflow-x: auto;
  margin-top: 30px;
  display: flex;
  justify-content: flex-start;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid black;
`

export const Th = styled.th`
  padding: 15px;
  text-align: left;
  border: 1px solid black;
  border-collapse: collapse;
  @media (min-width: ${breakpoints.lg}) {
    padding: 20px;
  }
`

export const Td = styled.td`
  padding: 10px;
  font-size: 16px;
  text-align: left;
  border: 1px solid black;
  border-collapse: collapse;
  @media (min-width: ${breakpoints.lg}) {
    font-size: 20px;
    padding: 20px;
  }
`

export const WrapperInfografic = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  grid-area: infographic;
  margin-top: 2rem;
  @media (min-width: ${breakpoints.lg}) {
    width: 70%;
    margin-top: 0;
  }
`

export const LoadingWrapper = styled.div`
  width: 500px;
  padding: 30px;
  border-radius: 8px;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  z-index: 9999;
  left: 50%;
  margin-left: -250px;
  top: 30%;
  background-color: #fff;
  overflow: hidden;
`

export const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.7);
  top: 0;
  left: 0;
  transition: all 0.3s;
`
