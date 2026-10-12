import { pixelClockHz, type Timing } from '../timing'
import { atMost, type ConstraintResult } from './result'

type DsiSpec = { lanes: number; laneMbps: number; maxWidth: number }

const BPP = 24
const PROTOCOL_OVERHEAD = 1.1

export function dsiConstraints(timing: Timing, spec: DsiSpec): ConstraintResult[] {
  return [
    atMost('DSI 대역폭', pixelClockHz(timing) * BPP * PROTOCOL_OVERHEAD, spec.lanes * spec.laneMbps * 1e6, 'bps'),
    atMost('DSI 라인버퍼 Width', timing.hActive, spec.maxWidth, 'px'),
  ]
}
