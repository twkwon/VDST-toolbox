# VIOC Display Output & Bandwidth Analyzer (최대 출력 해상도 Calculator)

Telechips 차량용 SoC(`D+ TCC803x`, `D+ Lite`, `D3 TCC805x`, `D3 Lite`, `D5 TCC807x`, `D7 TCC809x`, `D9 TCC811x`)의 디스플레이 서브시스템(VIOC) 및 출력 인터페이스(DisplayPort 1.4 SST/MST, MIPI DSI-2, OpenLDI LVDS, HDMI 2.0)에서 해상도·타이밍별 출력 가능 여부, 최대 지원 해상도, 다중 스트림 토폴로지 및 산출 수식 풀이를 검증하는 엔지니어링 도구입니다.

- **단일 해상도 타이밍·대역폭 검증:** SoC, 출력 인터페이스, 해상도, 주사율, 링크 옵션을 입력하면 항목별 적합성(PASS/FAIL), 병목 구간, 점유율 게이지 및 **단계별 수식 대입 풀이**를 제공합니다.
- **최대 지원 해상도 탐색:** 선택한 SoC·인터페이스·주사율 조건에서 후보 해상도 전체를 평가하여 지원 가능한 최대 해상도 순으로 정렬하고, 선택한 행의 상세 수식 풀이를 보여줍니다.
- **DP MST 다중 스트림 시뮬레이터:** 최대 4채널 Virtual Channel 스트림 조합(예: `4K@60 × 1 + FHD@60 × 3`)에 대해 스트림별·합산 PBN, Time Slot(`≤ 63`), TU 심볼 슬롯(`≤ 64`), 유효 대역폭을 시뮬레이션합니다.

## 실행

Node.js LTS가 필요합니다.

```powershell
cd max-resolution-calculator
npm install
npm run dev
```

터미널에 표시되는 `http://localhost:5173/`을 브라우저로 엽니다. 종료는 `Ctrl + C`입니다.

| 명령 | 용도 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm test` | 판정 규칙 단위 테스트 (Vitest) |
| `npm run lint` | 정적 분석 및 린트 (oxlint) |
| `npm run build` | 타입 검사 + 배포용 빌드 (`dist/`) |

## 배포

검증 기간에는 GitHub Pages로 배포하고, 완료 후 사내 서버로 이전합니다.

- **GitHub Pages:** `main`에 push하면 `.github/workflows/deploy-pages.yml`이 테스트 → 빌드 → 배포를 자동으로 실행합니다.
- **사내 서버:** `npm run build`로 생성된 `dist/` 폴더를 정적 파일로 호스팅합니다(상대 경로 빌드).

## SoC별 지원 출력 인터페이스

| SoC | DisplayPort 1.4 | MIPI DSI-2 | Single / Dual LVDS | HDMI 2.0 |
| --- | :---: | :---: | :---: | :---: |
| **D+ (`TCC803x`)** | - | - | O | O |
| **D+ Lite** | - | - | O (FHD 설계 상한) | - |
| **D3 (`TCC805x`)** | O (HBR3 × 4, SST/MST) | - | O | - |
| **D3 Lite** | - | O (D-PHY 2.5Gbps × 4) | O | - |
| **D5 (`TCC807x`)** | O (HBR3 × 4, SST/MST) | O (D-PHY 2.5Gbps × 4) | - | - |
| **D7 (`TCC809x`)** | O (HBR3 × 4, SST/MST) | O (D-PHY 2.5Gbps × 4) | - | - |
| **D9 (`TCC811x`)** | O (HBR3 × 4, SST/MST) | O (D-PHY 2.5Gbps × 4) | - | - |

## 판정 기준 및 적용 수식

스펙 출처는 최대 출력 해상도 Calculator 위키 **v22**, 출력 인터페이스별 최대 지원 해상도 매뉴얼 **10.1**, DisplayPort 출력조건별 대역폭 **DB v5**입니다.

| 구분 | 판정 부등식 및 제약 조건 |
| --- | --- |
| **공통 Pixel Clock** | `Pixel_Clock (Hz) = H_total × V_total × Frame_Rate` |
| **VIOC DISP** | `H_active ≤ 8190`, `V_active ≤ 8190`, `H_active × V_active ≤ 8,847,360 (4096 × 2160)` |
| **VIOC Scaler (선택)** | `4K 모드: H_active ≤ 4088, V_active ≤ 8190` / `2K 모드: H_active ≤ 2048, V_active ≤ 8190` |
| **DP SST** | `Pixel_Clock × BPP ≤ Link_Rate × Lanes × 0.8 × (FEC ? 0.976 : 1) × (SSC ? 0.995 : 1)`<br>*(DSC 활성화 시 `BPP = bpp_compressed`, `FEC = 0.976` 강제 적용)* |
| **DP MST** | • **유효 대역폭:** `Pixel_Clock × BPP ≤ Link_Rate × Lanes × 0.8 × (63/64) × (FEC ? 0.97 : 1/1.006)`<br>• **PBN:** `CEIL((Pixel_Clock_Hz × BPP × 1.006 × [FEC ? 100/97 : 1]) / 6,750,000)`<br>• **Time Slot:** `CEIL(PBN / PBN_per_Slot) ≤ 63` *(다중 스트림 시 합산 `≤ 63`)* |
| **DP TU 심볼 슬롯** | `CEIL((8 × BPP × PixelClock_kHz) / (Lanes × LinkRate_Gbps × 100,000)) ≤ 64` |
| **Single / Dual LVDS** | `Pixel_Clock × 28 ≤ 4.48 Gbps (Single) / 8.96 Gbps (Dual)`<br>Dual LVDS 추가 제약: `Splitter Half-Width = CEIL(H_active / 2) ≤ 4095 px` |
| **D+ Lite LVDS** | LVDS 대역폭 제약 + 칩셋 FHD 설계 상한(`H_active ≤ 1920`, `V_active ≤ 1080`, `fps ≤ 60`) 동시 적용 |
| **MIPI DSI-2** | `Pixel_Clock × 24 × 1.1 ≤ 2.5 Gbps × Lanes`, 라인버퍼 `H_active ≤ 4096`<br>EVB SerDes 경유 선택 시: `Pixel_Clock × 24 × 1.1 ≤ 4.8 Gbps` |
| **HDMI 2.0** | `TMDS_Clock ≤ 600 MHz`, `TMDS_Rate ≤ 18.0 Gbps`<br>*(RGB/YCbCr444/422 8-bit: `Pixel_Clock × 30`, YCbCr420 8-bit: `1/2 클럭 · Pixel_Clock × 15`)* |

`H_total / V_total`은 **CTA-861 표준 테이블**(정수 및 `59.94` 등 `1/1.001` 프레임레이트 매칭 포함)을 우선 적용하며, 미수록 비표준 해상도는 **Custom Reduced Blanking (H +80px, V +6lines)**, **VESA CVT-RB v2**, **Blanking Factor 20% (`Active × 1.2`)**, 또는 **수동 입력(Manual Override)** 중 선택하여 산출합니다.

## 코드 구성

```
src/
  data/       SoC별 지원 출력 및 한계값, VIOC 한계, CTA-861 VIC 테이블, 탐색 후보 해상도
  core/       React 의존 없는 순수 판정 엔진(단일 검증·탐색·다중 스트림 MST·수식 생성) 및 단위 테스트
  ui/         엔지니어링 워크벤치 UI 컴포넌트 (검증·탐색·DP MST 다중 스트림 시뮬레이터)
```

사내 계획서, 스펙 검토서, 용어집 문서는 공개 저장소에 포함하지 않고 작업 PC의 `docs/` 폴더에서 별도 로컬 저장소로 관리합니다.
