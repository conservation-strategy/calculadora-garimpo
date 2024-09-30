import Layout from '@/components/Layout'
import useAppContext from '@/hooks/useAppContext'
import * as SG from '@/styles/global'
import * as S from '@/components/pages/StepByStep/style'
import seoMetadata from '@/mocks/seo_metadata.json'
import SEO from '@/components/SEO'

export default function MiningMap() {
  const { state } = useAppContext()
  const { language } = state
  const { miningMap } = language
  return (
    <Layout headline={miningMap.headline} safeAreaHeight="200px" align="left">
      {/* <SEO title={miningMap.headline} description={miningMap.paragraphy_01} /> */}
      <SEO {...seoMetadata.miningMap} />
      <SG.Container style={{ paddingTop: 0 }}>
        <S.WrapperText>
          <SG.Text>{miningMap.paragraphy_01}</SG.Text>
          <br />
          <img src={miningMap.image} alt={miningMap.headline} />
          <br />
          <br />
          <SG.Text>{miningMap.paragraphy_02}</SG.Text>
        </S.WrapperText>
      </SG.Container>
    </Layout>
  )
}
