import { breakpoints, colors, bounce } from '@/styles/global'
import styled from 'styled-components'

interface SafeAreaProps {
  height?: string;
  isHome?: boolean;
}

interface BgImageContainerProps {
  isHome?: boolean
}

interface ScrollDownProps {
  isScrolled: boolean;
}

export const SafeArea = styled.div<SafeAreaProps>`
  position: relative;
  z-index: 0;
  width: 100%;
  min-height: ${({ isHome }) => (isHome ? 'calc(100vh - 77px)' : 'none')};
  background: ${colors.neutral_1};
  background-size: cover;
  display: flex;
  flex-direction: column;

  @media(min-width: ${breakpoints.md}) {
    min-height: ${({ isHome }) => (isHome ? 'calc(100vh - 84px)' : 'none')};
  }

  @media(min-width: ${breakpoints.xl}) {
    min-height: ${({ isHome }) => (isHome ? 'calc(100vh - 100px)' : 'none')};
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
`

export const BgImageContainer = styled.div<BgImageContainerProps>`
  position: 'absolute';
  z-index: 0;
  top: ${({ isHome }) => (isHome ? '77px' : '0')};
  left: 0;
  width: 100%;
  height: 100%;
  
  @media(min-width: ${breakpoints.md}) {
    top: ${({ isHome }) => (isHome ? '84px' : '0')};
  }

  @media(min-width: ${breakpoints.xl}) {
    top: ${({ isHome }) => (isHome ? '100px' : '0')};
  }

  @media(min-width: ${breakpoints.lg}) {
    position: ${({ isHome }) => (isHome ? 'fixed' : 'absolute')};
  }
`

export const ScrollDown = styled.div<ScrollDownProps>`
  position: absolute;
  z-index: 5;
  top: 0;
  left: 0;
  right: 0;
  margin-inline: auto;
  height: 100vh;
  height: 100dvh;
  display: flex;
  align-items: end;
  color: #fff;
  transition: opacity 1s ease-in-out;
  opacity: ${({ isScrolled }) => (isScrolled ? 0 : 1)};
  pointer-events: none;
  width: 2.5rem;
  padding: 0 0 77px;

  @media(min-width: ${breakpoints.md}) {
    width: 3rem;
    padding: 0 0 84px;
  }

  @media(min-width: ${breakpoints.lg}) {
    width: 4rem;
    padding: 0 0 100px;
  }

  
`