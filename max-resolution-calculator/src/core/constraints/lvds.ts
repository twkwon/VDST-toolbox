import { SPEC_SOURCE } from '../../data/chipsets'
import type { ResolutionCap } from '../spec'
import { pixelClockHz, type Timing } from '../timing'
import { resolutionCapConstraints } from './resolutionCap'
import { atMost, type ConstraintResult } from './result'

export type LvdsSpec = {
  lanes: number
  laneMbps: number
  maxHalfWidth?: number
  resolutionCap?: ResolutionCap
}

// RGB 24비트 + VS/HS/DE 제어 4비트 (7:1 시리얼라이제이션)
const BITS_PER_PIXEL_ON_WIRE = 28

export function lvdsConstraints(timing: Timing, spec: LvdsSpec): ConstraintResult[] {
  const pclkMHz = pixelClockHz(timing) / 1e6
  const actualBps = pixelClockHz(timing) * BITS_PER_PIXEL_ON_WIRE
  const limitBps = spec.lanes * spec.laneMbps * 1e6
  const laneGbps = spec.laneMbps / 1e3

  const results: ConstraintResult[] = [
    atMost('LVDS 대역폭', actualBps, limitBps, 'bps', SPEC_SOURCE, {
      expression: 'Pixel_Clock × 28 bits(RGB 24b + HS/VS/DE 4b) ≤ Lanes × 1.12 Gbps(160 MHz × 7 bits)',
      actualSubstitution: `${pclkMHz.toFixed(3)} MHz × 28 bits = ${(actualBps / 1e9).toFixed(3)} Gbps`,
      limitSubstitution: `${spec.lanes} lanes × ${laneGbps.toFixed(2)} Gbps = ${(limitBps / 1e9).toFixed(3)} Gbps`,
    }),
  ]
  if (spec.maxHalfWidth !== undefined) {
    const halfWidth = Math.ceil(timing.hActive / 2)
    results.push(
      atMost('Dual LVDS Splitter Half-Width', halfWidth, spec.maxHalfWidth, 'px', SPEC_SOURCE, {
        expression: 'CEIL(H_active / 2) ≤ Splitter_Max_Half_Width (4095 px)',
        actualSubstitution: `CEIL(${timing.hActive} / 2) = ${halfWidth} px`,
        limitSubstitution: `Splitter_Max_Half_Width = ${spec.maxHalfWidth} px (전체 폭 최대 ${spec.maxHalfWidth * 2} px)`,
      }),
    )
  }
  if (spec.resolutionCap) {
    results.push(...resolutionCapConstraints(timing, spec.resolutionCap))
  }
  return results
}
