import { breakpoints } from '@/styles/global'
import styled from 'styled-components'

interface SafeAreaProps {
  height?: string;
  isHero?: boolean;
}

export const SafeArea = styled.div<SafeAreaProps>`
  width: 100%;
  min-height: ${({ height }) => (height ? height : '100vh')};
  background: url('/assets/images/background.webp') no-repeat center top;
  background-size: cover;
  display: flex; // Add this
  flex-direction: column; // Add this


    > div {
      margin-top: ${({ height }) => (height ? '0' : '80px')};
    }
`

export const HeroContent = styled.div`
  padding: 0 24px;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-block: auto;

  @media(min-width: ${breakpoints.md}) {
    > div {
      transform: translateY(-50%);
    }
  }
`