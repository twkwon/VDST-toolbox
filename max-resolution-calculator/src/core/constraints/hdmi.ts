import { SPEC_SOURCE } from '../../data/chipsets'
import { pixelClockHz, type Timing } from '../timing'
import { atMost, type ConstraintResult } from './result'

export type HdmiSpec = {
  maxPixelClockHz: number
  maxTmdsBps: number
}

export type HdmiColorFormat = 'rgb_yuv444_8bpc' | 'yuv422_8bpc' | 'yuv420_8bpc'

export type HdmiOptions = {
  format?: HdmiColorFormat
}

// 매뉴얼 10.1.4 Table 10.8:
// RGB / YCbCr 4:4:4 8bpc (24bpp) + TMDS 8b/10b 인코딩(× 10/8) = 픽셀당 30비트 (594 MHz → 17.82 Gbps)
// YCbCr 4:2:0 8bpc는 픽셀 클럭 및 TMDS 데이터 레이트가 1/2로 감소 (픽셀당 15비트)
const TMDS_BITS_PER_PIXEL: Record<HdmiColorFormat, number> = {
  rgb_yuv444_8bpc: 30,
  yuv422_8bpc: 30,
  yuv420_8bpc: 15,
}

export function hdmiTmdsClockHz(timing: Timing, format: HdmiColorFormat = 'rgb_yuv444_8bpc'): number {
  const pclk = pixelClockHz(timing)
  return format === 'yuv420_8bpc' ? pclk / 2 : pclk
}

export function hdmiTmdsDataRateBps(timing: Timing, format: HdmiColorFormat = 'rgb_yuv444_8bpc'): number {
  return pixelClockHz(timing) * TMDS_BITS_PER_PIXEL[format]
}

export function hdmiConstraints(timing: Timing, spec: HdmiSpec, options?: HdmiOptions): ConstraintResult[] {
  const format = options?.format ?? 'rgb_yuv444_8bpc'
  const pclkMHz = pixelClockHz(timing) / 1e6
  const tmdsClockHz = hdmiTmdsClockHz(timing, format)
  const tmdsRateBps = hdmiTmdsDataRateBps(timing, format)
  const clockFactor = format === 'yuv420_8bpc' ? 0.5 : 1.0
  const tmdsBits = TMDS_BITS_PER_PIXEL[format]

  return [
    atMost('HDMI TMDS Pixel Clock', tmdsClockHz, spec.maxPixelClockHz, 'hz', SPEC_SOURCE, {
      expression: 'TMDS_Clock = Pixel_Clock × Chroma_Factor ≤ 600 MHz',
      actualSubstitution: `${pclkMHz.toFixed(3)} MHz × ${clockFactor} = ${(tmdsClockHz / 1e6).toFixed(3)} MHz`,
      limitSubstitution: `HDMI 2.0 최대 TMDS Pixel Clock = ${(spec.maxPixelClockHz / 1e6).toFixed(3)} MHz`,
    }),
    atMost('HDMI TMDS 대역폭', tmdsRateBps, spec.maxTmdsBps, 'bps', SPEC_SOURCE, {
      expression:
        format === 'yuv420_8bpc'
          ? 'TMDS_Rate = Pixel_Clock × 12 bpp(YCbCr420) × (10/8 TMDS 인코딩) ≤ 18.0 Gbps'
          : 'TMDS_Rate = Pixel_Clock × 24 bpp × (10/8 TMDS 인코딩 = 30 bits/px) ≤ 18.0 Gbps',
      actualSubstitution: `${pclkMHz.toFixed(3)} MHz × ${tmdsBits} bits/px = ${(tmdsRateBps / 1e9).toFixed(3)} Gbps`,
      limitSubstitution: `HDMI 2.0 최대 TMDS Data Rate (6.0 Gbps × 3 ch) = ${(spec.maxTmdsBps / 1e9).toFixed(3)} Gbps`,
    }),
  ]
}
