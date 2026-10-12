import { CANDIDATE_RESOLUTIONS, type Resolution } from '../data/candidates'
import { tightestConstraint, type ConstraintResult } from './constraints/result'
import { resolveTiming, type FallbackTimingMethod, type Timing } from './timing'
import { verify, type VerifyInput } from './verify'

export type ExploreInput = Omit<VerifyInput, 'timing'> & {
  fps: number
  fallback: FallbackTimingMethod
}

export type ExploreRow = {
  resolution: Resolution
  timing: Timing
  timingSource: string
  pass: boolean
  constraints: ConstraintResult[]
  tightest: ConstraintResult
}

export type ExploreResult = { supported: false } | { supported: true; rows: ExploreRow[] }

export function explore(input: ExploreInput, candidates: Resolution[] = CANDIDATE_RESOLUTIONS): ExploreResult {
  const { fps, fallback, ...target } = input
  const rows: ExploreRow[] = []
  for (const resolution of candidates) {
    const { timing, source } = resolveTiming({ hActive: resolution.width, vActive: resolution.height, fps }, fallback)
    const result = verify({ ...target, timing })
    if (!result.supported) {
      return { supported: false }
    }
    rows.push({
      resolution,
      timing,
      timingSource: source,
      pass: result.pass,
      constraints: result.constraints,
      tightest: tightestConstraint(result.constraints),
    })
  }
  rows.sort(
    (a, b) =>
      b.resolution.width * b.resolution.height - a.resolution.width * a.resolution.height ||
      b.resolution.width - a.resolution.width,
  )
  return { supported: true, rows }
}
