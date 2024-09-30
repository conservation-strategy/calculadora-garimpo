import Layout from '@/components/Layout'
import useAppContext from '@/hooks/useAppContext'

import * as SG from '@/styles/global'
import * as S from '@/components/pages/StepByStep/style'
import seoMetadata from '@/mocks/seo_metadata.json'
import SEO from '@/components/SEO'

interface CSFAndCreatosContentProps {
  contents: {
    topic: string
    content: {
      tagline: string
      lines: string[]
    }[]
  }[]
}

export const CSFAndCreatosContent = ({
  contents
}: CSFAndCreatosContentProps) => {
  return (
    <>
      {contents.map((content) => {
        return (
          <div key={content.topic}>
            <SG.Headline size="24px">&raquo; {content.topic}</SG.Headline>
            {content.content.map((item) => (
              <div key={item.tagline}>
                <SG.Headline size="20px">{item.tagline}</SG.Headline>
                {item.lines.map((line) => (
                  <SG.Text style={{ lineHeight: '100%' }} key={line}>
                    {line}
                  </SG.Text>
                ))}
                <br />
              </div>
            ))}
            <br />
            <hr />
            <br />
            <br />
          </div>
        )
      })}
    </>
  )
}

export default function CSFAndCreatos() {
  const { state } = useAppContext()
  const { language } = state
  const { team } = language
  const { CSFAndCreators } = team
  return (
    <Layout
      headline={CSFAndCreators.headline}
      safeAreaHeight="200px"
      align="left"
    >
      <SG.Container style={{ paddingBottom: 0 }}>
        <SG.Headline size="20px">{CSFAndCreators.coordination}</SG.Headline>
        <SG.Text style={{ lineHeight: '100%' }}>
          {CSFAndCreators.nameDirector}
        </SG.Text>
      </SG.Container>
      {/* <SEO title={CSFAndCreators.headline} /> */}
      <SEO {...seoMetadata.csfAndCreators} />
      <SG.Container style={{ paddingTop: 0 }}>
        <S.WrapperText>
          <CSFAndCreatosContent contents={CSFAndCreators.contents} />
        </S.WrapperText>
      </SG.Container>
    </Layout>
  )
}
