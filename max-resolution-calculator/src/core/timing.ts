import { CEA861_MODES, CEA861_SOURCE, WIKI_CUSTOM_BLANKING } from '../data/timings'

export type Timing = {
  hActive: number
  vActive: number
  hTotal: number
  vTotal: number
  fps: number
}

export type ActiveMode = { hActive: number; vActive: number; fps: number }

export type FallbackTimingMethod = 'cvtRbV2' | 'wikiCustom'

export type ResolvedTiming = { timing: Timing; source: string }

export function pixelClockHz(timing: Timing): number {
  return timing.hTotal * timing.vTotal * timing.fps
}

export function findCea861(mode: ActiveMode): (Timing & { vic: number }) | undefined {
  return CEA861_MODES.find(
    (m) => m.hActive === mode.hActive && m.vActive === mode.vActive && m.fps === mode.fps,
  )
}

const RB_V2_H_BLANK = 80
const RB_MIN_V_BLANK_US = 460
const RB_V2_MIN_VBI_LINES = 1 + 8 + 6

// VESA CVT 1.2 Reduced Blanking v2, progressive, margin 없음, refresh multiplier 1.0.
// Pixel Clock은 요청 fps로 다시 계산하므로 규격의 1 kHz 클럭 스텝 내림은 적용하지 않는다.
export function cvtRbV2Timing(mode: ActiveMode): Timing {
  const hPeriodEstUs = (1e6 / mode.fps - RB_MIN_V_BLANK_US) / mode.vActive
  const vbiLines = Math.floor(RB_MIN_V_BLANK_US / hPeriodEstUs) + 1
  return {
    ...mode,
    hTotal: mode.hActive + RB_V2_H_BLANK,
    vTotal: mode.vActive + Math.max(vbiLines, RB_V2_MIN_VBI_LINES),
  }
}

export function wikiCustomTiming(mode: ActiveMode): Timing {
  return {
    ...mode,
    hTotal: mode.hActive + WIKI_CUSTOM_BLANKING.hBlank,
    vTotal: mode.vActive + WIKI_CUSTOM_BLANKING.vBlank,
  }
}

export function resolveTiming(mode: ActiveMode, fallback: FallbackTimingMethod): ResolvedTiming {
  const cea = findCea861(mode)
  if (cea) {
    const { vic, ...timing } = cea
    return { timing, source: `${CEA861_SOURCE} VIC ${vic}` }
  }
  if (fallback === 'cvtRbV2') {
    return { timing: cvtRbV2Timing(mode), source: 'CVT-RB v2' }
  }
  return {
    timing: wikiCustomTiming(mode),
    source: `위키 Custom (H blank ${WIKI_CUSTOM_BLANKING.hBlank} px, V blank ${WIKI_CUSTOM_BLANKING.vBlank} lines)`,
  }
}
