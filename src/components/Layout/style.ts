import { breakpoints, colors } from '@/styles/global'
import styled from 'styled-components'

interface SafeAreaProps {
  height?: string;
  isHome?: boolean;
}

interface BgImageContainerProps {
  isHome?: boolean
}

export const SafeArea = styled.div<SafeAreaProps>`
  position: relative;
  z-index: 0;
  width: 100%;
  min-height: ${({ height }) => (height ? height : 'calc(100vh - 77px)')};
  background: ${colors.neutral_1};
  background-size: cover;
  display: flex;
  flex-direction: column;

  @media(min-width: ${breakpoints.md}) {
    min-height: ${({ height }) => (height ? height : 'calc(100vh - 100px)')};
  }

  @media(min-width: ${breakpoints.lg}) {
    min-height: ${({ height }) => (height ? height : 'calc(100vh - 104px)')};
  }
`

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  padding: 0 24px;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-inline: auto;
  margin-top: 80px; 
  @media(min-width: ${breakpoints.md}) {
    > div {
      transform: translateY(-30%);
    }
  }
`

export const BgImageContainer = styled.div<BgImageContainerProps>`
  position: ${({ isHome }) => (isHome ? 'fixed' : 'absolute')};
  z-index: 0;
  top: ${({ isHome }) => (isHome ? '77px' : '0')};
  left: 0;
  width: 100%;
  height: 100%;

  @media(min-width: ${breakpoints.md}) {
    top: ${({ isHome }) => (isHome ? '100px' : '0')};
  }

  @media(min-width: ${breakpoints.lg}) {
    top: ${({ isHome }) => (isHome ? '104px' : '0')};
  }
`