export type OutputId = 'dp' | 'dsi' | 'lvdsSingle' | 'lvdsDual'

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

export type OutputSpec =
  | { kind: 'dp'; maxLinkRate: DpLinkRate; maxLanes: DpLaneCount }
  | { kind: 'dsi'; lanes: number; laneMbps: number; maxWidth: number }
  | { kind: 'lvds'; lanes: number; laneMbps: number }
  | { kind: 'resolutionCap'; maxWidth: number; maxHeight: number; maxFps: number }

export type Chipset = {
  id: string
  name: string
  outputs: Partial<Record<OutputId, OutputSpec>>
}

export type ViocLimits = {
  disp: { maxWidth: number; maxHeight: number; maxPixels: number }
  scaler: { maxWidth: number; maxHeight: number }
}
