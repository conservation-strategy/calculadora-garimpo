import { breakpoints } from '@/styles/global'
import styled from 'styled-components'

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

export const MapContainer = styled.div`
  position: relative;
  width:100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 0 0 1.875em;
`

export const Map = styled.div`
  position: relative;
  aspect-ratio: 3 / 4;
  max-width: 100%;
  padding: 2.5em 2em 0 2em;
  background: #ffffff;
  box-shadow: 0px 0px 41.8133px rgba(0, 0, 0, 0.15);

  @media(min-width: ${breakpoints.md}) {
    aspect-ratio: 1;
  }

  @media(min-width: ${breakpoints.lg}) {
    aspect-ratio: 2 / 1;
  }

`
