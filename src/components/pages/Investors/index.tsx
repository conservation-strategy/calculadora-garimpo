import Layout from '@/components/Layout'
import useAppContext from '@/hooks/useAppContext'

import * as S from '@/components/pages/StepByStep/style'
import SEO from '@/components/SEO'
import * as SG from '@/styles/global'

export default function Investors() {
  const { state } = useAppContext()
  const { language } = state
  const { team } = language
  const { investors } = team
  return (
    <Layout headline={investors.headline} safeAreaHeight="200px" align="left">
      <SEO title={investors.headline} />
      <SG.Container style={{ paddingTop: 0 }}>
        <S.WrapperText>
          {investors.contents.map((content) => (
            <SG.Text key={content} dangerouslySetInnerHTML={{ __html: content }}>
            </SG.Text>
          ))}
        </S.WrapperText>
      </SG.Container>
    </Layout>
  )
}
