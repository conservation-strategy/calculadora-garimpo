import { breakpoints } from '@/styles/global';
import styled from 'styled-components';
import { Button } from '@/styles/global';

export const Form = styled.form`
  padding: 24px;
  background: #ffffff;
  box-shadow: 0px 0px 41.8133px rgba(0, 0, 0, 0.15);
  margin-top: 24px;
  border-radius: 20px;
  display: grid;
  gap: 10px;
  align-items: flex-end;
  grid-template-columns: repeat(1, 1fr);
  grid-template-areas:
    'pit'
    'hypothesis'
    'use'
    'submit';

  @media(min-width: ${breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
        'pit hypothesis'
        'use use'
        'submit submit';
  }
  
`


export const FormControl = styled.div`
  width: 100%;
  > label {
    font-weight: 600;
    font-size: 13px;
  }
  @media(min-width: 1440px) {
    > label {
      font-size: 14px
    }
  }
  @media(min-width: 1600px) {
    > label {
      font-size: 15px
    }  
  }
`

export const FormControlPit = styled(FormControl)`
  grid-area: pit;
`
export const FormControlHypothesis = styled(FormControl)`
  grid-area: hypothesis;
`
export const FormControlUse = styled(FormControl)`
  grid-area: use;
`

export const ButtonSubmit = styled(Button)`
  grid-area: submit;
  margin-top: 4px;
  position: relative;

  @media(min-width: 1440px) {
    margin-top: 8px
  }

  @media(min-width: 1680px) {
    margin-top: 14px
  }
`

export const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1em;
  height: 1em;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;

  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
`