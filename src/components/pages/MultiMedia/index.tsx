import Layout from '@/components/Layout'
import * as S from '@/components/pages/StepByStep/style'
import useAppContext from '@/hooks/useAppContext'
import * as SG from '@/styles/global'

export default function MultiMedia() {
  const { state } = useAppContext()
  const { language } = state
  const { multimedia } = language
  return (
    <Layout safeAreaHeight="200px" align="left" headline={multimedia.headline}>
      <SG.Container>
        <S.WrapperText>
          <SG.Text>{multimedia.paragraphy_01}</SG.Text>
        </S.WrapperText>
        <div style={{display: 'flex'}}>
          <iframe width="100%" height="480" 
            src="https://www.youtube.com/embed/ShDu_8x-R2c" 
            title="Calculadora de Impactos de la Minería Ilegal de Oro: Entrevista a Fabiano Fernandes (MPF, Brasil)" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share">
          </iframe>
          <iframe width="100%" height="480" 
            src="https://www.youtube.com/embed/Ag29apNrziA" 
            title="Resumen: Calculadora de Impactos de la Minería Ilegal de Oro en la Amazonía" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share">
          </iframe>
        </div>
        
      </SG.Container>
    </Layout>
  )
}
