import { CEA861_MODES } from './timings'

export type Resolution = { width: number; height: number }

// 탐색 후보에 추가할 일반 패널 해상도. 담당자 확인 전 잠정 목록.
const PANEL_RESOLUTIONS: Resolution[] = [
  { width: 800, height: 480 },
  { width: 1024, height: 600 },
  { width: 1280, height: 480 },
  { width: 1280, height: 800 },
  { width: 1366, height: 768 },
  { width: 1440, height: 540 },
  { width: 1600, height: 900 },
  { width: 1920, height: 720 },
  { width: 1920, height: 1200 },
  { width: 2560, height: 720 },
  { width: 2560, height: 1440 },
  { width: 2880, height: 1080 },
  { width: 3840, height: 1080 },
  { width: 3840, height: 1440 },
  { width: 5120, height: 1440 },
  { width: 5120, height: 2160 },
  { width: 7680, height: 1080 },
]

function uniqueResolutions(list: Resolution[]): Resolution[] {
  const seen = new Set<string>()
  return list.filter(({ width, height }) => {
    const key = `${width}x${height}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export const CANDIDATE_RESOLUTIONS: Resolution[] = uniqueResolutions([
  ...CEA861_MODES.map((m) => ({ width: m.hActive, height: m.vActive })),
  ...PANEL_RESOLUTIONS,
])
