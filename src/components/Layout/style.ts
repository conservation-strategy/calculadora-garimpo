import { breakpoints } from '@/styles/global'
import styled from 'styled-components'

interface SafeAreaProps {
  height?: string
}

export const SafeArea = styled.div<SafeAreaProps>`
  width: 100%;
  min-height: ${({ height }) => (height ? height : '70vh')};
  background: url('/assets/images/background.webp') no-repeat center top;
  background-size: cover;

  @media (min-width: ${breakpoints.md}) {
    > div {
      margin-top: ${({ height }) => (height ? '0' : '80px')};
    }
  }
`
