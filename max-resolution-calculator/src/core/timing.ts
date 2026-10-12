export type Timing = {
  hActive: number
  vActive: number
  hTotal: number
  vTotal: number
  fps: number
}

export function pixelClockHz(timing: Timing): number {
  return timing.hTotal * timing.vTotal * timing.fps
}
