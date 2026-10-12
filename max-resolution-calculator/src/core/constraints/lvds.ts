import { pixelClockHz, type Timing } from '../timing'
import { atMost, type ConstraintResult } from './result'

type LvdsSpec = { lanes: number; laneMbps: number }

// RGB 24비트 + VS/HS/DE 제어 4비트 (7:1 시리얼라이제이션)
const BITS_PER_PIXEL_ON_WIRE = 28

export function lvdsConstraints(timing: Timing, spec: LvdsSpec): ConstraintResult[] {
  return [
    atMost(
      'LVDS 대역폭',
      pixelClockHz(timing) * BITS_PER_PIXEL_ON_WIRE,
      spec.lanes * spec.laneMbps * 1e6,
      'bps',
    ),
  ]
}
