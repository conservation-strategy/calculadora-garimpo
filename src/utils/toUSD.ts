const toUSD = (value: number) => {
  const parseValue = Math.round(value * 100) / 100
  const options = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }

  return `US${parseValue.toLocaleString('en-US', options)}`
}

export default toUSD
