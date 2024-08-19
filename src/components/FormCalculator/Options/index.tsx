export interface OptionsItemsProps {
  text: string
  value: string | number
}

export interface OptionsProps {
  data: OptionsItemsProps[]
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
