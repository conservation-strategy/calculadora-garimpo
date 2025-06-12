import Header from '@/components/Header'
import Layout from '@/components/Layout'
import * as SHome from '@/components/pages/Home/style'
import * as SG from '@/styles/global'
import * as S from './style'

import Accordion from '@/components/Accordion'
import FormCalculator from '@/components/FormCalculator'
import useAppContext from '@/hooks/useAppContext'
import ResultsCalculator from '@/components/ResultsCalculator'
import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import seoMetadata from '@/mocks/seo_metadata.json'
import SEO from '@/components/SEO'

interface GuideProps {
  title: string
  content: ReactNode
}

export default function Calculator() {
  const [guideList, setGuide] = useState<GuideProps[]>([])
  const [scrollResults, setResults] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { state } = useAppContext()
  const { language, dataCalculator } = state
  const { calculator } = language
  const { guide, safeArea } = calculator
  const {
    setLocation,
    typeMining,
    unitMeasurement,
    ValuesHypotheses,
    Inflation,
    useCalculator,
    title
  } = guide
  const RETORT_INDEX = 3

  useEffect(() => {
    if (dataCalculator) {
      setResults(true)
      setTimeout(() => {
        setResults(false)
      }, 1000)
    }
  }, [dataCalculator])

  useEffect(() => {
    setGuide([
      {
        title: setLocation.headline,

        content: (
          <>
            <SG.Text>
              <span
                dangerouslySetInnerHTML={{ __html: setLocation.paragraphy_01 }}
              ></span>
            </SG.Text>
            <SG.Text weight="600">
              <span
                dangerouslySetInnerHTML={{
                  __html: setLocation.paragraphy_list1
                }}
              ></span>
            </SG.Text>
            <SG.Text weight="600">
              <span
                dangerouslySetInnerHTML={{
                  __html: setLocation.paragraphy_list2
                }}
              ></span>
            </SG.Text>
            <SG.Text weight="600">
              <span
                dangerouslySetInnerHTML={{
                  __html: setLocation.paragraphy_list3
                }}
              ></span>
            </SG.Text>
            <SG.Text>
              <span
                dangerouslySetInnerHTML={{ __html: setLocation.paragraphy_o3 }}
              ></span>
            </SG.Text>
          </>
        )
      },
      {
        title: typeMining.headline,
        content: (
          <>
            {typeMining.items
              .filter((item, index) => index !== RETORT_INDEX)
              .map((typeminig) => (
                <div key={typeminig.headline}
                style={{ marginBottom: '2rem' }}
                >
                  <SG.Headline size="24px">{typeminig.headline}</SG.Headline>
                  <br />
                  <img src={typeminig.image_url} alt={typeminig.headline} />
                  <br />
                  <br />
                  <SG.Text>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: typeminig.description
                      }}
                    ></span>
                  </SG.Text>
                </div>
              ))}
          </>
        )
      },
      {
        title: typeMining.items[RETORT_INDEX].headline,
        content: <SG.Text>{typeMining.items[RETORT_INDEX].description}</SG.Text>
      },
      {
        title: guide.unitMeasurement.headline,
        content: (
          <>
            <SG.Text weight="600">{unitMeasurement.paragraphy_o3}</SG.Text>
            <SG.Text>{unitMeasurement.paragraphy_04}</SG.Text>
            <br />
            <SG.Text weight="600">{unitMeasurement.paragraphy_o7}</SG.Text>
            <SG.Text>{unitMeasurement.paragraphy_08}</SG.Text>
            <br />
            <SG.Text weight="600">{unitMeasurement.paragraphy_o5}</SG.Text>
            <SG.Text>{unitMeasurement.paragraphy_06}</SG.Text>
            <br />
            <SG.Text weight="600">{unitMeasurement.paragraphy_01}</SG.Text>
            <SG.Text>{unitMeasurement.paragraphy_02}</SG.Text>
          </>
        )
      },
      {
        title: ValuesHypotheses.headline,
        content: (
          <>
            <SG.Text>{ValuesHypotheses.paragraphy_01}</SG.Text>
          </>
        )
      },
      {
        title: Inflation.headline,
        content: (
          <>
            <SG.Text>
              {Inflation.paragraphy_01}
              <Link href={Inflation.href} target="_blank" rel='noreferrer'>
                {Inflation.siteIBGE}
              </Link>
            </SG.Text>
          </>
        )
      },
      {
        title: useCalculator.headline,
        content: (
          <>
            <SG.Text>
              <span
                dangerouslySetInnerHTML={{ __html: useCalculator.text }}
              ></span>
            </SG.Text>
            <SG.Text weight="600">
              <span
                dangerouslySetInnerHTML={{
                  __html: useCalculator.paragraphy_01
                }}
              ></span>
            </SG.Text>
            <SG.Text weight="600">
              <span
                dangerouslySetInnerHTML={{
                  __html: useCalculator.paragraphy_02
                }}
              ></span>
            </SG.Text>
            <SG.Text weight="600">
              <span
                dangerouslySetInnerHTML={{
                  __html: useCalculator.paragraphy_03
                }}
              ></span>
            </SG.Text>
          </>
        )
      }
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guide])

  return (
    <Layout headline={safeArea.headline} safeAreaHeight="200px" align="left" isCalculator>
      {/* <SEO title={safeArea.headline} /> */}
      <SEO
        title={seoMetadata.calculator.title}
        description={seoMetadata.calculator.description}
        image={seoMetadata.calculator.image}
      />
        <SG.Container fontSize='12.8px' style={{ paddingLeft: 0 }}>
          <S.WrapperCalculator>            
            <div>
              <SG.Headline style={{ transform: 'translateY(-1.5rem)' }}>
                {safeArea.headline}
              </SG.Headline>
              <S.Guide>              
                <SG.Headline size='1.5625em'>{title.headline}</SG.Headline>
                <Accordion Items={guideList} />
              </S.Guide>
              <S.MobileGuide>
                <S.DropdownButton
                onClick={() => setIsDropdownOpen(prev => !prev)}
                >
                  <SG.Headline size='1.5625em'>{title.headline}</SG.Headline>
                  <i className="fi fi-sr-angle-down"
                  style={{
                    fontWeight: 'bold',
                    transition: 'transform 0.2s',
                    transitionDelay: '0.2s',
                    transformOrigin: 'center',
                    transform: `${isDropdownOpen ? 'scaleY(-1) translateY(30%)' : 'scaleY(1) translateY(-20%)'}`
                  }}
                ></i>                  
                </S.DropdownButton>
                <S.DropdownContent isOpen={isDropdownOpen}>
                  <Accordion Items={guideList} />
                </S.DropdownContent>
              </S.MobileGuide>
            </div>
            <FormCalculator />
          </S.WrapperCalculator>
        </SG.Container>
      <SG.Container padding='0 24px 50px'>
        <ResultsCalculator scrollResults={scrollResults} />
      </SG.Container>
    </Layout>
  )
}
