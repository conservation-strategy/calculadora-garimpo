import styled from 'styled-components'
import { Card } from '@/components/pages/Home/style'
import { breakpoints } from '@/styles/global'

export const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 30px;
  @media (min-width: ${breakpoints.md}) {
    flex-direction: row;
  }
`

export const CardPartner = styled(Card)`
  height: 150px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  h2 {
    margin-bottom: 0;
  }
`
