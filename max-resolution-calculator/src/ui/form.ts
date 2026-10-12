export function parsePositiveInt(text: string): number | undefined {
  const n = Number(text)
  return Number.isInteger(n) && n > 0 ? n : undefined
}

export function parsePositive(text: string): number | undefined {
  const n = Number(text)
  return Number.isFinite(n) && n > 0 ? n : undefined
}
