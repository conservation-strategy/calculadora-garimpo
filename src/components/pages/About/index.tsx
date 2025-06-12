import Layout from '@/components/Layout'
import useAppContext from '@/hooks/useAppContext'
import * as SG from '@/styles/global'
import * as S from '@/components/pages/StepByStep/style'
import seoMetadata from '@/mocks/seo_metadata.json'
import SEO from '@/components/SEO'

export default function About() {
  const { state } = useAppContext()
  const { language } = state
  const { about } = language
  const { headline, whatIts, history } = about

  return (
    <Layout headline={headline} safeAreaHeight="200px" align="left">
      {/* <SEO title={headline} description={whatIts.paragraphy_01} /> */}
      <SEO
        title={seoMetadata.about.title}
        description={seoMetadata.about.description}
        image={seoMetadata.about.image}
      />
      <SG.Container style={{ paddingTop: 0 }}>
        <S.WrapperText>
          <SG.Headline>{whatIts.headline}</SG.Headline>
          <SG.Text>{whatIts.paragraphy_01}</SG.Text>
          <SG.Text>{whatIts.paragraphy_02}</SG.Text>
          <br />
          <br />
          <SG.Headline>{history.headline}</SG.Headline>
          <SG.Text>{history.paragraphy_01}</SG.Text>
          <SG.Text>
            <span
              dangerouslySetInnerHTML={{ __html: history.paragraphy_02 }}
            ></span>
          </SG.Text>
          <SG.Text>{history.paragraphy_03}</SG.Text>
        </S.WrapperText>
      </SG.Container>
    </Layout>
  )
}
