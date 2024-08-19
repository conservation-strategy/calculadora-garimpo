import { breakpoints } from '@/styles/global'
import styled from 'styled-components'

export const Container = styled.footer`
  width: 100%;
  background: #000;
`

export const LinksWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  @media (min-width: ${breakpoints.md}) {
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
  gap: 18px;
  margin-bottom: 50px;
  @media (min-width: ${breakpoints.lg}) {
    margin: 0;
  }
`

export const Links = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`

export const Link = styled.a`
  color: #fff;
  font-weight: 400;
  font-size: 16px;
  line-height: 30px;
  cursor: pointer;
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
  margin: 50px 0;
  a {
    color: #fff;
    font-size: 25px;
    text-decoration: none;
  }
  > div {
    display: flex;
    gap: 16px;
  }
`

export const Copy = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
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
  font-size: 20px;
  line-height: 48px;
  color: #fff;
`

export const Text = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  @media (min-width: ${breakpoints.md}) {
    text-align: left;
  }
`
