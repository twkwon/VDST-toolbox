import type { OutputId } from '../core/spec'
import type { FallbackTimingMethod } from '../core/timing'

export const OUTPUT_LABELS: Record<OutputId, string> = {
  dp: 'DP (SST)',
  dsi: 'MIPI DSI',
  lvdsSingle: 'Single LVDS',
  lvdsDual: 'Dual LVDS',
}

export const FALLBACK_LABELS: Record<FallbackTimingMethod, string> = {
  wikiCustom: '위키 Custom (H +80px, V +6라인)',
  cvtRbV2: 'CVT-RB v2',
}
