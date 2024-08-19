import useCountry from '@/hooks/useCountry'
import useResize from '@/hooks/useResize'
import ToBRL from '@/utils/toBRL'
import toUSD from '@/utils/toUSD'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import useAppContext from '@/hooks/useAppContext'
import { useCallback, useEffect, useState } from 'react'
import { uid } from 'uid'

export interface ResumeChartsProps {
  [key: string]: number | string
}

interface ResumeCharts {
  data: ResumeChartsProps[]
  version?: 'v1' | 'v2'
}

export default function ResumeCharts({ data, version = 'v2' }: ResumeCharts) {
  const [barWidth, setBarWidth] = useState(800)
  const [barHeight, setBarHeight] = useState(650)
  const { isBrazil } = useCountry()
  const { isMobile, isTablet } = useResize()
  const { state } = useAppContext()
  const { language } = state

  const setPropsBar = useCallback(
    (impact: string) => {
      if (
        impact === language.calculator.resume.component_graphics_desforestation
      ) {
        return {
          fill: '#58c5ff',
          stackId: 'a'
        }
      } else if (
        impact === language.calculator.resume.component_graphics_silting
      ) {
        return {
          fill: '#52aad9',
          stackId: 'a'
        }
      } else if (
        impact === language.calculator.resume.component_graphics_mercury
      ) {
        return {
          fill: '#2D7CA8',
          stackId: 'a'
        }
      } else if (
        impact === language.calculator.resume.component_graphics_gold
      ) {
        return {
          fill: '#D2B754',
          stackId: 'b'
        }
      }
    },
    [language]
  )

  useEffect(() => {
    if (isMobile && version !== 'v1') {
      setBarWidth(320)
      setBarHeight(400)
    } else if (isTablet && version !== 'v1') {
      setBarWidth(600)
      setBarHeight(400)
    } else if (version !== 'v1') {
      setBarWidth(800)
      setBarHeight(650)
    }
  }, [isMobile, isTablet, version])

  return (
    <BarChart
      width={barWidth}
      height={barHeight}
      data={data}
      barSize={65}
      barGap={50}
      margin={{
        top: 20,
        right: 30,
        left: 80,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis
        allowDecimals
        tickFormatter={(value) => {
          return isBrazil ? ToBRL(Number(value)) : toUSD(Number(value))
        }}
      />
      <Tooltip
        wrapperStyle={{ visibility: 'visible', zIndex: 1000 }}
        formatter={(value) => {
          return isBrazil ? ToBRL(Number(value)) : toUSD(Number(value))
        }}
      />
      <Legend />
      {data.map((item, i) =>
        Object.keys(item)
          .filter((propName) => {
            if (
              propName !== 'name' ||
              propName !== language.calculator.resume.resumeText
            ) {
              return true
            }
            return false
          })
          .map((trackName) => {
            if (i == 0) {
              return (
                <Bar
                  key={uid()}
                  dataKey={trackName}
                  {...setPropsBar(trackName)}
                  name={`${trackName}`}
                />
              )
            }
          })
      )}
    </BarChart>
  )
}
