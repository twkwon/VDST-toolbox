import { SPEC_SOURCE } from '../../data/chipsets'
import { DP_LINK_RATE_MBPS, DP_MST_PBN_PER_SLOT, type DpLaneCount, type DpLinkRate } from '../spec'
import { pixelClockHz, type Timing } from '../timing'
import {
  assertValidDpLink,
  DP_TU_SIZE_SYMBOLS,
  dpLinkSymbolSlots,
  effectiveDpBpp,
  effectiveDpFec,
  type DpSpec,
  type DpSstOptions,
} from './dpSst'
import { atMost, type ConstraintResult } from './result'

const ENCODING_8B10B = 0.8
// MST 슬롯 마진: 64개 슬롯 중 제어 슬롯 1개 제외 (63/64)
export const DP_MST_MAX_TIME_SLOTS = 63
// MST 기본 마진: Branch SSC(0.5%) + 클록 편차(0.06%) = 1.006
const MST_CLOCK_MARGIN = 1.006
// MST FEC + 기본 마진: 2.4% + 0.6% = 3% (× 0.97 / × 100/97)
const MST_FEC_EFFICIENCY = 0.97
const MST_FEC_INFLATION = 100 / 97
// VESA / 위키 Table 3 PBN 단위: 8 bits/byte × (54/64) MBps = 6.75 Mbps = 6,750,000 bps
const PBN_UNIT_BPS = 6_750_000

export function dpMstPbnPerSlot(linkRate: DpLinkRate, lanes: DpLaneCount): number {
  return DP_MST_PBN_PER_SLOT[linkRate][lanes]
}

// 위키 Table 3: CEIL((Pixel_Clock_Hz × bpp × 1.006 × [100/97]) / 6750000)
export function dpMstStreamPbn(timing: Timing, options: DpSstOptions): number {
  const bpp = effectiveDpBpp(options)
  const fecFactor = effectiveDpFec(options) ? MST_FEC_INFLATION : 1
  const raw = (pixelClockHz(timing) * bpp * MST_CLOCK_MARGIN * fecFactor) / PBN_UNIT_BPS
  return Math.ceil(raw - 1e-9)
}

// 위키 Table 4: Time Slots = CEIL(Stream_PBN / Table2_PBN_per_Slot)
export function dpMstTimeSlots(timing: Timing, options: DpSstOptions): number {
  const pbn = dpMstStreamPbn(timing, options)
  const pbnPerSlot = dpMstPbnPerSlot(options.linkRate, options.lanes)
  return Math.ceil(pbn / pbnPerSlot - 1e-9)
}

// DB 452788685 MST 행:
// - 8/10 인코딩: Link Rate × Lane Count × 0.8 × (63/64) × (1 / 1.006)
// - 8/10 인코딩 + FEC (+ DSC): Link Rate × Lane Count × 0.8 × (63/64) × 0.97
export function dpMstMaxPayloadBps(options: DpSstOptions): number {
  const rawBps = DP_LINK_RATE_MBPS[options.linkRate] * 1e6 * options.lanes
  const marginEfficiency = effectiveDpFec(options) ? MST_FEC_EFFICIENCY : 1 / MST_CLOCK_MARGIN
  return rawBps * ENCODING_8B10B * (DP_MST_MAX_TIME_SLOTS / DP_TU_SIZE_SYMBOLS) * marginEfficiency
}

export function dpMstConstraints(timing: Timing, spec: DpSpec, options: DpSstOptions): ConstraintResult[] {
  assertValidDpLink(spec, options)
  const bpp = effectiveDpBpp(options)
  const fecOn = effectiveDpFec(options)
  const pclkHz = pixelClockHz(timing)
  const pclkMHz = pclkHz / 1e6
  const actualBps = pclkHz * bpp
  const limitBps = dpMstMaxPayloadBps(options)
  const linkRateGbps = DP_LINK_RATE_MBPS[options.linkRate] / 1e3

  const pbnRaw = (pclkHz * bpp * MST_CLOCK_MARGIN * (fecOn ? MST_FEC_INFLATION : 1)) / PBN_UNIT_BPS
  const pbn = dpMstStreamPbn(timing, options)
  const pbnPerSlot = dpMstPbnPerSlot(options.linkRate, options.lanes)
  const timeSlots = dpMstTimeSlots(timing, options)
  const tu = dpLinkSymbolSlots(timing, options)

  return [
    atMost('DP MST 대역폭', actualBps, limitBps, 'bps', SPEC_SOURCE, {
      expression: fecOn
        ? 'Pixel_Clock × BPP ≤ Link_Rate × Lanes × 0.8 × (63/64) × 0.97(FEC+MST마진)'
        : 'Pixel_Clock × BPP ≤ Link_Rate × Lanes × 0.8 × (63/64) × (1 / 1.006)',
      actualSubstitution: `${pclkMHz.toFixed(3)} MHz × ${bpp} bpp = ${(actualBps / 1e9).toFixed(3)} Gbps`,
      limitSubstitution: `${linkRateGbps} Gbps(${options.linkRate}) × ${options.lanes} lanes × 0.8 × (63/64) × ${
        fecOn ? '0.97' : '(1/1.006)'
      } = ${(limitBps / 1e9).toFixed(3)} Gbps`,
    }),
    atMost('DP MST Time Slot', timeSlots, DP_MST_MAX_TIME_SLOTS, 'slots', SPEC_SOURCE, {
      expression: `PBN = CEIL((PixelClock_MHz × BPP × 1.006${fecOn ? ' × (100/97)' : ''}) / 6.75), Time_Slots = CEIL(PBN / PBN_per_Slot) ≤ 63`,
      actualSubstitution: `PBN = CEIL((${pclkMHz.toFixed(3)} × ${bpp} × 1.006${
        fecOn ? ' × 1.0309' : ''
      }) / 6.75) = CEIL(${pbnRaw.toFixed(2)}) = ${pbn} PBN → CEIL(${pbn} / ${pbnPerSlot}) = ${timeSlots} slots`,
      limitSubstitution: `63 slots (MTP 64 slots 중 헤더 1 slot 제외, ${options.linkRate}×${options.lanes} 기준 1 slot = ${pbnPerSlot} PBN)`,
    }),
    atMost('DP TU 심볼 슬롯', tu.slots, DP_TU_SIZE_SYMBOLS, 'slots', SPEC_SOURCE, {
      expression: tu.expression,
      actualSubstitution: tu.substitution,
      limitSubstitution: `${DP_TU_SIZE_SYMBOLS} slots (Transfer Unit 고정 64 link symbols)`,
    }),
  ]
}
