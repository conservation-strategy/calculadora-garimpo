import styled, { createGlobalStyle, css } from 'styled-components';
import { doppioOne, gudea } from '@/fonts/fonts';

interface ButtonProps {
  variant: 'primary' | 'outline';
  maxWidth?: number
}

interface TextProps {
  color?: string
  align?: 'left' | 'right' | 'center'
  size?: string
  weight?: '300' | '400' | '500' | '600'
  isHero?: boolean;
}

interface ContainerProps {
  fontSize?: string;
  variant?: 'nav';
  padding?: string;
}

export const colors = {
  primary: '#F6A249',
  secondary_dark: '#F48D1F',
  secondary: '#673928',
  neutral_1: "#E4D2D2",
  neutral_2: "#D8D8D8",
  green: '#417505',
  outline: '#AF8313',
  outline_hover: '#E9A701'
}

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg : '1280px',
  xl: '1440px',
  xll: '1600px'
}

export interface Field {
  error?: boolean
}

export const GlobalStyle = createGlobalStyle`
    *,
    *::after,
    *::before{
       box-sizing: border-box;
       margin: 0;
       padding: 0;
    }

    html, body {
        font-family: ${gudea.style.fontFamily}, sans-serif;
        height: 100%;
    }

    h2 {
      font-family: ${doppioOne.style.fontFamily}, sans-serif;
    }

    button {
        border: 0;
        background-color: transparent;
    }

    img {
        max-width: 100%;
    }
    
   .recharts-legend-wrapper {
    left: 5px !important;
    right: 0;
   }


`

export const Container = styled.div<ContainerProps>`
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '1rem')};
  width: 100%;
  @media (min-width: ${breakpoints.md}) {
    width: 720px;
    margin-left: auto;
    margin-right: auto;
  }
  @media (min-width: ${breakpoints.lg}) {
    width: 1232px;
  }
  @media (min-width: ${breakpoints.xl}) {
    width: 1392px;
  }
  @media (min-width: ${breakpoints.xll}) {
    width: 1552px;
  }
  padding: ${({ padding }) => ( padding ?? '50px 24px')}; 
`

export const Button = styled.button<ButtonProps>`
  font-family: inherit;
  width: 100%;
  max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : 'none' )};
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  padding: 21px 24px;
  text-transform: uppercase;
  color: #fff;
  transition: background-color 300ms;
  a {
    color: #fff;
    text-decoration: none;
  }
  ${({ variant }) => {
    if (variant === 'primary') {
      return css`
        background-color: ${colors.primary};
        &:hover {
          background-color: ${colors.secondary};
        }
      `
    } else if (variant === 'outline') {
      return css`
        background: ${colors.outline};
        &:hover {
          background-color: ${colors.outline_hover};
        }
      `
    }
  }}
`

export const Embed = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  padding-top: 56.25%;
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }
`
export const OverLay = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: radial-gradient(
    89.9% 318.95% at 49.37% 40.4%,
    rgba(0, 0, 0, 0.71) 0%,
    rgba(0, 0, 0, 0.9) 100%
  );
  z-index: 8;
`

export const Select = styled.select<Field>`
  position: relative;
  width: 100%;
  padding: 16px 16px;
  background: #ffffff;
  border: 2px solid ${({ error }) => (error ? 'red' : 'rgba(0, 0, 0, 0.2)')};
  border-radius: 12px;
  font-size: 18px;
  color: #2c2c2c;
`

export const Input = styled.input<Field>`
  width: 100%;
  padding: 16px 16px;
  background: #ffffff;
  border: 2px solid ${({ error }) => (error ? 'red' : 'rgba(0, 0, 0, 0.2)')};
  border-radius: 12px;
  font-size: 18px;
  color: #2c2c2c;
  box-shadow: none;
  transition: 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
`

export const Text = styled.p<TextProps>`
  font-size: ${({ size }) => (size ? size : '14px')};
  line-height: 150%;
  font-weight: ${({ weight }) => (weight ? weight : '400')};
  color: ${({ color }) => (color ? color : '#000')};
  text-align: ${({ align }) => (align ? align : 'left')};
  margin-bottom: 16px;
  @media (min-width: ${breakpoints.md}) {
    font-size: ${({ size }) => (size ? size : '18px')};
  }
`

export const Headline = styled.h2<TextProps>`
  font-family: ${doppioOne.style.fontFamily}, sans-serif;
  font-size: ${({ size }) => (size ? size : '25px')};
  line-height: 175%;
  font-weight: ${({ weight }) => (weight ? weight : '600')};
  color: ${({ color }) => (color ? color : '#000')};
  text-align: ${({ align }) => (align ? align : 'left')};
  margin-bottom: 16px;

  @media (min-width: ${breakpoints.md}) {
    font-size: ${({ size }) => (size ? size : '30px')};
  }

  @media (min-width: ${breakpoints.lg}) {
    font-size: ${({ size }) => (size ? size : '36px')};
  }

  ${({ isHero }) => {
    return isHero
    ? css `
      max-width: 45ch;
      margin-inline: auto
    `
    : ''
  }}
`
