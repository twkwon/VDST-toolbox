import type { ConstraintUnit } from '../core/constraints/result'

export function formatValue(value: number, unit: ConstraintUnit): string {
  switch (unit) {
    case 'bps':
      return `${(value / 1e9).toFixed(3)} Gbps`
    case 'px':
      return `${value} px`
    case 'pixels':
      return `${value.toLocaleString('en-US')} 픽셀`
    case 'fps':
      return `${value} fps`
  }
}

export function formatMargin(margin: number): string {
  return `${(margin * 100).toFixed(1)}%`
}

export function formatMHz(hz: number): string {
  return `${(hz / 1e6).toFixed(3)} MHz`
}
