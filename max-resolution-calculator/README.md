# 최대 출력 해상도 Calculator

Telechips 칩셋의 디스플레이 출력(DP SST, MIPI DSI, LVDS)에서 특정 해상도가 출력 가능한지 판정하고, 가능한 최대 해상도를 찾는 도구입니다.

- **검증 모드:** 칩셋, 출력, 해상도, fps를 넣으면 조건별 결과와 병목 조건을 보여줍니다.
- **탐색 모드:** 칩셋, 출력, fps를 넣으면 후보 해상도 중 출력 가능한 것을 픽셀 수가 큰 순으로 보여줍니다.

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
| `npm test` | 판정 규칙 테스트 (Vitest) |
| `npm run lint` | 린트 (oxlint) |
| `npm run build` | 타입 검사 + 배포용 빌드 (`dist/`) |

## 배포

검증 기간에는 GitHub Pages로 배포하고, 완료 후 사내 서버로 이전합니다.

- **GitHub Pages:** `main`에 push하면 `.github/workflows/deploy-pages.yml`이 테스트 → 빌드 → 배포를 자동으로 실행합니다. 테스트가 실패하면 배포하지 않습니다.
- **사내 서버:** `npm run build`로 만든 `dist/` 폴더를 정적 파일로 그대로 올리면 됩니다. 상대 경로로 빌드하므로 서버의 어느 경로에 두어도 동작합니다.

## 판정 기준

스펙 출처는 Confluence 최대 출력 해상도 Calculator 위키 **v22**입니다.

| 대상 | 판정 |
| --- | --- |
| DISP (공통) | `W ≤ 8190`, `H ≤ 8190`, `W × H ≤ 8,847,360` |
| Scaler (사용 시) | 출력 `W ≤ 4088`, `H ≤ 8190` (4K 가정) |
| DP SST | `Pixel Clock × 24 ≤ Link Rate × Lane × 0.8 × (FEC 0.976) × (SSC 0.995)` |
| Single / Dual LVDS | `Pixel Clock × 28 ≤ 4.48 / 8.96 Gbps` |
| MIPI DSI | `Pixel Clock × 24 × 1.1 ≤ 10 Gbps`, `W ≤ 4096` |
| D+ Lite LVDS | `W ≤ 1920`, `H ≤ 1080`, `fps ≤ 60` |

`Pixel Clock = Htotal × Vtotal × fps`이며, Htotal/Vtotal은 CTA-861 표 → (없으면) 위키 Custom(H +80px, V +6라인) 또는 CVT-RB v2 → 직접 입력 순으로 정합니다.

위키에 명시되지 않아 개발 측이 정한 가정이 포함되어 있습니다. 담당자 확인 전까지 결과는 **잠정**이며, 확인 대상은 `../docs/decisions-for-confirmation.md`에 정리되어 있습니다.

## 1차 범위 밖

DP MST, DSC, RGB888 외 픽셀 포맷, DRAM 대역폭, 동시 출력, Scaler 배율 한계, HDMI.

## 코드 구성

```
src/
  data/       칩셋 스펙, VIOC 한계, CTA-861 표, 탐색 후보 해상도 (위키 값은 여기만 수정)
  core/       React 의존 없는 판정 로직과 테스트
  ui/         화면 컴포넌트
```

관련 문서는 저장소 루트의 `docs/`에 있습니다.

- `project-plan.md`: 결정 사항, 아키텍처, 마일스톤
- `decisions-for-confirmation.md`: 담당자 컨펌 요청
- `wiki-review-max-output-resolution-calculator.md`: 위키 검토 이력
- `display-interface-glossary.md`: 용어집
