import Layout from '@/components/Layout'

import * as S from './style'
import * as SG from '@/styles/global'
import useAppContext from '@/hooks/useAppContext'
import seoMetadata from '@/mocks/seo_metadata.json'
import { useRouter } from 'next/router'
import { ROUTE } from '@/enums'
import SEO from '@/components/SEO'

export default function Home() {
  const { state } = useAppContext()
  const route = useRouter()
  const { language } = state
  const { home } = language
  const { safeArea, introduction, titlevideo, impacts, news } = home

  return (
    <Layout
      isHome
      headline={safeArea.headline}
      SafeAreaCTA={
        <S.Buttons>
          <SG.Button
            onClick={() => route.push(ROUTE.stepByStep)}
            variant="primary"
          >
            {safeArea.buttonActions.introduction}
          </SG.Button>
          <SG.Button
            onClick={() => route.push(ROUTE.calculator)}
            variant="primary"
          >
            {safeArea.buttonActions.calculator}
          </SG.Button>
        </S.Buttons>
      }
    >
      {/* <SEO
        title={language.header.title_CSF.headline}
        description={safeArea.headline}
      /> */}
      <SEO
        title={seoMetadata.home.title}
        description={seoMetadata.home.description}
        image={seoMetadata.home.image}
      />
      <SG.Container>
        <S.AboutCalculator>
          <div>
            <SG.Headline>{introduction.headline}</SG.Headline>
            <SG.Text>{introduction.paragraphy_o1}</SG.Text>
            {introduction.list.map((item, index) => (
              <SG.Text
                key={item.label}
                style={{ marginLeft: '16px', marginBottom: '32px' }}
              >
                <span>{index + 1}. </span>
                <span style={{ fontWeight: '700' }}>{item.label}</span>
              </SG.Text>
            ))}
          </div>
          <div>
            <SG.Headline>{titlevideo.headline}</SG.Headline>
            <SG.Embed>
              <iframe
                width="560"
                height="315"
                src={titlevideo.tutorialvideo}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </SG.Embed>
          </div>
        </S.AboutCalculator>
      </SG.Container>
      <S.ImpactsWrapper>
        <SG.Container>
          <SG.Headline>{impacts.headline}</SG.Headline>
          <S.CardsWrapper>
            {impacts.list.map((item) => (
              <S.Card key={item.title}>
                <S.CardHeader>
                  <S.CardIcon src={item.icon} />
                </S.CardHeader>
                <SG.Text align="left" weight="600">
                  {item.title}
                </SG.Text>
                <SG.Text align="left">{item.description}</SG.Text>
                <S.CardButton
                  onClick={() => route.push(`/impact/${item.slug}`)}
                >
                  {item.button}
                </S.CardButton>
              </S.Card>
            ))}
          </S.CardsWrapper>
        </SG.Container>
      </S.ImpactsWrapper>
      <SG.Container>
        <SG.Headline>{news.headline}</SG.Headline>
        <S.NewsWrapper>
          {news.list.map((item) => (
            <S.NewsPost key={item.slug}>
              <S.NewsPostImage src={item.image} alt={item.title} />
              <S.NewsPostContent>
                <SG.Text weight="600" size="22px">
                  {item.title}
                </SG.Text>
                <SG.Text>{item.description}</SG.Text>
                <S.NewsPostLink href={item.slug}>{item.action}</S.NewsPostLink>
              </S.NewsPostContent>
            </S.NewsPost>
          ))}
        </S.NewsWrapper>
      </SG.Container>
    </Layout>
  )
}
