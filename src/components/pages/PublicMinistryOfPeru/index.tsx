import Layout from '@/components/Layout'
import useAppContext from '@/hooks/useAppContext'
import * as SG from '@/styles/global'
import * as S from '@/components/pages/StepByStep/style'
import SEO from '@/components/SEO'

export default function PublicMinistryOfPeru() {
  const { state } = useAppContext()
  const { language } = state
  const { publicMinistryOfPeru, usageStories } = language
  return (
    <Layout
      headline={usageStories.headline}
      safeAreaHeight="200px"
      align="left"
    >
      <SEO
        title={publicMinistryOfPeru.headline}
        description={publicMinistryOfPeru.paragraphy_01}
      />
      <SG.Container style={{ paddingTop: 0 }}>
        <S.WrapperText>
          <SG.Headline>{publicMinistryOfPeru.headline}</SG.Headline>
          <SG.Text>
            <i>{publicMinistryOfPeru.paragraphy_01}</i>
          </SG.Text>
          <br />
          <SG.Text>
            <div
              dangerouslySetInnerHTML={{
                __html: publicMinistryOfPeru.paragraphy_02
              }}
            ></div>
          </SG.Text>
          <br />
          <img
            src={publicMinistryOfPeru.image_01}
            alt={publicMinistryOfPeru.headline}
          />
          <SG.Text>
            <i>{publicMinistryOfPeru.paragraphy_03}</i>
          </SG.Text>
          <br />
          <SG.Text>{publicMinistryOfPeru.paragraphy_04}</SG.Text>
          <br />
          <SG.Text>{publicMinistryOfPeru.paragraphy_05}</SG.Text>
          <br />
          <SG.Text>{publicMinistryOfPeru.paragraphy_05_0}</SG.Text>
          <br />
          <SG.Headline>{publicMinistryOfPeru.subTitle_01}</SG.Headline>

          <SG.Text>{publicMinistryOfPeru.paragraphy_06}</SG.Text>
          <br />
          <SG.Text>{publicMinistryOfPeru.paragraphy_07}</SG.Text>
          <br />
          <SG.Text>{publicMinistryOfPeru.paragraphy_08}</SG.Text>
          <br />
          <SG.Text>{publicMinistryOfPeru.paragraphy_09}</SG.Text>
          <br />
          <SG.Text>{publicMinistryOfPeru.paragraphy_10}</SG.Text>
          <br />
          <SG.Text>{publicMinistryOfPeru.paragraphy_11}</SG.Text>
          <br />
          <SG.Text>{publicMinistryOfPeru.paragraphy_12}</SG.Text>
          <br />
          <img
            src={publicMinistryOfPeru.image_02}
            alt={publicMinistryOfPeru.headline}
          />
          <SG.Text>
            <i>{publicMinistryOfPeru.paragraphy_13}</i>
          </SG.Text>
          <br />
          <SG.Headline>{publicMinistryOfPeru.subTitle_02}</SG.Headline>

          <SG.Text>{publicMinistryOfPeru.paragraphy_14}</SG.Text>
          <br />
          <SG.Text>{publicMinistryOfPeru.paragraphy_15}</SG.Text>
          <br />
          <SG.Text>{publicMinistryOfPeru.paragraphy_16}</SG.Text>
          <br />
          <SG.Text>{publicMinistryOfPeru.paragraphy_17}</SG.Text>
          <br />
        </S.WrapperText>
      </SG.Container>
    </Layout>
  )
}
