const calcImpact = (valor: number, price: number) => {
  const toHectare = valor * 12 * 0.0001907
  return toHectare * price
}

export default calcImpact
