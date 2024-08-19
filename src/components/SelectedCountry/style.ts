import { breakpoints } from '@/styles/global'
import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 10;
  padding: 100px 64px 0 64px;
  @media (min-width: ${breakpoints.lg}) {
    padding: 0;
    align-items: center;
  }
`

export const Modal = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 25px;
  padding: 50px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  @media (min-width: ${breakpoints.lg}) {
    width: 733px;
  }
`

export const Headerline = styled.h2`
  font-weight: 700;
  font-size: 36px;
  line-height: 54px;
  text-align: center;
  color: #0f0f0f;
`

export const Icon = styled.img`
  width: 36px;
  height: 36px;
  margin-top: 16px;
`

export const TextCountry = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 30px;
`

export const Text = styled.p`
  font-weight: 400;
  font-size: 24px;
  line-height: 36px;
  color: #515151;
  opacity: 0.8;
  text-align: center;
`
