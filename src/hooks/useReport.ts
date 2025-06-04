import { dataCalculatorTypes, resultsType } from '@/store/state/proveider'
import { useCallback, useState } from 'react'
import * as pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import domtoimage from 'dom-to-image'
import useResults from './useResults'
import { LanguageTypeProps } from '@/store/state'
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces'
import { typeMiningTypes } from '@/enums'
import useCountry from './useCountry'
import { usePriceData } from '@/store/api'

interface useReportProps {
  results: resultsType
  dataCalculator: dataCalculatorTypes
  language: LanguageTypeProps
}

export default function useReport({
  results,
  dataCalculator,
  language
}: useReportProps) {
  const {
    totalGold,
    totalImpacts,
    totalMonetary,
    textResume,
    subTextTotalImpacts,
    textGold,
    textUsesTypes,
    textDeforestation,
    textSiltingOfRivers,
    textMercury
  } = useResults({ results, dataCalculator, language })

  const [loadingPDF, setLoading] = useState<string | boolean>('start')
  const { isBrazil } = useCountry();
  const { inflationData, goldPriceData, dollarPriceData } = usePriceData();

  const getBase64ImageFromURL = useCallback((url: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.setAttribute('crossOrigin', 'anonymous')

      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height

        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0)

        const dataURL = canvas.toDataURL('image/png')

        resolve(dataURL)
      }

      img.onerror = (error) => {
        reject(error)
      }

      img.src = url
    })
  }, [])

  const downloadPDF = useCallback(async () => {
    ;(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs
    const resumeChart = document.getElementById('resumeChart') as HTMLDivElement
    const deforestationChart = document.getElementById(
      'chartDeforestation'
    ) as HTMLDivElement
    const siltingOfRiverChart = document.getElementById(
      'chartSiltingOfRiver'
    ) as HTMLDivElement
    const MercuryChart = document.getElementById(
      'chartMercury'
    ) as HTMLDivElement
    setLoading(true)
    const isFerry = Number(dataCalculator?.typeMining) === typeMiningTypes.FERRY

    if (resumeChart && siltingOfRiverChart && MercuryChart) {
      const today = new Date()
      let dateFormat = 'pt-BR'
      if (language.id === 'en_US') {
        dateFormat = 'en-US'
      } else if (language.id === 'es_ES') {
        dateFormat = 'es-ES'
      }
      const date = today.toLocaleDateString(dateFormat, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })

      try {
        const chartResume = await domtoimage.toPng(resumeChart)
        const chartDeforestation = await domtoimage.toPng(deforestationChart)
        const chartSiltingOfRiver = await domtoimage.toPng(siltingOfRiverChart)
        const chartMercury = await domtoimage.toPng(MercuryChart)
        const logo = (await getBase64ImageFromURL(
          `/assets/images/logo-black.webp`
        )) as string

        const deforestationInfographic = (await getBase64ImageFromURL(
          `/assets/infographic/deforestation_${language.id}.png`
        )) as string
        const siltingOfRiverInfographic = (await getBase64ImageFromURL(
          `/assets/infographic/siltingOfRivers_${language.id}.png`
        )) as string
        const mercuryInfographic = (await getBase64ImageFromURL(
          `/assets/infographic/mercury_${language.id}.png`
        )) as string

        if (
          !textResume ||
          !textUsesTypes ||
          !totalImpacts ||
          !subTextTotalImpacts ||
          !textGold ||
          !textSiltingOfRivers ||
          !textMercury
        ) {
          return
        }

        const impactsNotMonetary: any = []

        results?.impactsNotMonetary.map((impact) => {
          impactsNotMonetary.push([
            { text: impact.label, fontSize: 10, margin: [0, 5, 0, 5] },
            {
              text: `${impact.value} ${impact.measure}`,
              fontSize: 10,
              margin: [0, 5, 0, 5]
            }
          ])
        })

        const headerPage: Content = [
          {
            alignment: 'center',
            margin: [30, 10],
            columns: [
              {
                image: logo,
                width: 60
              },
              {
                text: language.methodology.resultsOfCalculator,
                alignment: 'right',
                marginTop: 40
              }
            ]
          }
        ]

        const footerPage: Content = [
          {
            text: `${date} | https://miningcalculator.conservation-strategy.org/`,
            alignment: 'right',
            margin: [15, 30]
          }
        ]

        const resumePage: Content = [
          {
            text: `${language.calculator.resume.monetary_impacts}\n\n`,
            style: 'headline'
          },
          {
            text: textResume,
            lineHeight: 1.4,
            marginBottom: 10
          },
          {
            text: textUsesTypes,
            marginBottom: 20
          },
          {
            columns: [
              {
                width: 220,
                stack: [
                  {
                    text: language.calculator.resume.total_impacts,
                    marginBottom: 12
                  },
                  {
                    text: totalImpacts,
                    color: '#2D7CA8',
                    bold: true,
                    fontSize: 20,
                    marginBottom: 5
                  },
                  {
                    text: subTextTotalImpacts,
                    fontSize: 10,
                    marginBottom: 25
                  },
                  {
                    text: language.calculator.resume.total_gold,
                    marginBottom: 12
                  },
                  {
                    text: totalGold,
                    color: '#D2B754',
                    bold: true,
                    fontSize: 20,
                    marginBottom: 5
                  },
                  {
                    text: textGold,
                    fontSize: 10,
                    marginBottom: 25
                  },
                  {
                    text: language.calculator.resume.total_monetary,
                    marginBottom: 12
                  },
                  {
                    text: totalMonetary,
                    color: '#D93410',
                    bold: true,
                    fontSize: 20,
                    marginBottom: 5
                  },
                  {
                    text: language.calculator.resume
                      .custom_label_monetary_total,
                    fontSize: 10,
                    marginBottom: 25
                  }
                ]
              },
              {
                image: chartResume,
                width: 630,
                alignment: 'right'
              }
            ],
            marginTop: 30,
            pageBreak: 'after'
          },          
        ]

        const deforestationPage: Content = isFerry
          ? []
          : [
              {
                columns: [
                  {
                    width: 250,
                    stack: [
                      {
                        text: language.calculator.impacts.deforestation
                          .headline,
                        style: 'headline',
                        marginBottom: 12
                      },
                      {
                        text: !textDeforestation
                          ? ''
                          : textDeforestation.paragraphy_01
                              .replaceAll('<strong>', '')
                              .replaceAll('</strong>', ''),
                        marginBottom: 12
                      },
                      {
                        text: !textDeforestation
                          ? ''
                          : textDeforestation.paragraphy_02
                              .replaceAll('<strong>', '')
                              .replaceAll('</strong>', ''),
                        marginBottom: 12
                      },
                      {
                        image: chartDeforestation,
                        width: 700,
                        marginLeft: 50
                      }
                    ]
                  },
                  {
                    image: deforestationInfographic,
                    width: 250
                  }
                ],
                columnGap: 30,
                pageBreak: 'after'
              }
            ]

        const siltingOfRiverPage: Content = [
          {
            columns: [
              {
                width: 250,
                stack: [
                  {
                    text: language.calculator.impacts.siltingOfRivers.headline,
                    style: 'headline',
                    marginBottom: 12
                  },
                  {
                    text: textSiltingOfRivers.paragraphy_01
                      .replaceAll('<strong>', '')
                      .replaceAll('</strong>', ''),
                    marginBottom: 12
                  },
                  {
                    text: textSiltingOfRivers.paragraphy_02
                      .replaceAll('<strong>', '')
                      .replaceAll('</strong>', ''),
                    marginBottom: 12
                  },
                  {
                    image: chartSiltingOfRiver,
                    width: 700,
                    marginLeft: 50
                  }
                ]
              },
              {
                image: siltingOfRiverInfographic,
                width: 250
              }
            ],
            columnGap: 30,
            pageBreak: 'after'
          }
        ]

        const mercuryPage: Content = [
          {
            columns: [
              {
                width: 250,
                stack: [
                  {
                    text: language.calculator.impacts.mercuryContamination
                      .headline,
                    style: 'headline',
                    marginBottom: 12
                  },
                  {
                    text: textMercury.paragraphy_01
                      .replaceAll('<strong>', '')
                      .replaceAll('</strong>', ''),
                    marginBottom: 12
                  },
                  {
                    image: chartMercury,
                    width: 700,
                    marginLeft: 50
                  }
                ]
              },
              {
                image: mercuryInfographic,
                width: 250
              }
            ],
            columnGap: 30,
            pageBreak: 'after'
          }
        ]

        const impactsNotMonetaryPage: Content = [
          {
            text: language.calculator.impacts.notMonetary.headline,
            style: 'headline',
            marginBottom: 30
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', '*'],
              body: [
                [
                  {
                    text: language.calculator.impacts.notMonetary.results,
                    style: 'tableHeader',
                    fontSize: 15,
                    bold: true
                  },
                  {
                    text: language.calculator.impacts.notMonetary.result,
                    style: 'tableHeader',
                    fontSize: 15,
                    bold: true
                  }
                ],
                ...impactsNotMonetary
              ]
            }
          },
          {
            text: language.methodology.references,
            marginBottom: 15,
            marginTop: 20
          },
          {
            text: language.methodology.paragraphy_10,
            marginBottom: 15
          },
          {
            text: language.methodology.paragraphy_11,
            marginBottom: 15
          },
          {
            text: language.methodology.paragraphy_12,
            marginBottom: 15,
            pageBreak:'after'
          },
        ]

        const notesPage: Content = [
          {
            text: language.calculator.resume.headnote.note,
          },
          {
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: language.calculator.resume.headnote.table.columns[0], style: 'tableHeader', fontSize: 8, bold: true },
                  { text: language.calculator.resume.headnote.table.columns[1], style: 'tableHeader', fontSize: 8, bold: true },
                  { text: language.calculator.resume.headnote.table.columns[2], style: 'tableHeader', fontSize: 8, bold: true },
                  { text: language.calculator.resume.headnote.table.columns[3], style: 'tableHeader', fontSize: 8, bold: true }
                ],
                [
                  { text: language.calculator.resume.headnote.table.rows[0].index.replace('<yearOfRef>', `${inflationData.yearOfRef}`), fontSize: 8 },
                  { text: `${inflationData.data?.toFixed(2) ?? 'N/A'}`, fontSize: 8 },
                  { text: inflationData.fallback ? language.calculator.resume.headnote.table.rows[0].source[1] : language.calculator.resume.headnote.table.rows[0].source[0], fontSize: 8 },
                  { text: inflationData.cachedAt ? new Date(inflationData.cachedAt).toLocaleDateString('en-CA') : 'N/A', fontSize: 8 }
                ],
                [
                  { text: language.calculator.resume.headnote.table.rows[1].index, fontSize: 8 },
                  { text: `${goldPriceData.data?.toFixed(2) ?? 'N/A'}`, fontSize: 8 },
                  { text: goldPriceData?.fallback ? language.calculator.resume.headnote.table.rows[1].source[1] : language.calculator.resume.headnote.table.rows[1].source[0], fontSize: 8 },
                  { text: goldPriceData?.timestamp ? new Date(goldPriceData.timestamp).toLocaleDateString('en-CA') : 'N/A', fontSize: 8 }
                ],
                ...(isBrazil ? [[
                  { text: language.calculator.resume.headnote.table.rows[2].index, fontSize: 8 },
                  { text: `${dollarPriceData.value?.toFixed(2) ?? 'N/A'}`, fontSize: 8 },
                  { text: dollarPriceData.fallback ? language.calculator.resume.headnote.table.rows[2].source[1] : language.calculator.resume.headnote.table.rows[2].source[0], fontSize: 8 },
                  { text: dollarPriceData.date ? new Date(dollarPriceData.date).toLocaleDateString('en-CA') : 'N/A', fontSize: 8 }
                ]] : [])
              ]
            },
            margin: [0, 5, 0, 0],
          },      
          {
            text: language.footer.disclaimer.text,
            alignment: 'left',
            marginBottom: 15,
            marginTop: 20,
            fontSize: 8
          }          
        ]

        const docDefinition: TDocumentDefinitions = {
          pageSize: 'A4',
          pageMargins: [15, 100, 15, 60],
          info: {
            title: 'Report Mining Calculator CSF',
            author: 'Convervation Strategy Found',
            subject: 'Report CSF'
          },
          content: [
            ...resumePage,
            ...deforestationPage,
            ...siltingOfRiverPage,
            ...mercuryPage,
            ...impactsNotMonetaryPage,
            ...notesPage
          ],
          header: () => {
            return headerPage
          },
          footer: () => {
            return footerPage
          },
          styles: {
            headline: {
              fontSize: 20,
              bold: true
            }
          }
        }
        pdfMake.createPdf(docDefinition).download('report-csf.pdf', () => {
          setLoading(false)
        })
        // pdfMake.createPdf(docDefinition).open();
      } catch (err) {
        console.log('falha ao gerar PDF', err)
      }
    }
  }, [
    dataCalculator?.typeMining,
    language.id,
    language.methodology.resultsOfCalculator,
    language.methodology.references,
    language.methodology.paragraphy_10,
    language.methodology.paragraphy_11,
    language.methodology.paragraphy_12,
    language.calculator.resume.monetary_impacts,
    language.calculator.resume.total_impacts,
    language.calculator.resume.total_gold,
    language.calculator.resume.total_monetary,
    language.calculator.resume.custom_label_monetary_total,
    language.calculator.impacts.deforestation.headline,
    language.calculator.impacts.siltingOfRivers.headline,
    language.calculator.impacts.mercuryContamination.headline,
    language.calculator.impacts.notMonetary.headline,
    language.calculator.impacts.notMonetary.results,
    language.calculator.impacts.notMonetary.result,
    language.footer.disclaimer.text,
    getBase64ImageFromURL,
    textResume,
    textUsesTypes,
    totalImpacts,
    subTextTotalImpacts,
    textGold,
    textSiltingOfRivers,
    textMercury,
    results?.impactsNotMonetary,
    totalMonetary,
    totalGold,
    textDeforestation
  ])
  return {
    downloadPDF,
    loadingPDF,
    setLoading
  }
}
