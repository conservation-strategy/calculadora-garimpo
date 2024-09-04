import Layout from '@/components/Layout'
import * as S from '@/components/pages/StepByStep/style'
import SEO from '@/components/SEO'
import useAppContext from '@/hooks/useAppContext'
import * as SG from '@/styles/global'

export default function Cases() {
  const { state } = useAppContext()
  const { language } = state
  const { cases } = language
  return (
    <Layout headline={cases.headline} safeAreaHeight="200px" align="left">
      <SEO title={cases.headline} description={cases.paragraphy_01} />
      <SG.Container style={{ paddingTop: 0 }}>
        <S.WrapperText>
          <SG.Text>{cases.paragraphy_01}</SG.Text>
          {cases.contents.map((content) => (
            <SG.Text key={content} dangerouslySetInnerHTML={{ __html: content }}>
            </SG.Text>
          ))}
        </S.WrapperText>
      </SG.Container>
    </Layout>
  )
}
