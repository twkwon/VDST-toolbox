import { CHIPSETS, VIOC } from '../data/chipsets'
import { dpSstConstraints, type DpSstOptions } from './constraints/dpSst'
import { dsiConstraints } from './constraints/dsi'
import { lvdsConstraints } from './constraints/lvds'
import { resolutionCapConstraints } from './constraints/resolutionCap'
import type { ConstraintResult } from './constraints/result'
import { dispConstraints, scalerConstraints } from './constraints/vioc'
import type { OutputId, OutputSpec } from './spec'
import type { Timing } from './timing'

export type VerifyInput = {
  chipsetId: string
  output: OutputId
  timing: Timing
  scaler: boolean
  dp?: DpSstOptions
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

  const constraints = [
    ...dispConstraints(input.timing, VIOC.disp),
    ...(input.scaler ? scalerConstraints(input.timing, VIOC.scaler) : []),
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
      return dpSstConstraints(input.timing, spec, input.dp)
    case 'dsi':
      return dsiConstraints(input.timing, spec)
    case 'lvds':
      return lvdsConstraints(input.timing, spec)
    case 'resolutionCap':
      return resolutionCapConstraints(input.timing, spec)
  }
}
