import * as S from './style'
import * as SG from '@/styles/global'
import ResumeCharts, { ResumeChartsProps } from '../Charts/Resume'
import { createRef, useCallback, useEffect, useState } from 'react'
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
import { usesValuesTypes } from '@/enums'
import { DataImpacts } from '@/hooks/useCalculator'
import { FormInputs } from '../FormMap'

export interface ResultsMapProps extends ResultsProps {
    totalImpacts: number[]; // total per location
    formInputs: FormInputs;
}

const getImpactSubtotal = (impact: DataImpacts[]) => {
  return impact.reduce((sum, item) => sum + item.value, 0);
}

export default function ResultsMap({
    totalImpacts,
    deforestation,
    mercury,
    siltingOfRivers,
    impactsNotMonetary,
    formInputs
} : ResultsMapProps) {
    const { state }= useAppContext();
    const { language } = state;
    const { calculator } = language;
    const { inflationData, goldPriceData, dollarPriceData } = usePriceData();
    const { currentCountry } = useCountry();

    const [textUsesTypes, setTextUsesTypes] = useState('');
    const [resumeDataChart, setResumeDataChart] = useState<ResumeChartsProps[]>([])

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

    const handleDownload = () => {}

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
            .replace('$valueImpact', sumValues(totalImpacts).toFixed(2))
            // .replace('$valueMercury', totalMercury)
        }
        setTextUsesTypes(textUsesTypes)
      }, [
        // totalMonetary, 
        // totalMercury, 
        totalImpacts, 
        language
    ]);

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
                [calculator.resume.component_graphics_gold]: 0
            }
        ]);
    }, [
        calculator,
        correctForInflation,
        deforestation,
        siltingOfRivers,
        mercury
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
              {correctForInflation(sumValues(totalImpacts))}
            </SG.Text>
            <SG.Text size="15px">{calculator.resume.TextTotalImpacts.impactedArea}</SG.Text>
            <br />
            <br />
            <SG.Text>{calculator.resume.total_gold}</SG.Text>
            <SG.Text
              weight="600"
              color="#D2B754"
              size="30px"
              style={{ marginBottom: 0 }}
            >
              {"totalGold"}
            </SG.Text>
            <SG.Text size="15px">{calculator.resume.TextTotalImpacts.amoutGold}</SG.Text>
            <br />
            <br />
            <SG.Text>{calculator.resume.total_monetary}</SG.Text>
            <SG.Text
              weight="600"
              color="#D93410"
              size="30px"
              style={{ marginBottom: 0 }}
            >
              {"totalMonetary"}
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
    