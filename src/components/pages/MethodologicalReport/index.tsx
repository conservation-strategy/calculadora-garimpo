import Layout from '@/components/Layout'
import * as SG from '@/styles/global'
import * as S from '@/components/pages/Publications/style'
import * as ST from '@/components/pages/StepByStep/style'

import useAppContext from '@/hooks/useAppContext'
import SEO from '@/components/SEO'

export default function MethodologicalReport() {
  const { state } = useAppContext()
  const { language } = state
  const { publications } = language
  const { methodology } = publications
  return (
    <Layout headline={methodology.headline} safeAreaHeight="200px" align="left">
      <SEO title={methodology.headline} description={methodology.description} />
      <SG.Container style={{ paddingTop: 0 }}>
        <ST.WrapperText>
          <SG.Text>{methodology.description}</SG.Text>
          <br />
          <S.CardPublication
            key={publications.articles[0].tagline}
            onClick={() => window.open(publications.articles[0].link)}
          >
            <S.PublicationImage src={publications.articles[0].image} />
            <S.PublicationContent>
              <SG.Headline size="20px">
                {publications.articles[0].tagline}
              </SG.Headline>
              <SG.Text>{publications.articles[0].description}</SG.Text>
              <SG.Text>{publications.articles[0].linkName}</SG.Text>

              <SG.Text weight="500">{publications.author}:</SG.Text>
              {publications.articles[0].authors.map((author) => (
                <SG.Text
                  key={author}
                  style={{ marginLeft: '15px', lineHeight: '100%' }}
                >
                  {author}
                </SG.Text>
              ))}
            </S.PublicationContent>
          </S.CardPublication>
        </ST.WrapperText>
      </SG.Container>
    </Layout>
  )
}
