export type Cea861Mode = {
  vic: number
  hActive: number
  vActive: number
  hTotal: number
  vTotal: number
  fps: number
}

export const CEA861_SOURCE = 'CTA-861'

export const CEA861_MODES: Cea861Mode[] = [
  { vic: 1, hActive: 640, vActive: 480, hTotal: 800, vTotal: 525, fps: 60 },
  { vic: 2, hActive: 720, vActive: 480, hTotal: 858, vTotal: 525, fps: 60 },
  { vic: 17, hActive: 720, vActive: 576, hTotal: 864, vTotal: 625, fps: 50 },
  { vic: 60, hActive: 1280, vActive: 720, hTotal: 3300, vTotal: 750, fps: 24 },
  { vic: 61, hActive: 1280, vActive: 720, hTotal: 3960, vTotal: 750, fps: 25 },
  { vic: 62, hActive: 1280, vActive: 720, hTotal: 3300, vTotal: 750, fps: 30 },
  { vic: 19, hActive: 1280, vActive: 720, hTotal: 1980, vTotal: 750, fps: 50 },
  { vic: 4, hActive: 1280, vActive: 720, hTotal: 1650, vTotal: 750, fps: 60 },
  { vic: 41, hActive: 1280, vActive: 720, hTotal: 1980, vTotal: 750, fps: 100 },
  { vic: 47, hActive: 1280, vActive: 720, hTotal: 1650, vTotal: 750, fps: 120 },
  { vic: 32, hActive: 1920, vActive: 1080, hTotal: 2750, vTotal: 1125, fps: 24 },
  { vic: 33, hActive: 1920, vActive: 1080, hTotal: 2640, vTotal: 1125, fps: 25 },
  { vic: 34, hActive: 1920, vActive: 1080, hTotal: 2200, vTotal: 1125, fps: 30 },
  { vic: 31, hActive: 1920, vActive: 1080, hTotal: 2640, vTotal: 1125, fps: 50 },
  { vic: 16, hActive: 1920, vActive: 1080, hTotal: 2200, vTotal: 1125, fps: 60 },
  { vic: 64, hActive: 1920, vActive: 1080, hTotal: 2640, vTotal: 1125, fps: 100 },
  { vic: 63, hActive: 1920, vActive: 1080, hTotal: 2200, vTotal: 1125, fps: 120 },
  { vic: 89, hActive: 2560, vActive: 1080, hTotal: 3300, vTotal: 1125, fps: 50 },
  { vic: 90, hActive: 2560, vActive: 1080, hTotal: 3000, vTotal: 1100, fps: 60 },
  { vic: 93, hActive: 3840, vActive: 2160, hTotal: 5500, vTotal: 2250, fps: 24 },
  { vic: 94, hActive: 3840, vActive: 2160, hTotal: 5280, vTotal: 2250, fps: 25 },
  { vic: 95, hActive: 3840, vActive: 2160, hTotal: 4400, vTotal: 2250, fps: 30 },
  { vic: 96, hActive: 3840, vActive: 2160, hTotal: 5280, vTotal: 2250, fps: 50 },
  { vic: 97, hActive: 3840, vActive: 2160, hTotal: 4400, vTotal: 2250, fps: 60 },
  { vic: 117, hActive: 3840, vActive: 2160, hTotal: 5280, vTotal: 2250, fps: 100 },
  { vic: 118, hActive: 3840, vActive: 2160, hTotal: 4400, vTotal: 2250, fps: 120 },
  { vic: 98, hActive: 4096, vActive: 2160, hTotal: 5500, vTotal: 2250, fps: 24 },
  { vic: 99, hActive: 4096, vActive: 2160, hTotal: 5280, vTotal: 2250, fps: 25 },
  { vic: 100, hActive: 4096, vActive: 2160, hTotal: 4400, vTotal: 2250, fps: 30 },
  { vic: 101, hActive: 4096, vActive: 2160, hTotal: 5280, vTotal: 2250, fps: 50 },
  { vic: 102, hActive: 4096, vActive: 2160, hTotal: 4400, vTotal: 2250, fps: 60 },
  { vic: 218, hActive: 4096, vActive: 2160, hTotal: 5280, vTotal: 2250, fps: 100 },
  { vic: 219, hActive: 4096, vActive: 2160, hTotal: 4400, vTotal: 2250, fps: 120 },
]

// 위키 Custom 링크(tomverbeure video timings calculator)의 custom_hblank=80, custom_vblank=6 값. 단위는 픽셀과 라인.
export const WIKI_CUSTOM_BLANKING = { hBlank: 80, vBlank: 6 }
