export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatEmission(value: number): string {
  return `${formatNumber(value)} kgCO2e`
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "0%"
  return `${value > 0 ? "+" : ""}${formatNumber(value)}%`
}

export function formatEmissionFactor(value: number): string {
  return new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits: 3,
  }).format(value)
}