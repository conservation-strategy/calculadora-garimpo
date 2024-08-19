const ToBRL = (value: number) => {
  return (Math.round(value * 100) / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'BRL'
  })
}

export default ToBRL
