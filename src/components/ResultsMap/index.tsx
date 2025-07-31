import * as S from './style'
import * as SG from '@/styles/global'
import ResumeCharts, { ResumeChartsProps } from '../Charts/Resume'
import { createRef, useCallback, useEffect, useMemo, useState } from 'react'
import useAppContext from '@/hooks/useAppContext'
import ImpactChart from '../Charts/Impact'
import useResults, { Tabs } from '@/hooks/useResults'
import useReport from '@/hooks/useReport'
import useResize from '@/hooks/useResize'
import { event as gaEvent } from "nextjs-google-analytics";
import useCountry from '@/hooks/useCountry'
import { usePriceData } from '@/store/api'
import { ResultsProps } from '@/store/state/proveider'
import { inflationBackupValues } from '@/lib/api'
import { sumValues } from '@/utils/filterValues'
import { countryCodes, currency, usesValuesTypes } from '@/enums'
import { DataImpacts } from '@/hooks/useCalculator'
import { FormInputs } from '../FormMap'
import { CalculatorArgs, getCountryData } from '@/lib/calculator'
import { hectareToGold } from '@/lib/calculator/gold'
import useFixedCalculator from '@/hooks/useFixedCalculator'
import toUSD from '@/utils/toUSD'

export interface TotalImpactPerLocation extends CalculatorArgs {
  totalImpact: number;
}

export interface ResultsMapProps extends ResultsProps {
    // locations: CalculatorArgs[];
    totalImpacts: TotalImpactPerLocation[];
    totalGold: number;
    formInputs: FormInputs;
}

const getImpactSubtotal = (impact: DataImpacts[]) => {
  return impact.reduce((sum, item) => sum + item.value, 0);
}

export default function ResultsMap({
    totalImpacts,
    totalGold,
    deforestation,
    mercury,
    siltingOfRivers,
    impactsNotMonetary,
    formInputs,
} : ResultsMapProps) {
    const { state }= useAppContext();
    const { language } = state;
    const { calculator } = language;
    const { inflationData, goldPriceData } = usePriceData();
    const { currentCountry } = useCountry();

    const [textUsesTypes, setTextUsesTypes] = useState('');
    const [resumeDataChart, setResumeDataChart] = useState<ResumeChartsProps[]>([]);
    const [totalGoldValue, setTotalGoldValue] = useState<number | null>(null);
    // const { general } = useFixedCalculator();

    const correctForInflation = useCallback((value: number ) => {
        try {
            const rate = inflationData.data 
                ? inflationData.data 
                : currentCountry 
                    ? inflationBackupValues[currentCountry?.country]
                    : null
            if(rate === null) throw new Error("Could not retrieve inflation data from neither primary nor backup source.");
            return value * (1 + rate / 100);
        } catch(err: any) {
            console.error(err);
            return value;
        }
    }, [inflationData.data]);

    const totalAffectedArea = useMemo(
      () => totalImpacts.reduce((sum, location) => sum + location.affectedArea, 0),
    [totalImpacts]);

    // const totalGold = useMemo(() => {
    //   const pitDepth = Number(formInputs.pitDepth);
    //   const { general } = getCountryData(countryCodes.BO);
    //   const cavaAverageProductivity = general ? general.cavaAverageProductivity : 0;
    //   const excavationGoldLoss = general ? general.excavationGoldLoss : 0;
    //   return hectareToGold({ 
    //     pitDepth, 
    //     area: totalAffectedArea, 
    //     cavaAverageProductivity, 
    //     excavationGoldLoss 
    //   })
    // } , [
    //   formInputs,
    //   totalAffectedArea
    // ]);

    /** correct monetary values for inflation */
    const totalImpactCorrected = useMemo(
      () => correctForInflation(totalImpacts.reduce((sum, impact) => sum + impact.totalImpact, 0)),
      [correctForInflation, totalImpacts]
    );

    console.log("total impacts prop", totalImpacts);
    console.log('total correctet', totalImpactCorrected);

  
    /**calculate gold value */
    useEffect(() => {    
      const goldPrice = goldPriceData.data ?? currency.gold;
      if(!goldPriceData.data) console.warn('Using backup hardcoded value for goldPrice');
      const goldValueUSD = totalGold * goldPrice;
      setTotalGoldValue(goldValueUSD);
    },[
      totalGold,
      goldPriceData
    ]);

    const handleDownload = () => {}

    /** get useTypes text content */
    useEffect(() => {
        let textUsesTypes = '';
        const { calculator } = language;
        const { valuation } = calculator;
        const useType = formInputs.usesTypes;
    
        if (useType === usesValuesTypes.environmental) {
            textUsesTypes = valuation.environmental.replace('$value', 'totalMonetary');
        } else if (useType === usesValuesTypes.planning) {
            textUsesTypes = valuation.planning.replace('$value', 'totalMonetary');
        } else if (useType === usesValuesTypes.technology) {
            textUsesTypes = valuation.technology
            .replace('$valueImpact', totalImpactCorrected.toFixed(2))
            // .replace('$valueMercury', totalMercury)
        }
        setTextUsesTypes(textUsesTypes)
      }, [
        // totalMonetary, 
        // totalMercury, 
        totalImpacts, 
        language
    ]);

    /** format resume chart data
     * TODO: move block to useResutls
    */
    useEffect(() => {
        const totalDeforestation = correctForInflation(getImpactSubtotal(deforestation));
        const totalSilting = correctForInflation(getImpactSubtotal(siltingOfRivers));
        const totalMercury = correctForInflation(getImpactSubtotal(mercury));

        setResumeDataChart([
            {
                [calculator.resume.component_graphics_desforestation]:
                    totalDeforestation,
                [calculator.resume.component_graphics_silting]:
                    totalSilting,
                [calculator.resume.component_graphics_mercury]:
                    totalMercury,
                [calculator.resume.component_graphics_gold]: totalGoldValue ?? 0
            }
        ]);
    }, [
        calculator,
        correctForInflation,
        deforestation,
        siltingOfRivers,
        mercury,
        totalGoldValue
    ]);

    return (
        <S.Container>
          {/* {loadingPDF === true && (
            <>
              <S.Overlay />
              <SG.Container
              style={{ 
                position: 'fixed',
                top: '30%', 
                left: 0, 
                width: '100%', 
                zIndex: '999', 
                display: 'flex', 
                justifyContent: 'center' 
              }}
              >
                <S.LoadingWrapper>
                  <img src="/assets/images/checklist.gif" width={80} alt="" />
                  <SG.Text>{pdf.loading}</SG.Text>
                </S.LoadingWrapper>
              </SG.Container>
            </>
          )} */}
    
          <S.ResultsHeadline>
            <SG.Headline weight="300" color={SG.colors.primary}>
              {calculator.resume.results}          
            </SG.Headline>
    
          </S.ResultsHeadline>
          <S.ButtonPDF>
            <SG.Button variant="primary" onClick={handleDownload}>
              <i className="fi fi-rr-document" style={{ fontSize: '20px' }}></i>
              {"Download PDF"}
            </SG.Button>
          </S.ButtonPDF>
          <S.ValuesWrapper>
            <SG.Headline>{calculator.resume.monetary_impacts}</SG.Headline>
            <SG.Text>Tabela Resumo</SG.Text>
            <br />
            <SG.Text>{calculator.resume.total_impacts}</SG.Text>
            <SG.Text
              weight="600"
              color="#2D7CA8"
              size="30px"
              style={{ marginBottom: 0 }}
            >
              {toUSD(totalImpactCorrected)}
            </SG.Text>
            <SG.Text size="15px">
              {calculator.resume.TextTotalImpacts.impactedArea.replace('$value', `${totalAffectedArea}`)}
            </SG.Text>
            <br />
            <br />
            <SG.Text>{calculator.resume.total_gold}</SG.Text>
            <SG.Text
              weight="600"
              color="#D2B754"
              size="30px"
              style={{ marginBottom: 0 }}
            >
              {toUSD(totalGoldValue ?? 0)}
            </SG.Text>
            <SG.Text size="15px">
              {calculator.resume.TextTotalImpacts.amoutGold.replace('$value', `${Math.ceil(totalGold)}`)}
            </SG.Text>
            <br />
            <br />
            <SG.Text>{calculator.resume.total_monetary}</SG.Text>
            <SG.Text
              weight="600"
              color="#D93410"
              size="30px"
              style={{ marginBottom: 0 }}
            >
              {toUSD(totalImpactCorrected + (totalGoldValue ?? 0))}
            </SG.Text>
            <SG.Text size="15px">{calculator.resume.custom_label_monetary_total}</SG.Text>
          </S.ValuesWrapper>
    
          <S.ImpactTextValuation>
            <SG.Headline>{calculator.valuation.headline}</SG.Headline>
            <SG.Text>{textUsesTypes}</SG.Text>
          </S.ImpactTextValuation>
          <S.GraphicResume>
            <ResumeCharts data={resumeDataChart} />
          </S.GraphicResume>
    
          {/* <div style={{ gridArea: 'charts-preview' }}>
            {showChartsPrint && (
              <div>
                <div id="resumeChart">
                  <ResumeCharts version="v1" data={resumeDataChart} />
                </div>
                <div id="chartDeforestation">
                  <ImpactChart
                    version="v1"
                    cy={cyCustomDeforestation}
                    data={deforastationDataChart}
                  />
                </div>
                <div id="chartSiltingOfRiver">
                  <ImpactChart
                    version="v1"
                    cy={cyCustomSiltingOfRivers}
                    data={siltingOfRiversDataChart}
                  />
                </div>
                <div id="chartMercury">
                  <ImpactChart
                    version="v1"
                    cy={cyCustomMercury}
                    data={mercuryRiversDataChart}
                  />
                </div>
              </div>
            )}
          </div>
    
          <S.TapWrapper>
            <S.TabHeader>
              {deforastationDataChart.length > 0 ? (
                <S.TabHeaderItem
                  active={tabDeforestation}
                  onClick={() => settab(Tabs.deforastation)}
                >
                  <SG.Text size="24px" align="center" weight="600">
                    {deforestation.headline}
                  </SG.Text>
                </S.TabHeaderItem>
              ) : (
                <></>
              )}
    
              <S.TabHeaderItem
                active={tabSiltingOfRivers}
                onClick={() => settab(Tabs.siltingOfRivers)}
              >
                <SG.Text size="24px" align="center" weight="600">
                  {siltingOfRivers.headline}
                </SG.Text>
              </S.TabHeaderItem>
              <S.TabHeaderItem
                active={tabMercury}
                onClick={() => settab(Tabs.mercury)}
              >
                <SG.Text size="24px" align="center" weight="600">
                  {mercuryContamination.headline}
                </SG.Text>
              </S.TabHeaderItem>
            </S.TabHeader>
            <S.TabContent>
              <S.TabContentITem active={tabActive === Tabs.deforastation}>
                <S.TabContentItemText>
                  {textDeforestation && (
                    <>
                      <SG.Text>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: textDeforestation.paragraphy_01
                          }}
                        ></div>
                      </SG.Text>
                      <SG.Text>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: textDeforestation.paragraphy_02
                          }}
                        ></div>
                      </SG.Text>
                    </>
                  )}
                </S.TabContentItemText>
                <S.WrapperGraphic>
                  <ImpactChart
                    cy={
                      ismobileOrTablet
                        ? deforastationDataChart.length < 5
                          ? 200
                          : 170
                        : cyCustomDeforestation
                    }
                    data={deforastationDataChart}
                  />
                </S.WrapperGraphic>
                <S.WrapperInfografic>
                  {infographicDeforestation && (
                    <S.Infographic
                      src={infographicDeforestation}
                      alt={deforestation.headline}
                    />
                  )}
                </S.WrapperInfografic>
              </S.TabContentITem>
              <S.TabContentITem active={tabActive === Tabs.siltingOfRivers}>
                <S.TabContentItemText>
                  {textSiltingOfRivers && (
                    <>
                      <SG.Text>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: textSiltingOfRivers.paragraphy_01
                          }}
                        ></div>
                      </SG.Text>
                      <SG.Text>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: textSiltingOfRivers.paragraphy_02
                          }}
                        ></div>
                      </SG.Text>
                    </>
                  )}
                </S.TabContentItemText>
                <S.WrapperGraphic>
                  <ImpactChart
                    cy={ismobileOrTablet ? 240 : cyCustomSiltingOfRivers}
                    data={siltingOfRiversDataChart}
                  />
                </S.WrapperGraphic>
                <S.WrapperInfografic>
                  {infographicSiltingOfRivers && (
                    <S.Infographic
                      src={infographicSiltingOfRivers}
                      alt={siltingOfRivers.headline}
                    />
                  )}
                </S.WrapperInfografic>
              </S.TabContentITem>
              <S.TabContentITem active={tabActive === Tabs.mercury}>
                <S.TabContentItemText>
                  {textMercury && (
                    <>
                      <SG.Text>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: textMercury.paragraphy_01
                          }}
                        ></div>
                      </SG.Text>
                    </>
                  )}
                </S.TabContentItemText>
                <S.WrapperGraphic>
                  <ImpactChart
                    cy={ismobileOrTablet ? 190 : cyCustomMercury}
                    data={mercuryRiversDataChart}
                  />
                </S.WrapperGraphic>
                <S.WrapperInfografic>
                  {infographicMercury && (
                    <S.Infographic
                      src={infographicMercury}
                      alt={mercuryContamination.headline}
                    />
                  )}
                </S.WrapperInfografic>
              </S.TabContentITem>
    
              <S.TableWrapper>
                <SG.Headline>{notMonetary.headline}</SG.Headline>
                <S.TableResponsive>
                  <S.Table>
                    <thead>
                      <tr>
                        <S.Th style={{ width: '700px' }}>
                          {notMonetary.results}
                        </S.Th>
                        <S.Th>{notMonetary.result}</S.Th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.impactsNotMonetary.map((impact: any) => (
                        <tr key={impact.label}>
                          <S.Td>{impact.label}</S.Td>
                          <S.Td>{`${impact.value} ${impact.measure}`}</S.Td>
                        </tr>
                      ))}
                    </tbody>
                  </S.Table>
                </S.TableResponsive>
              </S.TableWrapper>
              <S.IndexNote>
                {footnote.intro}
                <ul>
                  {footnote.list.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                {footnote.conclusion}
                {(!inflationData.data || !goldPriceData.data || (isBrazil && !dollarPriceData.value)) &&
                <div style={{ color: 'red', marginTop: '.2em' }}>{footnote.error}</div>
                }
              </S.IndexNote>
            </S.TabContent>
          </S.TapWrapper> */}
        </S.Container>
    )
}
    