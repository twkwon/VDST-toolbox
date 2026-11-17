import { createContext, useContext } from 'react'
import type { HdmiColorFormat } from '../core/constraints/hdmi'
import type { DpMode, OutputId, ScalerMode } from '../core/spec'
import type { FallbackTimingMethod } from '../core/timing'

export type LangCode = 'kr' | 'en' | 'jp' | 'ch' | 'fr' | 'de'

export type LanguageOption = {
  code: LangCode
  badge: string
  nativeName: string
  htmlLang: string
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'kr', badge: 'KR', nativeName: '한국어', htmlLang: 'ko' },
  { code: 'en', badge: 'EN', nativeName: 'English', htmlLang: 'en' },
  { code: 'jp', badge: 'JP', nativeName: '日本語', htmlLang: 'ja' },
  { code: 'ch', badge: 'CH', nativeName: '简体中文', htmlLang: 'zh-CN' },
  { code: 'fr', badge: 'FR', nativeName: 'Français', htmlLang: 'fr' },
  { code: 'de', badge: 'DE', nativeName: 'Deutsch', htmlLang: 'de' },
]

export const STORAGE_LANG_KEY = 'vdst-toolbox-lang'

export function loadInitialLang(): LangCode {
  try {
    const saved = localStorage.getItem(STORAGE_LANG_KEY)
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      return saved as LangCode
    }
  } catch {
    // ignore storage errors
  }
  return 'kr'
}

export type TranslationDict = {
  // Header & Navigation
  brandSubtitle: string
  metaActiveTarget: string
  metaSpecBaseline: string
  metaLanguage: string
  specSource: string
  navAriaLabel: string
  tabs: {
    verify: { title: string; subtitle: string }
    explore: { title: string; subtitle: string }
    mst: { title: string; subtitle: string }
  }

  // Option Labels
  outputLabels: Record<OutputId, string>
  fallbackLabels: Record<FallbackTimingMethod, string>
  scalerLabels: Record<ScalerMode, string>
  dpModeLabels: Record<DpMode, string>
  hdmiFormatLabels: Record<HdmiColorFormat, string>

  // Common Form / SettingsFields
  targetLegend: string
  targetSocLabel: string
  targetOutputLabel: string
  fallbackSelectLabel: string
  optionsLegend: string
  scalerPipelineLabel: string
  dpTransportModeLabel: string
  linkRateGradeLabel: string
  laneCountLabel: string
  fecEnableLabel: string
  fecMandatoryDscSuffix: string
  sscEnableLabel: string
  dscEnableLabel: string
  dscTargetBppLabel: string
  compressionRatio: (ratio: string) => string
  dsiDataLanesLabel: string
  physicalBandwidth: (gbps: string) => string
  dsiEvbSerdesLabel: string
  hdmiFormatSelectLabel: string

  // VerifyPage
  verifyTimingLegend: string
  ctaPresetLabel: string
  ctaPresetPlaceholder: string
  verifyBlankingLegend: string
  manualOverrideLabel: string
  manualTimingSource: string
  errWidthPositiveInt: string
  errHeightPositiveInt: string
  errFpsPositive: string
  errHTotalMin: string
  errVTotalMin: string

  // ExplorePage
  exploreSweepLegend: string
  exploreTargetFpsLabel: string
  exploreShowFailedLabel: string
  exploreErrFpsPositive: string
  exploreMaxAchievableTitle: (w: number, h: number, fps: number) => string
  exploreNoCandidateTitle: (fps: number) => string
  exploreSummaryText: (total: number, passCount: number, failCount: number) => string
  exploreSection1Title: string
  exploreSection1Tag: string
  exploreColResolution: string
  exploreColTimingSpec: string
  exploreColPixelClock: string
  exploreColBottleneck: string
  exploreColActualLimit: string
  exploreColMargin: string
  exploreColVerdict: string
  exploreSection2Title: (w: number, h: number, fps: number) => string

  // MstPage
  mstLinkConfigLegend: string
  mstTargetSocLabel: string
  mstFecOverheadSuffix: string
  mstTopologyLegend: (maxStreams: number) => string
  mstLoadReferenceBtn: string
  mstAddStreamBtn: (current: number, max: number) => string
  mstRemoveStreamBtn: string
  mstPresetLabel: string
  mstPresetPlaceholder: string
  mstStreamError: (index: number) => string
  mstVerdictPassTitle: (count: number) => string
  mstVerdictFailTitle: string
  mstVerdictSummary: (slots: number, tuSlots: number, actualGbps: string, maxGbps: string) => string
  mstKpiTimeSlotsSub: string
  mstKpiTuSymbolsSub: string
  mstKpiPayloadSub: (maxGbps: string) => string
  mstKpiPbnSub: (pbnPerSlot: number) => string
  mstSection1Title: string
  mstColAggregateItem: string
  mstColAggregateActual: string
  mstColLinkLimit: string
  mstColUtilization: string
  mstColMargin: string
  mstColVerdict: string
  mstFormulaCardTitle: (name: string) => string
  mstTagInequality: string
  mstTagSumSubstitution: string
  mstTagLimitSubstitution: string
  mstSection2Title: string
  mstSection2Tag: (count: number) => string
  mstColVcChannel: string
  mstColResTiming: string
  mstColReqBandwidth: string
  mstColAllocPbn: string
  mstColMstSlot: string
  mstColTuSymbol: string
  mstStreamFormulaTitle: (index: number, w: number, h: number, fps: number, hTotal: number, vTotal: number) => string

  // ResultPanel
  unsupportedTitle: string
  unsupportedDesc: string
  verdictCompliant: string
  verdictNonCompliant: string
  verdictPassHeadline: string
  verdictFailHeadline: string
  verdictPassDetail: (name: string, util: string, margin: string) => string
  verdictFailDetailPrefix: string
  kpiPixelClock: string
  kpiActiveBlanking: string
  kpiPrimaryBottleneck: string
  kpiPeakUtilization: string
  resultSection1Title: string
  totalResCardTitle: string
  pixelClockCardTitle: string
  dpTuCardTitle: string
  dpMstPbnCardTitle: string
  dpMstPbnSubstitution: (pbnPerSlot: number, linkRate: string, lanes: number, mstPbn: number, mstSlots: number) => string
  tagAppliedFormula: string
  tagValueSubstitution: string
  resultSection2Title: string
  resultSection2Tag: (count: number) => string
  colConstraint: string
  colActual: string
  colLimit: string
  colUtilization: string
  colMargin: string
  colVerdict: string
  miniBadgeBottleneck: string
  resultSection3Title: string
  resultSection3Tag: string
  primaryBottleneckBadge: string
  formulaPillSummary: (actual: string, limit: string, util: string, margin: string) => string
  tagInequality: string
  tagActualSubstitution: string
  tagLimitSubstitution: string
  specBasisNote: (source: string) => string
  unitPixels: string
}

export const TRANSLATIONS: Record<LangCode, TranslationDict> = {
  kr: {
    brandSubtitle: '차량용 SoC 디스플레이 서브시스템 타이밍 · 링크 대역폭 · 수식 검증 워크벤치',
    metaActiveTarget: 'ACTIVE TARGET (현재 대상)',
    metaSpecBaseline: 'SPECIFICATION BASELINE (스펙 기준)',
    metaLanguage: 'LANGUAGE (언어 선택)',
    specSource: '최대 출력 해상도 Calculator 위키 v22 · 출력 인터페이스 매뉴얼 10.1 · DP 대역폭 DB v5',
    navAriaLabel: '분석 모드 선택',
    tabs: {
      verify: {
        title: '단일 해상도 타이밍·대역폭 검증',
        subtitle: 'Single-Stream Timing & Bandwidth Compliance',
      },
      explore: {
        title: '최대 지원 해상도 탐색',
        subtitle: 'Maximum Achievable Resolution Explorer',
      },
      mst: {
        title: 'DP MST 다중 스트림 시뮬레이터',
        subtitle: 'Multi-Stream PBN & Time Slot Topology Analyzer',
      },
    },
    outputLabels: {
      dp: 'DisplayPort 1.4 (SST / MST)',
      dsi: 'MIPI DSI-2 (D-PHY v2.0)',
      lvdsSingle: 'OpenLDI Single LVDS (4-Lane)',
      lvdsDual: 'OpenLDI Dual LVDS (8-Lane)',
      hdmi: 'HDMI 2.0 (TMDS)',
    },
    fallbackLabels: {
      wikiCustom: 'Custom Reduced Blanking (H +80px, V +6lines)',
      cvtRbV2: 'VESA CVT-RB v2 (Reduced Blanking v2)',
      blankFactor20: 'Blanking Factor 20% (Active × 1.2, TRM 10.1.3)',
    },
    scalerLabels: {
      off: 'Bypass (VIOC Scaler 미사용 · DISP 직결)',
      '4k': '4K Line Buffer Mode (출력 Width ≤ 4088 px)',
      '2k': '2K Line Buffer Mode (출력 Width ≤ 2048 px)',
    },
    dpModeLabels: {
      sst: 'SST (Single-Stream Transport)',
      mst: 'MST (Multi-Stream Transport · PBN / Time Slot)',
    },
    hdmiFormatLabels: {
      rgb_yuv444_8bpc: 'RGB / YCbCr 4:4:4 (8-bpc, 24 bpp · TMDS 30 bits/px)',
      yuv422_8bpc: 'YCbCr 4:2:2 (8-bpc · TMDS 30 bits/px)',
      yuv420_8bpc: 'YCbCr 4:2:0 (8-bpc, 1/2 Pixel Clock · TMDS 15 bits/px)',
    },
    targetLegend: '1. 타깃 아키텍처 (Target SoC & Interface)',
    targetSocLabel: '대상 프로세서 (SoC)',
    targetOutputLabel: '디스플레이 출력 인터페이스',
    fallbackSelectLabel: '비표준 해상도 블랭킹 산출 모델 (CTA-861 미수록 시)',
    optionsLegend: '4. 서브시스템 및 링크 구성 (VIOC & Link Config)',
    scalerPipelineLabel: 'VIOC Scaler 파이프라인 구성',
    dpTransportModeLabel: 'DisplayPort 전송 모드',
    linkRateGradeLabel: 'Link Rate 등급',
    laneCountLabel: '구성 Lane 수',
    fecEnableLabel: 'FEC (Forward Error Correction) 활성화',
    fecMandatoryDscSuffix: '(DSC 필수 연동)',
    sscEnableLabel: 'SSC (Spread Spectrum Clocking · 0.5% 마진 차감)',
    dscEnableLabel: 'DSC (Display Stream Compression) 압축 활성화',
    dscTargetBppLabel: 'DSC 목표 압축 비트율 (bpp_compressed)',
    compressionRatio: (ratio) => `압축비 ${ratio}:1`,
    dsiDataLanesLabel: 'MIPI D-PHY Data Lanes 구성',
    physicalBandwidth: (gbps) => `물리 대역폭 ${gbps} Gbps`,
    dsiEvbSerdesLabel: 'EVB SerDes 경유 출력 제약 적용 (최대 4.8 Gbps · TRM 10.1.2)',
    hdmiFormatSelectLabel: 'HDMI 2.0 픽셀 인코딩 포맷 (TRM 10.1.4)',

    verifyTimingLegend: '2. 비디오 타이밍 파라미터 (Video Timing)',
    ctaPresetLabel: 'CTA-861 표준 프리셋 (Standard VIC Modes)',
    ctaPresetPlaceholder: '프리셋 선택 (수동 입력 중)…',
    verifyBlankingLegend: '3. 블랭킹 산출 규격 (Blanking & Total Timing)',
    manualOverrideLabel: '패널 규격서 H_total / V_total 직접 지정 (Manual Override)',
    manualTimingSource: '사용자 정의 타이밍 (Manual H_total / V_total)',
    errWidthPositiveInt: '수평 해상도(H_active)는 양의 정수여야 합니다.',
    errHeightPositiveInt: '수직 해상도(V_active)는 양의 정수여야 합니다.',
    errFpsPositive: '주사율(Frame Rate)은 0보다 커야 합니다.',
    errHTotalMin: 'H_total은 H_active 이상의 정수여야 합니다.',
    errVTotalMin: 'V_total은 V_active 이상의 정수여야 합니다.',

    exploreSweepLegend: '2. 탐색 조건 설정 (Sweep Parameters)',
    exploreTargetFpsLabel: '목표 주사율 (Target Frame Rate, Hz)',
    exploreShowFailedLabel: '부적합(FAIL) 후보 해상도 포함 표시',
    exploreErrFpsPositive: '목표 주사율(Frame Rate)은 0보다 커야 합니다.',
    exploreMaxAchievableTitle: (w, h, fps) => `최대 지원 가능 해상도: ${w}×${h} @ ${fps}Hz`,
    exploreNoCandidateTitle: (fps) => `${fps}Hz 조건에서 출력 가능한 후보 해상도가 없습니다.`,
    exploreSummaryText: (total, passCount, failCount) =>
      `전체 후보 ${total}개 중 적합(PASS) ${passCount}개 · 부적합(FAIL) ${failCount}개 (행 클릭 시 하단에 상세 수식 및 대입 풀이 표시)`,
    exploreSection1Title: '1. 후보 해상도 적격성 평가 테이블 (Candidate Resolution Matrix)',
    exploreSection1Tag: '행을 클릭하면 하단 수식 풀이가 갱신됩니다',
    exploreColResolution: '후보 해상도',
    exploreColTimingSpec: '적용 타이밍 규격',
    exploreColPixelClock: 'Pixel Clock',
    exploreColBottleneck: '핵심 병목 항목 (Primary Bottleneck)',
    exploreColActualLimit: '요구값 / 한계값',
    exploreColMargin: '여유 마진',
    exploreColVerdict: '판정',
    exploreSection2Title: (w, h, fps) => `2. 선택 해상도 수식 및 대입 상세 분석: ${w}×${h} @ ${fps}Hz`,

    mstLinkConfigLegend: '1. DP MST 물리 링크 구성 (Physical Link Config)',
    mstTargetSocLabel: '대상 프로세서 (DP MST 지원 SoC)',
    mstFecOverheadSuffix: '(MST + FEC 3% 오버헤드 적용)',
    mstTopologyLegend: (max) => `2. Virtual Channel 스트림 토폴로지 (최대 ${max}ch)`,
    mstLoadReferenceBtn: 'TRM 10.1.1 레퍼런스 토폴로지 로드 (4K@60 × 1 + FHD@60 × 3)',
    mstAddStreamBtn: (cur, max) => `+ Virtual Channel 스트림 추가 (${cur}/${max})`,
    mstRemoveStreamBtn: '스트림 제거',
    mstPresetLabel: 'CTA-861 표준 프리셋 적용',
    mstPresetPlaceholder: '프리셋 선택…',
    mstStreamError: (idx) => `Stream #${idx}: H_active, V_active, Frame Rate를 올바르게 입력하십시오.`,
    mstVerdictPassTitle: (count) => `${count}채널 DP MST 스트림 동시 출력이 가능합니다.`,
    mstVerdictFailTitle: '다중 스트림 합산 요구량이 DP MST 링크 또는 타임슬롯 용량을 초과했습니다.',
    mstVerdictSummary: (slots, tuSlots, actualGbps, maxGbps) =>
      `총 할당 Time Slot: ${slots} / 63 slots · 총 TU 심볼 슬롯: ${tuSlots} / 64 slots · 총 요구 대역폭: ${actualGbps} / ${maxGbps} Gbps`,
    mstKpiTimeSlotsSub: '1 MTP = 64 slots (헤더 1 slot 제외)',
    mstKpiTuSymbolsSub: 'TRM 10.1.1 Table 10.4 기준',
    mstKpiPayloadSub: (maxGbps) => `링크 한계 ${maxGbps} Gbps`,
    mstKpiPbnSub: (pbnPerSlot) => `슬롯당 용량 ${pbnPerSlot} PBN/slot (Table 2)`,
    mstSection1Title: '1. 물리 링크 합산 제약 및 수식 풀이 (Aggregate Link Constraints & Formulas)',
    mstColAggregateItem: '합산 검증 항목',
    mstColAggregateActual: '합산 요구값 (Actual)',
    mstColLinkLimit: '링크 허용 한계 (Limit)',
    mstColUtilization: '점유율',
    mstColMargin: '여유 마진',
    mstColVerdict: '판정',
    mstFormulaCardTitle: (name) => `${name} 산출 풀이`,
    mstTagInequality: '판정 부등식',
    mstTagSumSubstitution: '합산값 대입',
    mstTagLimitSubstitution: '한계값 대입',
    mstSection2Title: '2. Virtual Channel 스트림별 PBN · Time Slot · TU 심볼 상세 산출 (Per-Stream Breakdown)',
    mstSection2Tag: (count) => `총 ${count}개 스트림`,
    mstColVcChannel: 'VC 채널',
    mstColResTiming: '해상도 및 타이밍 규격',
    mstColReqBandwidth: '요구 대역폭',
    mstColAllocPbn: '할당 PBN',
    mstColMstSlot: 'MST Time Slot',
    mstColTuSymbol: 'TU 심볼 (10.1.1)',
    mstStreamFormulaTitle: (idx, w, h, fps, hTotal, vTotal) =>
      `VC Stream #${idx} (${w}×${h} @ ${fps}Hz, Total ${hTotal}×${vTotal}) 수식 대입 풀이`,

    unsupportedTitle: '선택한 SoC 아키텍처에서 해당 출력 인터페이스를 지원하지 않습니다.',
    unsupportedDesc: '좌측 타깃 아키텍처 설정에서 지원되는 인터페이스 조합을 선택하십시오.',
    verdictCompliant: 'COMPLIANT (적합)',
    verdictNonCompliant: 'NON-COMPLIANT (부적합)',
    verdictPassHeadline: '모든 하드웨어 및 링크 대역폭 제약을 충족합니다.',
    verdictFailHeadline: '하드웨어 또는 링크 대역폭 한계를 초과했습니다.',
    verdictPassDetail: (name, util, margin) =>
      `최소 여유 항목 (Primary Bottleneck): ${name} · 점유율 ${util}% (여유 마진 ${margin})`,
    verdictFailDetailPrefix: '위반 항목',
    kpiPixelClock: 'PIXEL CLOCK',
    kpiActiveBlanking: 'ACTIVE / BLANKING RATIO',
    kpiPrimaryBottleneck: 'PRIMARY BOTTLENECK',
    kpiPeakUtilization: 'PEAK UTILIZATION / HEADROOM',
    resultSection1Title: '1. 타이밍 및 픽셀 클럭 산출 수식 (Timing & Pixel Clock Derivation)',
    totalResCardTitle: 'Total 해상도 산출 (H_total × V_total)',
    pixelClockCardTitle: '픽셀 클럭 산출 (Pixel Clock)',
    dpTuCardTitle: 'DisplayPort Transfer Unit (TU) 필요 심볼 슬롯 (TRM 10.1.1 Table 10.4)',
    dpMstPbnCardTitle: 'DP MST Payload Bandwidth Number (PBN) & Time Slot (Table 2~4)',
    dpMstPbnSubstitution: (pbnPerSlot, linkRate, lanes, mstPbn, mstSlots) =>
      `1 Slot 당 ${pbnPerSlot} PBN (${linkRate} × ${lanes} lanes) → 스트림 요구 ${mstPbn} PBN → ${mstSlots} Time Slots 할당`,
    tagAppliedFormula: '적용 수식',
    tagValueSubstitution: '값 대입',
    resultSection2Title: '2. 제약 조건 적합성 매트릭스 (Constraint Compliance Matrix)',
    resultSection2Tag: (count) => `총 ${count}개 항목 검증`,
    colConstraint: '검증 항목 (Constraint)',
    colActual: '산출 요구값 (Actual)',
    colLimit: '허용 한계값 (Limit)',
    colUtilization: '링크/자원 점유율',
    colMargin: '여유 마진',
    colVerdict: '판정',
    miniBadgeBottleneck: '병목',
    resultSection3Title: '3. 항목별 적용 수식 및 값 대입 상세 풀이 (Detailed Formula & Substitution Breakdown)',
    resultSection3Tag: 'Step-by-Step Verification',
    primaryBottleneckBadge: 'PRIMARY BOTTLENECK',
    formulaPillSummary: (actual, limit, util, margin) => `${actual} ≤ ${limit} (점유율 ${util}% · 여유 ${margin})`,
    tagInequality: '판정 부등식',
    tagActualSubstitution: '요구값 대입',
    tagLimitSubstitution: '한계값 대입',
    specBasisNote: (source) => `스펙 근거: ${source}`,
    unitPixels: '픽셀',
  },

  en: {
    brandSubtitle: 'Automotive SoC Display Subsystem Timing · Link Bandwidth · Formula Verification Workbench',
    metaActiveTarget: 'ACTIVE TARGET',
    metaSpecBaseline: 'SPECIFICATION BASELINE',
    metaLanguage: 'LANGUAGE',
    specSource: 'Max Resolution Calculator Wiki v22 · Display Interface Manual 10.1 · DP Bandwidth DB v5',
    navAriaLabel: 'Select Analysis Mode',
    tabs: {
      verify: {
        title: 'Single-Stream Timing & Bandwidth Verification',
        subtitle: 'Single-Stream Timing & Bandwidth Compliance',
      },
      explore: {
        title: 'Maximum Achievable Resolution Explorer',
        subtitle: 'Candidate Resolution Sweep & Bottleneck Analysis',
      },
      mst: {
        title: 'DP MST Multi-Stream Simulator',
        subtitle: 'Multi-Stream PBN & Time Slot Topology Analyzer',
      },
    },
    outputLabels: {
      dp: 'DisplayPort 1.4 (SST / MST)',
      dsi: 'MIPI DSI-2 (D-PHY v2.0)',
      lvdsSingle: 'OpenLDI Single LVDS (4-Lane)',
      lvdsDual: 'OpenLDI Dual LVDS (8-Lane)',
      hdmi: 'HDMI 2.0 (TMDS)',
    },
    fallbackLabels: {
      wikiCustom: 'Custom Reduced Blanking (H +80px, V +6lines)',
      cvtRbV2: 'VESA CVT-RB v2 (Reduced Blanking v2)',
      blankFactor20: 'Blanking Factor 20% (Active × 1.2, TRM 10.1.3)',
    },
    scalerLabels: {
      off: 'Bypass (VIOC Scaler Disabled · Direct DISP)',
      '4k': '4K Line Buffer Mode (Output Width ≤ 4088 px)',
      '2k': '2K Line Buffer Mode (Output Width ≤ 2048 px)',
    },
    dpModeLabels: {
      sst: 'SST (Single-Stream Transport)',
      mst: 'MST (Multi-Stream Transport · PBN / Time Slot)',
    },
    hdmiFormatLabels: {
      rgb_yuv444_8bpc: 'RGB / YCbCr 4:4:4 (8-bpc, 24 bpp · TMDS 30 bits/px)',
      yuv422_8bpc: 'YCbCr 4:2:2 (8-bpc · TMDS 30 bits/px)',
      yuv420_8bpc: 'YCbCr 4:2:0 (8-bpc, 1/2 Pixel Clock · TMDS 15 bits/px)',
    },
    targetLegend: '1. Target Architecture (Target SoC & Interface)',
    targetSocLabel: 'Target Processor (SoC)',
    targetOutputLabel: 'Display Output Interface',
    fallbackSelectLabel: 'Fallback Blanking Model (When Not in CTA-861)',
    optionsLegend: '4. Subsystem & Link Configuration (VIOC & Link Config)',
    scalerPipelineLabel: 'VIOC Scaler Pipeline Mode',
    dpTransportModeLabel: 'DisplayPort Transport Mode',
    linkRateGradeLabel: 'Link Rate Grade',
    laneCountLabel: 'Lane Count',
    fecEnableLabel: 'Enable FEC (Forward Error Correction)',
    fecMandatoryDscSuffix: '(Mandatory with DSC)',
    sscEnableLabel: 'Enable SSC (Spread Spectrum Clocking · 0.5% margin)',
    dscEnableLabel: 'Enable DSC (Display Stream Compression)',
    dscTargetBppLabel: 'DSC Target Compressed Bitrate (bpp_compressed)',
    compressionRatio: (ratio) => `Ratio ${ratio}:1`,
    dsiDataLanesLabel: 'MIPI D-PHY Data Lanes',
    physicalBandwidth: (gbps) => `Physical BW ${gbps} Gbps`,
    dsiEvbSerdesLabel: 'Apply EVB SerDes Bandwidth Limit (Max 4.8 Gbps · TRM 10.1.2)',
    hdmiFormatSelectLabel: 'HDMI 2.0 Pixel Encoding Format (TRM 10.1.4)',

    verifyTimingLegend: '2. Video Timing Parameters',
    ctaPresetLabel: 'CTA-861 Standard Presets (VIC Modes)',
    ctaPresetPlaceholder: 'Select a preset (manual entry active)…',
    verifyBlankingLegend: '3. Blanking & Total Timing Specification',
    manualOverrideLabel: 'Manual H_total / V_total Override (Panel Datasheet)',
    manualTimingSource: 'Manual Timing (Custom H_total / V_total)',
    errWidthPositiveInt: 'Horizontal resolution (H_active) must be a positive integer.',
    errHeightPositiveInt: 'Vertical resolution (V_active) must be a positive integer.',
    errFpsPositive: 'Frame rate (Hz) must be greater than 0.',
    errHTotalMin: 'H_total must be an integer greater than or equal to H_active.',
    errVTotalMin: 'V_total must be an integer greater than or equal to V_active.',

    exploreSweepLegend: '2. Sweep Parameters',
    exploreTargetFpsLabel: 'Target Frame Rate (Hz)',
    exploreShowFailedLabel: 'Include Non-Compliant (FAIL) Candidates',
    exploreErrFpsPositive: 'Target frame rate (Hz) must be greater than 0.',
    exploreMaxAchievableTitle: (w, h, fps) => `Maximum Achievable Resolution: ${w}×${h} @ ${fps}Hz`,
    exploreNoCandidateTitle: (fps) => `No compliant candidate resolution found at ${fps}Hz.`,
    exploreSummaryText: (total, passCount, failCount) =>
      `${passCount} PASS · ${failCount} FAIL out of ${total} candidates (Click any row to inspect step-by-step formulas below)`,
    exploreSection1Title: '1. Candidate Resolution Compliance Matrix',
    exploreSection1Tag: 'Click a row to update the formula breakdown below',
    exploreColResolution: 'Resolution',
    exploreColTimingSpec: 'Timing Standard',
    exploreColPixelClock: 'Pixel Clock',
    exploreColBottleneck: 'Primary Bottleneck',
    exploreColActualLimit: 'Actual / Limit',
    exploreColMargin: 'Headroom',
    exploreColVerdict: 'Status',
    exploreSection2Title: (w, h, fps) => `2. Detailed Formula & Substitution Breakdown: ${w}×${h} @ ${fps}Hz`,

    mstLinkConfigLegend: '1. DP MST Physical Link Configuration',
    mstTargetSocLabel: 'Target Processor (DP MST Capable SoC)',
    mstFecOverheadSuffix: '(Applies 3% MST + FEC overhead)',
    mstTopologyLegend: (max) => `2. Virtual Channel Stream Topology (Up to ${max}ch)`,
    mstLoadReferenceBtn: 'Load TRM 10.1.1 Reference Topology (4K@60 × 1 + FHD@60 × 3)',
    mstAddStreamBtn: (cur, max) => `+ Add Virtual Channel Stream (${cur}/${max})`,
    mstRemoveStreamBtn: 'Remove Stream',
    mstPresetLabel: 'Apply CTA-861 Standard Preset',
    mstPresetPlaceholder: 'Select preset…',
    mstStreamError: (idx) => `Stream #${idx}: Please enter valid H_active, V_active, and Frame Rate.`,
    mstVerdictPassTitle: (count) => `Simultaneous output of ${count}-channel DP MST streams is supported.`,
    mstVerdictFailTitle: 'Aggregate multi-stream demand exceeds DP MST link bandwidth or time slot capacity.',
    mstVerdictSummary: (slots, tuSlots, actualGbps, maxGbps) =>
      `Total Time Slots: ${slots} / 63 slots · Total TU Symbols: ${tuSlots} / 64 slots · Total Payload BW: ${actualGbps} / ${maxGbps} Gbps`,
    mstKpiTimeSlotsSub: '1 MTP = 64 slots (excl. 1 header slot)',
    mstKpiTuSymbolsSub: 'Per TRM 10.1.1 Table 10.4',
    mstKpiPayloadSub: (maxGbps) => `Link Limit ${maxGbps} Gbps`,
    mstKpiPbnSub: (pbnPerSlot) => `Capacity ${pbnPerSlot} PBN/slot (Table 2)`,
    mstSection1Title: '1. Aggregate Link Constraints & Formula Breakdown',
    mstColAggregateItem: 'Aggregate Constraint',
    mstColAggregateActual: 'Aggregate Demand (Actual)',
    mstColLinkLimit: 'Link Capacity (Limit)',
    mstColUtilization: 'Utilization',
    mstColMargin: 'Headroom',
    mstColVerdict: 'Status',
    mstFormulaCardTitle: (name) => `${name} — Formula Breakdown`,
    mstTagInequality: 'Inequality',
    mstTagSumSubstitution: 'Sum Substitution',
    mstTagLimitSubstitution: 'Limit Substitution',
    mstSection2Title: '2. Per-Stream PBN · Time Slot · TU Symbol Breakdown',
    mstSection2Tag: (count) => `${count} Active Stream(s)`,
    mstColVcChannel: 'VC Channel',
    mstColResTiming: 'Resolution & Timing',
    mstColReqBandwidth: 'Payload BW',
    mstColAllocPbn: 'Allocated PBN',
    mstColMstSlot: 'MST Time Slot',
    mstColTuSymbol: 'TU Symbols (10.1.1)',
    mstStreamFormulaTitle: (idx, w, h, fps, hTotal, vTotal) =>
      `VC Stream #${idx} (${w}×${h} @ ${fps}Hz, Total ${hTotal}×${vTotal}) Formula Breakdown`,

    unsupportedTitle: 'The selected output interface is not supported on this SoC architecture.',
    unsupportedDesc: 'Please choose a supported SoC and display interface combination in the left panel.',
    verdictCompliant: 'COMPLIANT (PASS)',
    verdictNonCompliant: 'NON-COMPLIANT (FAIL)',
    verdictPassHeadline: 'Meets all hardware and link bandwidth constraints.',
    verdictFailHeadline: 'Exceeds hardware or link bandwidth limits.',
    verdictPassDetail: (name, util, margin) =>
      `Primary Bottleneck: ${name} · Utilization ${util}% (Headroom ${margin})`,
    verdictFailDetailPrefix: 'Violated Constraints',
    kpiPixelClock: 'PIXEL CLOCK',
    kpiActiveBlanking: 'ACTIVE / BLANKING RATIO',
    kpiPrimaryBottleneck: 'PRIMARY BOTTLENECK',
    kpiPeakUtilization: 'PEAK UTILIZATION / HEADROOM',
    resultSection1Title: '1. Timing & Pixel Clock Derivation',
    totalResCardTitle: 'Total Resolution Derivation (H_total × V_total)',
    pixelClockCardTitle: 'Pixel Clock Derivation',
    dpTuCardTitle: 'DisplayPort Transfer Unit (TU) Symbol Slots (TRM 10.1.1 Table 10.4)',
    dpMstPbnCardTitle: 'DP MST Payload Bandwidth Number (PBN) & Time Slot (Table 2~4)',
    dpMstPbnSubstitution: (pbnPerSlot, linkRate, lanes, mstPbn, mstSlots) =>
      `${pbnPerSlot} PBN/slot (${linkRate} × ${lanes} lanes) → Stream requires ${mstPbn} PBN → ${mstSlots} Time Slots allocated`,
    tagAppliedFormula: 'Formula',
    tagValueSubstitution: 'Substitution',
    resultSection2Title: '2. Constraint Compliance Matrix',
    resultSection2Tag: (count) => `${count} Constraints Evaluated`,
    colConstraint: 'Constraint',
    colActual: 'Required (Actual)',
    colLimit: 'Capacity (Limit)',
    colUtilization: 'Utilization',
    colMargin: 'Headroom',
    colVerdict: 'Status',
    miniBadgeBottleneck: 'Bottleneck',
    resultSection3Title: '3. Detailed Formula & Substitution Breakdown',
    resultSection3Tag: 'Step-by-Step Verification',
    primaryBottleneckBadge: 'PRIMARY BOTTLENECK',
    formulaPillSummary: (actual, limit, util, margin) => `${actual} ≤ ${limit} (Util ${util}% · Headroom ${margin})`,
    tagInequality: 'Inequality',
    tagActualSubstitution: 'Actual Value',
    tagLimitSubstitution: 'Limit Value',
    specBasisNote: (source) => `Specification Source: ${source}`,
    unitPixels: 'pixels',
  },

  jp: {
    brandSubtitle: '車載SoC ディスプレイサブシステム タイミング・リンク帯域幅・数式検証ワークベンチ',
    metaActiveTarget: 'ACTIVE TARGET (対象構成)',
    metaSpecBaseline: 'SPECIFICATION BASELINE (仕様基準)',
    metaLanguage: 'LANGUAGE (言語)',
    specSource: '最大出力解像度 Calculator Wiki v22 · 出力インターフェースマニュアル 10.1 · DP帯域幅 DB v5',
    navAriaLabel: '解析モード選択',
    tabs: {
      verify: {
        title: '単一解像度 タイミング・帯域幅検証',
        subtitle: 'Single-Stream Timing & Bandwidth Compliance',
      },
      explore: {
        title: '最大対応解像度の探索',
        subtitle: 'Maximum Achievable Resolution Explorer',
      },
      mst: {
        title: 'DP MST マルチストリームシミュレータ',
        subtitle: 'Multi-Stream PBN & Time Slot Topology Analyzer',
      },
    },
    outputLabels: {
      dp: 'DisplayPort 1.4 (SST / MST)',
      dsi: 'MIPI DSI-2 (D-PHY v2.0)',
      lvdsSingle: 'OpenLDI Single LVDS (4-Lane)',
      lvdsDual: 'OpenLDI Dual LVDS (8-Lane)',
      hdmi: 'HDMI 2.0 (TMDS)',
    },
    fallbackLabels: {
      wikiCustom: 'Custom Reduced Blanking (H +80px, V +6lines)',
      cvtRbV2: 'VESA CVT-RB v2 (Reduced Blanking v2)',
      blankFactor20: 'Blanking Factor 20% (Active × 1.2, TRM 10.1.3)',
    },
    scalerLabels: {
      off: 'Bypass (VIOC Scaler 未使用 · DISP 直結)',
      '4k': '4K Line Buffer モード (出力 Width ≤ 4088 px)',
      '2k': '2K Line Buffer モード (出力 Width ≤ 2048 px)',
    },
    dpModeLabels: {
      sst: 'SST (Single-Stream Transport)',
      mst: 'MST (Multi-Stream Transport · PBN / Time Slot)',
    },
    hdmiFormatLabels: {
      rgb_yuv444_8bpc: 'RGB / YCbCr 4:4:4 (8-bpc, 24 bpp · TMDS 30 bits/px)',
      yuv422_8bpc: 'YCbCr 4:2:2 (8-bpc · TMDS 30 bits/px)',
      yuv420_8bpc: 'YCbCr 4:2:0 (8-bpc, 1/2 Pixel Clock · TMDS 15 bits/px)',
    },
    targetLegend: '1. ターゲットアーキテクチャ (Target SoC & Interface)',
    targetSocLabel: '対象プロセッサ (SoC)',
    targetOutputLabel: 'ディスプレイ出力インターフェース',
    fallbackSelectLabel: '非標準解像度 ブランキング算出モデル (CTA-861 未収録時)',
    optionsLegend: '4. サブシステムおよびリンク構成 (VIOC & Link Config)',
    scalerPipelineLabel: 'VIOC Scaler パイプライン構成',
    dpTransportModeLabel: 'DisplayPort 伝送モード',
    linkRateGradeLabel: 'Link Rate グレード',
    laneCountLabel: 'レーン数 (Lanes)',
    fecEnableLabel: 'FEC (Forward Error Correction) 有効化',
    fecMandatoryDscSuffix: '(DSC使用時は必須)',
    sscEnableLabel: 'SSC (Spread Spectrum Clocking · 0.5% マージン減算)',
    dscEnableLabel: 'DSC (Display Stream Compression) 圧縮を有効化',
    dscTargetBppLabel: 'DSC 目標圧縮ビットレート (bpp_compressed)',
    compressionRatio: (ratio) => `圧縮比 ${ratio}:1`,
    dsiDataLanesLabel: 'MIPI D-PHY データレーン構成',
    physicalBandwidth: (gbps) => `物理帯域幅 ${gbps} Gbps`,
    dsiEvbSerdesLabel: 'EVB SerDes 経由出力制約を適用 (最大 4.8 Gbps · TRM 10.1.2)',
    hdmiFormatSelectLabel: 'HDMI 2.0 ピクセルエンコーディング形式 (TRM 10.1.4)',

    verifyTimingLegend: '2. ビデオタイミングパラメータ (Video Timing)',
    ctaPresetLabel: 'CTA-861 標準プリセット (Standard VIC Modes)',
    ctaPresetPlaceholder: 'プリセットを選択 (手動入力中)…',
    verifyBlankingLegend: '3. ブランキング算出規格 (Blanking & Total Timing)',
    manualOverrideLabel: 'パネル仕様書 H_total / V_total 直接指定 (Manual Override)',
    manualTimingSource: 'ユーザー定義タイミング (Manual H_total / V_total)',
    errWidthPositiveInt: '水平解像度 (H_active) は正の整数である必要があります。',
    errHeightPositiveInt: '垂直解像度 (V_active) は正の整数である必要があります。',
    errFpsPositive: 'リフレッシュレート (Frame Rate) は 0 より大きい値を入力してください。',
    errHTotalMin: 'H_total は H_active 以上の整数である必要があります。',
    errVTotalMin: 'V_total は V_active 以上の整数である必要があります。',

    exploreSweepLegend: '2. 探索条件設定 (Sweep Parameters)',
    exploreTargetFpsLabel: '目標リフレッシュレート (Target Frame Rate, Hz)',
    exploreShowFailedLabel: '不適合 (FAIL) 候補解像度も表示',
    exploreErrFpsPositive: '目標リフレッシュレート (Frame Rate) は 0 より大きい値を入力してください。',
    exploreMaxAchievableTitle: (w, h, fps) => `最大対応可能解像度: ${w}×${h} @ ${fps}Hz`,
    exploreNoCandidateTitle: (fps) => `${fps}Hz 条件で出力可能な候補解像度はありません。`,
    exploreSummaryText: (total, passCount, failCount) =>
      `全候補 ${total}件中 適合(PASS) ${passCount}件 · 不適合(FAIL) ${failCount}件 (行をクリックすると下部に詳細数式を表示)`,
    exploreSection1Title: '1. 候補解像度 適合性評価テーブル (Candidate Resolution Matrix)',
    exploreSection1Tag: '行をクリックすると下部の数式解説が更新されます',
    exploreColResolution: '候補解像度',
    exploreColTimingSpec: '適用タイミング規格',
    exploreColPixelClock: 'Pixel Clock',
    exploreColBottleneck: '主要ボトルネック項目',
    exploreColActualLimit: '要求値 / 制限値',
    exploreColMargin: '余裕マージン',
    exploreColVerdict: '判定',
    exploreSection2Title: (w, h, fps) => `2. 選択解像度の数式および代入詳細解析: ${w}×${h} @ ${fps}Hz`,

    mstLinkConfigLegend: '1. DP MST 物理リンク構成 (Physical Link Config)',
    mstTargetSocLabel: '対象プロセッサ (DP MST 対応 SoC)',
    mstFecOverheadSuffix: '(MST + FEC 3% オーバーヘッド適用)',
    mstTopologyLegend: (max) => `2. Virtual Channel ストリームトポロジ (最大 ${max}ch)`,
    mstLoadReferenceBtn: 'TRM 10.1.1 リファレンストポロジ読込 (4K@60 × 1 + FHD@60 × 3)',
    mstAddStreamBtn: (cur, max) => `+ Virtual Channel ストリーム追加 (${cur}/${max})`,
    mstRemoveStreamBtn: 'ストリーム削除',
    mstPresetLabel: 'CTA-861 標準プリセット適用',
    mstPresetPlaceholder: 'プリセットを選択…',
    mstStreamError: (idx) => `Stream #${idx}: H_active、V_active、Frame Rate を正しく入力してください。`,
    mstVerdictPassTitle: (count) => `${count}チャンネル DP MST ストリームの同時出力が可能です。`,
    mstVerdictFailTitle: 'マルチストリーム合算要求量が DP MST リンクまたはタイムスロット容量を超過しました。',
    mstVerdictSummary: (slots, tuSlots, actualGbps, maxGbps) =>
      `総割当 Time Slot: ${slots} / 63 slots · 総 TU シンボルスロット: ${tuSlots} / 64 slots · 総要求帯域幅: ${actualGbps} / ${maxGbps} Gbps`,
    mstKpiTimeSlotsSub: '1 MTP = 64 slots (ヘッダ 1 slot 除く)',
    mstKpiTuSymbolsSub: 'TRM 10.1.1 Table 10.4 基準',
    mstKpiPayloadSub: (maxGbps) => `リンク上限 ${maxGbps} Gbps`,
    mstKpiPbnSub: (pbnPerSlot) => `スロット当たり容量 ${pbnPerSlot} PBN/slot (Table 2)`,
    mstSection1Title: '1. 物理リンク合算制約および数式解説 (Aggregate Link Constraints & Formulas)',
    mstColAggregateItem: '合算検証項目',
    mstColAggregateActual: '合算要求値 (Actual)',
    mstColLinkLimit: 'リンク許容上限 (Limit)',
    mstColUtilization: '占有率',
    mstColMargin: '余裕マージン',
    mstColVerdict: '判定',
    mstFormulaCardTitle: (name) => `${name} の算出詳細`,
    mstTagInequality: '判定不等式',
    mstTagSumSubstitution: '合算値代入',
    mstTagLimitSubstitution: '上限値代入',
    mstSection2Title: '2. Virtual Channel ストリーム別 PBN · Time Slot · TU シンボル詳細算出',
    mstSection2Tag: (count) => `全 ${count} ストリーム`,
    mstColVcChannel: 'VC チャンネル',
    mstColResTiming: '解像度・タイミング規格',
    mstColReqBandwidth: '要求帯域幅',
    mstColAllocPbn: '割当 PBN',
    mstColMstSlot: 'MST Time Slot',
    mstColTuSymbol: 'TU シンボル (10.1.1)',
    mstStreamFormulaTitle: (idx, w, h, fps, hTotal, vTotal) =>
      `VC Stream #${idx} (${w}×${h} @ ${fps}Hz, Total ${hTotal}×${vTotal}) 数式代入詳細`,

    unsupportedTitle: '選択した SoC アーキテクチャではこの出力インターフェースをサポートしていません。',
    unsupportedDesc: '左側のターゲットアーキテクチャ設定から対応するインターフェースを選択してください。',
    verdictCompliant: 'COMPLIANT (適合)',
    verdictNonCompliant: 'NON-COMPLIANT (不適合)',
    verdictPassHeadline: 'すべてのハードウェアおよびリンク帯域幅制約を満たしています。',
    verdictFailHeadline: 'ハードウェアまたはリンク帯域幅の上限を超過しました。',
    verdictPassDetail: (name, util, margin) =>
      `最小余裕項目 (Primary Bottleneck): ${name} · 占有率 ${util}% (余裕マージン ${margin})`,
    verdictFailDetailPrefix: '違反項目',
    kpiPixelClock: 'PIXEL CLOCK',
    kpiActiveBlanking: 'ACTIVE / BLANKING RATIO',
    kpiPrimaryBottleneck: 'PRIMARY BOTTLENECK',
    kpiPeakUtilization: 'PEAK UTILIZATION / HEADROOM',
    resultSection1Title: '1. タイミングおよびピクセルクロック算出数式 (Timing & Pixel Clock Derivation)',
    totalResCardTitle: 'Total 解像度算出 (H_total × V_total)',
    pixelClockCardTitle: 'ピクセルクロック算出 (Pixel Clock)',
    dpTuCardTitle: 'DisplayPort Transfer Unit (TU) 必要シンボルスロット (TRM 10.1.1 Table 10.4)',
    dpMstPbnCardTitle: 'DP MST Payload Bandwidth Number (PBN) & Time Slot (Table 2~4)',
    dpMstPbnSubstitution: (pbnPerSlot, linkRate, lanes, mstPbn, mstSlots) =>
      `1 Slot 当たり ${pbnPerSlot} PBN (${linkRate} × ${lanes} lanes) → ストリーム要求 ${mstPbn} PBN → ${mstSlots} Time Slots 割当`,
    tagAppliedFormula: '適用数式',
    tagValueSubstitution: '値代入',
    resultSection2Title: '2. 制約条件 適合性マトリクス (Constraint Compliance Matrix)',
    resultSection2Tag: (count) => `全 ${count} 項目を検証`,
    colConstraint: '検証項目 (Constraint)',
    colActual: '算出要求値 (Actual)',
    colLimit: '許容上限値 (Limit)',
    colUtilization: 'リンク/資源占有率',
    colMargin: '余裕マージン',
    colVerdict: '判定',
    miniBadgeBottleneck: 'ボトルネック',
    resultSection3Title: '3. 項目別 適用数式および値代入の詳細解説 (Detailed Formula Breakdown)',
    resultSection3Tag: 'Step-by-Step Verification',
    primaryBottleneckBadge: 'PRIMARY BOTTLENECK',
    formulaPillSummary: (actual, limit, util, margin) => `${actual} ≤ ${limit} (占有率 ${util}% · 余裕 ${margin})`,
    tagInequality: '判定不等式',
    tagActualSubstitution: '要求値代入',
    tagLimitSubstitution: '上限値代入',
    specBasisNote: (source) => `仕様根拠: ${source}`,
    unitPixels: 'ピクセル',
  },

  ch: {
    brandSubtitle: '车载 SoC 显示子系统 (VIOC) 时序 · 链路带宽 · 公式验证工作台',
    metaActiveTarget: 'ACTIVE TARGET (当前目标)',
    metaSpecBaseline: 'SPECIFICATION BASELINE (规范基准)',
    metaLanguage: 'LANGUAGE (语言选择)',
    specSource: '最大输出分辨率计算器 Wiki v22 · 输出接口手册 10.1 · DP 带宽数据库 v5',
    navAriaLabel: '选择分析模式',
    tabs: {
      verify: {
        title: '单一分辨率时序与带宽验证',
        subtitle: 'Single-Stream Timing & Bandwidth Compliance',
      },
      explore: {
        title: '最大支持分辨率探索',
        subtitle: 'Maximum Achievable Resolution Explorer',
      },
      mst: {
        title: 'DP MST 多流拓扑仿真器',
        subtitle: 'Multi-Stream PBN & Time Slot Topology Analyzer',
      },
    },
    outputLabels: {
      dp: 'DisplayPort 1.4 (SST / MST)',
      dsi: 'MIPI DSI-2 (D-PHY v2.0)',
      lvdsSingle: 'OpenLDI 单路 LVDS (4-Lane)',
      lvdsDual: 'OpenLDI 双路 LVDS (8-Lane)',
      hdmi: 'HDMI 2.0 (TMDS)',
    },
    fallbackLabels: {
      wikiCustom: '自定义缩减消隐 Custom RB (H +80px, V +6lines)',
      cvtRbV2: 'VESA CVT-RB v2 (Reduced Blanking v2)',
      blankFactor20: '消隐系数 20% (Active × 1.2, TRM 10.1.3)',
    },
    scalerLabels: {
      off: '旁路模式 Bypass (不使用 VIOC Scaler · DISP 直连)',
      '4k': '4K 行缓冲模式 (输出宽度 ≤ 4088 px)',
      '2k': '2K 行缓冲模式 (输出宽度 ≤ 2048 px)',
    },
    dpModeLabels: {
      sst: 'SST (单流传输 Single-Stream Transport)',
      mst: 'MST (多流传输 Multi-Stream Transport · PBN / 时隙)',
    },
    hdmiFormatLabels: {
      rgb_yuv444_8bpc: 'RGB / YCbCr 4:4:4 (8-bpc, 24 bpp · TMDS 30 bits/px)',
      yuv422_8bpc: 'YCbCr 4:2:2 (8-bpc · TMDS 30 bits/px)',
      yuv420_8bpc: 'YCbCr 4:2:0 (8-bpc, 1/2 像素时钟 · TMDS 15 bits/px)',
    },
    targetLegend: '1. 目标架构配置 (Target SoC & Interface)',
    targetSocLabel: '目标车载芯片 (SoC)',
    targetOutputLabel: '显示输出接口',
    fallbackSelectLabel: '非标分辨率消隐计算模型 (未收录于 CTA-861 时)',
    optionsLegend: '4. 子系统与链路配置 (VIOC & Link Config)',
    scalerPipelineLabel: 'VIOC Scaler 缩放器流水线配置',
    dpTransportModeLabel: 'DisplayPort 传输模式',
    linkRateGradeLabel: '链路速率等级 (Link Rate)',
    laneCountLabel: '通道数量 (Lanes)',
    fecEnableLabel: '启用 FEC (前向纠错 Forward Error Correction)',
    fecMandatoryDscSuffix: '(启用 DSC 时强制开启)',
    sscEnableLabel: '启用 SSC (展频时钟 · 扣除 0.5% 裕量)',
    dscEnableLabel: '启用 DSC (显示流压缩 Display Stream Compression)',
    dscTargetBppLabel: 'DSC 目标压缩位深 (bpp_compressed)',
    compressionRatio: (ratio) => `压缩比 ${ratio}:1`,
    dsiDataLanesLabel: 'MIPI D-PHY 数据通道数 (Data Lanes)',
    physicalBandwidth: (gbps) => `物理带宽 ${gbps} Gbps`,
    dsiEvbSerdesLabel: '应用 EVB SerDes 串行器带宽限制 (上限 4.8 Gbps · TRM 10.1.2)',
    hdmiFormatSelectLabel: 'HDMI 2.0 像素编码格式 (TRM 10.1.4)',

    verifyTimingLegend: '2. 视频时序参数 (Video Timing)',
    ctaPresetLabel: 'CTA-861 标准预设模式 (Standard VIC Modes)',
    ctaPresetPlaceholder: '选择预设模式 (当前为手动输入)…',
    verifyBlankingLegend: '3. 消隐与总时序规格 (Blanking & Total Timing)',
    manualOverrideLabel: '根据面板规格书手动指定 H_total / V_total (Manual Override)',
    manualTimingSource: '用户自定义时序 (Manual H_total / V_total)',
    errWidthPositiveInt: '水平有效像素 (H_active) 必须为正整数。',
    errHeightPositiveInt: '垂直有效行数 (V_active) 必须为正整数。',
    errFpsPositive: '刷新率 (Frame Rate) 必须大于 0。',
    errHTotalMin: 'H_total 必须为大于或等于 H_active 的整数。',
    errVTotalMin: 'V_total 必须为大于或等于 V_active 的整数。',

    exploreSweepLegend: '2. 扫描探索参数 (Sweep Parameters)',
    exploreTargetFpsLabel: '目标刷新率 (Target Frame Rate, Hz)',
    exploreShowFailedLabel: '同时显示不合规 (FAIL) 的候选分辨率',
    exploreErrFpsPositive: '目标刷新率 (Frame Rate) 必须大于 0。',
    exploreMaxAchievableTitle: (w, h, fps) => `最大可支持分辨率: ${w}×${h} @ ${fps}Hz`,
    exploreNoCandidateTitle: (fps) => `在 ${fps}Hz 条件下没有可输出的候选分辨率。`,
    exploreSummaryText: (total, passCount, failCount) =>
      `共 ${total} 个候选分辨率：合规 (PASS) ${passCount} 个 · 超限 (FAIL) ${failCount} 个（点击任意行可在下方查看详细公式推导）`,
    exploreSection1Title: '1. 候选分辨率合规性评估矩阵 (Candidate Resolution Matrix)',
    exploreSection1Tag: '点击表格行可更新下方详细公式推导',
    exploreColResolution: '候选分辨率',
    exploreColTimingSpec: '适用时序标准',
    exploreColPixelClock: '像素时钟',
    exploreColBottleneck: '核心瓶颈项 (Primary Bottleneck)',
    exploreColActualLimit: '需求值 / 上限值',
    exploreColMargin: '余量裕度',
    exploreColVerdict: '判定',
    exploreSection2Title: (w, h, fps) => `2. 所选分辨率公式与代入详细分析: ${w}×${h} @ ${fps}Hz`,

    mstLinkConfigLegend: '1. DP MST 物理链路配置 (Physical Link Config)',
    mstTargetSocLabel: '目标处理器 (支持 DP MST 的 SoC)',
    mstFecOverheadSuffix: '(应用 MST + FEC 3% 开销)',
    mstTopologyLegend: (max) => `2. Virtual Channel 虚拟通道流拓扑 (最多 ${max} 路)`,
    mstLoadReferenceBtn: '加载 TRM 10.1.1 参考拓扑 (4K@60 × 1 + FHD@60 × 3)',
    mstAddStreamBtn: (cur, max) => `+ 添加虚拟通道视频流 (${cur}/${max})`,
    mstRemoveStreamBtn: '移除该流',
    mstPresetLabel: '应用 CTA-861 标准预设',
    mstPresetPlaceholder: '选择预设…',
    mstStreamError: (idx) => `视频流 #${idx}: 请正确输入 H_active、V_active 与刷新率 (Frame Rate)。`,
    mstVerdictPassTitle: (count) => `支持 ${count} 路 DP MST 视频流同时输出。`,
    mstVerdictFailTitle: '多流累计需求超出 DP MST 物理链路带宽或时隙 (Time Slot) 容量上限。',
    mstVerdictSummary: (slots, tuSlots, actualGbps, maxGbps) =>
      `总分配时隙: ${slots} / 63 slots · 总 TU 符号槽: ${tuSlots} / 64 slots · 总需求带宽: ${actualGbps} / ${maxGbps} Gbps`,
    mstKpiTimeSlotsSub: '1 MTP = 64 slots (扣除 1 个控制头时隙)',
    mstKpiTuSymbolsSub: '依据 TRM 10.1.1 表 10.4',
    mstKpiPayloadSub: (maxGbps) => `链路有效上限 ${maxGbps} Gbps`,
    mstKpiPbnSub: (pbnPerSlot) => `单时隙容量 ${pbnPerSlot} PBN/slot (表 2)`,
    mstSection1Title: '1. 物理链路累计约束与公式推导 (Aggregate Link Constraints & Formulas)',
    mstColAggregateItem: '累计验证项',
    mstColAggregateActual: '累计需求值 (Actual)',
    mstColLinkLimit: '链路允许上限 (Limit)',
    mstColUtilization: '占用率',
    mstColMargin: '余量裕度',
    mstColVerdict: '判定',
    mstFormulaCardTitle: (name) => `${name} 计算推导`,
    mstTagInequality: '判定不等式',
    mstTagSumSubstitution: '累计值代入',
    mstTagLimitSubstitution: '上限值代入',
    mstSection2Title: '2. 各虚拟通道流 PBN · 时隙 (Time Slot) · TU 符号详细计算',
    mstSection2Tag: (count) => `共 ${count} 路视频流`,
    mstColVcChannel: 'VC 通道',
    mstColResTiming: '分辨率与时序标准',
    mstColReqBandwidth: '需求带宽',
    mstColAllocPbn: '分配 PBN',
    mstColMstSlot: 'MST 时隙',
    mstColTuSymbol: 'TU 符号槽 (10.1.1)',
    mstStreamFormulaTitle: (idx, w, h, fps, hTotal, vTotal) =>
      `VC 视频流 #${idx} (${w}×${h} @ ${fps}Hz, Total ${hTotal}×${vTotal}) 公式代入推导`,

    unsupportedTitle: '当前所选 SoC 架构不支持该显示输出接口。',
    unsupportedDesc: '请在左侧目标架构设置中选择受支持的 SoC 与输出接口组合。',
    verdictCompliant: 'COMPLIANT (合规)',
    verdictNonCompliant: 'NON-COMPLIANT (超限)',
    verdictPassHeadline: '满足所有 VIOC 硬件与接口链路带宽约束。',
    verdictFailHeadline: '超出 VIOC 硬件或接口链路带宽上限。',
    verdictPassDetail: (name, util, margin) =>
      `最小余量项 (主要瓶颈): ${name} · 占用率 ${util}% (剩余裕度 ${margin})`,
    verdictFailDetailPrefix: '超限项',
    kpiPixelClock: 'PIXEL CLOCK (像素时钟)',
    kpiActiveBlanking: 'ACTIVE / BLANKING (有效/消隐比)',
    kpiPrimaryBottleneck: 'PRIMARY BOTTLENECK (主要瓶颈)',
    kpiPeakUtilization: 'PEAK UTILIZATION / HEADROOM',
    resultSection1Title: '1. 时序与像素时钟推导公式 (Timing & Pixel Clock Derivation)',
    totalResCardTitle: '总分辨率计算 (H_total × V_total)',
    pixelClockCardTitle: '像素时钟计算 (Pixel Clock)',
    dpTuCardTitle: 'DisplayPort 传输单元 (TU) 所需符号槽数 (TRM 10.1.1 表 10.4)',
    dpMstPbnCardTitle: 'DP MST 有效载荷带宽数 (PBN) 与时隙计算 (表 2~4)',
    dpMstPbnSubstitution: (pbnPerSlot, linkRate, lanes, mstPbn, mstSlots) =>
      `每时隙 ${pbnPerSlot} PBN (${linkRate} × ${lanes} lanes) → 视频流需求 ${mstPbn} PBN → 分配 ${mstSlots} 个时隙 (Time Slots)`,
    tagAppliedFormula: '适用公式',
    tagValueSubstitution: '数值代入',
    resultSection2Title: '2. 约束条件合规性矩阵 (Constraint Compliance Matrix)',
    resultSection2Tag: (count) => `共验证 ${count} 项约束`,
    colConstraint: '验证项 (Constraint)',
    colActual: '计算需求值 (Actual)',
    colLimit: '允许上限值 (Limit)',
    colUtilization: '链路/资源占用率',
    colMargin: '余量裕度',
    colVerdict: '判定',
    miniBadgeBottleneck: '瓶颈',
    resultSection3Title: '3. 各约束项公式与数值代入详细推导 (Detailed Formula & Substitution Breakdown)',
    resultSection3Tag: '逐项分步验证',
    primaryBottleneckBadge: 'PRIMARY BOTTLENECK',
    formulaPillSummary: (actual, limit, util, margin) => `${actual} ≤ ${limit} (占用率 ${util}% · 余量 ${margin})`,
    tagInequality: '判定不等式',
    tagActualSubstitution: '需求值代入',
    tagLimitSubstitution: '上限值代入',
    specBasisNote: (source) => `规范依据: ${source}`,
    unitPixels: '像素',
  },

  fr: {
    brandSubtitle: 'Banc de vérification du timing, de la bande passante et des formules du sous-système VIOC SoC automobile',
    metaActiveTarget: 'CIBLE ACTIVE',
    metaSpecBaseline: 'RÉFÉRENCE SPÉC.',
    metaLanguage: 'LANGUE',
    specSource: 'Wiki Calculateur de résolution max v22 · Manuel d’interface 10.1 · BD bande passante DP v5',
    navAriaLabel: 'Sélectionner le mode d’analyse',
    tabs: {
      verify: {
        title: 'Vérification Timing & Bande Passante (Flux Unique)',
        subtitle: 'Single-Stream Timing & Bandwidth Compliance',
      },
      explore: {
        title: 'Explorateur de Résolution Maximale',
        subtitle: 'Maximum Achievable Resolution Explorer',
      },
      mst: {
        title: 'Simulateur Multi-Flux DP MST',
        subtitle: 'Multi-Stream PBN & Time Slot Topology Analyzer',
      },
    },
    outputLabels: {
      dp: 'DisplayPort 1.4 (SST / MST)',
      dsi: 'MIPI DSI-2 (D-PHY v2.0)',
      lvdsSingle: 'OpenLDI Single LVDS (4 voies)',
      lvdsDual: 'OpenLDI Dual LVDS (8 voies)',
      hdmi: 'HDMI 2.0 (TMDS)',
    },
    fallbackLabels: {
      wikiCustom: 'Custom Reduced Blanking (H +80px, V +6 lignes)',
      cvtRbV2: 'VESA CVT-RB v2 (Reduced Blanking v2)',
      blankFactor20: 'Facteur de blanking 20 % (Active × 1.2, TRM 10.1.3)',
    },
    scalerLabels: {
      off: 'Bypass (Scaler VIOC désactivé · connexion directe DISP)',
      '4k': 'Mode tampon de ligne 4K (Largeur sortie ≤ 4088 px)',
      '2k': 'Mode tampon de ligne 2K (Largeur sortie ≤ 2048 px)',
    },
    dpModeLabels: {
      sst: 'SST (Single-Stream Transport)',
      mst: 'MST (Multi-Stream Transport · PBN / Time Slot)',
    },
    hdmiFormatLabels: {
      rgb_yuv444_8bpc: 'RGB / YCbCr 4:4:4 (8-bpc, 24 bpp · TMDS 30 bits/px)',
      yuv422_8bpc: 'YCbCr 4:2:2 (8-bpc · TMDS 30 bits/px)',
      yuv420_8bpc: 'YCbCr 4:2:0 (8-bpc, 1/2 Pixel Clock · TMDS 15 bits/px)',
    },
    targetLegend: '1. Architecture Cible (SoC & Interface)',
    targetSocLabel: 'Processeur cible (SoC)',
    targetOutputLabel: 'Interface de sortie d’affichage',
    fallbackSelectLabel: 'Modèle de blanking hors standard (si absent de CTA-861)',
    optionsLegend: '4. Configuration Sous-système & Liaison (VIOC & Link Config)',
    scalerPipelineLabel: 'Configuration du pipeline VIOC Scaler',
    dpTransportModeLabel: 'Mode de transport DisplayPort',
    linkRateGradeLabel: 'Calibre Link Rate',
    laneCountLabel: 'Nombre de voies (Lanes)',
    fecEnableLabel: 'Activer FEC (Forward Error Correction)',
    fecMandatoryDscSuffix: '(Obligatoire avec DSC)',
    sscEnableLabel: 'Activer SSC (Spread Spectrum Clocking · marge -0,5 %)',
    dscEnableLabel: 'Activer la compression DSC (Display Stream Compression)',
    dscTargetBppLabel: 'Débit binaire compressé cible DSC (bpp_compressed)',
    compressionRatio: (ratio) => `Ratio ${ratio}:1`,
    dsiDataLanesLabel: 'Voies de données MIPI D-PHY (Data Lanes)',
    physicalBandwidth: (gbps) => `BP physique ${gbps} Gbps`,
    dsiEvbSerdesLabel: 'Appliquer la limite EVB SerDes (Max 4,8 Gbps · TRM 10.1.2)',
    hdmiFormatSelectLabel: 'Format d’encodage pixel HDMI 2.0 (TRM 10.1.4)',

    verifyTimingLegend: '2. Paramètres de Timing Vidéo',
    ctaPresetLabel: 'Préréglages standard CTA-861 (Modes VIC)',
    ctaPresetPlaceholder: 'Choisir un préréglage (saisie manuelle)…',
    verifyBlankingLegend: '3. Spécification de Blanking & Timing Total',
    manualOverrideLabel: 'Saisie manuelle H_total / V_total (Fiche technique dalle)',
    manualTimingSource: 'Timing personnalisé (H_total / V_total manuel)',
    errWidthPositiveInt: 'La résolution horizontale (H_active) doit être un entier positif.',
    errHeightPositiveInt: 'La résolution verticale (V_active) doit être un entier positif.',
    errFpsPositive: 'La fréquence d’images (Frame Rate) doit être supérieure à 0.',
    errHTotalMin: 'H_total doit être un entier supérieur ou égal à H_active.',
    errVTotalMin: 'V_total doit être un entier supérieur ou égal à V_active.',

    exploreSweepLegend: '2. Paramètres d’Exploration (Sweep Parameters)',
    exploreTargetFpsLabel: 'Fréquence d’images cible (Hz)',
    exploreShowFailedLabel: 'Afficher également les résolutions non conformes (FAIL)',
    exploreErrFpsPositive: 'La fréquence d’images cible (Hz) doit être supérieure à 0.',
    exploreMaxAchievableTitle: (w, h, fps) => `Résolution maximale supportée : ${w}×${h} @ ${fps}Hz`,
    exploreNoCandidateTitle: (fps) => `Aucune résolution candidate supportée à ${fps}Hz.`,
    exploreSummaryText: (total, passCount, failCount) =>
      `${passCount} PASS · ${failCount} FAIL sur ${total} candidats (Cliquez sur une ligne pour afficher le détail des formules ci-dessous)`,
    exploreSection1Title: '1. Matrice d’Éligibilité des Résolutions Candidates',
    exploreSection1Tag: 'Cliquez sur une ligne pour mettre à jour les formules ci-dessous',
    exploreColResolution: 'Résolution',
    exploreColTimingSpec: 'Norme de Timing',
    exploreColPixelClock: 'Pixel Clock',
    exploreColBottleneck: 'Goulot d’étranglement principal',
    exploreColActualLimit: 'Requis / Limite',
    exploreColMargin: 'Marge',
    exploreColVerdict: 'Verdict',
    exploreSection2Title: (w, h, fps) => `2. Analyse Détaillée des Formules : ${w}×${h} @ ${fps}Hz`,

    mstLinkConfigLegend: '1. Configuration Physique de la Liaison DP MST',
    mstTargetSocLabel: 'Processeur cible (SoC compatible DP MST)',
    mstFecOverheadSuffix: '(Surcharge MST + FEC de 3 % appliquée)',
    mstTopologyLegend: (max) => `2. Topologie des Flux Virtual Channel (Jusqu’à ${max}ch)`,
    mstLoadReferenceBtn: 'Charger la topologie de référence TRM 10.1.1 (4K@60 × 1 + FHD@60 × 3)',
    mstAddStreamBtn: (cur, max) => `+ Ajouter un flux Virtual Channel (${cur}/${max})`,
    mstRemoveStreamBtn: 'Supprimer le flux',
    mstPresetLabel: 'Appliquer un préréglage CTA-861',
    mstPresetPlaceholder: 'Choisir un préréglage…',
    mstStreamError: (idx) => `Flux #${idx} : Veuillez saisir des valeurs valides pour H_active, V_active et Frame Rate.`,
    mstVerdictPassTitle: (count) => `La sortie simultanée de ${count} flux DP MST est supportée.`,
    mstVerdictFailTitle: 'La demande cumulée dépasse la bande passante ou la capacité en Time Slots de la liaison DP MST.',
    mstVerdictSummary: (slots, tuSlots, actualGbps, maxGbps) =>
      `Time Slots totaux : ${slots} / 63 slots · Symboles TU totaux : ${tuSlots} / 64 slots · Bande passante totale : ${actualGbps} / ${maxGbps} Gbps`,
    mstKpiTimeSlotsSub: '1 MTP = 64 slots (hors 1 slot d’en-tête)',
    mstKpiTuSymbolsSub: 'Selon TRM 10.1.1 Tableau 10.4',
    mstKpiPayloadSub: (maxGbps) => `Limite liaison ${maxGbps} Gbps`,
    mstKpiPbnSub: (pbnPerSlot) => `Capacité ${pbnPerSlot} PBN/slot (Tableau 2)`,
    mstSection1Title: '1. Contraintes Cumulées de la Liaison & Formules',
    mstColAggregateItem: 'Contrainte cumulée',
    mstColAggregateActual: 'Demande cumulée (Actual)',
    mstColLinkLimit: 'Limite liaison (Limit)',
    mstColUtilization: 'Utilisation',
    mstColMargin: 'Marge',
    mstColVerdict: 'Verdict',
    mstFormulaCardTitle: (name) => `Détail du calcul — ${name}`,
    mstTagInequality: 'Inégalité',
    mstTagSumSubstitution: 'Somme substituée',
    mstTagLimitSubstitution: 'Limite substituée',
    mstSection2Title: '2. Détail par Flux Virtual Channel (PBN · Time Slot · Symboles TU)',
    mstSection2Tag: (count) => `${count} flux actif(s)`,
    mstColVcChannel: 'Canal VC',
    mstColResTiming: 'Résolution & Timing',
    mstColReqBandwidth: 'BP requise',
    mstColAllocPbn: 'PBN alloué',
    mstColMstSlot: 'MST Time Slot',
    mstColTuSymbol: 'Symboles TU (10.1.1)',
    mstStreamFormulaTitle: (idx, w, h, fps, hTotal, vTotal) =>
      `Flux VC #${idx} (${w}×${h} @ ${fps}Hz, Total ${hTotal}×${vTotal}) — Détail des formules`,

    unsupportedTitle: 'L’interface de sortie sélectionnée n’est pas prise en charge par ce SoC.',
    unsupportedDesc: 'Veuillez sélectionner une combinaison SoC / interface valide dans le panneau de gauche.',
    verdictCompliant: 'COMPLIANT (CONFORME)',
    verdictNonCompliant: 'NON-COMPLIANT (NON CONFORME)',
    verdictPassHeadline: 'Respecte toutes les contraintes matérielles et de bande passante.',
    verdictFailHeadline: 'Dépasse les limites matérielles ou de bande passante de la liaison.',
    verdictPassDetail: (name, util, margin) =>
      `Goulot principal : ${name} · Utilisation ${util}% (Marge ${margin})`,
    verdictFailDetailPrefix: 'Contraintes en échec',
    kpiPixelClock: 'PIXEL CLOCK',
    kpiActiveBlanking: 'RATIO ACTIVE / BLANKING',
    kpiPrimaryBottleneck: 'GOULOT PRINCIPAL',
    kpiPeakUtilization: 'UTILISATION MAX / MARGE',
    resultSection1Title: '1. Dérivation du Timing et de l’Horloge Pixel (Pixel Clock)',
    totalResCardTitle: 'Calcul de la résolution totale (H_total × V_total)',
    pixelClockCardTitle: 'Calcul de l’horloge pixel (Pixel Clock)',
    dpTuCardTitle: 'Slots de symboles DisplayPort Transfer Unit (TU) (TRM 10.1.1 Tableau 10.4)',
    dpMstPbnCardTitle: 'DP MST Payload Bandwidth Number (PBN) & Time Slot (Tableaux 2~4)',
    dpMstPbnSubstitution: (pbnPerSlot, linkRate, lanes, mstPbn, mstSlots) =>
      `${pbnPerSlot} PBN/slot (${linkRate} × ${lanes} voies) → Demande du flux ${mstPbn} PBN → ${mstSlots} Time Slots alloués`,
    tagAppliedFormula: 'Formule',
    tagValueSubstitution: 'Substitution',
    resultSection2Title: '2. Matrice de Conformité des Contraintes',
    resultSection2Tag: (count) => `${count} contraintes vérifiées`,
    colConstraint: 'Contrainte',
    colActual: 'Valeur requise (Actual)',
    colLimit: 'Valeur limite (Limit)',
    colUtilization: 'Utilisation',
    colMargin: 'Marge',
    colVerdict: 'Verdict',
    miniBadgeBottleneck: 'Goulot',
    resultSection3Title: '3. Détail des Formules et Substitutions par Contrainte',
    resultSection3Tag: 'Vérification étape par étape',
    primaryBottleneckBadge: 'GOULOT PRINCIPAL',
    formulaPillSummary: (actual, limit, util, margin) => `${actual} ≤ ${limit} (Util. ${util}% · Marge ${margin})`,
    tagInequality: 'Inégalité',
    tagActualSubstitution: 'Substitution requise',
    tagLimitSubstitution: 'Substitution limite',
    specBasisNote: (source) => `Source de spécification : ${source}`,
    unitPixels: 'pixels',
  },

  de: {
    brandSubtitle: 'Automotive-SoC Display-Subsystem Timing-, Verbindungsbandbreiten- & Formel-Prüfwerkbank',
    metaActiveTarget: 'AKTIVES ZIELSYSTEM',
    metaSpecBaseline: 'SPEZIFIKATIONSBASIS',
    metaLanguage: 'SPRACHE',
    specSource: 'Max-Auflösungs-Rechner Wiki v22 · Schnittstellen-Handbuch 10.1 · DP-Bandbreiten-DB v5',
    navAriaLabel: 'Analysemodus auswählen',
    tabs: {
      verify: {
        title: 'Einzelstream Timing- & Bandbreitenprüfung',
        subtitle: 'Single-Stream Timing & Bandwidth Compliance',
      },
      explore: {
        title: 'Maximalauflösungs-Explorer',
        subtitle: 'Maximum Achievable Resolution Explorer',
      },
      mst: {
        title: 'DP MST Multi-Stream-Simulator',
        subtitle: 'Multi-Stream PBN & Time Slot Topology Analyzer',
      },
    },
    outputLabels: {
      dp: 'DisplayPort 1.4 (SST / MST)',
      dsi: 'MIPI DSI-2 (D-PHY v2.0)',
      lvdsSingle: 'OpenLDI Single LVDS (4-Lane)',
      lvdsDual: 'OpenLDI Dual LVDS (8-Lane)',
      hdmi: 'HDMI 2.0 (TMDS)',
    },
    fallbackLabels: {
      wikiCustom: 'Custom Reduced Blanking (H +80px, V +6 Zeilen)',
      cvtRbV2: 'VESA CVT-RB v2 (Reduced Blanking v2)',
      blankFactor20: 'Blanking-Faktor 20 % (Active × 1.2, TRM 10.1.3)',
    },
    scalerLabels: {
      off: 'Bypass (VIOC Scaler deaktiviert · direkte DISP-Anbindung)',
      '4k': '4K-Zeilenpuffermodus (Ausgabebreite ≤ 4088 px)',
      '2k': '2K-Zeilenpuffermodus (Ausgabebreite ≤ 2048 px)',
    },
    dpModeLabels: {
      sst: 'SST (Single-Stream Transport)',
      mst: 'MST (Multi-Stream Transport · PBN / Time Slot)',
    },
    hdmiFormatLabels: {
      rgb_yuv444_8bpc: 'RGB / YCbCr 4:4:4 (8-bpc, 24 bpp · TMDS 30 bits/px)',
      yuv422_8bpc: 'YCbCr 4:2:2 (8-bpc · TMDS 30 bits/px)',
      yuv420_8bpc: 'YCbCr 4:2:0 (8-bpc, 1/2 Pixeltakt · TMDS 15 bits/px)',
    },
    targetLegend: '1. Zielarchitektur (Target SoC & Interface)',
    targetSocLabel: 'Zielprozessor (SoC)',
    targetOutputLabel: 'Display-Ausgabeschnittstelle',
    fallbackSelectLabel: 'Fallback-Austastmodell (falls nicht in CTA-861)',
    optionsLegend: '4. Subsystem- & Verbindungskonfiguration (VIOC & Link Config)',
    scalerPipelineLabel: 'VIOC Scaler Pipeline-Modus',
    dpTransportModeLabel: 'DisplayPort-Übertragungsmodus',
    linkRateGradeLabel: 'Link-Rate-Stufe',
    laneCountLabel: 'Anzahl der Lanes',
    fecEnableLabel: 'FEC (Forward Error Correction) aktivieren',
    fecMandatoryDscSuffix: '(Pflicht bei aktiviertem DSC)',
    sscEnableLabel: 'SSC (Spread Spectrum Clocking · 0,5 % Margenabzug)',
    dscEnableLabel: 'DSC-Komprimierung (Display Stream Compression) aktivieren',
    dscTargetBppLabel: 'DSC-Ziel-Kompressionsbitrate (bpp_compressed)',
    compressionRatio: (ratio) => `Kompressionsrate ${ratio}:1`,
    dsiDataLanesLabel: 'MIPI D-PHY Data Lanes',
    physicalBandwidth: (gbps) => `Phys. Bandbreite ${gbps} Gbps`,
    dsiEvbSerdesLabel: 'EVB SerDes-Bandbreitenbegrenzung anwenden (Max. 4,8 Gbps · TRM 10.1.2)',
    hdmiFormatSelectLabel: 'HDMI 2.0 Pixel-Codierungsformat (TRM 10.1.4)',

    verifyTimingLegend: '2. Video-Timing-Parameter',
    ctaPresetLabel: 'CTA-861 Standard-Presets (VIC-Modi)',
    ctaPresetPlaceholder: 'Preset wählen (manuelle Eingabe aktiv)…',
    verifyBlankingLegend: '3. Austastung & Gesamt-Timing (Blanking & Total Timing)',
    manualOverrideLabel: 'Manuelle H_total / V_total Vorgabe (Panel-Datenblatt)',
    manualTimingSource: 'Benutzerdefiniertes Timing (Manuelles H_total / V_total)',
    errWidthPositiveInt: 'Horizontale Auflösung (H_active) muss eine positive ganze Zahl sein.',
    errHeightPositiveInt: 'Vertikale Auflösung (V_active) muss eine positive ganze Zahl sein.',
    errFpsPositive: 'Bildwiederholrate (Frame Rate) muss größer als 0 sein.',
    errHTotalMin: 'H_total muss eine ganze Zahl größer oder gleich H_active sein.',
    errVTotalMin: 'V_total muss eine ganze Zahl größer oder gleich V_active sein.',

    exploreSweepLegend: '2. Suchparameter (Sweep Parameters)',
    exploreTargetFpsLabel: 'Ziel-Bildwiederholrate (Target Frame Rate, Hz)',
    exploreShowFailedLabel: 'Nicht konforme (FAIL) Kandidaten ebenfalls anzeigen',
    exploreErrFpsPositive: 'Ziel-Bildwiederholrate (Hz) muss größer als 0 sein.',
    exploreMaxAchievableTitle: (w, h, fps) => `Maximal unterstützte Auflösung: ${w}×${h} @ ${fps}Hz`,
    exploreNoCandidateTitle: (fps) => `Keine unterstützte Kandidatenauflösung bei ${fps}Hz gefunden.`,
    exploreSummaryText: (total, passCount, failCount) =>
      `${passCount} PASS · ${failCount} FAIL von ${total} Kandidaten (Klicken Sie auf eine Zeile für die detaillierte Formelableitung unten)`,
    exploreSection1Title: '1. Bewertungsmatrix der Kandidatenauflösungen',
    exploreSection1Tag: 'Zeile anklicken, um die Formelanalyse unten zu aktualisieren',
    exploreColResolution: 'Auflösung',
    exploreColTimingSpec: 'Timing-Standard',
    exploreColPixelClock: 'Pixeltakt',
    exploreColBottleneck: 'Primärer Engpass (Bottleneck)',
    exploreColActualLimit: 'Bedarf / Limit',
    exploreColMargin: 'Reserve',
    exploreColVerdict: 'Ergebnis',
    exploreSection2Title: (w, h, fps) => `2. Detaillierte Formel- & Einsetzungsanalyse: ${w}×${h} @ ${fps}Hz`,

    mstLinkConfigLegend: '1. Physische DP-MST-Verbindungskonfiguration',
    mstTargetSocLabel: 'Zielprozessor (DP-MST-fähiges SoC)',
    mstFecOverheadSuffix: '(3 % MST + FEC Overhead angewendet)',
    mstTopologyLegend: (max) => `2. Virtual-Channel-Stream-Topologie (Max. ${max} Kanäle)`,
    mstLoadReferenceBtn: 'TRM 10.1.1 Referenztopologie laden (4K@60 × 1 + FHD@60 × 3)',
    mstAddStreamBtn: (cur, max) => `+ Virtual-Channel-Stream hinzufügen (${cur}/${max})`,
    mstRemoveStreamBtn: 'Stream entfernen',
    mstPresetLabel: 'CTA-861 Standard-Preset anwenden',
    mstPresetPlaceholder: 'Preset auswählen…',
    mstStreamError: (idx) => `Stream #${idx}: Bitte gültige Werte für H_active, V_active und Frame Rate eingeben.`,
    mstVerdictPassTitle: (count) => `Gleichzeitige Ausgabe von ${count} DP-MST-Streams wird unterstützt.`,
    mstVerdictFailTitle: 'Der kumulierte Bedarf überschreitet die DP-MST-Bandbreite oder Time-Slot-Kapazität.',
    mstVerdictSummary: (slots, tuSlots, actualGbps, maxGbps) =>
      `Gesamt-Time-Slots: ${slots} / 63 slots · Gesamt-TU-Symbole: ${tuSlots} / 64 slots · Gesamtbandbreite: ${actualGbps} / ${maxGbps} Gbps`,
    mstKpiTimeSlotsSub: '1 MTP = 64 slots (exkl. 1 Header-Slot)',
    mstKpiTuSymbolsSub: 'Gemäß TRM 10.1.1 Tabelle 10.4',
    mstKpiPayloadSub: (maxGbps) => `Verbindungslimit ${maxGbps} Gbps`,
    mstKpiPbnSub: (pbnPerSlot) => `Kapazität ${pbnPerSlot} PBN/slot (Tabelle 2)`,
    mstSection1Title: '1. Kumulierte Verbindungsgrenzen & Formelableitung',
    mstColAggregateItem: 'Kumuliertes Prüfkriterium',
    mstColAggregateActual: 'Kumulierter Bedarf (Actual)',
    mstColLinkLimit: 'Verbindungslimit (Limit)',
    mstColUtilization: 'Auslastung',
    mstColMargin: 'Reserve',
    mstColVerdict: 'Ergebnis',
    mstFormulaCardTitle: (name) => `Berechnungsableitung — ${name}`,
    mstTagInequality: 'Ungleichung',
    mstTagSumSubstitution: 'Summeneinsetzung',
    mstTagLimitSubstitution: 'Limiteinsetzung',
    mstSection2Title: '2. Pro-Stream-Aufschlüsselung (PBN · Time Slot · TU-Symbole)',
    mstSection2Tag: (count) => `${count} Stream(s) aktiv`,
    mstColVcChannel: 'VC-Kanal',
    mstColResTiming: 'Auflösung & Timing',
    mstColReqBandwidth: 'Bandbreite',
    mstColAllocPbn: 'Zugewiesene PBN',
    mstColMstSlot: 'MST Time Slot',
    mstColTuSymbol: 'TU-Symbole (10.1.1)',
    mstStreamFormulaTitle: (idx, w, h, fps, hTotal, vTotal) =>
      `VC Stream #${idx} (${w}×${h} @ ${fps}Hz, Total ${hTotal}×${vTotal}) — Formelableitung`,

    unsupportedTitle: 'Die gewählte Ausgabeschnittstelle wird von dieser SoC-Architektur nicht unterstützt.',
    unsupportedDesc: 'Bitte wählen Sie links eine unterstützte SoC- und Schnittstellenkombination.',
    verdictCompliant: 'COMPLIANT (KONFORM)',
    verdictNonCompliant: 'NON-COMPLIANT (NICHT KONFORM)',
    verdictPassHeadline: 'Erfüllt alle Hardware- und Verbindungsbandbreiten-Vorgaben.',
    verdictFailHeadline: 'Überschreitet Hardware- oder Verbindungsbandbreiten-Grenzwerte.',
    verdictPassDetail: (name, util, margin) =>
      `Primärer Engpass: ${name} · Auslastung ${util}% (Reserve ${margin})`,
    verdictFailDetailPrefix: 'Verletzte Kriterien',
    kpiPixelClock: 'PIXEL CLOCK (PIXELTAKT)',
    kpiActiveBlanking: 'ACTIVE / BLANKING ANTEIL',
    kpiPrimaryBottleneck: 'PRIMÄRER ENGPASS',
    kpiPeakUtilization: 'SPITZENLAST / RESERVE',
    resultSection1Title: '1. Timing- & Pixeltakt-Herleitung (Timing & Pixel Clock Derivation)',
    totalResCardTitle: 'Gesamtauflösung (H_total × V_total)',
    pixelClockCardTitle: 'Pixeltakt-Berechnung (Pixel Clock)',
    dpTuCardTitle: 'DisplayPort Transfer Unit (TU) benötigte Symbol-Slots (TRM 10.1.1 Tabelle 10.4)',
    dpMstPbnCardTitle: 'DP MST Payload Bandwidth Number (PBN) & Time Slot (Tabelle 2~4)',
    dpMstPbnSubstitution: (pbnPerSlot, linkRate, lanes, mstPbn, mstSlots) =>
      `${pbnPerSlot} PBN/Slot (${linkRate} × ${lanes} Lanes) → Stream-Bedarf ${mstPbn} PBN → ${mstSlots} Time Slots zugewiesen`,
    tagAppliedFormula: 'Formel',
    tagValueSubstitution: 'Einsetzung',
    resultSection2Title: '2. Konformitätsmatrix der Grenzwerte (Constraint Compliance Matrix)',
    resultSection2Tag: (count) => `${count} Kriterien geprüft`,
    colConstraint: 'Prüfkriterium (Constraint)',
    colActual: 'Anforderung (Actual)',
    colLimit: 'Grenzwert (Limit)',
    colUtilization: 'Auslastung',
    colMargin: 'Reserve',
    colVerdict: 'Ergebnis',
    miniBadgeBottleneck: 'Engpass',
    resultSection3Title: '3. Detaillierte Formel- und Einsetzungsanalyse pro Kriterium',
    resultSection3Tag: 'Schritt-für-Schritt-Prüfung',
    primaryBottleneckBadge: 'PRIMÄRER ENGPASS',
    formulaPillSummary: (actual, limit, util, margin) => `${actual} ≤ ${limit} (Last ${util}% · Reserve ${margin})`,
    tagInequality: 'Ungleichung',
    tagActualSubstitution: 'Istwert-Einsetzung',
    tagLimitSubstitution: 'Grenzwert-Einsetzung',
    specBasisNote: (source) => `Spezifikationsgrundlage: ${source}`,
    unitPixels: 'Pixel',
  },
}

const CONSTRAINT_NAME_MAP: Record<string, Record<LangCode, string>> = {
  'DISP 출력 Width': {
    kr: 'DISP 출력 Width',
    en: 'DISP Output Width',
    jp: 'DISP 出力 Width',
    ch: 'DISP 输出宽度 (Width)',
    fr: 'Largeur de sortie DISP',
    de: 'DISP-Ausgabebreite (Width)',
  },
  'DISP 출력 Height': {
    kr: 'DISP 출력 Height',
    en: 'DISP Output Height',
    jp: 'DISP 出力 Height',
    ch: 'DISP 输出高度 (Height)',
    fr: 'Hauteur de sortie DISP',
    de: 'DISP-Ausgabehöhe (Height)',
  },
  'DISP 픽셀 총량': {
    kr: 'DISP 픽셀 총량',
    en: 'DISP Total Active Pixels',
    jp: 'DISP 総ピクセル数',
    ch: 'DISP 有效像素总量',
    fr: 'Total de pixels actifs DISP',
    de: 'DISP Gesamt-Pixelanzahl',
  },
  'Scaler 출력 Width': {
    kr: 'Scaler 출력 Width',
    en: 'Scaler Output Width',
    jp: 'Scaler 出力 Width',
    ch: 'Scaler 输出宽度 (Width)',
    fr: 'Largeur de sortie Scaler',
    de: 'Scaler-Ausgabebreite (Width)',
  },
  'Scaler 출력 Height': {
    kr: 'Scaler 출력 Height',
    en: 'Scaler Output Height',
    jp: 'Scaler 出力 Height',
    ch: 'Scaler 输出高度 (Height)',
    fr: 'Hauteur de sortie Scaler',
    de: 'Scaler-Ausgabehöhe (Height)',
  },
  'DP SST 대역폭': {
    kr: 'DP SST 대역폭',
    en: 'DP SST Payload Bandwidth',
    jp: 'DP SST 帯域幅',
    ch: 'DP SST 有效带宽',
    fr: 'Bande passante DP SST',
    de: 'DP SST Nutzbandbreite',
  },
  'DP MST 대역폭': {
    kr: 'DP MST 대역폭',
    en: 'DP MST Payload Bandwidth',
    jp: 'DP MST 帯域幅',
    ch: 'DP MST 有效带宽',
    fr: 'Bande passante DP MST',
    de: 'DP MST Nutzbandbreite',
  },
  'DP MST Time Slot': {
    kr: 'DP MST Time Slot',
    en: 'DP MST Time Slot',
    jp: 'DP MST Time Slot',
    ch: 'DP MST 时隙 (Time Slot)',
    fr: 'Time Slot DP MST',
    de: 'DP MST Time Slot',
  },
  'DP TU 심볼 슬롯': {
    kr: 'DP TU 심볼 슬롯',
    en: 'DP TU Symbol Slots',
    jp: 'DP TU シンボルスロット',
    ch: 'DP TU 符号槽 (Symbol Slots)',
    fr: 'Slots de symboles DP TU',
    de: 'DP TU Symbol-Slots',
  },
  'DP MST 합산 Time Slot': {
    kr: 'DP MST 합산 Time Slot',
    en: 'DP MST Aggregate Time Slots',
    jp: 'DP MST 合算 Time Slot',
    ch: 'DP MST 累计时隙 (Time Slots)',
    fr: 'Time Slots cumulés DP MST',
    de: 'DP MST Kumulierte Time Slots',
  },
  'DP MST 합산 대역폭': {
    kr: 'DP MST 합산 대역폭',
    en: 'DP MST Aggregate Bandwidth',
    jp: 'DP MST 合算帯域幅',
    ch: 'DP MST 累计有效带宽',
    fr: 'Bande passante cumulée DP MST',
    de: 'DP MST Kumulierte Bandbreite',
  },
  'DP TU 합산 심볼 슬롯': {
    kr: 'DP TU 합산 심볼 슬롯',
    en: 'DP TU Aggregate Symbol Slots',
    jp: 'DP TU 合算シンボルスロット',
    ch: 'DP TU 累计符号槽',
    fr: 'Slots de symboles cumulés DP TU',
    de: 'DP TU Kumulierte Symbol-Slots',
  },
  'DSI 대역폭': {
    kr: 'DSI 대역폭',
    en: 'MIPI DSI Bandwidth',
    jp: 'DSI 帯域幅',
    ch: 'MIPI DSI 带宽',
    fr: 'Bande passante MIPI DSI',
    de: 'MIPI DSI Bandbreite',
  },
  'DSI 라인버퍼 Width': {
    kr: 'DSI 라인버퍼 Width',
    en: 'DSI Line Buffer Width',
    jp: 'DSI ラインバッファ Width',
    ch: 'DSI 行缓冲宽度 (Line Buffer)',
    fr: 'Largeur tampon de ligne DSI',
    de: 'DSI Zeilenpuffer-Breite',
  },
  'DSI EVB SerDes 대역폭': {
    kr: 'DSI EVB SerDes 대역폭',
    en: 'DSI EVB SerDes Bandwidth',
    jp: 'DSI EVB SerDes 帯域幅',
    ch: 'DSI EVB SerDes 带宽上限',
    fr: 'Bande passante DSI EVB SerDes',
    de: 'DSI EVB SerDes Bandbreite',
  },
  'LVDS 대역폭': {
    kr: 'LVDS 대역폭',
    en: 'LVDS Bandwidth',
    jp: 'LVDS 帯域幅',
    ch: 'LVDS 带宽',
    fr: 'Bande passante LVDS',
    de: 'LVDS Bandbreite',
  },
  'Dual LVDS Splitter Half-Width': {
    kr: 'Dual LVDS Splitter Half-Width',
    en: 'Dual LVDS Splitter Half-Width',
    jp: 'Dual LVDS スプリッタ半幅 (Half-Width)',
    ch: '双路 LVDS 分割器半宽 (Half-Width)',
    fr: 'Demi-largeur Splitter Dual LVDS',
    de: 'Dual LVDS Splitter-Halbbreite',
  },
  'HDMI TMDS Pixel Clock': {
    kr: 'HDMI TMDS Pixel Clock',
    en: 'HDMI TMDS Pixel Clock',
    jp: 'HDMI TMDS ピクセルクロック',
    ch: 'HDMI TMDS 像素时钟',
    fr: 'Horloge pixel HDMI TMDS',
    de: 'HDMI TMDS Pixeltakt',
  },
  'HDMI TMDS 대역폭': {
    kr: 'HDMI TMDS 대역폭',
    en: 'HDMI TMDS Bandwidth',
    jp: 'HDMI TMDS 帯域幅',
    ch: 'HDMI TMDS 带宽',
    fr: 'Bande passante HDMI TMDS',
    de: 'HDMI TMDS Bandbreite',
  },
  '칩셋 해상도 제약 Width': {
    kr: '칩셋 해상도 제약 Width',
    en: 'Chipset Resolution Cap Width',
    jp: 'チップセット解像度上限 Width',
    ch: '芯片分辨率上限 Width',
    fr: 'Limite largeur du chipset',
    de: 'Chipset-Auflösungslimit Breite',
  },
  '칩셋 해상도 제약 Height': {
    kr: '칩셋 해상도 제약 Height',
    en: 'Chipset Resolution Cap Height',
    jp: 'チップセット解像度上限 Height',
    ch: '芯片分辨率上限 Height',
    fr: 'Limite hauteur du chipset',
    de: 'Chipset-Auflösungslimit Höhe',
  },
  '칩셋 해상도 제약 fps': {
    kr: '칩셋 해상도 제약 fps',
    en: 'Chipset Frame Rate Cap (fps)',
    jp: 'チップセットフレームレート上限 (fps)',
    ch: '芯片刷新率上限 (fps)',
    fr: 'Limite fréquence d’images chipset (fps)',
    de: 'Chipset-Bildratenlimit (fps)',
  },
}

export function translateConstraintName(name: string, lang: LangCode): string {
  return CONSTRAINT_NAME_MAP[name]?.[lang] ?? name
}

export function translateTimingSource(source: string, lang: LangCode): string {
  if (lang === 'kr') return source
  if (source.startsWith('위키 Custom')) {
    const labels: Record<Exclude<LangCode, 'kr'>, string> = {
      en: 'Custom RB (H +80px, V +6lines)',
      jp: 'カスタム RB (H +80px, V +6lines)',
      ch: '自定义消隐 (H +80px, V +6lines)',
      fr: 'Custom RB (H +80px, V +6 lignes)',
      de: 'Custom RB (H +80px, V +6 Zeilen)',
    }
    return labels[lang]
  }
  if (source.startsWith('사용자 정의 타이밍')) {
    return TRANSLATIONS[lang].manualTimingSource
  }
  return source
}

export function translateFormulaText(text: string, lang: LangCode): string {
  if (lang === 'kr') return text

  const replacements: Record<Exclude<LangCode, 'kr'>, [string, string][]> = {
    en: [
      ['표준 테이블 정의값', 'Standard Table Definition'],
      ['4K 픽셀 상한', '4K Pixel Cap'],
      [' 픽셀', ' pixels'],
      ['2K 모드', '2K Mode'],
      ['4K 모드', '4K Mode'],
      ['FEC+MST마진', 'FEC+MST margin'],
      ['MTP 64 slots 중 헤더 1 slot 제외,', 'MTP 64 slots minus 1 header slot,'],
      ['MTP 64 slots - 헤더 1 slot', 'MTP 64 slots - 1 header slot'],
      ['기준 1 slot =', '→ 1 slot ='],
      ['Transfer Unit 고정 64 link symbols', 'Fixed 64 link symbols per Transfer Unit'],
      ['TCC807x EVB 4-lane SerDes 상한', 'TCC807x EVB 4-lane SerDes cap'],
      ['전체 폭 최대', 'max full width'],
      ['HDMI 2.0 최대 TMDS Pixel Clock', 'HDMI 2.0 Max TMDS Pixel Clock'],
      ['TMDS 인코딩', 'TMDS encoding'],
      ['HDMI 2.0 최대 TMDS Data Rate', 'HDMI 2.0 Max TMDS Data Rate'],
      ['FHD 설계 상한', 'FHD Design Cap'],
    ],
    jp: [
      ['표준 테이블 정의값', '標準テーブル定義値'],
      ['4K 픽셀 상한', '4K ピクセル上限'],
      [' 픽셀', ' ピクセル'],
      ['2K 모드', '2K モード'],
      ['4K 모드', '4K モード'],
      ['FEC+MST마진', 'FEC+MSTマージン'],
      ['MTP 64 slots 중 헤더 1 slot 제외,', 'MTP 64 slots のうちヘッダ 1 slot 除外、'],
      ['MTP 64 slots - 헤더 1 slot', 'MTP 64 slots - ヘッダ 1 slot'],
      ['기준 1 slot =', '基準 1 slot ='],
      ['Transfer Unit 고정 64 link symbols', 'Transfer Unit 固定 64 link symbols'],
      ['TCC807x EVB 4-lane SerDes 상한', 'TCC807x EVB 4-lane SerDes 上限'],
      ['전체 폭 최대', '全体幅最大'],
      ['HDMI 2.0 최대 TMDS Pixel Clock', 'HDMI 2.0 最大 TMDS Pixel Clock'],
      ['TMDS 인코딩', 'TMDS エンコーディング'],
      ['HDMI 2.0 최대 TMDS Data Rate', 'HDMI 2.0 最大 TMDS Data Rate'],
      ['FHD 설계 상한', 'FHD 設計上限'],
    ],
    ch: [
      ['표준 테이블 정의값', '标准表定义值'],
      ['4K 픽셀 상한', '4K 像素上限'],
      [' 픽셀', ' 像素'],
      ['2K 모드', '2K 模式'],
      ['4K 모드', '4K 模式'],
      ['FEC+MST마진', 'FEC+MST裕量'],
      ['MTP 64 slots 중 헤더 1 slot 제외,', 'MTP 64 时隙扣除 1 个控制头时隙,'],
      ['MTP 64 slots - 헤더 1 slot', 'MTP 64 slots - 1 个控制头时隙'],
      ['기준 1 slot =', '下 1 slot ='],
      ['Transfer Unit 고정 64 link symbols', 'Transfer Unit 固定 64 个链路符号'],
      ['TCC807x EVB 4-lane SerDes 상한', 'TCC807x EVB 4通道 SerDes 上限'],
      ['전체 폭 최대', '总宽度最大'],
      ['HDMI 2.0 최대 TMDS Pixel Clock', 'HDMI 2.0 最大 TMDS 像素时钟'],
      ['TMDS 인코딩', 'TMDS 编码'],
      ['HDMI 2.0 최대 TMDS Data Rate', 'HDMI 2.0 最大 TMDS 数据率'],
      ['FHD 설계 상한', 'FHD 设计上限'],
    ],
    fr: [
      ['표준 테이블 정의값', 'Valeur définie par la table standard'],
      ['4K 픽셀 상한', 'Limite pixels 4K'],
      [' 픽셀', ' pixels'],
      ['2K 모드', 'Mode 2K'],
      ['4K 모드', 'Mode 4K'],
      ['FEC+MST마진', 'marge FEC+MST'],
      ['MTP 64 slots 중 헤더 1 slot 제외,', 'MTP 64 slots hors 1 slot d’en-tête,'],
      ['MTP 64 slots - 헤더 1 slot', 'MTP 64 slots - 1 slot d’en-tête'],
      ['기준 1 slot =', '→ 1 slot ='],
      ['Transfer Unit 고정 64 link symbols', 'Transfer Unit fixe de 64 symboles de liaison'],
      ['TCC807x EVB 4-lane SerDes 상한', 'Limite SerDes 4 voies TCC807x EVB'],
      ['전체 폭 최대', 'largeur totale max'],
      ['HDMI 2.0 최대 TMDS Pixel Clock', 'Horloge pixel TMDS max HDMI 2.0'],
      ['TMDS 인코딩', 'encodage TMDS'],
      ['HDMI 2.0 최대 TMDS Data Rate', 'Débit TMDS max HDMI 2.0'],
      ['FHD 설계 상한', 'Limite nominale FHD'],
    ],
    de: [
      ['표준 테이블 정의값', 'Standardtabellen-Definitionswert'],
      ['4K 픽셀 상한', '4K-Pixelobergrenze'],
      [' 픽셀', ' Pixel'],
      ['2K 모드', '2K-Modus'],
      ['4K 모드', '4K-Modus'],
      ['FEC+MST마진', 'FEC+MST-Marge'],
      ['MTP 64 slots 중 헤더 1 slot 제외,', 'MTP 64 Slots abzgl. 1 Header-Slot,'],
      ['MTP 64 slots - 헤더 1 slot', 'MTP 64 Slots - 1 Header-Slot'],
      ['기준 1 slot =', '→ 1 Slot ='],
      ['Transfer Unit 고정 64 link symbols', 'Transfer Unit feste 64 Link-Symbole'],
      ['TCC807x EVB 4-lane SerDes 상한', 'TCC807x EVB 4-Lane SerDes-Limit'],
      ['전체 폭 최대', 'Gesamtbreite max.'],
      ['HDMI 2.0 최대 TMDS Pixel Clock', 'HDMI 2.0 Max. TMDS-Pixeltakt'],
      ['TMDS 인코딩', 'TMDS-Codierung'],
      ['HDMI 2.0 최대 TMDS Data Rate', 'HDMI 2.0 Max. TMDS-Datenrate'],
      ['FHD 설계 상한', 'FHD-Auslegungsgrenze'],
    ],
  }

  let out = text
  for (const [ko, target] of replacements[lang]) {
    out = out.replaceAll(ko, target)
  }
  return out
}

export const I18nContext = createContext<LangCode>('kr')

export function useI18n(): { lang: LangCode; t: TranslationDict } {
  const lang = useContext(I18nContext)
  return { lang, t: TRANSLATIONS[lang] }
}
