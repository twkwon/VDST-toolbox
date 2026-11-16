import type { HdmiColorFormat } from '../core/constraints/hdmi'
import type { DpMode, OutputId, ScalerMode } from '../core/spec'
import type { FallbackTimingMethod } from '../core/timing'

export const OUTPUT_LABELS: Record<OutputId, string> = {
  dp: 'DisplayPort 1.4 (SST / MST)',
  dsi: 'MIPI DSI-2 (D-PHY v2.0)',
  lvdsSingle: 'OpenLDI Single LVDS (4-Lane)',
  lvdsDual: 'OpenLDI Dual LVDS (8-Lane)',
  hdmi: 'HDMI 2.0 (TMDS)',
}

export const FALLBACK_LABELS: Record<FallbackTimingMethod, string> = {
  wikiCustom: 'Custom Reduced Blanking (H +80px, V +6lines)',
  cvtRbV2: 'VESA CVT-RB v2 (Reduced Blanking v2)',
  blankFactor20: 'Blanking Factor 20% (Active × 1.2, TRM 10.1.3)',
}

export const SCALER_LABELS: Record<ScalerMode, string> = {
  off: 'Bypass (VIOC Scaler 미사용 · DISP 직결)',
  '4k': '4K Line Buffer Mode (출력 Width ≤ 4088 px)',
  '2k': '2K Line Buffer Mode (출력 Width ≤ 2048 px)',
}

export const DP_MODE_LABELS: Record<DpMode, string> = {
  sst: 'SST (Single-Stream Transport)',
  mst: 'MST (Multi-Stream Transport · PBN / Time Slot)',
}

export const HDMI_FORMAT_LABELS: Record<HdmiColorFormat, string> = {
  rgb_yuv444_8bpc: 'RGB / YCbCr 4:4:4 (8-bpc, 24 bpp · TMDS 30 bits/px)',
  yuv422_8bpc: 'YCbCr 4:2:2 (8-bpc · TMDS 30 bits/px)',
  yuv420_8bpc: 'YCbCr 4:2:0 (8-bpc, 1/2 Pixel Clock · TMDS 15 bits/px)',
}
