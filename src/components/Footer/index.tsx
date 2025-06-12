import { useCallback } from 'react';
import * as S from './style'
import * as SG from '@/styles/global'
import useAppContext from '@/hooks/useAppContext'
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Footer() {
  const { state } = useAppContext()
  const { language } = state
  const { footer } = language
  const { copy, disclaimer } = footer
  const router = useRouter();

  const handleIconClick = useCallback(() => {
    const isHome = router.pathname === '/';
    if(!isHome) {
      router.push('/');
    } else {
      setTimeout(() => window.scrollTo({ top:0, behavior: 'smooth' }), 100);
    }
  },[router]);

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
        <S.BottomLinksWrapper>
          {/* <S.CalculatorsWrapper> */}
            <S.Calculators>
              <div
              style={{ cursor: 'pointer '}}
              onClick={() => handleIconClick()}
              >
                  <img
                    // src="images/Garimpo_VersãoInvertida.svg"
                    src="/assets/images/logo_garimpo-principal.svg"
                    // src="/assets/images/logo-Garimpo_BordaBranca.svg"
                    alt="CSF Logo"
                    width={64}
                    height={64}                  
                    style={{ objectFit: 'contain' }}
                  />
              </div>
                <a 
                  href="https://indigenouscalculator.conservation-strategy.org/home"
                  target="_blank"
                  rel='noreferrer'
                >
                  <img
                        // src="images/Indígena_VersãoInvertida.svg"
                    src="/assets/images/logo_indigena-principal.svg"
                    alt="CSF Logo"
                    width={64}
                    height={64}                  
                    style={{ objectFit: 'contain' }}
                  />
                </a>
                <a 
                  href="https://deforestationcalculator.conservation-strategy.org/"
                  target="_blank"
                  rel='noreferrer'
                >
                  <img
                        // src="images/Indígena_VersãoInvertida.svg"
                    src="/assets/images/logo_desmatamento-principal.svg"
                    alt="CSF Logo"
                    width={64}
                    height={64}                  
                    style={{ objectFit: 'contain' }}
                  />
                </a>
            </S.Calculators>
          {/* </S.CalculatorsWrapper> */}

          <S.Social>
            <div>
              <Link
                target="_blank"
                rel='noreferrer'
                href="https://web.facebook.com/conservationstrategyfund?_rdc=1&_rdr"
                title="Facebook"
              >
                <i className="fi fi-brands-facebook"></i>
              </Link>
              <Link
                target="_blank"
                rel='noreferrer'
                href="https://bsky.app/profile/numbers4nature.bsky.social"
                title="Twitter"
              >
                <IconBlueSky/>
              </Link>
              <Link
                target="_blank"
                rel='noreferrer'
                href="https://www.youtube.com/user/numbers4nature"
                title="Youtube"
              >
                <i className="fi fi-brands-youtube"></i>
              </Link>
              <Link
                target="_blank"
                rel='noreferrer'
                href="https://www.instagram.com/conservationstrategyfund/"
                title="Instagram"
              >
                <i className="fi fi-brands-instagram"></i>
              </Link>
              <Link
                target="_blank"
                rel='noreferrer'
                href="https://www.linkedin.com/company/conservation-strategy-fund/"
                title="Linkedin"
              >
                <i className="fi fi-brands-linkedin"></i>
              </Link>
            </div>
          </S.Social>
          </S.BottomLinksWrapper>
          <S.Copy>
            <S.Text style={{ opacity: 0.5 }}>{disclaimer.text}</S.Text>
            <S.Text style={{ opacity: 0.5 }}>{copy.copyright}</S.Text>
          </S.Copy>
      </SG.Container>
    </S.Container>
  )
}

const IconBlueSky = () => {
  return (
    <div>
      <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.31076 1.45666C8.11945 3.57247 11.141 7.86188 12.25 10.1637V16.2436C12.25 16.1142 12.2002 16.2604 12.093 16.5755C11.5142 18.2813 9.25334 24.9388 4.08346 19.6165C1.36128 16.8143 2.6215 14.0121 7.57662 13.1661C4.7419 13.65 1.55498 12.8503 0.680641 9.71508C0.42875 8.81317 0 3.2578 0 2.50748C0 -1.25097 3.28415 -0.06961 5.31076 1.45666ZM19.1892 1.45666C16.3805 3.57247 13.359 7.86188 12.25 10.1637V16.2436C12.25 16.1142 12.2998 16.2604 12.407 16.5755C12.9858 18.2813 15.2467 24.9388 20.4165 19.6165C23.1387 16.8143 21.8785 14.0121 16.9234 13.1661C19.7581 13.65 22.945 12.8503 23.8194 9.71508C24.0712 8.81317 24.5 3.2578 24.5 2.50748C24.5 -1.25097 21.2162 -0.06961 19.1892 1.45666Z" fill="currentColor"/>
      </svg>
    </div>
  )
}