import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import useAppContext from "@/hooks/useAppContext";
import seoMetadata from '@/mocks/seo_metadata.json';
import * as SG from '@/styles/global';
import * as S from './style';
import FormMap from "@/components/FormMap";
import Image from "next/image";



export default function MapCalculator() {
    const { state } = useAppContext();
    const { language } = state;
    const { map } = language;
    const { safeArea } = map;

    return (
        <Layout headline={safeArea.headline} safeAreaHeight="200px" align="left" isCalculator>
            <SEO
            title={seoMetadata.calculator.title}
            description={seoMetadata.calculator.description}
            image={seoMetadata.calculator.image}
            />
            <SG.Container fontSize='12.8px' style={{ paddingLeft: 0 }}>
                <S.MapContainer>
                    <div>
                        <SG.Headline style={{ transform: 'translateY(-1.5rem)' }}>
                            {safeArea.headline}
                        </SG.Headline>
                        <S.Map>
                            <Image
                            src={'/assets/images/AMW_map.png'}
                            alt="map"
                            fill
                            style={{ objectFit: 'cover' }}
                            />
                        </S.Map>                        
                    </div>
                    <FormMap/>
                </S.MapContainer>
            </SG.Container>
        </Layout>
    )
}