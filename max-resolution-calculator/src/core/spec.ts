export type OutputId = 'dp' | 'dsi' | 'lvdsSingle' | 'lvdsDual' | 'hdmi'

export const DP_LINK_RATES = ['RBR', 'HBR', 'HBR2', 'HBR3'] as const
export type DpLinkRate = (typeof DP_LINK_RATES)[number]

export const DP_LINK_RATE_MBPS: Record<DpLinkRate, number> = {
  RBR: 1620,
  HBR: 2700,
  HBR2: 5400,
  HBR3: 8100,
}

export const DP_LANE_COUNTS = [1, 2, 4] as const
export type DpLaneCount = (typeof DP_LANE_COUNTS)[number]

export type DpMode = 'sst' | 'mst'

// Table 2: VC Payload Bandwidth when one time slot per every MTP is allocated (PBN)
export const DP_MST_PBN_PER_SLOT: Record<DpLinkRate, Record<DpLaneCount, number>> = {
  RBR: { 1: 3, 2: 6, 4: 12 },
  HBR: { 1: 5, 2: 10, 4: 20 },
  HBR2: { 1: 10, 2: 20, 4: 40 },
  HBR3: { 1: 15, 2: 30, 4: 60 },
}

export const DSI_LANE_COUNTS = [1, 2, 3, 4] as const
export type DsiLaneCount = (typeof DSI_LANE_COUNTS)[number]

export type ScalerMode = 'off' | '4k' | '2k'
export type ScalerInput = boolean | ScalerMode

export type ResolutionCap = { maxWidth: number; maxHeight: number; maxFps: number }

export type OutputSpec =
  | { kind: 'dp'; maxLinkRate: DpLinkRate; maxLanes: DpLaneCount; mst?: boolean }
  | { kind: 'dsi'; lanes: DsiLaneCount; laneMbps: number; maxWidth: number; serdesMaxBps?: number }
  | { kind: 'lvds'; lanes: number; laneMbps: number; maxHalfWidth?: number; resolutionCap?: ResolutionCap }
  | { kind: 'hdmi'; maxPixelClockHz: number; maxTmdsBps: number }

export type Chipset = {
  id: string
  name: string
  outputs: Partial<Record<OutputId, OutputSpec>>
}

export type ViocLimits = {
  disp: { maxWidth: number; maxHeight: number; maxPixels: number }
  scaler: { maxWidth: number; maxWidth2k: number; maxWidth4k: number; maxHeight: number }
}
