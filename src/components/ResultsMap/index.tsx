import * as S from './style'
import * as SG from '@/styles/global'
import ResumeCharts, { ResumeChartsProps } from '../Charts/Resume'
import { createRef, useCallback, useEffect, useMemo, useState } from 'react'
import useAppContext from '@/hooks/useAppContext'
import ImpactChart from '../Charts/Impact'
import useResults, { Tabs, textImpactProps } from '@/hooks/useResults'
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
import { formatNumberToLocale } from '@/utils/formatNumber'

export interface TotalImpactPerLocation extends CalculatorArgs {
  totalImpact: number;
}

export interface ResultsMapProps extends ResultsProps {
    // locations: CalculatorArgs[];
    totalImpacts: TotalImpactPerLocation[];
    totalGold: number;
    formInputs: FormInputs;
}

// type Tabs = 'deforestation' | 'silting' | 'mercury';

const getImpactSubtotal = (impact: DataImpacts[]) => {
  return impact.reduce((sum, item) => sum + item.value, 0);
}

const getInfographic = ({ tab, languageId } : { tab: Tabs, languageId: string}) => {
  return tab === Tabs.deforastation ? `/assets/infographic/deforestation_${languageId}.svg`
  : tab === Tabs.siltingOfRivers ? `/assets/infographic/siltingOfRivers_${languageId}.svg`
  : `/assets/infographic/mercury_${languageId}.svg`;
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
  const { goldPriceData } = usePriceData();
  const { ismobileOrTablet } = useResize();


  const [textUsesTypes, setTextUsesTypes] = useState('');
  const [resumeDataChart, setResumeDataChart] = useState<ResumeChartsProps[]>([]);
  const [totalGoldValue, setTotalGoldValue] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.deforastation);
  const [textDeforestation, setTextDeforestation] = useState<textImpactProps | null>(null);
  const [textSiltingOfRivers, setTextSiltingOfRivers] = useState<textImpactProps | null>(null);
  const [textMercury, setTextMercury] = useState<textImpactProps | null>(null);

  const totalAffectedArea = useMemo(
    () => totalImpacts.reduce((sum, location) => sum + location.affectedArea, 0),
  [totalImpacts]);
  
  /** correct monetary values for inflation */
  const totalImpactReduced = useMemo(
    () => totalImpacts.reduce((sum, impact) => sum + impact.totalImpact, 0),
    [totalImpacts]
  );

  console.log("total impacts prop", totalImpacts);
  // console.log('total correctet', totalImpactCorrected);


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

  /** get text contents */
  useEffect(() => {
      let textUsesTypes = '';
      const { calculator } = language;
      const { valuation } = calculator;
      const useType = formInputs.usesTypes;
  
      /**useTypes */
      if (useType === usesValuesTypes.environmental) {
          textUsesTypes = valuation.environmental.replace('$value', 'totalMonetary'); // TODO check text
      } else if (useType === usesValuesTypes.planning) {
          textUsesTypes = valuation.planning.replace('$value', 'totalMonetary');
      } else if (useType === usesValuesTypes.technology) {
        const totalMercury = getImpactSubtotal(mercury);
        textUsesTypes = valuation.technology
        .replace('$valueImpact', totalImpactReduced.toFixed(2))
        .replace('$valueMercury', `${totalMercury}`)
      }
      setTextUsesTypes(textUsesTypes);

      /**deforestation */
      const overflowText = calculator.impacts.deforestation.withoutOverflow;
      
      const paragraphy_01_def = `${language.calculator.impacts.deforestation.paragraphy_01
        .replace('$grams', formatNumberToLocale(totalGold))
        .replace('$hectare', formatNumberToLocale(totalAffectedArea))
        .replace(
          '$withoutOverflow',
          totalAffectedArea.toString()
        )} ${overflowText}`;
      const paragraphy_02_def =
        language.calculator.impacts.deforestation.paragraphy_02.replace(
          '$hectare',
          formatNumberToLocale(totalAffectedArea)
        );

      setTextDeforestation({
        paragraphy_01: paragraphy_01_def,
        paragraphy_02: paragraphy_02_def
      });

      /**siltingOfRivers */      
      const affectedAreaM2 = totalAffectedArea * 10000;
      const volumeM3 = Number(formInputs.pitDepth) * affectedAreaM2
      const m3String = `${formatNumberToLocale(Math.round(volumeM3 * 100) / 100)} m³`;
      const paragraphy_01_silt = language.calculator.impacts.siltingOfRivers.paragraphy_01
        .replace('$grams', formatNumberToLocale(totalGold))
        .replace('$volumeM3', m3String)
      const paragraphy_02_silt =
        language.calculator.impacts.siltingOfRivers.paragraphy_02.replace(
          '$volumeM3',
          m3String
        )
      setTextSiltingOfRivers({
        paragraphy_01: paragraphy_01_silt,
        paragraphy_02: paragraphy_02_silt
      });

      /**mercury */
      const paragraphy_01_merc =
        language.calculator.impacts.mercuryContamination.paragraphy_01
          // .replace('$people', formatNumberToLocale(people))
          // .replace('$HgAuRatio', `${HgAuRatio}kg`)
          // .replace(
          //   '$lossPercentHgInWater',
          //   `${roundPercent(lossPercentHgInWater)}%`
          // )

      setTextMercury({
        paragraphy_01: paragraphy_01_merc,
        paragraphy_02: ''
      });

    }, [
      // totalMonetary, 
      // totalMercury, 
      totalImpacts, 
      language,
      totalAffectedArea,
  ]);

  /** format resume chart data
   * TODO: move block to useResutls
  */
  useEffect(() => {
      const totalDeforestation = getImpactSubtotal(deforestation);
      const totalSilting = getImpactSubtotal(siltingOfRivers);
      const totalMercury = getImpactSubtotal(mercury);

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
      deforestation,
      siltingOfRivers,
      mercury,
      totalGoldValue
  ]);

  let cyCustomDeforestation = 0
  let cyCustomSiltingOfRivers = 0
  let cyCustomMercury = 0

  cyCustomSiltingOfRivers = 220
  cyCustomMercury = ismobileOrTablet ? 190 : 200

  if (deforestation.length >= 5) {
    cyCustomDeforestation = 150
    cyCustomMercury = 250
  } else {
    cyCustomDeforestation = ismobileOrTablet ? 200 : 170
  }

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
            {toUSD(totalImpactReduced)}
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
            {toUSD(totalImpactReduced + (totalGoldValue ?? 0))}
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
        </div> */}
  
        <S.TapWrapper>
          <S.TabHeader>
            
            <S.TabHeaderItem
              active={activeTab === Tabs.deforastation}
              onClick={() => setActiveTab(Tabs.deforastation)}
            >
              <SG.Text size="24px" align="center" weight="600">
                {calculator.impacts.deforestation.headline}
              </SG.Text>
            </S.TabHeaderItem>
          
  
            <S.TabHeaderItem
              active={activeTab === Tabs.siltingOfRivers}
              onClick={() => setActiveTab(Tabs.siltingOfRivers)}
            >
              <SG.Text size="24px" align="center" weight="600">
                {calculator.impacts.siltingOfRivers.headline}
              </SG.Text>
            </S.TabHeaderItem>
            <S.TabHeaderItem
              active={activeTab === Tabs.mercury}
              onClick={() => setActiveTab(Tabs.mercury)}
            >
              <SG.Text size="24px" align="center" weight="600">
                {calculator.impacts.mercuryContamination.headline}
              </SG.Text>
            </S.TabHeaderItem>
          </S.TabHeader>
          <S.TabContent>
            <S.TabContentITem active={activeTab === Tabs.deforastation}>
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
                      ? deforestation.length < 5
                        ? 200
                        : 170
                      : 150
                  }
                  data={deforestation}
                />
              </S.WrapperGraphic>
              <S.WrapperInfografic>
                 <S.Infographic
                    src={getInfographic({tab: Tabs.deforastation, languageId: language.id})}
                    alt={calculator.impacts.deforestation.headline}
                  />                
              </S.WrapperInfografic>
            </S.TabContentITem>
            <S.TabContentITem active={activeTab === Tabs.siltingOfRivers}>
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
                  data={siltingOfRivers}
                />
              </S.WrapperGraphic>
              <S.WrapperInfografic>                
                <S.Infographic
                  src={getInfographic({tab: Tabs.siltingOfRivers, languageId: language.id})}
                  alt={calculator.impacts.siltingOfRivers.headline}
                />
              </S.WrapperInfografic>
            </S.TabContentITem>
            <S.TabContentITem active={activeTab === Tabs.mercury}>
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
                  data={mercury}
                />
              </S.WrapperGraphic>
              <S.WrapperInfografic>
                <S.Infographic
                  src={getInfographic({ tab: Tabs.mercury, languageId: language.id })}
                  alt={calculator.impacts.mercuryContamination.headline}
                />
              </S.WrapperInfografic>
            </S.TabContentITem>
  
            <S.TableWrapper>
              <SG.Headline>{calculator.impacts.notMonetary.headline}</SG.Headline>
              <S.TableResponsive>
                <S.Table>
                  <thead>
                    <tr>
                      <S.Th style={{ width: '700px' }}>
                        {calculator.impacts.notMonetary.results}
                      </S.Th>
                      <S.Th>{calculator.impacts.notMonetary.result}</S.Th>
                    </tr>
                  </thead>
                  <tbody>
                    {impactsNotMonetary.map((impact: any) => (
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
              {calculator.footnote.intro}
              <ul>
                {calculator.footnote.list.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              {calculator.footnote.conclusion}
                {/* {(!inflationData.data || !goldPriceData.data || (isBrazil && !dollarPriceData.value)) &&
                  <div style={{ color: 'red', marginTop: '.2em' }}>{footnote.error}</div>
                } */}
            </S.IndexNote>
          </S.TabContent>
        </S.TapWrapper>
      </S.Container>
    )
}
    