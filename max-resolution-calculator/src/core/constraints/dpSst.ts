import { DP_LINK_RATE_MBPS, type DpLaneCount, type DpLinkRate } from '../spec'
import { pixelClockHz, type Timing } from '../timing'
import { atMost, type ConstraintResult } from './result'

export type DpSstOptions = {
  linkRate: DpLinkRate
  lanes: DpLaneCount
  fec: boolean
  ssc: boolean
}

type DpSpec = { maxLinkRate: DpLinkRate; maxLanes: DpLaneCount }

const BPP = 24
const ENCODING_8B10B = 0.8
const FEC_EFFICIENCY = 0.976
const SSC_EFFICIENCY = 0.995

export function dpMaxPayloadBps(options: DpSstOptions): number {
  return (
    DP_LINK_RATE_MBPS[options.linkRate] *
    1e6 *
    options.lanes *
    ENCODING_8B10B *
    (options.fec ? FEC_EFFICIENCY : 1) *
    (options.ssc ? SSC_EFFICIENCY : 1)
  )
}

export function dpSstConstraints(timing: Timing, spec: DpSpec, options: DpSstOptions): ConstraintResult[] {
  if (DP_LINK_RATE_MBPS[options.linkRate] > DP_LINK_RATE_MBPS[spec.maxLinkRate] || options.lanes > spec.maxLanes) {
    throw new Error(`DP link ${options.linkRate} x${options.lanes} exceeds chipset maximum`)
  }
  return [atMost('DP SST 대역폭', pixelClockHz(timing) * BPP, dpMaxPayloadBps(options), 'bps')]
}
