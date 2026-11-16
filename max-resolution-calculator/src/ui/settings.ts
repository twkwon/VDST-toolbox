import { DEFAULT_DSC_BPP, type DpSstOptions } from '../core/constraints/dpSst'
import type { DsiOptions } from '../core/constraints/dsi'
import type { HdmiOptions } from '../core/constraints/hdmi'
import type { OutputId, ScalerMode } from '../core/spec'
import { DEFAULT_FALLBACK_TIMING, type FallbackTimingMethod } from '../core/timing'
import { CHIPSETS } from '../data/chipsets'

export type Settings = {
  chipsetId: string
  output: OutputId
  fallback: FallbackTimingMethod
  scaler: ScalerMode
  dp: DpSstOptions
  dsi: Required<DsiOptions>
  hdmi: Required<HdmiOptions>
}

export function outputsOf(chipsetId: string): OutputId[] {
  const chipset = CHIPSETS.find((c) => c.id === chipsetId)
  return chipset ? (Object.keys(chipset.outputs) as OutputId[]) : []
}

export const INITIAL_SETTINGS: Settings = {
  chipsetId: CHIPSETS[0].id,
  output: outputsOf(CHIPSETS[0].id)[0],
  fallback: DEFAULT_FALLBACK_TIMING,
  scaler: 'off',
  dp: {
    mode: 'sst',
    linkRate: 'HBR3',
    lanes: 4,
    fec: false,
    ssc: false,
    dsc: false,
    bppCompressed: DEFAULT_DSC_BPP,
  },
  dsi: {
    lanes: 4,
    serdesCap: false,
  },
  hdmi: {
    format: 'rgb_yuv444_8bpc',
  },
}

export function withChipset(settings: Settings, chipsetId: string): Settings {
  const outputs = outputsOf(chipsetId)
  return { ...settings, chipsetId, output: outputs.includes(settings.output) ? settings.output : outputs[0] }
}

export function dpOptionsFor(settings: Settings): DpSstOptions | undefined {
  return settings.output === 'dp' ? settings.dp : undefined
}

export function dsiOptionsFor(settings: Settings): DsiOptions | undefined {
  return settings.output === 'dsi' ? settings.dsi : undefined
}

export function hdmiOptionsFor(settings: Settings): HdmiOptions | undefined {
  return settings.output === 'hdmi' ? settings.hdmi : undefined
}
