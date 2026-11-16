import type { HdmiColorFormat } from '../core/constraints/hdmi'
import {
  DP_LANE_COUNTS,
  DP_LINK_RATES,
  DP_LINK_RATE_MBPS,
  DSI_LANE_COUNTS,
  type DpLaneCount,
  type DpLinkRate,
  type DpMode,
  type DsiLaneCount,
  type OutputId,
  type ScalerMode,
} from '../core/spec'
import type { FallbackTimingMethod } from '../core/timing'
import { CHIPSETS } from '../data/chipsets'
import { DP_MODE_LABELS, FALLBACK_LABELS, HDMI_FORMAT_LABELS, OUTPUT_LABELS, SCALER_LABELS } from './labels'
import { outputsOf, withChipset, type Settings } from './settings'

type Props = {
  settings: Settings
  onChange: (settings: Settings) => void
}

export function TargetFieldset({ settings, onChange }: Props) {
  return (
    <fieldset className="control-group">
      <legend>1. 타깃 아키텍처 (Target SoC &amp; Interface)</legend>
      <label>
        대상 프로세서 (SoC)
        <select value={settings.chipsetId} onChange={(e) => onChange(withChipset(settings, e.target.value))}>
          {CHIPSETS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        디스플레이 출력 인터페이스
        <select
          value={settings.output}
          onChange={(e) => onChange({ ...settings, output: e.target.value as OutputId })}
        >
          {outputsOf(settings.chipsetId).map((o) => (
            <option key={o} value={o}>
              {OUTPUT_LABELS[o]}
            </option>
          ))}
        </select>
      </label>
    </fieldset>
  )
}

export function FallbackSelect({ settings, onChange, disabled }: Props & { disabled?: boolean }) {
  return (
    <label>
      비표준 해상도 블랭킹 산출 모델 (CTA-861 미수록 시)
      <select
        value={settings.fallback}
        disabled={disabled}
        onChange={(e) => onChange({ ...settings, fallback: e.target.value as FallbackTimingMethod })}
      >
        {(Object.keys(FALLBACK_LABELS) as FallbackTimingMethod[]).map((m) => (
          <option key={m} value={m}>
            {FALLBACK_LABELS[m]}
          </option>
        ))}
      </select>
    </label>
  )
}

export function OptionsFieldset({ settings, onChange }: Props) {
  const chipset = CHIPSETS.find((c) => c.id === settings.chipsetId)
  const dpSpec = chipset?.outputs.dp?.kind === 'dp' ? chipset.outputs.dp : undefined
  const dsiSpec = chipset?.outputs.dsi?.kind === 'dsi' ? chipset.outputs.dsi : undefined
  const { dp, dsi, hdmi } = settings
  const setDp = (next: Partial<Settings['dp']>) => onChange({ ...settings, dp: { ...dp, ...next } })
  const setDsi = (next: Partial<Settings['dsi']>) => onChange({ ...settings, dsi: { ...dsi, ...next } })
  const setHdmi = (next: Partial<Settings['hdmi']>) => onChange({ ...settings, hdmi: { ...hdmi, ...next } })

  return (
    <fieldset className="control-group">
      <legend>4. 서브시스템 및 링크 구성 (VIOC &amp; Link Config)</legend>
      <label>
        VIOC Scaler 파이프라인 구성
        <select
          value={settings.scaler}
          onChange={(e) => onChange({ ...settings, scaler: e.target.value as ScalerMode })}
        >
          {(Object.keys(SCALER_LABELS) as ScalerMode[]).map((mode) => (
            <option key={mode} value={mode}>
              {SCALER_LABELS[mode]}
            </option>
          ))}
        </select>
      </label>

      {settings.output === 'dp' && dpSpec && (
        <>
          <label>
            DisplayPort 전송 모드
            <select value={dp.mode ?? 'sst'} onChange={(e) => setDp({ mode: e.target.value as DpMode })}>
              {(Object.keys(DP_MODE_LABELS) as DpMode[]).map((m) => (
                <option key={m} value={m}>
                  {DP_MODE_LABELS[m]}
                </option>
              ))}
            </select>
          </label>
          <div className="row">
            <label>
              Link Rate 등급
              <select value={dp.linkRate} onChange={(e) => setDp({ linkRate: e.target.value as DpLinkRate })}>
                {DP_LINK_RATES.slice(0, DP_LINK_RATES.indexOf(dpSpec.maxLinkRate) + 1).map((r) => (
                  <option key={r} value={r}>
                    {r} ({(DP_LINK_RATE_MBPS[r] / 1000).toFixed(2)} Gbps/lane)
                  </option>
                ))}
              </select>
            </label>
            <label>
              구성 Lane 수
              <select value={dp.lanes} onChange={(e) => setDp({ lanes: Number(e.target.value) as DpLaneCount })}>
                {DP_LANE_COUNTS.filter((n) => n <= dpSpec.maxLanes).map((n) => (
                  <option key={n} value={n}>
                    {n} Lanes
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="check">
            <input
              type="checkbox"
              checked={dp.dsc ? true : dp.fec}
              disabled={Boolean(dp.dsc)}
              onChange={(e) => setDp({ fec: e.target.checked })}
            />
            FEC (Forward Error Correction) 활성화 {dp.dsc ? '(DSC 필수 연동)' : ''}
          </label>
          {(dp.mode ?? 'sst') === 'sst' && (
            <label className="check">
              <input type="checkbox" checked={dp.ssc} onChange={(e) => setDp({ ssc: e.target.checked })} />
              SSC (Spread Spectrum Clocking · 0.5% 마진 차감)
            </label>
          )}
          <label className="check">
            <input
              type="checkbox"
              checked={Boolean(dp.dsc)}
              onChange={(e) => setDp({ dsc: e.target.checked, fec: e.target.checked ? true : dp.fec })}
            />
            DSC (Display Stream Compression) 압축 활성화
          </label>
          {dp.dsc && (
            <label>
              DSC 목표 압축 비트율 (bpp_compressed)
              <select
                value={dp.bppCompressed ?? 12}
                onChange={(e) => setDp({ bppCompressed: Number(e.target.value) })}
              >
                {[8, 9, 10, 12, 15, 16].map((bpp) => (
                  <option key={bpp} value={bpp}>
                    {bpp} bpp (압축비 {(24 / bpp).toFixed(2)}:1)
                  </option>
                ))}
              </select>
            </label>
          )}
        </>
      )}

      {settings.output === 'dsi' && dsiSpec && (
        <>
          <label>
            MIPI D-PHY Data Lanes 구성
            <select value={dsi.lanes} onChange={(e) => setDsi({ lanes: Number(e.target.value) as DsiLaneCount })}>
              {DSI_LANE_COUNTS.filter((n) => n <= dsiSpec.lanes).map((n) => (
                <option key={n} value={n}>
                  {n} Lanes (물리 대역폭 {((n * dsiSpec.laneMbps) / 1000).toFixed(1)} Gbps)
                </option>
              ))}
            </select>
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={dsi.serdesCap}
              onChange={(e) => setDsi({ serdesCap: e.target.checked })}
            />
            EVB SerDes 경유 출력 제약 적용 (최대 4.8 Gbps · TRM 10.1.2)
          </label>
        </>
      )}

      {settings.output === 'hdmi' && (
        <label>
          HDMI 2.0 픽셀 인코딩 포맷 (TRM 10.1.4)
          <select
            value={hdmi.format}
            onChange={(e) => setHdmi({ format: e.target.value as HdmiColorFormat })}
          >
            {(Object.keys(HDMI_FORMAT_LABELS) as HdmiColorFormat[]).map((fmt) => (
              <option key={fmt} value={fmt}>
                {HDMI_FORMAT_LABELS[fmt]}
              </option>
            ))}
          </select>
        </label>
      )}
    </fieldset>
  )
}
