export default function convertGramsToKg(value: number) {
  return Math.round((value / 1000) * 100) / 100
}
