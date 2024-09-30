import FormCalculator from '@/components/FormCalculator'
import Layout from '@/components/Layout'

import seoMetadata from '@/mocks/seo_metadata.json'
import SEO from '@/components/SEO'
import { ROUTE } from '@/enums'
import useAppContext from '@/hooks/useAppContext'
import * as SG from '@/styles/global'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import * as S from './style'

export default function StepByStep() {
  const { state } = useAppContext()
  const { language } = state
  const { calculator } = language
  const { guide, form } = calculator
  const {
    title,
    setLocation,
    typeMining,
    defaultTypeMining,
    unitMeasurement,
    ValuesHypotheses,
    Inflation,
    useCalculator
  } = guide
  const route = useRouter()

  const RETORT_INDEX = 3

  useEffect(() => {
    const button = document.getElementById('btn-calcular')
    const qtdAnalysis = document.querySelector(
      "input[name='qtdAnalysis']"
    ) as HTMLInputElement
    if (button) {
      button.addEventListener('click', () => {
        if (qtdAnalysis && qtdAnalysis.value !== '') {
          setTimeout(() => {
            route.push(ROUTE.calculator)
          }, 500)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout headline={title.headline} safeAreaHeight="200px" align="left">
      {/* <SEO title={title.headline} description={setLocation.paragraphy_01} /> */}
      <SEO
        title={seoMetadata.usageGuide.title}
        description={seoMetadata.usageGuide.description}
        image={seoMetadata.usageGuide.image}
      />
      <SG.Container style={{ paddingTop: 0 }}>
        <S.WrapperText>
          <SG.Text>
            <div
              dangerouslySetInnerHTML={{ __html: setLocation.soptexttitle }}
            ></div>
          </SG.Text>

          <SG.Headline size="25px">{setLocation.headline}</SG.Headline>

          <SG.Text>
            <div
              dangerouslySetInnerHTML={{ __html: setLocation.paragraphy_01 }}
            ></div>
          </SG.Text>
          <SG.Text weight="600">
            <div
              dangerouslySetInnerHTML={{ __html: setLocation.paragraphy_list1 }}
            ></div>
          </SG.Text>
          <SG.Text weight="600">
            <div
              dangerouslySetInnerHTML={{ __html: setLocation.paragraphy_list2 }}
            ></div>
          </SG.Text>
          <SG.Text weight="600">
            <div
              dangerouslySetInnerHTML={{ __html: setLocation.paragraphy_list3 }}
            ></div>
          </SG.Text>
          <SG.Text>
            <div
              dangerouslySetInnerHTML={{ __html: setLocation.paragraphy_o3 }}
            ></div>
          </SG.Text>
        </S.WrapperText>

        <SG.Headline>{typeMining.headline}</SG.Headline>
        <S.CardsContainer>
          {typeMining.items
            .filter((item, index) => index !== RETORT_INDEX)
            .map((typeminig) => (
              <S.Card key={typeminig.headline}>
                <SG.Text size="24px" weight="600">
                  {typeminig.headline}
                </SG.Text>
                <img src={typeminig.image_url} alt={typeminig.headline} />
                <br />
                <br />
                <SG.Text>
                  <div
                    dangerouslySetInnerHTML={{ __html: typeminig.description }}
                  ></div>
                </SG.Text>
              </S.Card>
            ))}
        </S.CardsContainer>

        <S.WrapperText>
          <SG.Text>{defaultTypeMining.text}</SG.Text>
        </S.WrapperText>

        <S.WrapperText>
          <SG.Headline>{typeMining.items[RETORT_INDEX].headline}</SG.Headline>
          <SG.Text>
            <div
              dangerouslySetInnerHTML={{
                __html: typeMining.items[RETORT_INDEX].description
              }}
            ></div>
          </SG.Text>
        </S.WrapperText>

        <br />
        <SG.Headline>{unitMeasurement.headline}</SG.Headline>
        <S.CardsContainer>
          <S.Card style={{ width: '100%' }}>
            <SG.Text weight="600" size="24px">
              {unitMeasurement.paragraphy_01}
            </SG.Text>
            <br />
            <SG.Text>{unitMeasurement.paragraphy_02}</SG.Text>
          </S.Card>
          <S.Card style={{ width: '100%' }}>
            <SG.Text weight="600" size="24px">
              {unitMeasurement.paragraphy_o3}
            </SG.Text>
            <br />
            <SG.Text>{unitMeasurement.paragraphy_04}</SG.Text>
          </S.Card>
          <S.Card style={{ width: '100%' }}>
            <SG.Text weight="600" size="24px">
              {unitMeasurement.paragraphy_o5}
            </SG.Text>
            <br />
            <SG.Text>{unitMeasurement.paragraphy_06}</SG.Text>
          </S.Card>
          <S.Card style={{ width: '100%' }}>
            <SG.Text weight="600" size="24px">
              {unitMeasurement.paragraphy_o7}
            </SG.Text>
            <br />
            <SG.Text>{unitMeasurement.paragraphy_08}</SG.Text>
          </S.Card>
        </S.CardsContainer>

        <S.WrapperText>
          <SG.Headline>{ValuesHypotheses.headline}</SG.Headline>
          <SG.Text>{ValuesHypotheses.paragraphy_01}</SG.Text>
        </S.WrapperText>

        <S.WrapperText>
          <SG.Headline>{Inflation.headline}</SG.Headline>
          <SG.Text>
            {Inflation.paragraphy_01}
            <Link href={Inflation.href} target="_blank" rel='noreferrer'>
              {Inflation.siteIBGE}
            </Link>
          </SG.Text>
        </S.WrapperText>

        <S.WrapperText>
          <SG.Headline>{useCalculator.headline}</SG.Headline>
          <SG.Text>
            <div dangerouslySetInnerHTML={{ __html: useCalculator.text }}></div>
          </SG.Text>
          <SG.Text weight="600">
            <div
              dangerouslySetInnerHTML={{ __html: useCalculator.paragraphy_01 }}
            ></div>
          </SG.Text>
          <SG.Text weight="600">
            <div
              dangerouslySetInnerHTML={{ __html: useCalculator.paragraphy_02 }}
            ></div>
          </SG.Text>
          <SG.Text weight="600">
            <div
              dangerouslySetInnerHTML={{ __html: useCalculator.paragraphy_03 }}
            ></div>
          </SG.Text>
        </S.WrapperText>

        <SG.Headline>{form.title.headline}</SG.Headline>
        <S.Card style={{ width: '100%', height: '100%' }}>
          <FormCalculator />
        </S.Card>
        <br />
        <br />
        <br />
      </SG.Container>
    </Layout>
  )
}
