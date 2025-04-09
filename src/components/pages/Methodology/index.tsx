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
            <span
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_01 }}
            ></span>
          </SG.Text>
          <br />
          <img src={methodology.image} alt={methodology.headline} />
          <br />
          <br />
          <SG.Text>
            <span
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_02 }}
            ></span>
          </SG.Text>
          <br />
          <SG.Text>
            <span
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_03 }}
            ></span>
          </SG.Text>
          <br />
          <SG.Text>
            <span
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_04 }}
            ></span>
          </SG.Text>
          <br />
          <SG.Text>
            <span
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_05 }}
            ></span>
          </SG.Text>
          <br />
          <SG.Text>
            <span
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_06 }}
            ></span>
          </SG.Text>
          <br />
          <SG.Text>
            <span
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_07 }}
            ></span>
          </SG.Text>
          <br />
          <SG.Text>
            <span
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_07_1 }}
            ></span>
          </SG.Text>
          <br />
          <SG.Text>
            <span
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_07_2 }}
            ></span>
          </SG.Text>
          <br />
          <SG.Headline>
            <span
              dangerouslySetInnerHTML={{
                __html: methodology.resultsOfCalculator
              }}
            ></span>
          </SG.Headline>
          <SG.Text>
            <span
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_08 }}
            ></span>
          </SG.Text>
          <br />
          <SG.Text>
            <span
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_09 }}
            ></span>
          </SG.Text>
          <br />
          <SG.Headline>
            <span
              dangerouslySetInnerHTML={{
                __html: methodology.TecnicalDocuments
              }}
            ></span>
          </SG.Headline>
          <SG.Text>
            <span
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_10 }}
            ></span>
          </SG.Text>
          <br />
          <SG.Text>
            <span
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_11 }}
            ></span>
          </SG.Text>
          <br />
          <SG.Text>
            <span
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_12 }}
            ></span>
          </SG.Text>
          <br />
          <SG.Text>
            <span
              dangerouslySetInnerHTML={{ __html: methodology.paragraphy_13 }}
            ></span>
          </SG.Text>
          <br />
        </S.WrapperText>
      </SG.Container>
    </Layout>
  )
}
