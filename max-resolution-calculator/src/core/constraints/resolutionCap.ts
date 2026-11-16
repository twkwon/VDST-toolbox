import { SPEC_SOURCE } from '../../data/chipsets'
import type { Timing } from '../timing'
import { atMost, type ConstraintResult } from './result'

type ResolutionCapSpec = { maxWidth: number; maxHeight: number; maxFps: number }

export function resolutionCapConstraints(timing: Timing, spec: ResolutionCapSpec): ConstraintResult[] {
  return [
    atMost('칩셋 해상도 제약 Width', timing.hActive, spec.maxWidth, 'px', SPEC_SOURCE, {
      expression: 'H_active ≤ Chipset_Max_Width (FHD 설계 상한)',
      actualSubstitution: `H_active = ${timing.hActive} px`,
      limitSubstitution: `Chipset_Max_Width = ${spec.maxWidth} px`,
    }),
    atMost('칩셋 해상도 제약 Height', timing.vActive, spec.maxHeight, 'px', SPEC_SOURCE, {
      expression: 'V_active ≤ Chipset_Max_Height (FHD 설계 상한)',
      actualSubstitution: `V_active = ${timing.vActive} px`,
      limitSubstitution: `Chipset_Max_Height = ${spec.maxHeight} px`,
    }),
    atMost('칩셋 해상도 제약 fps', timing.fps, spec.maxFps, 'fps', SPEC_SOURCE, {
      expression: 'Frame_Rate ≤ Chipset_Max_FPS',
      actualSubstitution: `Frame_Rate = ${timing.fps} fps`,
      limitSubstitution: `Chipset_Max_FPS = ${spec.maxFps} fps`,
    }),
  ]
}
