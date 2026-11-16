import { CHIPSETS, VIOC } from '../data/chipsets'
import { dpMstConstraints } from './constraints/dpMst'
import { dpSstConstraints, type DpSstOptions } from './constraints/dpSst'
import { dsiConstraints, type DsiOptions } from './constraints/dsi'
import { hdmiConstraints, type HdmiOptions } from './constraints/hdmi'
import { lvdsConstraints } from './constraints/lvds'
import type { ConstraintResult } from './constraints/result'
import { dispConstraints, normalizeScalerMode, scalerConstraints } from './constraints/vioc'
import type { OutputId, OutputSpec, ScalerInput } from './spec'
import type { Timing } from './timing'

export type VerifyInput = {
  chipsetId: string
  output: OutputId
  timing: Timing
  scaler: ScalerInput
  dp?: DpSstOptions
  dsi?: DsiOptions
  hdmi?: HdmiOptions
}

export type VerifyResult =
  | { supported: false }
  | { supported: true; pass: boolean; constraints: ConstraintResult[] }

export function verify(input: VerifyInput): VerifyResult {
  const chipset = CHIPSETS.find((c) => c.id === input.chipsetId)
  if (!chipset) {
    throw new Error(`Unknown chipset: ${input.chipsetId}`)
  }
  const spec = chipset.outputs[input.output]
  if (!spec) {
    return { supported: false }
  }

  const scalerMode = normalizeScalerMode(input.scaler)
  const constraints = [
    ...dispConstraints(input.timing, VIOC.disp),
    ...(scalerMode !== 'off' ? scalerConstraints(input.timing, VIOC.scaler, scalerMode) : []),
    ...outputConstraints(spec, input),
  ]
  return { supported: true, pass: constraints.every((c) => c.pass), constraints }
}

function outputConstraints(spec: OutputSpec, input: VerifyInput): ConstraintResult[] {
  switch (spec.kind) {
    case 'dp':
      if (!input.dp) {
        throw new Error('DP output requires link options')
      }
      if (input.dp.mode === 'mst') {
        return dpMstConstraints(input.timing, spec, input.dp)
      }
      return dpSstConstraints(input.timing, spec, input.dp)
    case 'dsi':
      return dsiConstraints(input.timing, spec, input.dsi)
    case 'lvds':
      return lvdsConstraints(input.timing, spec)
    case 'hdmi':
      return hdmiConstraints(input.timing, spec, input.hdmi)
  }
}
