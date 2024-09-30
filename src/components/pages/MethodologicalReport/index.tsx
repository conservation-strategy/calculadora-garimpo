import Layout from '@/components/Layout'
import * as S from '@/components/pages/Publications/style'
import * as ST from '@/components/pages/StepByStep/style'
import * as SG from '@/styles/global'

import seoMetadata from '@/mocks/seo_metadata.json'
import SEO from '@/components/SEO'
import useAppContext from '@/hooks/useAppContext'

export default function MethodologicalReport() {
  const { state } = useAppContext()
  const { language } = state
  const { publications } = language
  const { methodology } = publications
  return (
    <Layout headline={methodology.headline} safeAreaHeight="200px" align="left">
      {/* <SEO title={methodology.headline} description={methodology.description} /> */}
      <SEO {...seoMetadata.methodologicalReport} />
      <SG.Container style={{ paddingTop: 0 }}>
        <ST.WrapperText>
          <SG.Text>{methodology.description}</SG.Text>
          <br />
          {publications.articles.filter(x => x.type == 'methodology').map((article) => (
            <S.CardPublication
              key={article.tagline}
              onClick={() => window.open(article.link)}
            >
              <S.PublicationImage src={article.image} />
              <S.PublicationContent>
                <SG.Headline size="20px">{article.tagline}</SG.Headline>
                <SG.Text>{article.description}</SG.Text>
                <SG.Text>{article.linkName}</SG.Text>

                <SG.Text weight="500">{publications.author}:</SG.Text>
                {article.authors.map((author) => (
                  <SG.Text
                    key={author}
                    style={{ marginLeft: '15px', lineHeight: '100%' }}
                  >
                    {author}
                  </SG.Text>
                ))}
              </S.PublicationContent>
            </S.CardPublication>
          ))}
        </ST.WrapperText>
      </SG.Container>
    </Layout>
  )
}
