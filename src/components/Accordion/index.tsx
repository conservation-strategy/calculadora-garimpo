import { ReactNode } from 'react'
import Collapsible from 'react-collapsible'

import * as S from './style'

export interface ItemsAcoordionProps {
  title: string
  content: ReactNode
}

interface AccordionProps {
  Items: ItemsAcoordionProps[]
}

export default function Accordion({ Items }: AccordionProps) {
  return (
    <>
      {Items.map(({ title, content }, index) => (
        <Collapsible
          key={index}
          transitionTime={100}
          trigger={
            <S.AccordionHeader>
              <S.AccordionTitle>{title}</S.AccordionTitle>
              <S.AccordionIcon>
                <i className="fi fi-rr-plus-small"></i>
              </S.AccordionIcon>
            </S.AccordionHeader>
          }
        >
          <S.AccordionBody>{content}</S.AccordionBody>
        </Collapsible>
      ))}
    </>
  )
}
