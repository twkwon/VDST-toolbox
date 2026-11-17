# VDST Toolbox

Telechips 차량용 SoC 디스플레이 서브시스템(VIOC) 및 비디오 출력 인터페이스 검증·분석을 위한 엔지니어링 도구 모음 저장소입니다.

- **배포 사이트 (GitHub Pages):** [https://twkwon.github.io/VDST-toolbox/](https://twkwon.github.io/VDST-toolbox/)
- **GitHub 저장소:** [https://github.com/twkwon/VDST-toolbox](https://github.com/twkwon/VDST-toolbox)

---

## 수록 도구

| 도구 | 경로 | 사이트 / 문서 | 설명 |
| --- | --- | --- | --- |
| **VIOC Display Output & Bandwidth Analyzer**<br>*(최대 출력 해상도 Calculator)* | [`max-resolution-calculator/`](./max-resolution-calculator/) | [웹 실행](https://twkwon.github.io/VDST-toolbox/) · [상세 문서](./max-resolution-calculator/README.md) | 차량용 SoC별 VIOC 및 출력 인터페이스(DP 1.4 SST/MST, MIPI DSI-2, LVDS, HDMI 2.0)의 해상도·타이밍·링크 대역폭 검증 및 다중 스트림 시뮬레이터 |

---

## 참고 사이트 및 기준 스펙 (References)

### 1. 배포 및 외부 참고 사이트
| 구분 | 사이트 | 용도 및 설명 |
| --- | --- | --- |
| **배포 웹앱** | [VDST Toolbox (GitHub Pages)](https://twkwon.github.io/VDST-toolbox/) | 최신 `main` 브랜치 기준 자동 배포되는 웹 계산기 |
| **외부 타이밍 계산기** | [Video Timings Calculator (Tom Verbeure)](https://tomverbeure.github.io/video_timings_calculator) | CTA-861(CEA-861), VESA CVT-RB v2 및 위키 Custom Blanking(`custom_hblank=80&custom_vblank=6`) 타이밍 대조·검증 참고 사이트 |

### 2. 사내 기준 스펙 문서 (Telechips Confluence — 사내 계정 권한 필요)
| 구분 | 문서명 및 링크 | 버전 / 비고 |
| --- | --- | --- |
| **스펙 문서 1** | [최대 출력 해상도 Calculator](https://telechips.atlassian.net/wiki/spaces/SA23/pages/445939803/Calculator) | Confluence Wiki **v22** (VIOC 크기 상한, 인터페이스별 수식, DP SST/MST Table 1~4) |
| **스펙 문서 2** | [10.1 출력 인터페이스별 최대 지원 해상도](https://telechips.atlassian.net/wiki/spaces/SA23/pages/426641490/10.1) | **TRM 10.1** (DP TU 64 심볼 및 4ch MST 예시, DSI EVB SerDes 4.8Gbps, Dual LVDS Splitter 4095, HDMI 2.0) |
| **스펙 문서 3** | [DisplayPort 출력조건별 대역폭](https://telechips.atlassian.net/wiki/spaces/SA23/database/452788685) | Confluence Database **v5** (DP SST/MST 조건별 최대 유효 대역폭·필요 대역폭 정의) |

---

## 주요 기능 (`max-resolution-calculator`)

1. **단일 해상도 타이밍 · 대역폭 검증 (`Verify`)**
   - SoC, 출력 인터페이스, 해상도, 주사율, 링크 옵션(레인 수, 링크 레이트, DSC, FEC, SSC, SerDes 등)을 입력하면 제약 항목별 적합성(`PASS` / `FAIL`), 병목 구간, 대역폭 점유율 및 **단계별 수식 대입 풀이**를 제공합니다.
2. **최대 지원 해상도 탐색 (`Explore`)**
   - 선택한 SoC · 출력 인터페이스 · 주사율 조건에서 후보 해상도 전체를 일괄 평가하여 지원 가능한 최대 해상도 순으로 정렬하고, 각 해상도의 상세 수식 풀이를 비교합니다.
3. **DP MST 다중 스트림 시뮬레이터 (`MST`)**
   - 최대 4채널 Virtual Channel 스트림 조합(예: `4K@60 × 1 + FHD@60 × 3`)에 대해 스트림별·합산 PBN, Time Slot(`≤ 63`), TU 심볼 슬롯(`≤ 64`), 유효 링크 대역폭을 시뮬레이션합니다.
4. **다국어 인터페이스 지원 (Multi-Language UI)**
   - 상단 언어 전환기를 통해 **한국어(`KR`)**, **영어(`EN`)**, **일본어(`JP`)**, **중국어 간체(`CH`, 중국 본토 `zh-CN`)**, **프랑스어(`FR`)**, **독일어(`DE`, Deutsch)** 6개 언어를 실시간 전환하며, 선택한 언어는 브라우저(`localStorage`)에 유지됩니다.

### 지원 SoC 및 출력 인터페이스 요약

| SoC | DisplayPort 1.4 | MIPI DSI-2 | Single / Dual LVDS | HDMI 2.0 |
| --- | :---: | :---: | :---: | :---: |
| **D+ (`TCC803x`)** | - | - | O | O |
| **D+ Lite** | - | - | O (FHD 설계 상한) | - |
| **D3 (`TCC805x`)** | O (HBR3 × 4, SST/MST) | - | O | - |
| **D3 Lite** | - | O (D-PHY 2.5Gbps × 4) | O | - |
| **D5 (`TCC807x`)** | O (HBR3 × 4, SST/MST) | O (D-PHY 2.5Gbps × 4) | - | - |
| **D7 (`TCC809x`)** | O (HBR3 × 4, SST/MST) | O (D-PHY 2.5Gbps × 4) | - | - |
| **D9 (`TCC811x`)** | O (HBR3 × 4, SST/MST) | O (D-PHY 2.5Gbps × 4) | - | - |

> 세부 판정 부등식 및 타이밍 산출 기준(CTA-861, CVT-RB v2, Custom RB 등)은 [`max-resolution-calculator/README.md`](./max-resolution-calculator/README.md)를 참고하세요.

---

## 빠른 시작 (Quick Start)

실행을 위해 **Node.js LTS** 환경이 필요합니다.

```powershell
cd max-resolution-calculator
npm install
npm run dev
```

개발 서버가 시작되면 브라우저에서 `http://localhost:5173/`으로 접속합니다.

### 주요 스크립트

| 명령 (`max-resolution-calculator/` 기준) | 설명 |
| --- | --- |
| `npm run dev` | Vite 로컬 개발 서버 실행 |
| `npm test` | 판정 엔진 단위 테스트 실행 (Vitest) |
| `npm run lint` | 정적 분석 및 코드 린트 (oxlint) |
| `npm run build` | TypeScript 타입 검사 및 프로덕션 정적 빌드 (`dist/`) |
| `npm run preview` | 프로덕션 빌드 결과물 로컬 미리보기 |

---

## 저장소 구조

```text
VDST-toolbox/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml          # GitHub Pages 자동 테스트 · 빌드 · 배포 워크플로
├── max-resolution-calculator/        # 최대 출력 해상도 Calculator 웹 애플리케이션
│   ├── src/
│   │   ├── data/                     # SoC 스펙, VIOC 한계, CTA-861 타이밍, 후보 해상도 데이터
│   │   ├── core/                     # 순수 판정 엔진 (단일 검증·탐색·DP MST·수식 생성) 및 단위 테스트
│   │   └── ui/                       # React 기반 엔지니어링 워크벤치 UI
│   ├── README.md                     # 계산기 상세 문서 및 판정 수식 명세
│   ├── package.json
│   └── vite.config.ts
└── .gitignore
```

> **참고 (사내 문서 관리 정책):** 사내 계획서, 스펙 검토서, 용어집 등 내부 문서는 공개 저장소에 커밋하지 않으며, 작업 환경의 `docs/` 디렉터리에서 별도 로컬 저장소로 분리 관리합니다(`.gitignore` 처리됨).

---

## 배포 (Deployment)

- **GitHub Pages (검증용):** `main` 브랜치에 푸시하거나 수동 실행(`workflow_dispatch`) 시 [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml) 워크플로가 자동으로 단위 테스트(`npm test`) 및 프로덕션 빌드(`npm run build`)를 수행한 뒤 배포합니다.
- **사내 서버 (정적 호스팅):** `vite.config.ts`에 상대 경로(`base: './'`)가 설정되어 있어, `npm run build`로 생성된 `max-resolution-calculator/dist/` 디렉터리를 사내 웹 서버의 하위 경로 어디에든 그대로 배치하여 호스팅할 수 있습니다.
