import styled from 'styled-components'

interface LabelColorProps {
  color: string
}

export const LegendHeadline = styled.span`
  width: 100%;
  display: block;
  font-size: 19px;
  font-weight: 600;
`

export const LegendText = styled.span`
  display: block;
  font-size: 18px;
  align-self: flex-end;
`

export const LegendWrapper = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
`

export const LegendeTextWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 8px;
`

export const LabelColor = styled.div<LabelColorProps>`
  width: 16px;
  height: 16px;
  border-radius: 16px;
  background-color: ${({ color }) => color};
`
