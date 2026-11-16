import { describe, expect, it } from 'vitest'
import { dpMstStreamPbn, dpMstTimeSlots } from './constraints/dpMst'
import { dpLinkSymbolSlots, type DpSstOptions } from './constraints/dpSst'
import type { DsiOptions } from './constraints/dsi'
import type { HdmiOptions } from './constraints/hdmi'
import type { OutputId, ScalerInput } from './spec'
import { resolveTiming, type Timing } from './timing'
import { verify, type VerifyResult } from './verify'

function timing(hActive: number, vActive: number, hTotal: number, vTotal: number, fps: number): Timing {
  return { hActive, vActive, hTotal, vTotal, fps }
}

const CTA_1080P = (fps: number) => timing(1920, 1080, 2200, 1125, fps)
const CTA_2160P = (fps: number) => timing(3840, 2160, 4400, 2250, fps)
const HBR3_X4: DpSstOptions = { linkRate: 'HBR3', lanes: 4, fec: false, ssc: false }

function run(
  chipsetId: string,
  output: OutputId,
  t: Timing,
  extra: { scaler?: ScalerInput; dp?: DpSstOptions; dsi?: DsiOptions; hdmi?: HdmiOptions } = {},
) {
  return verify({
    chipsetId,
    output,
    timing: t,
    scaler: extra.scaler ?? false,
    dp: extra.dp,
    dsi: extra.dsi,
    hdmi: extra.hdmi,
  })
}

function constraint(result: VerifyResult, name: string) {
  if (!result.supported) throw new Error('expected supported output')
  const found = result.constraints.find((c) => c.name === name)
  if (!found) throw new Error(`missing constraint ${name}`)
  return found
}

function failedNames(result: VerifyResult) {
  if (!result.supported) throw new Error('expected supported output')
  return result.constraints.filter((c) => !c.pass).map((c) => c.name)
}

describe('LVDS', () => {
  it('D3 Single LVDS 1920x1080@60 fits (4.158 <= 4.48 Gbps)', () => {
    const result = run('d3', 'lvdsSingle', CTA_1080P(60))
    expect(constraint(result, 'LVDS 대역폭').actual).toBeCloseTo(4.158e9, -6)
    expect(result).toMatchObject({ pass: true })
  })

  it('D3 Single LVDS 2560x1080@60 CVT-RB v1 exceeds (5.077 > 4.48 Gbps)', () => {
    const result = run('d3', 'lvdsSingle', timing(2560, 1080, 2720, 1111, 60))
    expect(constraint(result, 'LVDS 대역폭').actual).toBeCloseTo(5.0768e9, -6)
    expect(failedNames(result)).toEqual(['LVDS 대역폭'])
  })

  it('D3 Dual LVDS 2560x1440@60 CVT-RB fits (6.768 <= 8.96 Gbps) and checks Splitter Half-Width', () => {
    const result = run('d3', 'lvdsDual', timing(2560, 1440, 2720, 1481, 60))
    expect(constraint(result, 'LVDS 대역폭').actual).toBeCloseTo(6.7678e9, -6)
    expect(constraint(result, 'Dual LVDS Splitter Half-Width')).toMatchObject({
      actual: 1280,
      limit: 4095,
      pass: true,
    })
    expect(result).toMatchObject({ pass: true })
  })
})

describe('DP SST & DSC & Link Symbol Slots', () => {
  it('D5 3840x2160@60 fits (14.256 <= 25.92 Gbps)', () => {
    const result = run('d5', 'dp', CTA_2160P(60), { dp: HBR3_X4 })
    expect(constraint(result, 'DP SST 대역폭').limit).toBeCloseTo(25.92e9, -3)
    expect(result).toMatchObject({ pass: true })
  })

  it('direct 4400x2250@100 fits (23.76 <= 25.92 Gbps) — catches double-applied 8b/10b', () => {
    const result = run('d5', 'dp', timing(3840, 2160, 4400, 2250, 100), { dp: HBR3_X4 })
    expect(constraint(result, 'DP SST 대역폭').actual).toBeCloseTo(23.76e9, -3)
    expect(result).toMatchObject({ pass: true })
  })

  it('CEA-861 3840x2160@100 (VIC 117, 1188 MHz) exceeds HBR3 x4 without DSC', () => {
    const { timing: vic117 } = resolveTiming({ hActive: 3840, vActive: 2160, fps: 100 }, 'cvtRbV2')
    const result = run('d5', 'dp', vic117, { dp: HBR3_X4 })
    expect(failedNames(result)).toEqual(['DP SST 대역폭'])
  })

  it('D5 3840x2160@120 exceeds without DSC (28.512 > 25.92 Gbps), but fits with DSC 12bpp + mandatory FEC', () => {
    const result = run('d5', 'dp', CTA_2160P(120), { dp: HBR3_X4 })
    expect(failedNames(result)).toEqual(['DP SST 대역폭'])

    const withDsc = run('d5', 'dp', CTA_2160P(120), {
      dp: { ...HBR3_X4, dsc: true, bppCompressed: 12 },
    })
    expect(constraint(withDsc, 'DP SST 대역폭').actual).toBeCloseTo(14.256e9, -3)
    expect(constraint(withDsc, 'DP SST 대역폭').limit).toBeCloseTo(25.29792e9, -3)
    expect(withDsc).toMatchObject({ pass: true })
  })

  it('FEC factor decides 4400x2250@107 (25.423 Gbps between 25.298 and 25.92)', () => {
    const t = timing(3840, 2160, 4400, 2250, 107)
    expect(run('d5', 'dp', t, { dp: HBR3_X4 })).toMatchObject({ pass: true })

    const withFec = run('d5', 'dp', t, { dp: { ...HBR3_X4, fec: true } })
    expect(constraint(withFec, 'DP SST 대역폭').limit).toBeCloseTo(25.29792e9, -3)
    expect(failedNames(withFec)).toEqual(['DP SST 대역폭'])
  })

  it('SSC multiplies capacity by 0.995', () => {
    const result = run('d5', 'dp', CTA_2160P(60), { dp: { ...HBR3_X4, fec: true, ssc: true } })
    expect(constraint(result, 'DP SST 대역폭').limit).toBeCloseTo(25.29792e9 * 0.995, -3)
  })

  it('lower negotiated link HBR2 x2 cannot carry 3840x2160@60 (14.256 > 8.64 Gbps)', () => {
    const result = run('d5', 'dp', CTA_2160P(60), { dp: { ...HBR3_X4, linkRate: 'HBR2', lanes: 2 } })
    expect(constraint(result, 'DP SST 대역폭').limit).toBeCloseTo(8.64e9, -3)
    expect(failedNames(result)).toEqual(['DP SST 대역폭'])
  })

  it('matches Table 10.4 TU link symbol slot counts (manual 10.1.1)', () => {
    expect(dpLinkSymbolSlots(CTA_2160P(60), HBR3_X4)).toMatchObject({ exact: 35.2, slots: 36 })
    expect(dpLinkSymbolSlots(CTA_2160P(30), HBR3_X4)).toMatchObject({ exact: 17.6, slots: 18 })
    expect(dpLinkSymbolSlots(CTA_1080P(60), HBR3_X4)).toMatchObject({ exact: 8.8, slots: 9 })
    expect(dpLinkSymbolSlots(timing(1280, 720, 1650, 750, 60), HBR3_X4)).toMatchObject({
      exact: 4.4,
      slots: 5,
    })
    expect(dpLinkSymbolSlots(timing(640, 480, 800, 525, 60), HBR3_X4).slots).toBe(2)
  })

  it('requires link options', () => {
    expect(() => run('d5', 'dp', CTA_2160P(60))).toThrow()
  })

  it('rejects a link above the chipset maximum as invalid input', () => {
    expect(() => run('d5', 'dp', CTA_2160P(60), { dp: { ...HBR3_X4, lanes: 8 as 4 } })).toThrow()
  })
})

describe('DP MST (Table 2~4 & DB 452788685)', () => {
  it('computes PBN and Time Slots for 4K60 and FHD60 on HBR3 x4', () => {
    const mstOpts: DpSstOptions = { ...HBR3_X4, mode: 'mst' }
    expect(dpMstStreamPbn(CTA_2160P(60), mstOpts)).toBe(2125)
    expect(dpMstTimeSlots(CTA_2160P(60), mstOpts)).toBe(36)
    expect(dpMstStreamPbn(CTA_1080P(60), mstOpts)).toBe(532)
    expect(dpMstTimeSlots(CTA_1080P(60), mstOpts)).toBe(9)

    const result = run('d5', 'dp', CTA_2160P(60), { dp: mstOpts })
    expect(result).toMatchObject({ pass: true })
    expect(constraint(result, 'DP MST Time Slot')).toMatchObject({ actual: 36, limit: 63, pass: true })
  })
})

describe('DSI (Direct & EVB SerDes 10.1.2)', () => {
  it('D5 DSI 1920x1080@60 fits (3.920 <= 10 Gbps)', () => {
    const result = run('d5', 'dsi', CTA_1080P(60))
    expect(constraint(result, 'DSI 대역폭').actual).toBeCloseTo(3.9204e9, -6)
    expect(result).toMatchObject({ pass: true })
  })

  it('D5 DSI 4200x1000@30 exceeds line buffer width 4096', () => {
    const result = run('d5', 'dsi', timing(4200, 1000, 4280, 1030, 30))
    expect(failedNames(result)).toEqual(['DSI 라인버퍼 Width'])
  })

  it('Table 10.5: 3840x1080@60 fits direct DSI (10 Gbps) but fails EVB SerDes (4.8 Gbps); 3840x1080@30 fits SerDes', () => {
    const { timing: t60 } = resolveTiming({ hActive: 3840, vActive: 1080, fps: 60 }, 'wikiCustom')
    expect(run('d5', 'dsi', t60, { dsi: { serdesCap: false } })).toMatchObject({ pass: true })
    const serdes60 = run('d5', 'dsi', t60, { dsi: { serdesCap: true } })
    expect(failedNames(serdes60)).toEqual(['DSI EVB SerDes 대역폭'])

    const { timing: t30 } = resolveTiming({ hActive: 3840, vActive: 1080, fps: 30 }, 'wikiCustom')
    expect(run('d5', 'dsi', t30, { dsi: { serdesCap: true } })).toMatchObject({ pass: true })
  })
})

describe('HDMI 2.0 (manual 10.1.4 Table 10.8)', () => {
  it('supports 3840x2160@60 on D+ (TCC803x) (594 MHz <= 600 MHz, 17.82 Gbps <= 18.0 Gbps)', () => {
    const result = run('d-plus', 'hdmi', CTA_2160P(60))
    expect(constraint(result, 'HDMI TMDS Pixel Clock').actual).toBe(594e6)
    expect(constraint(result, 'HDMI TMDS 대역폭').actual).toBeCloseTo(17.82e9, -3)
    expect(result).toMatchObject({ pass: true })
  })

  it('rejects 3840x2160@120 in RGB/YCbCr444, but allows in YCbCr 4:2:0 8-bit on D+ (TCC803x)', () => {
    const rgb = run('d-plus', 'hdmi', CTA_2160P(120))
    expect(failedNames(rgb)).toEqual(['HDMI TMDS Pixel Clock', 'HDMI TMDS 대역폭'])

    const yuv420 = run('d-plus', 'hdmi', CTA_2160P(120), { hdmi: { format: 'yuv420_8bpc' } })
    expect(yuv420).toMatchObject({ pass: true })
  })
})

describe('VIOC DISP / Scaler (2K & 4K)', () => {
  const WIDE = timing(8190, 1080, 8270, 1111, 30)

  it('8190x1080 is allowed by DISP pixel total', () => {
    expect(run('d5', 'dp', WIDE, { dp: HBR3_X4 })).toMatchObject({ pass: true })
  })

  it('8190x1080 fails when Scaler (4K assumption) is in the path', () => {
    const result = run('d5', 'dp', WIDE, { dp: HBR3_X4, scaler: true })
    expect(failedNames(result)).toEqual(['Scaler 출력 Width'])
  })

  it('2560x1440@60 passes with 4K Scaler (<= 4088) but fails with 2K Scaler (<= 2048)', () => {
    const qhd = timing(2560, 1440, 2720, 1481, 60)
    expect(run('d3', 'lvdsDual', qhd, { scaler: '4k' })).toMatchObject({ pass: true })
    const res2k = run('d3', 'lvdsDual', qhd, { scaler: '2k' })
    expect(failedNames(res2k)).toEqual(['Scaler 출력 Width'])
  })

  it('8190x1081 exceeds DISP pixel total', () => {
    const result = run('d5', 'dp', timing(8190, 1081, 8270, 1112, 30), { dp: HBR3_X4 })
    expect(failedNames(result)).toEqual(['DISP 픽셀 총량'])
  })

  it('2160x4096 portrait sits exactly on the pixel total limit', () => {
    const result = run('d5', 'dp', timing(2160, 4096, 2240, 4130, 30), { dp: HBR3_X4 })
    expect(constraint(result, 'DISP 픽셀 총량').pass).toBe(true)
  })
})

describe('D+ Lite FHD cap + LVDS bandwidth', () => {
  it('1920x1080@60 is allowed', () => {
    expect(run('d-plus-lite', 'lvdsSingle', CTA_1080P(60))).toMatchObject({ pass: true })
  })

  it('1920x1200@60 exceeds height 1080', () => {
    const result = run('d-plus-lite', 'lvdsDual', timing(1920, 1200, 2080, 1235, 60))
    expect(failedNames(result)).toEqual(['칩셋 해상도 제약 Height'])
  })

  it('1920x1080@60 with excessive blanking (2640x1125) fails Single LVDS bandwidth on D+ Lite', () => {
    const result = run('d-plus-lite', 'lvdsSingle', timing(1920, 1080, 2640, 1125, 60))
    expect(failedNames(result)).toEqual(['LVDS 대역폭'])
  })
})

describe('unsupported outputs', () => {
  it('D3, D5, D7, D9 have no HDMI; D5 has no LVDS', () => {
    expect(run('d3', 'hdmi', CTA_2160P(60))).toEqual({ supported: false })
    expect(run('d5', 'lvdsSingle', CTA_1080P(60))).toEqual({ supported: false })
    expect(run('d5', 'hdmi', CTA_2160P(60))).toEqual({ supported: false })
    expect(run('d7', 'hdmi', CTA_2160P(60))).toEqual({ supported: false })
    expect(run('d9', 'hdmi', CTA_2160P(60))).toEqual({ supported: false })
  })

  it('D3 Lite has no DP', () => {
    expect(run('d3-lite', 'dp', CTA_1080P(60), { dp: HBR3_X4 })).toEqual({ supported: false })
  })
})
