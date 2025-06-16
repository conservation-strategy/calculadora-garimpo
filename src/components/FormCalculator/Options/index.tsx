export interface OptionsItemsProps {
  text: string
  value: string | number
}

export interface OptionsProps {
  data: OptionsItemsProps[]
}

interface Standart {
  value: string
  flag: string
}

export interface OptionsWithStandartFlaggingProps {
  data: OptionsItemsProps[]
  standart: Standart
}

export default function Options({ data }: OptionsProps) {
  return (
    <>
      {data.map((option) => (
        <option key={option.text} value={option.value}>
          {option.text}
        </option>
      ))}
    </>
  )
}

export function OptionsWithStandartFlagging({ data, standart }: OptionsWithStandartFlaggingProps) {
  return (
    <>
      {data.map((option) => (
        <option key={option.text} value={option.value}>
          {`${option.text} ${option.value === Number(standart.value) ? standart.flag : ''}`}
        </option>
      ))}
    </>
  )
}