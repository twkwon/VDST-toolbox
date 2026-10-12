import { describe, expect, it } from 'vitest'
import type { DpSstOptions } from './constraints/dpSst'
import { explore, type ExploreInput, type ExploreRow } from './explore'

const HBR3_X4: DpSstOptions = { linkRate: 'HBR3', lanes: 4, fec: false, ssc: false }

function rows(input: Omit<ExploreInput, 'scaler' | 'fallback'> & Partial<ExploreInput>): ExploreRow[] {
  const result = explore({ scaler: false, fallback: 'wikiCustom', ...input })
  if (!result.supported) throw new Error('expected supported output')
  return result.rows
}

const label = (r: ExploreRow) => `${r.resolution.width}x${r.resolution.height}`

describe('explore', () => {
  it('D5 DP HBR3 x4 @60: largest is 4096x2160, exactly on the DISP pixel total', () => {
    const passing = rows({ chipsetId: 'd5', output: 'dp', fps: 60, dp: HBR3_X4 }).filter((r) => r.pass)
    expect(label(passing[0])).toBe('4096x2160')
    expect(passing[0].timingSource).toContain('VIC 102')
  })

  it('D3 Single LVDS @60: 1920x1200 fits, 2560x1080 (VIC 90, 198 MHz) does not', () => {
    const all = rows({ chipsetId: 'd3', output: 'lvdsSingle', fps: 60 })
    expect(label(all.filter((r) => r.pass)[0])).toBe('1920x1200')
    const wide = all.find((r) => label(r) === '2560x1080')!
    expect(wide.pass).toBe(false)
    expect(wide.tightest.name).toBe('LVDS 대역폭')
  })

  it('D5 DSI @60: 3840x1440 is the largest under 10 Gbps and Width 4096', () => {
    const all = rows({ chipsetId: 'd5', output: 'dsi', fps: 60 })
    expect(label(all.filter((r) => r.pass)[0])).toBe('3840x1440')
    expect(all.find((r) => label(r) === '5120x1440')!.pass).toBe(false)
  })

  it('sorts by pixel count, then wider first on ties', () => {
    const all = rows({ chipsetId: 'd5', output: 'dp', fps: 60, dp: HBR3_X4 })
    const tie = all.filter((r) => r.resolution.width * r.resolution.height === 3840 * 2160).map(label)
    expect(tie).toEqual(['7680x1080', '3840x2160'])
  })

  it('reports unsupported outputs', () => {
    expect(explore({ chipsetId: 'd5', output: 'lvdsSingle', fps: 60, scaler: false, fallback: 'wikiCustom' })).toEqual({
      supported: false,
    })
  })
})
