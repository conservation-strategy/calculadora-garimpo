import Layout from '@/components/Layout'
import useAppContext from '@/hooks/useAppContext'
import * as SG from '@/styles/global'
import * as S from './style'
import * as ST from '@/components/pages/StepByStep/style'
import SEO from '@/components/SEO'

export default function Publications() {
  const { state } = useAppContext()
  const { language } = state
  const { publications } = language
  const { methodology, ScientificArticle } = publications
  const publicationsWithoutMethodology = [...publications.articles]
  publicationsWithoutMethodology.shift()
  return (
    <Layout
      headline={publications.headline}
      safeAreaHeight="200px"
      align="left"
    >
      <SEO title={publications.headline} />
      <SG.Container style={{ paddingTop: 0 }}>
        <ST.WrapperText>
          <SG.Headline>{methodology.headline}</SG.Headline>
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
          <SG.Headline>{ScientificArticle.headline}</SG.Headline>
          <SG.Text>{ScientificArticle.description}</SG.Text>
          <br />
          {publicationsWithoutMethodology.map((article) => (
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
