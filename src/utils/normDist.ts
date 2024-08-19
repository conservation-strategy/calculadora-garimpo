function _getNDistPDF(x: any, mean: any, stdev: any) {
  const sqrt2PI = Math.SQRT2 * Math.sqrt(Math.PI)
  const frac = (x - mean) / stdev
  return Math.exp(-0.5 * frac * frac) / (sqrt2PI * stdev)
}

function _getNDistCDF(x: any, mean: any, stdev: any) {
  const a1 = 5.75885480458
  const a2 = 2.62433121679
  const a3 = 5.92885724438
  const b1 = -29.8213557807
  const b2 = 48.6959930692
  const c1 = -0.000000038052
  const c2 = 0.000398064794
  const c3 = -0.151679116635
  const c4 = 4.8385912808
  const c5 = 0.742380924027
  const c6 = 3.99019417011
  const con = 1.28
  const d1 = 1.00000615302
  const d2 = 1.98615381364
  const d3 = 5.29330324926
  const d4 = -15.1508972451
  const d5 = 30.789933034
  const p = 0.398942280444
  const q = 0.39990348504
  const r = 0.398942280385

  let up = false
  let value
  let y = 0

  let z = (x - mean) / stdev

  if (z < 0) {
    up = true
    z = -z
  }

  // if (ltone < z && (!up || utzero < z))
  // {
  //   value = !up * 1;
  //   return value;
  // }

  y = 0.5 * z * z

  if (z <= con) {
    value = 0.5 - z * (p - (q * y) / (y + a1 + b1 / (y + a2 + b2 / (y + a3))))
  } else {
    value =
      (r * Math.exp(-y)) /
      (z +
        c1 +
        d1 /
          (z +
            c2 +
            d2 / (z + c3 + d3 / (z + c4 + d4 / (z + c5 + d5 / (z + c6))))))
  }

  if (!up) value = 1 - value

  return value
}

function normDist(x: any, mean: any, stdev: any, cumulative: any) {
  return cumulative
    ? _getNDistCDF(x, mean, stdev)
    : _getNDistPDF(x, mean, stdev)
}

export default normDist
