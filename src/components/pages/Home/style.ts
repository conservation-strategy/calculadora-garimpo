import { breakpoints, colors } from '@/styles/global'
import styled, { css } from 'styled-components'

interface CardProps {
  position?: 'horizontal' | 'vertical'
}

export const SafeArea = styled.div`
  width: 100%;
  min-height: 70vh;
  padding-bottom: 50px;
  background: url('/assets/images/background.webp') no-repeat center top;
  background-size: cover;
  > div {
    margin-top: 0;
  }
  @media (min-width: ${breakpoints.md}) {
    padding: 0;
    > div {
      margin-top: 235px;
    }
  }
`

export const Buttons = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 100px auto 0 auto;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  @media (min-width: ${breakpoints.md}) {
    margin: 80px auto 0 auto;
    width: 720px;
    flex-direction: row;
  }
`

export const AboutCalculator = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 50px;
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 100px
  }
`

export const ImpactsWrapper = styled.div`
  width: 100%;
  background: ${colors.secondary};
  background-size: cover;
  h2 {
    color: #fff;
  }
`

export const CardsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 50px;
  margin-top: 50px;
  @media (min-width: ${breakpoints.lg}) {
    flex-direction: row;
    gap: 0;
  }
`

export const Card = styled.div`
  width: 100%;
  height: 412px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  @media (min-width: ${breakpoints.lg}) {
    width: 370px;
    height: 450px;
  }
  @media (min-width: ${breakpoints.xl}) {
    width: 425px;
  }
`

export const CardIcon = styled.img`
  display: block;
`

export const CardHeader = styled.div`
  height: 85px;
  margin-bottom: 20px;
  @media (min-width: ${breakpoints.lg}) {
    margin-bottom: 30px;
  }
`

export const CardButton = styled.button`
  width: 100%;
  display: block;
  border: 1px solid ${colors.secondary};
  border-radius: 6px;
  font-size: 18px;
  line-height: 150%;
  text-align: center;
  padding: 15px 0;
  margin-top: auto;
  cursor: pointer;
  text-transform: uppercase;
  &:hover {
    background-color: ${colors.secondary};
    color: #fff;
  }
`

export const NewsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 70px;
  padding-top: 32px;
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
`

export const NewsPost = styled.article<CardProps>`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 24px;
  height: 100%;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  @media (min-width: ${breakpoints.md}) {
    //height: 420px;
    flex-direction: row;
    align-items: flex-start;
    padding: 0;
  }
  @media (min-width: ${breakpoints.lg}) {
    ${({ position }) => {
      if (position) {
        return css`
          height: 100%;
          flex-direction: column;
          align-items: center;
          img {
            height: 100%;
            width: 100%;
          }
        `
      } else {
        return css`
          //height: 350px;
          flex-direction: row;
          align-items: flex-start;
        `
      }
    }}
  }
`

export const NewsPostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  @media (min-width: ${breakpoints.md}) {
    width: 252px;
    //height: 420px;
  }
  /* @media (min-width: ${breakpoints.lg}) {
        height: 350px;
    } */
  @media (min-width: ${breakpoints.xll}) {
    //height: 350px;
  }
`

export const NewsPostContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
  @media (min-width: ${breakpoints.md}) {
    //height: 420px;
  }

  /* @media (min-width: ${breakpoints.lg}) {
        height: 350px;
    } */
  @media (min-width: ${breakpoints.xll}) {
    //height: 350px;
  }
`

export const NewsPostLink = styled.a`
  font-size: 18px;
  line-height: 150%;
  padding: 16px 0;
  text-decoration-line: underline;
  color: #4a92fd;
  align-self: center;
  @media (min-width: ${breakpoints.md}) {
    align-self: flex-end;
  }
  @media (min-width: ${breakpoints.lg}) {
    align-self: flex-end;
  }
`
