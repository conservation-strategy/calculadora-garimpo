import Layout from '@/components/Layout'
import useAppContext from '@/hooks/useAppContext'
import * as SG from '@/styles/global'
import Link from 'next/link'
import * as S from './style'
import * as ST from '@/components/pages/StepByStep/style'
import seoMetadata from '@/mocks/seo_metadata.json'
import SEO from '@/components/SEO'

export default function PressAdvisory() {
  const { state } = useAppContext()
  const { language } = state
  const { pressAdvisory } = language
  return (
    <Layout
      headline={pressAdvisory.headline}
      safeAreaHeight="200px"
      align="left"
    >
      {/* <SEO title={pressAdvisory.headline} /> */}
      <SEO {...seoMetadata.press} />
      <SG.Container style={{ paddingTop: 0 }}>
        <ST.WrapperText>
          <SG.Text>{pressAdvisory.text_press}</SG.Text>
          <br />
          <br />
          <S.News>
            {pressAdvisory.articles.map((article) => (
              <S.NewsBox
                key={article.title}
                onClick={() => window.open(article.href)}
              >
                <S.NewsImage src={article.image} />
                <S.NewsContent>
                  <SG.Text>{article.reference}</SG.Text>
                  <SG.Headline size="24px">{article.title}</SG.Headline>
                  <SG.Text>{article.report}</SG.Text>
                  <SG.Text size="15px">{article.date}</SG.Text>
                </S.NewsContent>
              </S.NewsBox>
            ))}
          </S.News>
        </ST.WrapperText>
      </SG.Container>
    </Layout>
  )
}
