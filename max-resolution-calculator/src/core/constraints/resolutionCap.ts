import type { Timing } from '../timing'
import { atMost, type ConstraintResult } from './result'

type ResolutionCapSpec = { maxWidth: number; maxHeight: number; maxFps: number }

export function resolutionCapConstraints(timing: Timing, spec: ResolutionCapSpec): ConstraintResult[] {
  return [
    atMost('칩셋 해상도 제약 Width', timing.hActive, spec.maxWidth, 'px'),
    atMost('칩셋 해상도 제약 Height', timing.vActive, spec.maxHeight, 'px'),
    atMost('칩셋 해상도 제약 fps', timing.fps, spec.maxFps, 'fps'),
  ]
}
