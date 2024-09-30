import Layout from '@/components/Layout'
import * as SG from '@/styles/global'
import * as S from '@/components/pages/StepByStep/style'
import useAppContext from '@/hooks/useAppContext'
import seoMetadata from '@/mocks/seo_metadata.json'
import SEO from '@/components/SEO'

export default function Methodology() {
  const { state } = useAppContext()
  const { language } = state
  const { methodology } = language
  return (
    <Layout headline={methodology.headline} safeAreaHeight="200px" align="left">
      {/* <SEO
        title={methodology.headline}
        description={methodology.paragraphy_01}
      /> */}
      <SEO {...seoMetadata.methodology} />
      <SG.Container style={{ paddingTop: 0 }}>
        <S.WrapperText>
          <SG.Text>
            <div
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_01 }}
            ></div>
          </SG.Text>
          <br />
          <img src={methodology.image} alt={methodology.headline} />
          <br />
          <br />
          <SG.Text>
            <div
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_02 }}
            ></div>
          </SG.Text>
          <br />
          <SG.Text>
            <div
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_03 }}
            ></div>
          </SG.Text>
          <br />
          <SG.Text>
            <div
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_04 }}
            ></div>
          </SG.Text>
          <br />
          <SG.Text>
            <div
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_05 }}
            ></div>
          </SG.Text>
          <br />
          <SG.Text>
            <div
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_06 }}
            ></div>
          </SG.Text>
          <br />
          <SG.Text>
            <div
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_07 }}
            ></div>
          </SG.Text>
          <br />
          <SG.Text>
            <div
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_07_1 }}
            ></div>
          </SG.Text>
          <br />
          <SG.Text>
            <div
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_07_2 }}
            ></div>
          </SG.Text>
          <br />
          <SG.Headline>
            <div
              dangerouslySetInnerHTML={{
                __html: methodology.resultsOfCalculator
              }}
            ></div>
          </SG.Headline>
          <SG.Text>
            <div
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_08 }}
            ></div>
          </SG.Text>
          <br />
          <SG.Text>
            <div
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_09 }}
            ></div>
          </SG.Text>
          <br />
          <SG.Headline>
            <div
              dangerouslySetInnerHTML={{
                __html: methodology.TecnicalDocuments
              }}
            ></div>
          </SG.Headline>
          <SG.Text>
            <div
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_10 }}
            ></div>
          </SG.Text>
          <br />
          <SG.Text>
            <div
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_11 }}
            ></div>
          </SG.Text>
          <br />
          <SG.Text>
            <div
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_12 }}
            ></div>
          </SG.Text>
          <br />
          <SG.Text>
            <div
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_13 }}
            ></div>
          </SG.Text>
          <br />
        </S.WrapperText>
      </SG.Container>
    </Layout>
  )
}
