import { breakpoints } from '@/styles/global'
import styled from 'styled-components'

// export const WrapperCalculator = styled.div`
//   width: 100%;
//   display: grid;
//   grid-template-columns: auto;
//   margin-bottom: 3.125em;
//   padding: 0 0 0 1.875em;
//   gap: 1.25em;
//   justify-content: space-between;
//   align-items: flex-start;
//   @media (max-width: ${breakpoints.md}) {
//     form {
//       margin-top: 1.25em;
//     }
//   }

//   @media (min-width: ${breakpoints.lg}) {
//     grid-template-columns: 60% 40%;
//     form {
//       margin-bottom: 0;
//     }
//   }
// `

// export const FormGuideContainer = styled.div`
//   position: relative;
//   z-index: 2;
//   width: 100%;
//   display: flex;
//   flex-direction: column;
//   gap: 1.25em;

//   @media(min-width: ${breakpoints.lg}) {
//     flex-direction: row;
//     justify-content: space-between;
//   }
// `
export const GuideContainer = styled.div`
  padding: 24px;
  background: #ffffff;
  box-shadow: 0px 0px 41.8133px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  grid-column: 1 / span 12;
  height: fit-content;
  @media(min-width: ${breakpoints.lg}) {
    grid-column: 1 / span 4;
  }
`

export const FormWrapper = styled.div`
  position relative;
  z-index:2;
  grid-column: 1 / span 12;
  grid-row-start: 3;
  @media(min-width: ${breakpoints.lg}) {
    grid-column: 1 / span 4;
    grid-row-start: 2;
  }
`

export const MapContainer = styled.div`
  position: relative;
  width:100%;
  display: flex;
  flex-direction: column;
  padding: 0 0 0 1.875em;
`

export const MapContainerGrid = styled.div`
  position: relative;
  padding: 50px 0 0 0;
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: repeat(12, [col-start] 1fr);
  gap: 1.25em;
`


export const Map = styled.div`
  grid-column: 1 / span 12;
  grid-row-start: 2;
  position: relative;
  z-index: 1;
  aspect-ratio: 3 / 4;
  background: transparent;

  @media(min-width: ${breakpoints.md}) {
    aspect-ratio: 1;
  }

  @media(min-width: ${breakpoints.lg}) {
      border-radius: 20px;
    background: #ffffff;
    box-shadow: 0px 0px 41.8133px rgba(0, 0, 0, 0.15);
    padding: 2em;
    aspect-ratio: 4 / 3;
    grid-column: 5 / span 8;
    grid-row: 1 / span 3;
  }

`
