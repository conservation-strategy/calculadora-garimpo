import useAppContext from '@/hooks/useAppContext'
import useLanguage from '@/hooks/useLanguage'
import { ReactNode, useEffect } from 'react'
import Footer from '../Footer'
import Header from '../Header'
import * as SG from '@/styles/global'
import * as S from './style'
import useCountryDetection from '@/hooks/useCountryDetection'
import { convertToBold } from '@/utils/text'

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
  }, [languageUser, countryDetection])

  return (
    <main>
      <S.SafeArea height={safeAreaHeight}>
        <Header />
        {isHome
        ? <S.HeroContent>
            <div style={{ transform: 'translateY(-30%)'}}>
              <SG.Headline weight="300" color="#fff" align={align} isHero>
                {convertToBold(headline)}
              </SG.Headline>
              {SafeAreaCTA}
            </div>
          </S.HeroContent>
        : <SG.Container>
            <SG.Headline weight="600" color="#fff" align={align}>
              {headline}
            </SG.Headline>
          </SG.Container>}
      </S.SafeArea>
      {children}
      <Footer />
    </main>
  )
}
