import { CEA861_MODES, CEA861_SOURCE, WIKI_CUSTOM_BLANKING } from '../data/timings'

export type Timing = {
  hActive: number
  vActive: number
  hTotal: number
  vTotal: number
  fps: number
}

export type ActiveMode = { hActive: number; vActive: number; fps: number }

export type FallbackTimingMethod = 'cvtRbV2' | 'wikiCustom' | 'blankFactor20'

export const DEFAULT_FALLBACK_TIMING: FallbackTimingMethod = 'wikiCustom'

export type ResolvedTiming = { timing: Timing; source: string }

export type TimingDerivation = {
  blankingFormula: string
  blankingSubstitution: string
  clockFormula: string
  clockSubstitution: string
}

export function pixelClockHz(timing: Timing): number {
  return timing.hTotal * timing.vTotal * timing.fps
}

const FRACTIONAL_FPS_TOLERANCE = 0.05

export function findCea861(mode: ActiveMode): (Timing & { vic: number }) | undefined {
  const exact = CEA861_MODES.find(
    (m) => m.hActive === mode.hActive && m.vActive === mode.vActive && m.fps === mode.fps,
  )
  if (exact) return exact

  // 23.976, 29.97, 59.94, 119.88 Hz 등 1000/1001 계열 fps는 정수 기준 VIC 타이밍(Htotal/Vtotal)에 매칭하고 실제 fps는 유지한다.
  const nominalFps = Math.round(mode.fps)
  if (nominalFps > 0 && Math.abs(mode.fps * 1.001 - nominalFps) < FRACTIONAL_FPS_TOLERANCE) {
    const base = CEA861_MODES.find(
      (m) => m.hActive === mode.hActive && m.vActive === mode.vActive && m.fps === nominalFps,
    )
    if (base) {
      return { ...base, fps: mode.fps }
    }
  }
  return undefined
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

// 매뉴얼 10.1.3 Table 10.7: 일반적인 Blank Factor 20% (Active + Blank = Active × 1.2)
export function blankFactor20Timing(mode: ActiveMode): Timing {
  return {
    ...mode,
    hTotal: Math.round(mode.hActive * 1.2),
    vTotal: mode.vActive,
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
  if (fallback === 'blankFactor20') {
    return { timing: blankFactor20Timing(mode), source: 'Blank Factor 20% (Active × 1.2)' }
  }
  return {
    timing: wikiCustomTiming(mode),
    source: `위키 Custom (H +${WIKI_CUSTOM_BLANKING.hBlank}px, V +${WIKI_CUSTOM_BLANKING.vBlank}라인)`,
  }
}

export function describeTimingDerivation(timing: Timing, timingSource: string): TimingDerivation {
  const hBlank = timing.hTotal - timing.hActive
  const vBlank = timing.vTotal - timing.vActive
  const pclkHz = pixelClockHz(timing)
  const pclkMHz = pclkHz / 1e6

  let blankingFormula = 'H_total = H_active + H_blank, V_total = V_active + V_blank'
  let blankingSubstitution = `H_total = ${timing.hActive} + ${hBlank} = ${timing.hTotal} px, V_total = ${timing.vActive} + ${vBlank} = ${timing.vTotal} lines`

  if (timingSource.startsWith(CEA861_SOURCE)) {
    blankingFormula = `${timingSource} 표준 테이블 정의값 (H_total = H_active + H_blank, V_total = V_active + V_blank)`
    blankingSubstitution = `H_total = ${timing.hActive} + ${hBlank} = ${timing.hTotal} px, V_total = ${timing.vActive} + ${vBlank} = ${timing.vTotal} lines`
  } else if (timingSource === 'CVT-RB v2') {
    const hPeriodEstUs = (1e6 / timing.fps - RB_MIN_V_BLANK_US) / timing.vActive
    const vbiLines = Math.floor(RB_MIN_V_BLANK_US / hPeriodEstUs) + 1
    blankingFormula =
      'H_total = H_active + 80, V_total = V_active + MAX(FLOOR(460µs / H_period_est) + 1, 15)'
    blankingSubstitution = `H_total = ${timing.hActive} + 80 = ${timing.hTotal} px, H_period_est = ${hPeriodEstUs.toFixed(3)} µs → VBI = MAX(${vbiLines}, 15) = ${vBlank} lines → V_total = ${timing.vActive} + ${vBlank} = ${timing.vTotal} lines`
  } else if (timingSource.startsWith('Blank Factor')) {
    blankingFormula = 'H_total = ROUND(H_active × 1.2), V_total = V_active (Blank Factor 20%)'
    blankingSubstitution = `H_total = ROUND(${timing.hActive} × 1.2) = ${timing.hTotal} px, V_total = ${timing.vTotal} lines`
  } else if (timingSource.startsWith('위키 Custom')) {
    blankingFormula = `H_total = H_active + ${WIKI_CUSTOM_BLANKING.hBlank}, V_total = V_active + ${WIKI_CUSTOM_BLANKING.vBlank}`
    blankingSubstitution = `H_total = ${timing.hActive} + ${WIKI_CUSTOM_BLANKING.hBlank} = ${timing.hTotal} px, V_total = ${timing.vActive} + ${WIKI_CUSTOM_BLANKING.vBlank} = ${timing.vTotal} lines`
  }

  return {
    blankingFormula,
    blankingSubstitution,
    clockFormula: 'Pixel_Clock (Hz) = H_total × V_total × Frame_Rate',
    clockSubstitution: `${timing.hTotal} × ${timing.vTotal} × ${timing.fps} Hz = ${Math.round(pclkHz).toLocaleString('en-US')} Hz (${pclkMHz.toFixed(3)} MHz)`,
  }
}
