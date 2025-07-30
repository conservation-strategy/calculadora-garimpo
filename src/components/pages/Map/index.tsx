import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import useAppContext from "@/hooks/useAppContext";
import seoMetadata from '@/mocks/seo_metadata.json';
import * as SG from '@/styles/global';
import * as S from './style';
import FormMap from "@/components/FormMap";
import Image from "next/image";
import { useEffect, useState } from "react";
import calculateMapImpacts, { LocationImpact } from "@/lib/map/map-calculator";
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
            const impacts = calculateMapImpacts(locations);
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
                    <FormMap onSubmit={onSubmit}/>
                </S.MapContainer>
            </SG.Container>
            {!!results &&
            <SG.Container>
                <ResultsMap {...results} />
            </SG.Container>}
        </Layout>
    )
}