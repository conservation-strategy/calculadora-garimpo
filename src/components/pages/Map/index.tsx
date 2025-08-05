import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import useAppContext from "@/hooks/useAppContext";
import seoMetadata from '@/mocks/seo_metadata.json';
import * as SG from '@/styles/global';
import * as S from './style';
import FormMap from "@/components/FormMap";
import { useEffect, useRef, useState } from "react";
import { calculateMapImpacts, LocationImpact } from "@/lib/map";
import { countryCodes } from "@/enums";
import { CalculatorArgs } from "@/lib/calculator";
import ResultsMap from "@/components/ResultsMap";
import { formDefaultValues } from "@/components/FormMap";
import { useMapResults } from "./useMapResults";

const locations = [
    {
        city: "Palca",
        affectedArea: 4,
        country: countryCodes.BO
    },
    {
        city: "putumayo",
        affectedArea: 4,
        country: countryCodes.CO
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
    const resultsRef = useRef<HTMLDivElement>(null);

    const results = useMapResults({ impacts, inputs: formInputs, locations });

    const onSubmit = async () => {
        try {
            const impacts = await calculateMapImpacts({ locations, pitDepth: Number(formInputs.pitDepth) });
            setImpacts(impacts);
            console.log(impacts)
        } catch (err: any) {
            console.error(err);
        }
    };

    useEffect(() => {
        if(results && resultsRef.current) {
            const top = resultsRef.current.offsetTop
            window.scrollTo({ top, behavior: 'smooth'})
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [results]);
    

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
                                This is an integration of the <strong>Mining Impact Calculator</strong> with the interactive map from <strong>Amazon Mining Watch&copy;</strong>.
                                <br/>
                                <br/>
                                How to use:                 
                            </SG.Text>
                                <SG.OList>
                                    <li style={{ marginBlock: '1em'}}>
                                        Focus the map on your area of interest
                                    </li>
                                    <li style={{ marginBlock: '1em'}}>
                                        Adjust the form inputs as needed
                                    </li>
                                    <li style={{ marginBlock: '1em'}}>
                                        Click 'Calculate Impacts' to see the results
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
            <SG.Container ref={resultsRef}>
                <ResultsMap {...results} />
            </SG.Container>}
        </Layout>
    )
}