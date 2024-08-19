import { breakpoints } from '@/styles/global'
import styled from 'styled-components'

export const ListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
`

export const WrapperNews = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 70px;

  @media (min-width: ${breakpoints.lg}) {
    width: 400px;
  }
`
