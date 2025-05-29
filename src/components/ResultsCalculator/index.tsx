import * as S from './style'
import * as SG from '@/styles/global'
import ResumeCharts from '../Charts/Resume'
import { createRef, useCallback, useEffect, useState } from 'react'
import useAppContext from '@/hooks/useAppContext'
import ImpactChart from '../Charts/Impact'
import useResults, { Tabs } from '@/hooks/useResults'
import useReport from '@/hooks/useReport'
import useResize from '@/hooks/useResize'
import { event as gaEvent } from "nextjs-google-analytics";


export type TypeInfographic = 'deforestation' | 'siltingOfRivers' | 'mercury'

interface ResultsCalculatorProps {
  scrollResults: boolean
}

export default function ResultsCalculator({
  scrollResults
}: ResultsCalculatorProps) {
  const [showChartsPrint, setShow] = useState(false)
  const { state } = useAppContext()
  const { results, dataCalculator, language } = state
  const { calculator } = language
  const { resume, pdf, valuation, impacts } = calculator
  const { deforestation, siltingOfRivers, mercuryContamination, notMonetary } =
    impacts

  const {
    totalGold,
    totalImpacts,
    totalMonetary,
    tabActive,
    textResume,
    subTextTotalImpacts,
    textGold,
    textUsesTypes,
    textDeforestation,
    textSiltingOfRivers,
    textMercury,
    resumeDataChart,
    deforastationDataChart,
    mercuryRiversDataChart,
    siltingOfRiversDataChart,
    infographicDeforestation,
    infographicMercury,
    infographicSiltingOfRivers,
    settab,
    inflationData,
    goldPriceData
  } = useResults({ results, dataCalculator, language });
  const { downloadPDF, loadingPDF, setLoading } = useReport({
    results,
    dataCalculator,
    language
  })
  const { ismobileOrTablet } = useResize()

  const refResults = createRef<HTMLDivElement>()

  useEffect(() => {
    if (loadingPDF === false) {
      setLoading('start')
      setShow(false)
      document.body.style.overflow = 'initial'
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingPDF])

  const handleDownload = useCallback(() => {
    setShow(true)
    setTimeout(() => {
      downloadPDF()
    }, 500)
    document.body.style.overflow = 'hidden'
    gaEvent("download_pdf", {
      pdf_name: "Report",
    });
  }, [downloadPDF])

  useEffect(() => {
    if (results && refResults.current && scrollResults) {
      const top = refResults.current.offsetTop
      window.scrollTo(0, top)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollResults])

  const tabDeforestation = tabActive === Tabs.deforastation
  const tabSiltingOfRivers = tabActive === Tabs.siltingOfRivers
  const tabMercury = tabActive === Tabs.mercury

  let cyCustomDeforestation = 0
  let cyCustomSiltingOfRivers = 0
  let cyCustomMercury = 0

  cyCustomSiltingOfRivers = 220
  cyCustomMercury = ismobileOrTablet ? 190 : 200

  if (deforastationDataChart.length >= 5) {
    cyCustomDeforestation = 150
    cyCustomMercury = 250
  } else {
    cyCustomDeforestation = ismobileOrTablet ? 200 : 170
  }

  if (!results) {
    return <></>
  }
  return (
    <S.Container ref={refResults}>
      {loadingPDF === true && (
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
      )}

      {/* <S.HeaderNote>
        {`
        Inflação acumulada desde ${inflationData.yearOfRef} usada: ${inflationData.data?.toFixed(2)}%.
        Fonte: (${inflationData.fallback ? 'FRED' : 'Banco Mundial'}).
        `}
      </S.HeaderNote> */}

      <S.ResultsHeadline>
        <SG.Headline weight="300" color={SG.colors.primary}>
          {resume.results}          
        </SG.Headline>
        <S.HeaderNote>
          {`${
            resume.headnote[0].text
              .replace('<yearOfRef>', `${inflationData.yearOfRef}`)
              .replace('<inflationData>', (inflationData?.data ?? 0).toFixed(2))
              .replace('<source>', inflationData.fallback ? resume.headnote[0].source[1] : resume.headnote[0].source[0])
              .replace('<date>', inflationData.cachedAt ? new Date(inflationData.cachedAt).toLocaleDateString('en-CA') : 'N/A')
          }`}
        </S.HeaderNote>
        <S.HeaderNote>
          {`${
            resume.headnote[1].text
              .replace('<priceData>', `${goldPriceData?.data.toFixed(2)}`)
              .replace('<date>', goldPriceData?.timestamp ? 
                new Date(goldPriceData.timestamp).toLocaleDateString('en-CA')
                : 'N/A')
              .replace('<source>', goldPriceData?.fallback ? resume.headnote[1].source[1] : resume.headnote[1].source[0])
          }`}
        </S.HeaderNote>
      </S.ResultsHeadline>
      <S.ButtonPDF>
        <SG.Button variant="primary" onClick={handleDownload}>
          <i className="fi fi-rr-document" style={{ fontSize: '20px' }}></i>
          {"Download PDF"}
        </SG.Button>
      </S.ButtonPDF>
      <S.ValuesWrapper>
        <SG.Headline>{resume.monetary_impacts}</SG.Headline>
        <SG.Text>{textResume}</SG.Text>
        <br />
        <SG.Text>{resume.total_impacts}</SG.Text>
        <SG.Text
          weight="600"
          color="#2D7CA8"
          size="30px"
          style={{ marginBottom: 0 }}
        >
          {totalImpacts}
        </SG.Text>
        <SG.Text size="15px">{subTextTotalImpacts}</SG.Text>
        <br />
        <br />
        <SG.Text>{resume.total_gold}</SG.Text>
        <SG.Text
          weight="600"
          color="#D2B754"
          size="30px"
          style={{ marginBottom: 0 }}
        >
          {totalGold}
        </SG.Text>
        <SG.Text size="15px">{textGold}</SG.Text>
        <br />
        <br />
        <SG.Text>{resume.total_monetary}</SG.Text>
        <SG.Text
          weight="600"
          color="#D93410"
          size="30px"
          style={{ marginBottom: 0 }}
        >
          {totalMonetary}
        </SG.Text>
        <SG.Text size="15px">{resume.custom_label_monetary_total}</SG.Text>
      </S.ValuesWrapper>

      <S.ImpactTextValuation>
        <SG.Headline>{valuation.headline}</SG.Headline>
        <SG.Text>{textUsesTypes}</SG.Text>
      </S.ImpactTextValuation>
      <S.GraphicResume>
        <ResumeCharts data={resumeDataChart} />
      </S.GraphicResume>
      <div style={{ gridArea: 'charts-preview' }}>
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
        </S.TabContent>
      </S.TapWrapper>
    </S.Container>
  )
}
