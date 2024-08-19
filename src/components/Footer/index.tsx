import * as S from './style'
import * as SG from '@/styles/global'
import useAppContext from '@/hooks/useAppContext'
import Link from 'next/link'

export default function Footer() {
  const { state } = useAppContext()
  const { language } = state
  const { footer } = language
  const { copy, disclaimer } = footer

  return (
    <S.Container>
      <SG.Container>
        <S.LinksWrapper>
          {footer.menu.map((item, indexMenu) => (
            <S.LinksColumn key={item.topic}>
              <S.Headline>{item.topic}</S.Headline>
              {item.list.map((listItem, indexItem) => {
                return (
                  <S.Links key={listItem.label}>
                    <S.Link
                      target={
                        indexMenu === 5 && indexItem === 1 ? '_blank' : '_self'
                      }
                      href={listItem.href}
                    >
                      {listItem.label}
                    </S.Link>
                  </S.Links>
                )
              })}
            </S.LinksColumn>
          ))}
        </S.LinksWrapper>

        <S.Social>
          <div>
            <Link
              target="_blank"
              href="https://web.facebook.com/conservationstrategyfund?_rdc=1&_rdr"
              title="Facebook"
            >
              <i className="fi fi-brands-facebook"></i>
            </Link>
            <Link
              target="_blank"
              href="https://twitter.com/numbers4nature"
              title="Twitter"
            >
              <i className="fi fi-brands-twitter"></i>
            </Link>
            <Link
              target="_blank"
              href="https://www.youtube.com/user/numbers4nature"
              title="Youtube"
            >
              <i className="fi fi-brands-youtube"></i>
            </Link>
            <Link
              target="_blank"
              href="https://www.instagram.com/conservationstrategyfund/"
              title="Instagram"
            >
              <i className="fi fi-brands-instagram"></i>
            </Link>
            <Link
              target="_blank"
              href="https://www.linkedin.com/company/conservation-strategy-fund/"
              title="Linkedin"
            >
              <i className="fi fi-brands-linkedin"></i>
            </Link>
          </div>
        </S.Social>
        <S.Copy>
          <S.Text>{disclaimer.text}</S.Text>
          <S.Text>{copy.copyright}</S.Text>
        </S.Copy>
      </SG.Container>
    </S.Container>
  )
}
