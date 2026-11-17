import type { ConstraintUnit } from '../core/constraints/result'
import { TRANSLATIONS, type LangCode } from './i18n'

export function formatValue(value: number, unit: ConstraintUnit, lang: LangCode = 'kr'): string {
  switch (unit) {
    case 'bps':
      return `${(value / 1e9).toFixed(3)} Gbps`
    case 'hz':
      return `${(value / 1e6).toFixed(3)} MHz`
    case 'px':
      return `${value} px`
    case 'pixels':
      return `${value.toLocaleString('en-US')} ${TRANSLATIONS[lang].unitPixels}`
    case 'fps':
      return `${value} fps`
    case 'slots':
      return `${value} slots`
    case 'pbn':
      return `${value} PBN`
  }
}

export function formatMargin(margin: number): string {
  return `${(margin * 100).toFixed(1)}%`
}

export function formatMHz(hz: number): string {
  return `${(hz / 1e6).toFixed(3)} MHz`
}
