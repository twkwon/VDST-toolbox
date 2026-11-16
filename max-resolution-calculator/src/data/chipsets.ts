import type { Chipset, OutputSpec, ResolutionCap, ViocLimits } from '../core/spec'

export const SPEC_SOURCE = '최대 출력 해상도 Calculator 위키 v22 · 출력 인터페이스 매뉴얼 10.1 · DP 대역폭 DB v5'

const FHD_60_LIMIT: ResolutionCap = { maxWidth: 1920, maxHeight: 1080, maxFps: 60 }

const DP_HBR3_X4: OutputSpec = { kind: 'dp', maxLinkRate: 'HBR3', maxLanes: 4, mst: true }
const DSI_4_LANE: OutputSpec = {
  kind: 'dsi',
  lanes: 4,
  laneMbps: 2500,
  maxWidth: 4096,
  serdesMaxBps: 4.8e9,
}
const LVDS_SINGLE: OutputSpec = { kind: 'lvds', lanes: 4, laneMbps: 1120 }
const LVDS_DUAL: OutputSpec = { kind: 'lvds', lanes: 8, laneMbps: 1120, maxHalfWidth: 4095 }
const LVDS_SINGLE_FHD_CAP: OutputSpec = {
  kind: 'lvds',
  lanes: 4,
  laneMbps: 1120,
  resolutionCap: FHD_60_LIMIT,
}
const LVDS_DUAL_FHD_CAP: OutputSpec = {
  kind: 'lvds',
  lanes: 8,
  laneMbps: 1120,
  maxHalfWidth: 4095,
  resolutionCap: FHD_60_LIMIT,
}
const HDMI_2_0: OutputSpec = {
  kind: 'hdmi',
  maxPixelClockHz: 600e6,
  maxTmdsBps: 18e9,
}

export const CHIPSETS: Chipset[] = [
  {
    id: 'd-plus',
    name: 'D+ (TCC803x)',
    outputs: { lvdsSingle: LVDS_SINGLE, lvdsDual: LVDS_DUAL, hdmi: HDMI_2_0 },
  },
  {
    id: 'd-plus-lite',
    name: 'D+ Lite',
    outputs: { lvdsSingle: LVDS_SINGLE_FHD_CAP, lvdsDual: LVDS_DUAL_FHD_CAP },
  },
  {
    id: 'd3',
    name: 'D3 (TCC805x)',
    outputs: { dp: DP_HBR3_X4, lvdsSingle: LVDS_SINGLE, lvdsDual: LVDS_DUAL },
  },
  {
    id: 'd3-lite',
    name: 'D3 Lite',
    outputs: { dsi: DSI_4_LANE, lvdsSingle: LVDS_SINGLE, lvdsDual: LVDS_DUAL },
  },
  { id: 'd5', name: 'D5 (TCC807x)', outputs: { dp: DP_HBR3_X4, dsi: DSI_4_LANE } },
  { id: 'd7', name: 'D7 (TCC809x)', outputs: { dp: DP_HBR3_X4, dsi: DSI_4_LANE } },
  { id: 'd9', name: 'D9 (TCC811x)', outputs: { dp: DP_HBR3_X4, dsi: DSI_4_LANE } },
]

// Scaler 출력 Width는 위키 표의 2048(2K) / 4088(4K) 두 모드를 모두 지원하며 기본값은 4088(4K)이다.
export const VIOC: ViocLimits = {
  disp: { maxWidth: 8190, maxHeight: 8190, maxPixels: 4096 * 2160 },
  scaler: { maxWidth: 4088, maxWidth2k: 2048, maxWidth4k: 4088, maxHeight: 8190 },
}
