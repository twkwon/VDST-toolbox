import { SPEC_SOURCE } from '../../data/chipsets'
import type { DsiLaneCount } from '../spec'
import { pixelClockHz, type Timing } from '../timing'
import { atMost, type ConstraintResult } from './result'

export type DsiSpec = { lanes: DsiLaneCount; laneMbps: number; maxWidth: number; serdesMaxBps?: number }

export type DsiOptions = {
  lanes?: DsiLaneCount
  serdesCap?: boolean
}

const BPP = 24
const PROTOCOL_OVERHEAD = 1.1
export const EVB_SERDES_MAX_BPS = 4.8e9

export function dsiRequiredBps(timing: Timing): number {
  return pixelClockHz(timing) * BPP * PROTOCOL_OVERHEAD
}

export function dsiConstraints(timing: Timing, spec: DsiSpec, options?: DsiOptions): ConstraintResult[] {
  const lanes = options?.lanes ?? spec.lanes
  if (lanes > spec.lanes) {
    throw new Error(`DSI lanes ${lanes} exceeds chipset maximum ${spec.lanes}`)
  }
  const pclkMHz = pixelClockHz(timing) / 1e6
  const requiredBps = dsiRequiredBps(timing)
  const limitBps = lanes * spec.laneMbps * 1e6
  const laneGbps = spec.laneMbps / 1e3

  const results: ConstraintResult[] = [
    atMost('DSI 대역폭', requiredBps, limitBps, 'bps', SPEC_SOURCE, {
      expression: 'Pixel_Clock × BPP(24) × Protocol_Overhead(1.1) ≤ Lanes × Lane_Rate(2.5 Gbps)',
      actualSubstitution: `${pclkMHz.toFixed(3)} MHz × 24 bpp × 1.1 = ${(requiredBps / 1e9).toFixed(3)} Gbps`,
      limitSubstitution: `${lanes} lanes × ${laneGbps.toFixed(2)} Gbps = ${(limitBps / 1e9).toFixed(3)} Gbps`,
    }),
    atMost('DSI 라인버퍼 Width', timing.hActive, spec.maxWidth, 'px', SPEC_SOURCE, {
      expression: 'H_active ≤ DSI_LineBuffer_Max_Width',
      actualSubstitution: `H_active = ${timing.hActive} px`,
      limitSubstitution: `DSI_LineBuffer_Max_Width = ${spec.maxWidth} px`,
    }),
  ]
  if (options?.serdesCap) {
    const serdesLimit = spec.serdesMaxBps ?? EVB_SERDES_MAX_BPS
    results.push(
      atMost('DSI EVB SerDes 대역폭', requiredBps, serdesLimit, 'bps', SPEC_SOURCE, {
        expression: 'Pixel_Clock × 24 × 1.1 ≤ EVB_SerDes_Max_Bandwidth (4.8 Gbps)',
        actualSubstitution: `${pclkMHz.toFixed(3)} MHz × 24 bpp × 1.1 = ${(requiredBps / 1e9).toFixed(3)} Gbps`,
        limitSubstitution: `TCC807x EVB 4-lane SerDes 상한 = ${(serdesLimit / 1e9).toFixed(3)} Gbps`,
      }),
    )
  }
  return results
}
