import { breakpoints, colors } from '@/styles/global'
import styled from 'styled-components'


export const CalculatorsWrapper = styled.div`
  display: flex;
  width 100%;
  justify-content: center
`

export const Calculators = styled.div`
  display: flex;
  gap: 48px;
`


export const Container = styled.footer`
  position: relative;
  z-index: 1;
  width: 100%;
  background: ${colors.neutral_2};
`

export const LinksWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  @media (min-width: ${breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
    width: 85%;
    margin-left: auto;
  }
  @media (min-width: ${breakpoints.lg}) {
    width: 100%;
    margin: 0;
    grid-template-columns: repeat(6, 1fr);
  }
`

export const LinksColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 40px;
  @media (min-width: ${breakpoints.lg}) {
    margin: 0;
  }
`

export const Links = styled.div`
  display: flex;
  flex-direction: column;
`

export const Link = styled.a`
  color: inherit;
  font-weight: 400;
  font-size: 14px;
  line-height: 30px;
  cursor: pointer;

  @media(min-width: ${breakpoints.md}) {
    font-size: 16px;
  }
`

export const BottomLinksWrapper = styled.div`
  margin-top: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  @media(min-width: ${breakpoints.lg}) {
    flex-direction: row;
    justify-content: space-between;
    margin-top: 50px;
  }
`

export const FootnoteWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  @media(min-width: ${breakpoints.sm}) {
    whitespace: nowrap;
  }
`

export const Disclaimer = styled.div`
  border: 1px solid #fff;
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  margin-top: 50px;
`

export const Social = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
  a {
    color: inherit;
    font-size: 25px;
    text-decoration: none;
    opacity: 0.7;
    transition: opacity 0.3s ease;
    &:hover {
      opacity: 1;
    }
  }
  > div {
    display: flex;
    gap: 3rem;
  }
`

export const Copy = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 2.5rem;
  justify-content: space-between;
  align-items: center;
  @media(min-width: ${breakpoints.lg}) {
    flex-direction:row;
  }
`

export const ButtonWhite = styled.button`
  width: 230px;
  height: 56px;
  background: #ffffff;
  border-radius: 8px;
  text-align: center;
  color: #000;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  cursor: pointer;
`

export const Headline = styled.h5`
  font-weight: 700;
  font-size: 18px;
  line-height: 48px;
  color: inherit;

  @media(min-width: ${breakpoints.sm}) {
    font-size: 20px;
  }
`

export const Text = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: inherit;
  text-align: center;
  @media (min-width: ${breakpoints.sm}) {
    text-align: left;
    font-size: 16px;
  }

`
