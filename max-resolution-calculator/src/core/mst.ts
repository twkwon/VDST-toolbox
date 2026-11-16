import { CHIPSETS, SPEC_SOURCE, VIOC } from '../data/chipsets'
import {
  DP_MST_MAX_TIME_SLOTS,
  dpMstConstraints,
  dpMstMaxPayloadBps,
  dpMstPbnPerSlot,
  dpMstStreamPbn,
  dpMstTimeSlots,
} from './constraints/dpMst'
import {
  assertValidDpLink,
  DP_TU_SIZE_SYMBOLS,
  dpLinkSymbolSlots,
  effectiveDpBpp,
  effectiveDpFec,
  type DpSstOptions,
} from './constraints/dpSst'
import { atMost, type ConstraintResult } from './constraints/result'
import { dispConstraints, normalizeScalerMode, scalerConstraints } from './constraints/vioc'
import { DP_LINK_RATE_MBPS, type ScalerInput } from './spec'
import { pixelClockHz, type Timing } from './timing'

export type MstStreamInput = {
  timing: Timing
  timingSource?: string
}

export type MstVerifyInput = {
  chipsetId: string
  scaler: ScalerInput
  dp: DpSstOptions
  streams: MstStreamInput[]
}

export type MstStreamResult = {
  index: number
  timing: Timing
  timingSource: string
  pixelClockHz: number
  payloadBps: number
  pbn: number
  timeSlots: number
  tuSymbolSlots: number
  tuSymbolExact: number
  pbnSubstitution: string
  timeSlotSubstitution: string
  tuSymbolSubstitution: string
  pass: boolean
  constraints: ConstraintResult[]
}

export type MstVerifyResult =
  | { supported: false }
  | {
      supported: true
      pass: boolean
      pbnPerSlot: number
      maxPayloadBps: number
      totalPbn: number
      totalTimeSlots: number
      totalTuSymbolSlots: number
      totalPayloadBps: number
      streams: MstStreamResult[]
      linkConstraints: ConstraintResult[]
    }

export const MAX_MST_STREAMS = 4

export function verifyMstStreams(input: MstVerifyInput): MstVerifyResult {
  const chipset = CHIPSETS.find((c) => c.id === input.chipsetId)
  if (!chipset) {
    throw new Error(`Unknown chipset: ${input.chipsetId}`)
  }
  const spec = chipset.outputs.dp
  if (!spec || spec.kind !== 'dp' || !spec.mst) {
    return { supported: false }
  }
  if (input.streams.length === 0 || input.streams.length > MAX_MST_STREAMS) {
    throw new Error(`MST stream count must be between 1 and ${MAX_MST_STREAMS}`)
  }

  assertValidDpLink(spec, input.dp)

  const scalerMode = normalizeScalerMode(input.scaler)
  const bpp = effectiveDpBpp(input.dp)
  const fecOn = effectiveDpFec(input.dp)
  const pbnPerSlot = dpMstPbnPerSlot(input.dp.linkRate, input.dp.lanes)
  const maxPayloadBps = dpMstMaxPayloadBps(input.dp)
  const linkRateGbps = DP_LINK_RATE_MBPS[input.dp.linkRate] / 1e3

  const streams: MstStreamResult[] = input.streams.map((s, idx) => {
    const pclk = pixelClockHz(s.timing)
    const pclkMHz = pclk / 1e6
    const payloadBps = pclk * bpp
    const pbnRaw = (pclk * bpp * 1.006 * (fecOn ? 100 / 97 : 1)) / 6_750_000
    const pbn = dpMstStreamPbn(s.timing, input.dp)
    const timeSlots = dpMstTimeSlots(s.timing, input.dp)
    const tu = dpLinkSymbolSlots(s.timing, input.dp)
    const constraints = [
      ...dispConstraints(s.timing, VIOC.disp),
      ...(scalerMode !== 'off' ? scalerConstraints(s.timing, VIOC.scaler, scalerMode) : []),
      ...dpMstConstraints(s.timing, spec, input.dp),
    ]
    return {
      index: idx + 1,
      timing: s.timing,
      timingSource: s.timingSource ?? '',
      pixelClockHz: pclk,
      payloadBps,
      pbn,
      timeSlots,
      tuSymbolSlots: tu.slots,
      tuSymbolExact: tu.exact,
      pbnSubstitution: `CEIL((${pclkMHz.toFixed(3)} MHz × ${bpp} bpp × 1.006${
        fecOn ? ' × 1.0309' : ''
      }) / 6.75) = CEIL(${pbnRaw.toFixed(2)}) = ${pbn} PBN`,
      timeSlotSubstitution: `CEIL(${pbn} PBN / ${pbnPerSlot} PBN) = ${timeSlots} slots`,
      tuSymbolSubstitution: tu.substitution,
      pass: constraints.every((c) => c.pass),
      constraints,
    }
  })

  const totalPbn = streams.reduce((acc, s) => acc + s.pbn, 0)
  const totalTimeSlots = streams.reduce((acc, s) => acc + s.timeSlots, 0)
  const totalTuSymbolSlots = streams.reduce((acc, s) => acc + s.tuSymbolSlots, 0)
  const totalPayloadBps = streams.reduce((acc, s) => acc + s.payloadBps, 0)

  const linkConstraints: ConstraintResult[] = [
    atMost('DP MST 합산 Time Slot', totalTimeSlots, DP_MST_MAX_TIME_SLOTS, 'slots', SPEC_SOURCE, {
      expression: '∑ CEIL(Stream_PBN_i / PBN_per_Slot) ≤ 63 slots',
      actualSubstitution: `${streams.map((s) => `${s.timeSlots}`).join(' + ')} = ${totalTimeSlots} slots`,
      limitSubstitution: `63 slots (MTP 64 slots - 헤더 1 slot, 1 slot = ${pbnPerSlot} PBN)`,
    }),
    atMost('DP MST 합산 대역폭', totalPayloadBps, maxPayloadBps, 'bps', SPEC_SOURCE, {
      expression: fecOn
        ? '∑ (Pixel_Clock_i × BPP) ≤ Link_Rate × Lanes × 0.8 × (63/64) × 0.97'
        : '∑ (Pixel_Clock_i × BPP) ≤ Link_Rate × Lanes × 0.8 × (63/64) × (1 / 1.006)',
      actualSubstitution: `${streams.map((s) => `${(s.payloadBps / 1e9).toFixed(3)}`).join(' + ')} = ${(
        totalPayloadBps / 1e9
      ).toFixed(3)} Gbps`,
      limitSubstitution: `${linkRateGbps} Gbps × ${input.dp.lanes} lanes × 0.8 × (63/64) × ${
        fecOn ? '0.97' : '(1/1.006)'
      } = ${(maxPayloadBps / 1e9).toFixed(3)} Gbps`,
    }),
    atMost('DP TU 합산 심볼 슬롯', totalTuSymbolSlots, DP_TU_SIZE_SYMBOLS, 'slots', SPEC_SOURCE, {
      expression: '∑ CEIL((8 × BPP × PixelClock_kHz_i) / (Lanes × LinkRate_Gbps × 100,000)) ≤ 64 slots',
      actualSubstitution: `${streams.map((s) => `${s.tuSymbolSlots}`).join(' + ')} = ${totalTuSymbolSlots} slots`,
      limitSubstitution: `64 slots (Transfer Unit 고정 64 link symbols)`,
    }),
  ]

  const pass = streams.every((s) => s.pass) && linkConstraints.every((c) => c.pass)

  return {
    supported: true,
    pass,
    pbnPerSlot,
    maxPayloadBps,
    totalPbn,
    totalTimeSlots,
    totalTuSymbolSlots,
    totalPayloadBps,
    streams,
    linkConstraints,
  }
}
