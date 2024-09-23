import Layout from '@/components/Layout'
import useAppContext from '@/hooks/useAppContext'
import * as SG from '@/styles/global'
import * as S from '@/components/pages/StepByStep/style'
import seoMetadata from '@/mocks/seo_metadata.json'
import SEO from '@/components/SEO'

export default function PartnershipWithMpf() {
  const { state } = useAppContext()
  const { language } = state
  const { partnershipMPF, usageStories } = language
  return (
    <Layout
      headline={usageStories.headline}
      safeAreaHeight="200px"
      align="left"
    >
      {/* <SEO
        title={partnershipMPF.headline}
        description={partnershipMPF.paragraphy_01}
      /> */}
      <SEO
        title={seoMetadata.partnership.title}
        description={seoMetadata.partnership.description}
        image={seoMetadata.partnership.image}
      />
      <SG.Container style={{ paddingTop: 0 }}>
        <S.WrapperText>
          <SG.Headline>{partnershipMPF.headline}</SG.Headline>

          <SG.Text>{partnershipMPF.paragraphy_01}</SG.Text>
          <br />
          <img src={partnershipMPF.image} alt={partnershipMPF.headline} />
          <SG.Text>
            <i>{partnershipMPF.paragraphy_02}</i>
          </SG.Text>
          <br />
          <SG.Text>{partnershipMPF.paragraphy_03}</SG.Text>
          <br />
          <SG.Text>{partnershipMPF.paragraphy_04}</SG.Text>
          <br />
          <SG.Text>{partnershipMPF.paragraphy_05}</SG.Text>
          <br />
          <SG.Text>{partnershipMPF.paragraphy_06}</SG.Text>
          <br />
          <SG.Text>{partnershipMPF.paragraphy_07}</SG.Text>
          <br />
          <SG.Text>{partnershipMPF.paragraphy_08}</SG.Text>
          <br />
        </S.WrapperText>
      </SG.Container>
    </Layout>
  )
}
