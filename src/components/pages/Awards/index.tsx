import Layout from '@/components/Layout'
import useAppContext from '@/hooks/useAppContext'
import * as SG from '@/styles/global'
import * as S from '@/components/pages/Home/style'
import * as ST from '@/components/pages/StepByStep/style'
import { ROUTE } from '@/enums'
import { useRouter } from 'next/router'
import seoMetadata from '@/mocks/seo_metadata.json'
import SEO from '@/components/SEO'

export default function Awards() {
  const { state } = useAppContext()
  const { language } = state
  const { awards, home } = language
  const route = useRouter()
  return (
    <Layout headline={awards.headline} safeAreaHeight="200px" align="left">
      {/* <SEO title={awards.headline} /> */}
      <SEO {...seoMetadata.awards} />
      <SG.Container style={{ paddingTop: 0 }}>
        <ST.WrapperText>
          <S.NewsPost onClick={() => route.push(ROUTE.conservationXLabs)}>
            <S.NewsPostImage
              src={home.news.list[1].image}
              alt={home.news.list[1].title}
            />
            <S.NewsPostContent>
              <SG.Text weight="600" size="22px">
                {home.news.list[1].title}
              </SG.Text>
              <SG.Text>{home.news.list[1].description}</SG.Text>
              <S.NewsPostLink href={ROUTE.conservationXLabs}>
                {home.news.list[1].action}
              </S.NewsPostLink>
            </S.NewsPostContent>
          </S.NewsPost>
        </ST.WrapperText>
      </SG.Container>
    </Layout>
  )
}
