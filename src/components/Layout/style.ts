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
    min-height: ${({ isHome }) => (isHome ? 'calc(100vh - 100px)' : 'none')};
  }

  @media(min-width: ${breakpoints.lg}) {
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
    top: ${({ isHome }) => (isHome ? '100px' : '0')};
  }

  @media(min-width: ${breakpoints.lg}) {
    position: ${({ isHome }) => (isHome ? 'fixed' : 'absolute')};
  }
`

export const ScrollDown = styled.div<ScrollDownProps>`
  position: absolute;
  z-index: 2;
  bottom: 8px;
  left: 0;
  right: 0;
  margin-inline: auto;
  width: 64px;
  height: auto;
  color: #fff;
  transition: opacity 750ms ease-in-out;
  opacity: ${({ isScrolled }) => (isScrolled ? 0 : 1)};

  @media(max-height: 730px) {
    bottom: -8px;
  }
`