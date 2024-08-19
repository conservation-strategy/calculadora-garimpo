import Layout from '@/components/Layout'
import useAppContext from '@/hooks/useAppContext'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import * as SG from '@/styles/global'
import * as S from '@/components/pages/StepByStep/style'

import { TypeInfographic } from '@/components/ResultsCalculator'
import SEO from '@/components/SEO'

export type ImpactTypesPage = 'deforestation' | 'silting-of-rivers' | 'mercury'

export default function Impact() {
  const [contentPage, setContent] = useState<any>(null)

  const { state } = useAppContext()
  const { language } = state
  const { home } = language
  const { impacts } = home
  const route = useRouter()
  const { query } = route
  const { impactType } = query

  const getInfographic = useCallback(
    (type: TypeInfographic) => {
      return `/assets/infographic/${type}_${language.id}.svg`
    },
    [language]
  )

  useEffect(() => {
    if (impactType) {
      if (impactType === 'silting-of-rivers') {
        setContent({ ...impacts.list[1], infographic: 'siltingOfRivers' })
      } else if (impactType === 'mercury') {
        setContent({ ...impacts.list[2], infographic: 'mercury' })
      } else if (impactType === 'deforestation') {
        setContent({ ...impacts.list[0], infographic: 'deforestation' })
      } else {
        route.push('/404')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [impactType])
  if (!contentPage) {
    return <></>
  }
  return (
    <Layout headline={contentPage.title} safeAreaHeight="200px" align="left">
      <SEO title={contentPage.title} description={contentPage.description} />
      <SG.Container style={{ paddingTop: 0 }}>
        <S.WrapperText>
          <SG.Text>{contentPage.description}</SG.Text>
          <img
            src={getInfographic(contentPage.infographic)}
            alt={contentPage.title}
          />
        </S.WrapperText>
      </SG.Container>
    </Layout>
  )
}
