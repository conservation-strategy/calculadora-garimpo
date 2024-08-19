import Layout from '@/components/Layout'
import useAppContext from '@/hooks/useAppContext'
import * as SG from '@/styles/global'
import * as S from '@/components/pages/StepByStep/style'

export default function MultiMedia() {
  const { state } = useAppContext()
  const { language } = state
  const { multimedia } = language
  return (
    <Layout safeAreaHeight="200px" align="left" headline={multimedia.headline}>
      <SG.Container>
        <S.WrapperText>
          <SG.Text>{multimedia.paragraphy_01}</SG.Text>
        </S.WrapperText>
      </SG.Container>
    </Layout>
  )
}
