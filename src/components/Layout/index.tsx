import useAppContext from '@/hooks/useAppContext'
import useLanguage from '@/hooks/useLanguage'
import { ReactNode, useEffect, useState } from 'react'
import Footer from '../Footer'
import Header from '../Header'
import * as SG from '@/styles/global'
import * as S from './style'
import useCountryDetection from '@/hooks/useCountryDetection'
import { convertToBold } from '@/utils/text'
import Image from 'next/image'
import { ChevronCompactDown } from '../Icons'

const homeBackgroundImage = '/assets/images/backgrounds/hero_1.webp';
const pageHeaderBackgoundImage = '/assets/images/backgrounds/page_header_2.webp';

interface LayoutProps {
  children: ReactNode
  headline: string
  align?: 'left' | 'center'
  SafeAreaCTA?: ReactNode
  safeAreaHeight?: string;
  isHome?: boolean
}

export default function Layout({
  children,
  headline,
  SafeAreaCTA,
  safeAreaHeight,
  align = 'center',
  isHome
}: LayoutProps) {
  const { changeCountry, changeLanguage } = useAppContext()
  const languageUser = useLanguage()
  const { country: countryDetection } = useCountryDetection()
  const [isBgLoaded, setIsBgLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const country = sessionStorage.getItem('country')
    const languageStorage = sessionStorage.getItem('language')

    if (!languageStorage) {
      if (languageUser === 'en') {
        changeLanguage('en_US')
      } else if (languageUser === 'pt') {
        changeLanguage('pt_BR')
      } else if (languageUser === 'es') {
        changeLanguage('es_ES')
      }
    } else {
      changeLanguage(languageStorage)
    }

    if (country && country !== 'undefined') {
      // console.log('country', typeof country)
      changeCountry(JSON.parse(country))
    } else {
      changeCountry(countryDetection)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageUser, countryDetection]);

  return (
    <>
    <main style={{ scrollBehavior: 'smooth' }}>
      <Header isScrolled={isScrolled} />
      <S.SafeArea height={safeAreaHeight} isHome={isHome}>
        <S.BgImageContainer isHome={isHome}>
          <Image
          alt="background image"
          src={isHome ? homeBackgroundImage : pageHeaderBackgoundImage}
          style={{            
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: isHome ? 'top' : 'center',
            filter: 'brightness(50%)',
            transition: 'opacity 150ms ease-out',
            opacity: isBgLoaded ? 1 : 0
          }}
          fill
          onLoad={() => setIsBgLoaded(true)}
          />
        </S.BgImageContainer>
        {/* <div
        style={{ 
          position: 'absolute',
          zIndex: -1,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: "#000000",
          opacity: 0.5
        }}
        ></div>         */}
        {isHome
        ? <>
          <S.HeroContent>
            <div>
              <SG.Headline weight="300" color="#fff" align={align} isHero>
                {headline}
              </SG.Headline>
              {SafeAreaCTA}              
            </div>
          </S.HeroContent>
          <S.ScrollDown isScrolled={isScrolled} >
            <ChevronCompactDown/>
          </S.ScrollDown>
          </>
        : <SG.Container style={{ position: 'relative', zIndex: 1 }}>
            <SG.Headline weight="600" color="#fff" align={align}>
              {headline}
            </SG.Headline>
          </SG.Container>}
      </S.SafeArea>
      <div style={{ background: '#fff', position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </main>
    <Footer />
    </>
  )
}
