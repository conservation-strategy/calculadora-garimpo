export default function presentValue(rate: any, nper: any, pmt: any) {
  rate = rate / 100.0
  return (pmt / rate) * (1 - Math.pow(1 + rate, -nper))
}
