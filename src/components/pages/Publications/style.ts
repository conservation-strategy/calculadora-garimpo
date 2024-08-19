import { breakpoints } from '@/styles/global'
import styled from 'styled-components'

export const CardPublication = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-template-areas:
    'image'
    'content';
  column-gap: 30px;
  margin-bottom: 100px;
  cursor: pointer;
  h2 {
    margin-top: 30px;
  }
  img {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-width: ${breakpoints.lg}) {
    width: 650px;
    grid-template-columns: repeat(6, 1fr);
    grid-template-areas: 'image image content content content content';
    h2 {
      margin-top: 0;
    }
    img {
      display: inline;
    }
  }
`

export const PublicationImage = styled.img`
  grid-area: image;
  height: 250px;
  width: 100%;
  object-fit: cover;
`

export const PublicationContent = styled.div`
  grid-area: content;
  display: flex;
  flex-direction: column;
`
