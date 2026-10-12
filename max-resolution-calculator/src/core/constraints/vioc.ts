import type { ViocLimits } from '../spec'
import type { Timing } from '../timing'
import { atMost, type ConstraintResult } from './result'

export function dispConstraints(timing: Timing, limits: ViocLimits['disp']): ConstraintResult[] {
  return [
    atMost('DISP 출력 Width', timing.hActive, limits.maxWidth, 'px'),
    atMost('DISP 출력 Height', timing.vActive, limits.maxHeight, 'px'),
    atMost('DISP 픽셀 총량', timing.hActive * timing.vActive, limits.maxPixels, 'pixels'),
  ]
}

export function scalerConstraints(timing: Timing, limits: ViocLimits['scaler']): ConstraintResult[] {
  return [
    atMost('Scaler 출력 Width', timing.hActive, limits.maxWidth, 'px'),
    atMost('Scaler 출력 Height', timing.vActive, limits.maxHeight, 'px'),
  ]
}
