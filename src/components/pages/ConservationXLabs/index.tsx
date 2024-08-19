import Layout from '@/components/Layout'
import useAppContext from '@/hooks/useAppContext'
import * as SG from '@/styles/global'
import * as S from '@/components/pages/StepByStep/style'
import SEO from '@/components/SEO'

export default function ConservationXLabs() {
  const { state } = useAppContext()
  const { language } = state
  const { awards, home } = language
  const { news } = home
  return (
    <Layout headline={news.list[1].title} safeAreaHeight="200px" align="left">
      <SEO title={news.list[1].title} description={awards.paragraphy_01} />
      <SG.Container style={{ paddingTop: 0 }}>
        <S.WrapperText>
          <SG.Text>{awards.paragraphy_01}</SG.Text>
          <br />
          <img src={awards.image} alt={awards.headline} />
          <br />
          <br />
          <SG.Text>{awards.paragraphy_02}</SG.Text>
        </S.WrapperText>
      </SG.Container>
    </Layout>
  )
}
