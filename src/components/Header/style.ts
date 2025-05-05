import { breakpoints, colors } from '@/styles/global'
import styled from 'styled-components';
import { doppioOne } from '@/fonts/fonts';

interface MenuItemProps {
  active?: boolean
}

interface DropDownBoxProps {
  active: boolean;
}

interface ContainerProps {
  isScrolled: boolean;
}

export const Container = styled.header<ContainerProps>`
  width: 100%;
  position: sticky;
  top:0;
  z-index:10;
  opacity: ${({ isScrolled }) => (isScrolled ? 0.95 : 1 )};
  background: ${colors.primary};
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    @media (min-width: ${breakpoints.lg}) {
      justify-content: space-between;
    }
  }
`

export const ButtonBarMenu = styled.button`
  font-size: 24px;
  color: #fff;
  margin-left: auto;
`

// export const Logo = styled.div`
//   width: 142px;
//   cursor: pointer;

//   > img {
//     width: 85px;
//     display: block;
//     margin: 0 auto;
//   }
//   @media (min-width: ${breakpoints.lg}) {
//     > img {
//       display: inline;
//       margin: 0;
//     }
//   }
// `

export const Logo = styled.img`  
  width: 41px;
  height: 41px;

  @media (min-width: ${breakpoints.md}) {
    width: 48px;
    height: 48px;    
  }

  @media (min-width: ${breakpoints.xl}) {
    width: 64px;
    height: 64px;    
  }
`;

export const MenuDesktop = styled.nav`
  display: none;
  gap: 1.5rem;
  color: #fff;
  @media (min-width: ${breakpoints.lg}) {
    display: flex
  }
`

export const Menu = styled.nav<MenuItemProps>`
  position: fixed;
  width: 80%;
  height: 100%;
  right: ${({ active }) => (active ? '0' : '-150%')};
  top: 0;
  background: #000;
  display: flex;
  flex-direction: column;
  z-index: 999;
  gap: 1.75rem;
  padding: 1.5rem 2.5rem;
  transition: right 0.3s;
  @media (min-width: ${breakpoints.lg}) {
    position: initial;
    display: none;
    flex-direction: row;
    justify-content: center;
    background-color: transparent;
    padding: 0;
  }
`

export const MenuMobile = styled.nav<MenuItemProps>`
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding 16px 24px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  transition: opacity 300ms ease-in-out;
  opacity: ${({ active }) => (active ? 1 : 0)};
  pointer-events: ${({ active }) => (active ? 'auto' : 'none')};

  background-color: rgba(228, 210, 210, 0.9);
  backdrop-filter: blur(10px);

  font-size: 22px;
  letter-spacing: .1em;
  
  @media(max-height: 725px) {
    gap: 1.5rem;
  }
`

export const MenuTop = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: end;
`

export const MenuItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`

export const MenuItem = styled.a<MenuItemProps>`
  font-family: ${doppioOne.style.fontFamily}, sans-serif;
  font-size: inherit;
  font-weight: 700;
  letter-spacing: inherit;
  line-height: 150%;
  cursor: pointer;
  text-underline-offset: 8px;
  &:hover {
    text-decoration: underline;
  }
  @media (min-width: ${breakpoints.md}) {
    font-size: 24px;
  }

  @media (min-width: ${breakpoints.lg}) {
    font-size: 16px;
  }
`

export const DropDown = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  color: #fff;
  justify-content: start;
  position: relative;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  @media (min-width: ${breakpoints.lg}) {
    justify-content: flex-end;
    padding: 0;
    border: 0;
  }
  letter-spacing: .025em;
`

export const DropDownMobile = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  color: inherit;
  font-size: 22px;
`

export const DropDownMobileButton = styled.button`
  position: relative;
  -webkit-tap-highlight-color: transparent;
  padding: 0 1.75rem;
  color: inherit;
  font-size: inherit;
  letter-spacing: .1em;
`

export const DropDownText = styled.span`
  font-family: ${doppioOne.style.fontFamily}, sans-serif;
  font-size: inherit;
  font-weight: 700;
  letter-spacing: inherit;
  line-height: 17px;
  color: inherit;
  @media (min-width: ${breakpoints.md}) {
    font-size: 24px;
  }
  @media (min-width: ${breakpoints.lg}) {
    font-size: 14px;
  }
`

export const DropDownBoxMobile = styled.div<DropDownBoxProps>`
  margin-top: -0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7vh;
  width: 100%;
  font-size: 16px;
  transition: opacity 200ms ease-out;
  opacity: ${({ active }) => (active ? 1 : 0)};
  pointer-events: ${({ active }) => (active ? 'auto' : 'none')};
  > div {
   width: 100%;
   text-align: center;
   font-weight: 700;
   padding: .275rem 0;
   opacity: 0.7;
  }
  > div:active {
   opacity: 1;
  }
`

export const DropDownBox = styled.div<DropDownBoxProps>`
  width: 250px;
  background-color: ${({ active }) => (active ? colors.neutral_1 : 'transparent')};
  height: ${({ active }) => (active ? '170px' : 0)};
  overflow: ${({ active }) => (active ? 'auto' : 'hidden')};
  border: 1px solid ${({ active }) => (active ? '#fff' : 'transparent')};
  cursor: ${({ active }) => (active ? 'pointer' : 'auto')};
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none; 
  position: absolute;
  top: 50px;
  right: 0;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  @media (min-width: ${breakpoints.lg}) {
    width: 142px;
  }
`

export const DropdownItem = styled.a`
  cursor: pointer;
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 1rem;
  height: 100%;
  width: 100%;
  gap: 16px;
  color: #000;
  font-size: 18px;
  line-height: 20px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.2)
  }
  @media (min-width: ${breakpoints.lg}) {
    font-size: 16px;
  }
`

export const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.7);
  top: 0;
  left: 0;
  transition: all 0.3s;
`
