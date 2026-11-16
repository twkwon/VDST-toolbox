import { SPEC_SOURCE } from '../../data/chipsets'
import type { ScalerInput, ScalerMode, ViocLimits } from '../spec'
import type { Timing } from '../timing'
import { atMost, type ConstraintResult } from './result'

export function normalizeScalerMode(scaler: ScalerInput | undefined): ScalerMode {
  if (!scaler || scaler === 'off') return 'off'
  if (scaler === '2k') return '2k'
  return '4k'
}

export function dispConstraints(timing: Timing, limits: ViocLimits['disp']): ConstraintResult[] {
  const totalPixels = timing.hActive * timing.vActive
  return [
    atMost('DISP 출력 Width', timing.hActive, limits.maxWidth, 'px', SPEC_SOURCE, {
      expression: 'H_active ≤ DISP_Max_Width',
      actualSubstitution: `H_active = ${timing.hActive} px`,
      limitSubstitution: `DISP_Max_Width = ${limits.maxWidth} px`,
    }),
    atMost('DISP 출력 Height', timing.vActive, limits.maxHeight, 'px', SPEC_SOURCE, {
      expression: 'V_active ≤ DISP_Max_Height',
      actualSubstitution: `V_active = ${timing.vActive} px`,
      limitSubstitution: `DISP_Max_Height = ${limits.maxHeight} px`,
    }),
    atMost('DISP 픽셀 총량', totalPixels, limits.maxPixels, 'pixels', SPEC_SOURCE, {
      expression: 'H_active × V_active ≤ 4096 × 2160 (4K 픽셀 상한)',
      actualSubstitution: `${timing.hActive} × ${timing.vActive} = ${totalPixels.toLocaleString('en-US')} 픽셀`,
      limitSubstitution: `4096 × 2160 = ${limits.maxPixels.toLocaleString('en-US')} 픽셀`,
    }),
  ]
}

export function scalerConstraints(
  timing: Timing,
  limits: ViocLimits['scaler'],
  mode: '4k' | '2k' = '4k',
): ConstraintResult[] {
  const maxWidth = mode === '2k' ? limits.maxWidth2k : limits.maxWidth4k
  const modeLabel = mode === '2k' ? '2K 모드' : '4K 모드'
  return [
    atMost('Scaler 출력 Width', timing.hActive, maxWidth, 'px', SPEC_SOURCE, {
      expression: `H_active ≤ Scaler_Max_Width (${modeLabel})`,
      actualSubstitution: `H_active = ${timing.hActive} px`,
      limitSubstitution: `Scaler_Max_Width (${modeLabel}) = ${maxWidth} px`,
    }),
    atMost('Scaler 출력 Height', timing.vActive, limits.maxHeight, 'px', SPEC_SOURCE, {
      expression: 'V_active ≤ Scaler_Max_Height',
      actualSubstitution: `V_active = ${timing.vActive} px`,
      limitSubstitution: `Scaler_Max_Height = ${limits.maxHeight} px`,
    }),
  ]
}
