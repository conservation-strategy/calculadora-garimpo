import Layout from '@/components/Layout'
import useAppContext from '@/hooks/useAppContext'

import * as SG from '@/styles/global'
import * as S from '@/components/pages/StepByStep/style'
import SEO from '@/components/SEO'

interface PartnershipContentProps {
  contents: {
    tagline: string
    lines: string[]
  }[]
}

export const PartnershipContent = ({ contents }: PartnershipContentProps) => {
  return (
    <>
      {contents.map((item) => (
        <div key={item.tagline}>
          {item.lines.map((line) => {
            return (
              <SG.Text weight="600" style={{ lineHeight: '100%' }} key={line}>
                <div dangerouslySetInnerHTML={{ __html: line }}></div>
              </SG.Text>
            )
          })}
          <SG.Text>{item.tagline}</SG.Text>
          <br />
        </div>
      ))}
    </>
  )
}

export default function Partnership() {
  const { state } = useAppContext()
  const { language } = state
  const { team } = language
  const { partnership } = team
  return (
    <Layout headline={partnership.headline} safeAreaHeight="200px" align="left">
      <SEO title={partnership.headline} />
      <SG.Container style={{ paddingTop: 0 }}>
        <S.WrapperText>
          <PartnershipContent contents={partnership.contents} />
        </S.WrapperText>
      </SG.Container>
    </Layout>
  )
}
