import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import useAppContext from "@/hooks/useAppContext";
import seoMetadata from '@/mocks/seo_metadata.json';
import * as SG from '@/styles/global';
import * as S from './style';
import FormMap from "@/components/FormMap";
import Image from "next/image";
import { useEffect, useState } from "react";
import { calculateMapImpacts, LocationImpact } from "@/lib/map";
import { countryCodes } from "@/enums";
import { CalculatorArgs } from "@/lib/calculator";
import { usePriceData } from "@/store/api";
import ResultsMap, { ResultsMapProps } from "@/components/ResultsMap";
import { valueHypothesis } from "@/lib/calculator/store";
import { formDefaultValues } from "@/components/FormMap";
import { ResultsProps } from "@/store/state/proveider";
import { DataImpacts } from "@/hooks/useCalculator";
import { consolidateImpacts } from "./location-impacts";
import { useMapResults } from "./useMapResults";

const locations = [
    {
        city: "Palca",
        affectedArea: 4,
        country: countryCodes.BO
    }
] as CalculatorArgs[];


export default function MapCalculator() {
    const { state } = useAppContext();
    const { language } = state;
    const { map, calculator } = language;
    const { safeArea } = map;
    // const { inflationData, goldPriceData, dollarPriceData } = usePriceData();

    const [formInputs, setFormInputs] = useState(formDefaultValues);
    // const [results, setResults] = useState<ResultsMapProps | null>(null);
    const [impacts, setImpacts] = useState<LocationImpact[]>([]);
    const [error, setError] = useState<any>(null);

    const results = useMapResults({ impacts, inputs: formInputs, locations });

    const onSubmit = () => {
        try {
            const impacts = calculateMapImpacts({ locations, pitDepth: Number(formInputs.pitDepth) });
            setImpacts(impacts);
            console.log(impacts)
        } catch (err: any) {
            console.error(err);
        }
    };
    

    return (
        <Layout headline={safeArea.headline} safeAreaHeight="200px" align="left" isCalculator>
            <SEO
            title={seoMetadata.calculator.title}
            description={seoMetadata.calculator.description}
            image={seoMetadata.calculator.image}
            />
            <SG.Container fontSize='12.8px'>
                <S.MapContainerGrid>
                    {/* <S.FormGuideContainer> */}
                        <div 
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0
                        }}
                        >
                            <SG.Headline style={{ transform: 'translateY(-1.5rem)' }}>
                                {safeArea.headline}
                            </SG.Headline>
                        </div>
                        <S.GuideContainer>
                            <SG.Text>
                                Essa é uma integração da <strong>Calculadora de Impactos do Garimpo</strong> com o mapa interativo da <strong>Amazon Mining Watch&copy;</strong>.
                                <br/>
                                <br/>
                                Para usar:                 
                            </SG.Text>
                                <SG.OList>
                                    <li style={{ marginBlock: '1em'}}>
                                        Foque o mapa na área desejada
                                    </li>
                                    <li style={{ marginBlock: '1em'}}>
                                        Altere os parâmetros do formulário de acordo com o caso analisado
                                    </li>
                                    <li style={{ marginBlock: '1em'}}>
                                        Clique em calcular
                                    </li>
                                </SG.OList>                       
                        </S.GuideContainer>
                        <S.FormWrapper>
                            <FormMap onSubmit={onSubmit}/>
                        </S.FormWrapper>                        
                    {/* </S.FormGuideContainer> */}
                    <S.Map>
                        {/* <Image
                        src={'/assets/images/AMW_map.png'}
                        alt="map"
                        fill
                        style={{ objectFit: 'cover' }}
                        /> */}
                        <iframe
                        src="https://amazonminingwatch.org/en"
                        width="100%"
                        height="100%"
                        title="Amazon Mining Watch"
                        >                                
                        </iframe>
                    </S.Map>                                            
                </S.MapContainerGrid>
            </SG.Container>
            {!!results &&
            <SG.Container>
                <ResultsMap {...results} />
            </SG.Container>}
        </Layout>
    )
}