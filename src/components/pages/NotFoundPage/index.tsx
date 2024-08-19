import Layout from '@/components/Layout'
import * as SG from '@/styles/global'
import * as S from '@/components/pages/StepByStep/style'
import SEO from '@/components/SEO'
import useAppContext from '@/hooks/useAppContext'

export default function NotFoundPage() {
  const { state } = useAppContext()
  const { language } = state
  const { notFound } = language
  return (
    <Layout headline={notFound.title} safeAreaHeight="200px" align="left">
      <SEO
        title={'404 Not Found'}
        description="Oops 404! We couldn't find the path you were trying to access."
      />
      <SG.Container style={{ paddingTop: 0 }}>
        <S.WrapperText>
          <SG.Headline>{notFound.headline}</SG.Headline>
        </S.WrapperText>
      </SG.Container>
    </Layout>
  )
}
