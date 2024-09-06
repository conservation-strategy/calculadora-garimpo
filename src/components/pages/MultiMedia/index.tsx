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
          <div style={{padding: '20px', border: '1px solid', borderRadius: '15px', marginRight: '20px'}}>
            <a href='https://www.youtube.com/watch?v=ShDu_8x-R2c' target='_blank' rel="noreferrer">
              <img src='/assets/images/video-1.jpg'></img>
            </a>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
              <span>5:08</span>
              <span>12 de jul. de 2023</span>
            </div>
            <h2>
              Calculadora de Impactos de la Minería Ilegal de Oro: Entrevista a Fabiano Fernandes (MPF, Brasil)
            </h2>
          </div>
          <div style={{padding: '20px', border: '1px solid', borderRadius: '15px'}}>
            <a href='https://www.youtube.com/watch?v=Ag29apNrziA' target='_blank' rel="noreferrer">
              <img src='/assets/images/video-2.jpg'></img>
            </a>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
              <span>7:47</span>
              <span>4 de jan. de 2024</span>
            </div>
            <h2>
              Calculadora de Impactos de la Minería Ilegal de Oro en la Amazonía
            </h2>
          </div>          
        </div>
        
      </SG.Container>
    </Layout>
  )
}
