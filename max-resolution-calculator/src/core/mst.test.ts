import { describe, expect, it } from 'vitest'
import type { DpSstOptions } from './constraints/dpSst'
import { verifyMstStreams } from './mst'
import { resolveTiming } from './timing'

const HBR3_X4_MST: DpSstOptions = {
  mode: 'mst',
  linkRate: 'HBR3',
  lanes: 4,
  fec: false,
  ssc: false,
}

describe('verifyMstStreams (4-channel MST)', () => {
  it('supports manual 10.1.1 reference 4-channel setup: 4K@60 x1 + FHD@60 x3 (total 63 slots)', () => {
    const s4k = resolveTiming({ hActive: 3840, vActive: 2160, fps: 60 }, 'wikiCustom')
    const sfhd = resolveTiming({ hActive: 1920, vActive: 1080, fps: 60 }, 'wikiCustom')

    const res = verifyMstStreams({
      chipsetId: 'd5',
      scaler: 'off',
      dp: HBR3_X4_MST,
      streams: [
        { timing: s4k.timing, timingSource: s4k.source },
        { timing: sfhd.timing, timingSource: sfhd.source },
        { timing: sfhd.timing, timingSource: sfhd.source },
        { timing: sfhd.timing, timingSource: sfhd.source },
      ],
    })

    expect(res).toMatchObject({
      supported: true,
      pass: true,
      pbnPerSlot: 60,
      totalTimeSlots: 63,
      totalTuSymbolSlots: 63,
    })
  })

  it('fails when total MST time slots exceed 63 (e.g. 4K@60 x2)', () => {
    const s4k = resolveTiming({ hActive: 3840, vActive: 2160, fps: 60 }, 'wikiCustom')
    const res = verifyMstStreams({
      chipsetId: 'd5',
      scaler: 'off',
      dp: HBR3_X4_MST,
      streams: [
        { timing: s4k.timing, timingSource: s4k.source },
        { timing: s4k.timing, timingSource: s4k.source },
      ],
    })

    expect(res.supported).toBe(true)
    if (res.supported) {
      expect(res.pass).toBe(false)
      expect(res.totalTimeSlots).toBe(72)
    }
  })

  it('returns supported: false for chipsets without DP MST', () => {
    const sfhd = resolveTiming({ hActive: 1920, vActive: 1080, fps: 60 }, 'wikiCustom')
    const res = verifyMstStreams({
      chipsetId: 'd-plus',
      scaler: 'off',
      dp: HBR3_X4_MST,
      streams: [{ timing: sfhd.timing }],
    })
    expect(res).toEqual({ supported: false })
  })
})
