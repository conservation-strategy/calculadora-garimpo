import useCountry from '@/hooks/useCountry'
import useResize from '@/hooks/useResize'
import toBRL from '@/utils/toBRL'
import ToBRL from '@/utils/toBRL'
import toUSD from '@/utils/toUSD'
import { useEffect, useState } from 'react'
import { Cell, Pie, PieChart, Tooltip, Legend, Sector } from 'recharts'
import { VerticalAlignmentType } from 'recharts/types/component/DefaultLegendContent'
import * as S from './style'

export interface DataImpactChartProps {
  value: number
  name: string
}

interface ImpactChart {
  data: DataImpactChartProps[]
  version?: 'v1' | 'v2'
  cy?: number
}

const COLORS = [
  '#FF8C00',
  '#3B84DB',
  '#6ED18D',
  '#356958',
  '#073C29',
  '#F44C4C'
]
const RADIAN = Math.PI / 180

const customLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  valueConverted
}: any) => {
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'
  const percentValue = Math.round(percent * 100)

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#000"
        fontWeight={600}
      >{`${payload.name}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={25}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`${valueConverted} (${percentValue}%)`}
      </text>
    </g>
  )
}

const customLegend = ({ payload }: any) => {
  return (
    <>
      {payload.map((item: any) => (
        <S.LegendWrapper key={item.name}>
          <S.LabelColor color={item.payload.fill} />
          <S.LegendeTextWrapper key={item.name}>
            <S.LegendHeadline>{item.payload.name}</S.LegendHeadline>
            <S.LegendText>{toBRL(Number(item.payload.value))}</S.LegendText>
          </S.LegendeTextWrapper>
        </S.LegendWrapper>
      ))}
    </>
  )
}

export default function ImpactChart({
  data,
  version = 'v2',
  cy: cyCustom
}: ImpactChart) {
  const [chartWidth, setChartWidth] = useState(900)
  const [chartHeight, setChartHeight] = useState(450)
  const [cx, setCx] = useState(480)
  const [verticalAlign, setVertialAlign] =
    useState<VerticalAlignmentType>('middle')
  const { isBrazil } = useCountry()
  const { ismobileOrTablet, isMobile, isTablet } = useResize()

  useEffect(() => {
    if (isMobile && version !== 'v1') {
      setChartWidth(320)
      setChartHeight(650)
      setVertialAlign('bottom')
      setCx(125)
    } else if (isTablet && version !== 'v1') {
      setChartWidth(600)
      setVertialAlign('middle')
      setCx(130)
    } else if (version !== 'v1') {
      setChartWidth(900)
      setChartHeight(450)
      setVertialAlign('middle')
      setCx(480)
    }
  }, [isMobile, version, isTablet])

  if (version === 'v1') {
    return (
      <PieChart width={350} height={650}>
        <Legend
          margin={{ top: 50 }}
          content={customLegend}
          layout="vertical"
          verticalAlign="bottom"
          align="right"
        />
        <Pie
          dataKey="value"
          data={data}
          cx={120}
          cy={cyCustom !== undefined ? cyCustom : 150}
          innerRadius={60}
          outerRadius={120}
          fill="#8884d8"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) =>
            isBrazil ? ToBRL(Number(value)) : toUSD(Number(value))
          }
        />
      </PieChart>
    )
  }

  return (
    <>
      {ismobileOrTablet ? (
        <PieChart width={chartWidth} height={chartHeight}>
          <Legend
            margin={{ top: 50 }}
            content={customLegend}
            layout="vertical"
            verticalAlign={verticalAlign}
            align="right"
          />
          <Pie
            dataKey="value"
            data={data}
            cx={cx}
            cy={cyCustom ? cyCustom : 150}
            innerRadius={60}
            outerRadius={120}
            fill="#8884d8"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) =>
              isBrazil ? ToBRL(Number(value)) : toUSD(Number(value))
            }
          />
        </PieChart>
      ) : (
        <PieChart width={900} height={450}>
          <Pie
            dataKey="value"
            data={data}
            cx={cx}
            cy={200}
            label={(props) =>
              customLabel({
                ...props,
                valueConverted: isBrazil
                  ? ToBRL(Number(props.value))
                  : toUSD(Number(props.value))
              })
            }
            innerRadius={60}
            outerRadius={120}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      )}
    </>
  )
}
