import type { Chipset, OutputSpec, ViocLimits } from '../core/spec'

export const SPEC_SOURCE = '최대 출력 해상도 Calculator 위키 v22'

const DP_HBR3_X4: OutputSpec = { kind: 'dp', maxLinkRate: 'HBR3', maxLanes: 4 }
const DSI_4_LANE: OutputSpec = { kind: 'dsi', lanes: 4, laneMbps: 2500, maxWidth: 4096 }
const LVDS_SINGLE: OutputSpec = { kind: 'lvds', lanes: 4, laneMbps: 1120 }
const LVDS_DUAL: OutputSpec = { kind: 'lvds', lanes: 8, laneMbps: 1120 }
const FHD_60_CAP: OutputSpec = { kind: 'resolutionCap', maxWidth: 1920, maxHeight: 1080, maxFps: 60 }

export const CHIPSETS: Chipset[] = [
  { id: 'd-plus', name: 'D+', outputs: { lvdsSingle: LVDS_SINGLE, lvdsDual: LVDS_DUAL } },
  { id: 'd-plus-lite', name: 'D+ Lite', outputs: { lvdsSingle: FHD_60_CAP, lvdsDual: FHD_60_CAP } },
  { id: 'd3', name: 'D3', outputs: { dp: DP_HBR3_X4, lvdsSingle: LVDS_SINGLE, lvdsDual: LVDS_DUAL } },
  { id: 'd3-lite', name: 'D3 Lite', outputs: { dsi: DSI_4_LANE, lvdsSingle: LVDS_SINGLE, lvdsDual: LVDS_DUAL } },
  { id: 'd5', name: 'D5', outputs: { dp: DP_HBR3_X4, dsi: DSI_4_LANE } },
  { id: 'd7-d9', name: 'D7 / D9', outputs: { dp: DP_HBR3_X4, dsi: DSI_4_LANE } },
]

// Scaler 출력 Width 4088은 위키의 2K/4K 구분 조건이 정해지기 전까지의 4K 가정값이다.
export const VIOC: ViocLimits = {
  disp: { maxWidth: 8190, maxHeight: 8190, maxPixels: 4096 * 2160 },
  scaler: { maxWidth: 4088, maxHeight: 8190 },
}
