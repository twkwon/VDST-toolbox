import type { DpSstOptions } from '../core/constraints/dpSst'
import type { OutputId } from '../core/spec'
import { DEFAULT_FALLBACK_TIMING, type FallbackTimingMethod } from '../core/timing'
import { CHIPSETS } from '../data/chipsets'

export type Settings = {
  chipsetId: string
  output: OutputId
  fallback: FallbackTimingMethod
  scaler: boolean
  dp: DpSstOptions
}

export function outputsOf(chipsetId: string): OutputId[] {
  const chipset = CHIPSETS.find((c) => c.id === chipsetId)
  return chipset ? (Object.keys(chipset.outputs) as OutputId[]) : []
}

export const INITIAL_SETTINGS: Settings = {
  chipsetId: CHIPSETS[0].id,
  output: outputsOf(CHIPSETS[0].id)[0],
  fallback: DEFAULT_FALLBACK_TIMING,
  scaler: false,
  dp: { linkRate: 'HBR3', lanes: 4, fec: false, ssc: false },
}

export function withChipset(settings: Settings, chipsetId: string): Settings {
  const outputs = outputsOf(chipsetId)
  return { ...settings, chipsetId, output: outputs.includes(settings.output) ? settings.output : outputs[0] }
}

export function dpOptionsFor(settings: Settings): DpSstOptions | undefined {
  return settings.output === 'dp' ? settings.dp : undefined
}
