export default function round(n: number, precision = 2) {
  const factor = 10 ** precision
  return Math.round(n * factor) / factor
}
