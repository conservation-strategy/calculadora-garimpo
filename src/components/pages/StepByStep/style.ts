import { breakpoints } from '@/styles/global'
import styled from 'styled-components'

interface CardProps {
  align?: 'vertical' | 'horizontal'
}

export const WrapperButton = styled.div`
  width: 450px;
  position: absolute;
  bottom: 370px;
`

export const WrapperContent = styled.div`
  background: #fff;
  padding: 0 0 50px 0;
`

export const WrapperText = styled.div`
  width: 100%;
  padding: 50px 0;
`

export const CardsContainer = styled.div`
  display: flex;
  height: 100%;
  justify-content: space-between;
  gap: 50px;
  padding: 0 0 50px 0;
  flex-wrap: wrap;
  align-items: stretch;
  @media (min-width: ${breakpoints.lg}) {
    flex-wrap: nowrap;
    gap: 24px;
  }
`

export const CardsContainerTrio = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  padding: 0 0 50px 0;
  align-items: stretch;
  
  @media (min-width: ${breakpoints.lg}) {
    flex-direction: row;
  }
`

export const CardsContainerDuo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  padding: 0 0 50px 0;
  align-items: stretch;
  
  @media (min-width: ${breakpoints.lg}) {
    flex-direction: row;
  }
`


export const Card = styled.div<CardProps>`
  width: 100%;  
  height: auto;
  display: ${({ align }) => (align === 'horizontal' ? 'flex' : 'block')};
  gap: 50px;
  padding: 35px;
  background: #ffffff;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.15);
  border-radius: 15px;
  > form {
    background: transparent;
    box-shadow: none;
    padding: 0;
    margin-top: 50px;
  }
  @media (min-width: ${breakpoints.lg}) {
    width: ${({ align }) => (align === 'horizontal' ? '100%' : '500px')};
  }
`
