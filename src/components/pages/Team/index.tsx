import Layout from '@/components/Layout'
import useAppContext from '@/hooks/useAppContext'
import * as SG from '@/styles/global'
import * as S from './style'
import { useRouter } from 'next/router'
import { ROUTE } from '@/enums'
import seoMetadata from '@/mocks/seo_metadata.json'
import SEO from '@/components/SEO'

export default function Team() {
  const { state } = useAppContext()
  const { language } = state
  const { team } = language
  const { CSFAndCreators, partnership, investors } = team

  const route = useRouter()
  return (
    <Layout headline={team.headline} safeAreaHeight="200px" align="left">
      {/* <SEO title={team.headline} /> */}
      <SEO {...seoMetadata.team} />
      <SG.Container>
        <S.CardsContainer>
          <S.CardPartner onClick={() => route.push(ROUTE.CSFAndCreators)}>
            <SG.Headline>{CSFAndCreators.headline}</SG.Headline>
          </S.CardPartner>
          <S.CardPartner onClick={() => route.push(ROUTE.partnership)}>
            <SG.Headline>{partnership.headline}</SG.Headline>
          </S.CardPartner>
          <S.CardPartner onClick={() => route.push(ROUTE.investors)}>
            <SG.Headline>{investors.headline}</SG.Headline>
          </S.CardPartner>
        </S.CardsContainer>
      </SG.Container>
    </Layout>
  )
}
