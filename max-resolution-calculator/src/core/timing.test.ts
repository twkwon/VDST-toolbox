import { describe, expect, it } from 'vitest'
import { cvtRbV2Timing, findCea861, pixelClockHz, resolveTiming, wikiCustomTiming } from './timing'

describe('CVT-RB v2', () => {
  it('1920x1080@60 → 2000 x 1111, 133.32 MHz', () => {
    const t = cvtRbV2Timing({ hActive: 1920, vActive: 1080, fps: 60 })
    expect(t).toMatchObject({ hTotal: 2000, vTotal: 1111 })
    expect(pixelClockHz(t)).toBeCloseTo(133.32e6, -3)
  })

  it('3840x2160@60 → 3920 x 2222, 522.614 MHz', () => {
    const t = cvtRbV2Timing({ hActive: 3840, vActive: 2160, fps: 60 })
    expect(t).toMatchObject({ hTotal: 3920, vTotal: 2222 })
    expect(pixelClockHz(t)).toBeCloseTo(522.6144e6, -3)
  })

  it('2560x1440@60 → 2640 x 1481', () => {
    expect(cvtRbV2Timing({ hActive: 2560, vActive: 1440, fps: 60 })).toMatchObject({ hTotal: 2640, vTotal: 1481 })
  })

  it('vertical blanking grows with fps because the 460 µs minimum is a time', () => {
    expect(cvtRbV2Timing({ hActive: 1920, vActive: 1080, fps: 120 }).vTotal).toBe(1144)
  })

  it('never goes below the minimum 15 blanking lines', () => {
    expect(cvtRbV2Timing({ hActive: 640, vActive: 480, fps: 24 }).vTotal).toBe(495)
  })
})

describe('wiki Custom blanking', () => {
  it('adds 80 px and 6 lines', () => {
    expect(wikiCustomTiming({ hActive: 1920, vActive: 1080, fps: 60 })).toMatchObject({ hTotal: 2000, vTotal: 1086 })
  })
})

describe('resolveTiming', () => {
  it('prefers CEA-861: 1920x1080@60 is VIC 16', () => {
    const r = resolveTiming({ hActive: 1920, vActive: 1080, fps: 60 }, 'cvtRbV2')
    expect(r.timing).toMatchObject({ hTotal: 2200, vTotal: 1125 })
    expect(r.source).toContain('VIC 16')
  })

  it('3840x2160@100 is VIC 117 with 50 Hz-family H total 5280 (1188 MHz)', () => {
    const r = resolveTiming({ hActive: 3840, vActive: 2160, fps: 100 }, 'cvtRbV2')
    expect(r.timing).toMatchObject({ hTotal: 5280, vTotal: 2250 })
    expect(pixelClockHz(r.timing)).toBe(1188e6)
  })

  it('falls back to the chosen method when CEA-861 has no entry', () => {
    const mode = { hActive: 1920, vActive: 720, fps: 60 }
    expect(findCea861(mode)).toBeUndefined()
    expect(resolveTiming(mode, 'cvtRbV2')).toMatchObject({ source: 'CVT-RB v2', timing: { hTotal: 2000, vTotal: 741 } })
    expect(resolveTiming(mode, 'wikiCustom').timing).toMatchObject({ hTotal: 2000, vTotal: 726 })
  })
})
