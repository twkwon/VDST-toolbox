import { SPEC_SOURCE } from '../../data/chipsets'
import { DP_LINK_RATE_MBPS, type DpLaneCount, type DpLinkRate, type DpMode } from '../spec'
import { pixelClockHz, type Timing } from '../timing'
import { atMost, type ConstraintResult } from './result'

export type DpSstOptions = {
  linkRate: DpLinkRate
  lanes: DpLaneCount
  fec: boolean
  ssc: boolean
  mode?: DpMode
  dsc?: boolean
  bppCompressed?: number
}

export type DpSpec = { maxLinkRate: DpLinkRate; maxLanes: DpLaneCount; mst?: boolean }

export const DP_NATIVE_BPP = 24
export const DEFAULT_DSC_BPP = 12
const ENCODING_8B10B = 0.8
const FEC_EFFICIENCY = 0.976
const SSC_EFFICIENCY = 0.995
export const DP_TU_SIZE_SYMBOLS = 64

export function effectiveDpBpp(options: DpSstOptions): number {
  return options.dsc ? (options.bppCompressed ?? DEFAULT_DSC_BPP) : DP_NATIVE_BPP
}

// 위키 Table 1 / Table 3 / DB 452788685: DSC 사용 시 FEC는 필수이다.
export function effectiveDpFec(options: DpSstOptions): boolean {
  return options.dsc ? true : options.fec
}

export function assertValidDpLink(spec: DpSpec, options: DpSstOptions): void {
  if (DP_LINK_RATE_MBPS[options.linkRate] > DP_LINK_RATE_MBPS[spec.maxLinkRate] || options.lanes > spec.maxLanes) {
    throw new Error(`DP link ${options.linkRate} x${options.lanes} exceeds chipset maximum`)
  }
}

export function dpMaxPayloadBps(options: DpSstOptions): number {
  return (
    DP_LINK_RATE_MBPS[options.linkRate] *
    1e6 *
    options.lanes *
    ENCODING_8B10B *
    (effectiveDpFec(options) ? FEC_EFFICIENCY : 1) *
    (options.ssc ? SSC_EFFICIENCY : 1)
  )
}

// 매뉴얼 10.1.1 Table 10.4: ((8 * bpp * Pixel Clock(kHz)) / (Num of lane * Link Rate(Gbps) * 100000))
export function dpLinkSymbolSlots(
  timing: Timing,
  options: DpSstOptions,
): { exact: number; slots: number; expression: string; substitution: string } {
  const bpp = effectiveDpBpp(options)
  const pclkKhz = pixelClockHz(timing) / 1e3
  const linkRateGbps = DP_LINK_RATE_MBPS[options.linkRate] / 1e3
  const numerator = 8 * bpp * pclkKhz
  const denominator = options.lanes * linkRateGbps * 100_000
  const exact = numerator / denominator
  const slots = Math.ceil(exact - 1e-9)
  return {
    exact,
    slots,
    expression: 'CEIL( (8 × BPP × PixelClock_kHz) / (Lanes × LinkRate_Gbps × 100,000) ) ≤ 64',
    substitution: `CEIL( (8 × ${bpp} × ${pclkKhz.toLocaleString('en-US')}) / (${options.lanes} × ${linkRateGbps} × 100,000) ) = CEIL(${numerator.toLocaleString('en-US')} / ${denominator.toLocaleString('en-US')}) = CEIL(${exact.toFixed(2)}) = ${slots} slots`,
  }
}

export function dpSstConstraints(timing: Timing, spec: DpSpec, options: DpSstOptions): ConstraintResult[] {
  assertValidDpLink(spec, options)
  const bpp = effectiveDpBpp(options)
  const pclkMHz = pixelClockHz(timing) / 1e6
  const actualBps = pixelClockHz(timing) * bpp
  const limitBps = dpMaxPayloadBps(options)
  const linkRateGbps = DP_LINK_RATE_MBPS[options.linkRate] / 1e3
  const fecOn = effectiveDpFec(options)
  const bppLabel = options.dsc ? `bpp_compressed(${bpp})` : `bpp_native(${bpp})`

  const exprParts = ['Link_Rate × Lanes × 0.8(8b/10b)']
  const subParts = [`${linkRateGbps} Gbps(${options.linkRate}) × ${options.lanes} lanes × 0.8`]
  if (fecOn) {
    exprParts.push('× 0.976(FEC)')
    subParts.push('× 0.976(FEC)')
  }
  if (options.ssc) {
    exprParts.push('× 0.995(SSC)')
    subParts.push('× 0.995(SSC)')
  }

  return [
    atMost('DP SST 대역폭', actualBps, limitBps, 'bps', SPEC_SOURCE, {
      expression: `Pixel_Clock × ${options.dsc ? 'bpp_compressed' : 'bpp_native'} ≤ ${exprParts.join(' ')}`,
      actualSubstitution: `${pclkMHz.toFixed(3)} MHz × ${bppLabel} = ${(actualBps / 1e9).toFixed(3)} Gbps`,
      limitSubstitution: `${subParts.join(' ')} = ${(limitBps / 1e9).toFixed(3)} Gbps`,
    }),
  ]
}
