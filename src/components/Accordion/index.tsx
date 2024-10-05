import { ReactNode, useState } from 'react'
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
  const [openIndexes, setOpenIndexes] = useState<number[]>([])

  const handleOpening = (index: number) => {
    setOpenIndexes(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index)
      } else {
        return [...prev, index]
      }
    })
  }

  return (
    <>
      {Items.map(({ title, content }, index) => (
        <Collapsible
          key={index}
          transitionTime={100}
          onOpening={() => handleOpening(index)}
          onClosing={() => handleOpening(index)}
          trigger={
            <S.AccordionHeader showBorderBottom={index === Items.length - 1 && !openIndexes.includes(Items.length - 1) ? false : true}>
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
