import { breakpoints, colors } from '@/styles/global'
import styled, { css } from 'styled-components'

interface MenuItemProps {
  active?: boolean
}

interface DropDownBoxProps {
  active: boolean
}

export const Container = styled.header`
  width: 100%;
  background: ${colors.primary};
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    @media (min-width: ${breakpoints.lg}) {
      padding-top: 20px;
      justify-content: space-between;
    }
  }
`

export const ButtonBarMenu = styled.button`
  font-size: 24px;
  color: #fff;
  margin-left: auto;
`

export const Logo = styled.div`
  width: 142px;
  cursor: pointer;

  > img {
    width: 85px;
    display: block;
    margin: 0 auto;
  }
  @media (min-width: ${breakpoints.lg}) {
    > img {
      display: inline;
      margin: 0;
    }
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
  gap: 40px;
  padding: 40px;
  transition: right 0.3s;
  @media (min-width: ${breakpoints.lg}) {
    position: initial;
    display: flex;
    flex-direction: row;
    justify-content: center;
    background-color: transparent;
    padding: 0;
  }
`

export const MenuTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const MenuItem = styled.a<MenuItemProps>`
  font-size: 18px;
  line-height: 150%;
  color: ${({ active }) => (active ? colors.primary : '#fff')};
  cursor: pointer;
  text-underline-offset: 8px;
  &:hover {
    text-decoration: underline;
  }
  @media (min-width: ${breakpoints.md}) {
    font-size: 24px;
  }

  @media (min-width: ${breakpoints.lg}) {
    font-size: 18px;
  }
`

export const DropDown = styled.div`
  width: 250px;
  display: flex;
  align-items: center;
  gap: 16px;
  height: 30px;
  color: #fff;
  justify-content: space-between;
  padding: 10px;
  position: relative;
  border: 1px solid #fff;
  cursor: pointer;
  @media (min-width: ${breakpoints.lg}) {
    justify-content: flex-end;
    padding: 0;
    border: 0;
    width: 142px;
  }
`

export const DropDownText = styled.span`
  font-size: 24px;
  line-height: 17px;
  color: #fff;
  @media (min-width: ${breakpoints.lg}) {
    font-size: 14px;
  }
`

export const DropDownBox = styled.div<DropDownBoxProps>`
  width: 250px;
  height: ${({ active }) => (active ? '170px' : 0)};
  overflow: ${({ active }) => (active ? 'auto' : 'hidden')};
  border: 1px solid ${({ active }) => (active ? '#fff' : 'transparent')};
  cursor: ${({ active }) => (active ? 'pointer' : 'auto')};
  position: absolute;
  top: 50px;
  right: 0;
  padding: 16px 16px 0 16px;
  border-radius: 8px;
  transition: height 0.2s;
  display: flex;
  flex-direction: column;
  @media (min-width: ${breakpoints.lg}) {
    width: 142px;
  }
`

export const DropdownItem = styled.a`
  cursor: pointer;
  display: flex;
  height: 30px;
  gap: 16px;
  color: #fff;
  font-size: 24px;
  line-height: 20px;
  margin-bottom: 20px;
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
