import Layout from '@/components/Layout'
import * as SG from '@/styles/global'
import * as SHome from '@/components/pages/Home/style'
import * as S from './style'
import useAppContext from '@/hooks/useAppContext'
import { useRouter } from 'next/router'
import { ROUTE } from '@/enums'
import SEO from '@/components/SEO'

export default function UsageStories() {
  const { state } = useAppContext()
  const { language } = state
  const { usageStories } = language
  const route = useRouter()
  return (
    <Layout
      headline={usageStories.headline}
      safeAreaHeight="200px"
      align="left"
    >
      <SEO
        title={usageStories.headline}
        description={usageStories.paragraphy_01}
      />
      <SG.Container>
        <S.ListWrapper>
          <div>
            <SG.Text>{usageStories.paragraphy_01}</SG.Text>

            <S.WrapperNews>
              {usageStories.articles.map((article) => (
                <SHome.NewsPost
                  key={article.slug}
                  onClick={() => route.push(article.slug)}
                  position="vertical"
                >
                  <SHome.NewsPostImage
                    src={article.image}
                    alt={article.title}
                  />
                  <SHome.NewsPostContent>
                    <SG.Text weight="600" size="22px">
                      {article.title}
                    </SG.Text>
                    <SG.Text>{article.description}</SG.Text>
                    <SHome.NewsPostLink href={article.slug}>
                      {article.action}
                    </SHome.NewsPostLink>
                  </SHome.NewsPostContent>
                </SHome.NewsPost>
              ))}
            </S.WrapperNews>

            <br />
          </div>
          <div></div>
        </S.ListWrapper>
      </SG.Container>
    </Layout>
  )
}
