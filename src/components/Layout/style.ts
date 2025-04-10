import { breakpoints } from '@/styles/global'
import styled from 'styled-components'

interface SafeAreaProps {
  height?: string;
  isHome?: boolean;
}

export const SafeArea = styled.div<SafeAreaProps>`
  position: relative;
  z-index: 0;
  width: 100%;
  min-height: ${({ height }) => (height ? height : 'calc(100vh - 77px)')};
  background: ${({ isHome }) => (isHome ? "url('/assets/images/backgrounds/hero_4.jpg') no-repeat center top" : "url('/assets/images/backgrounds/page_header_2.jpg') no-repeat center bottom")};
  background-size: cover;
  display: flex;
  flex-direction: column; 
`

export const HeroContent = styled.div`
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