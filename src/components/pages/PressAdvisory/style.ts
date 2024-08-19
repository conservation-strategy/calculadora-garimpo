import { breakpoints } from '@/styles/global'
import styled from 'styled-components'

export const News = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 50px;
  @media (min-width: ${breakpoints.md}) {
    grid-template-columns: repeat(1, 1fr);
  }
`

export const NewsBox = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-template-areas:
    'content'
    'image';
  gap: 40px;
  cursor: pointer;
  &:hover {
    h2 {
      text-decoration: underline;
    }
  }
  @media (min-width: ${breakpoints.lg}) {
    gap: 24px;
    height: 300px;
    grid-template-columns: repeat(6, 1fr);
    grid-template-areas: 'image image image content content content';
    width: 800px;
  }
`

export const NewsImage = styled.img`
  grid-area: image;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
`

export const NewsContent = styled.div`
  grid-area: content;
  display: flex;
  flex-direction: column;
  gap: 10px;
  p {
    line-height: 100%;
    margin-bottom: 0;
  }
`
