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
import { useI18n } from './i18n'
import { outputsOf, withChipset, type Settings } from './settings'

type Props = {
  settings: Settings
  onChange: (settings: Settings) => void
}

export function TargetFieldset({ settings, onChange }: Props) {
  const { t } = useI18n()
  return (
    <fieldset className="control-group">
      <legend>{t.targetLegend}</legend>
      <label>
        {t.targetSocLabel}
        <select value={settings.chipsetId} onChange={(e) => onChange(withChipset(settings, e.target.value))}>
          {CHIPSETS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t.targetOutputLabel}
        <select
          value={settings.output}
          onChange={(e) => onChange({ ...settings, output: e.target.value as OutputId })}
        >
          {outputsOf(settings.chipsetId).map((o) => (
            <option key={o} value={o}>
              {t.outputLabels[o]}
            </option>
          ))}
        </select>
      </label>
    </fieldset>
  )
}

export function FallbackSelect({ settings, onChange, disabled }: Props & { disabled?: boolean }) {
  const { t } = useI18n()
  return (
    <label>
      {t.fallbackSelectLabel}
      <select
        value={settings.fallback}
        disabled={disabled}
        onChange={(e) => onChange({ ...settings, fallback: e.target.value as FallbackTimingMethod })}
      >
        {(Object.keys(t.fallbackLabels) as FallbackTimingMethod[]).map((m) => (
          <option key={m} value={m}>
            {t.fallbackLabels[m]}
          </option>
        ))}
      </select>
    </label>
  )
}

export function OptionsFieldset({ settings, onChange }: Props) {
  const { t } = useI18n()
  const chipset = CHIPSETS.find((c) => c.id === settings.chipsetId)
  const dpSpec = chipset?.outputs.dp?.kind === 'dp' ? chipset.outputs.dp : undefined
  const dsiSpec = chipset?.outputs.dsi?.kind === 'dsi' ? chipset.outputs.dsi : undefined
  const { dp, dsi, hdmi } = settings
  const setDp = (next: Partial<Settings['dp']>) => onChange({ ...settings, dp: { ...dp, ...next } })
  const setDsi = (next: Partial<Settings['dsi']>) => onChange({ ...settings, dsi: { ...dsi, ...next } })
  const setHdmi = (next: Partial<Settings['hdmi']>) => onChange({ ...settings, hdmi: { ...hdmi, ...next } })

  return (
    <fieldset className="control-group">
      <legend>{t.optionsLegend}</legend>
      <label>
        {t.scalerPipelineLabel}
        <select
          value={settings.scaler}
          onChange={(e) => onChange({ ...settings, scaler: e.target.value as ScalerMode })}
        >
          {(Object.keys(t.scalerLabels) as ScalerMode[]).map((mode) => (
            <option key={mode} value={mode}>
              {t.scalerLabels[mode]}
            </option>
          ))}
        </select>
      </label>

      {settings.output === 'dp' && dpSpec && (
        <>
          <label>
            {t.dpTransportModeLabel}
            <select value={dp.mode ?? 'sst'} onChange={(e) => setDp({ mode: e.target.value as DpMode })}>
              {(Object.keys(t.dpModeLabels) as DpMode[]).map((m) => (
                <option key={m} value={m}>
                  {t.dpModeLabels[m]}
                </option>
              ))}
            </select>
          </label>
          <div className="row">
            <label>
              {t.linkRateGradeLabel}
              <select value={dp.linkRate} onChange={(e) => setDp({ linkRate: e.target.value as DpLinkRate })}>
                {DP_LINK_RATES.slice(0, DP_LINK_RATES.indexOf(dpSpec.maxLinkRate) + 1).map((r) => (
                  <option key={r} value={r}>
                    {r} ({(DP_LINK_RATE_MBPS[r] / 1000).toFixed(2)} Gbps/lane)
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t.laneCountLabel}
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
            {t.fecEnableLabel} {dp.dsc ? t.fecMandatoryDscSuffix : ''}
          </label>
          {(dp.mode ?? 'sst') === 'sst' && (
            <label className="check">
              <input type="checkbox" checked={dp.ssc} onChange={(e) => setDp({ ssc: e.target.checked })} />
              {t.sscEnableLabel}
            </label>
          )}
          <label className="check">
            <input
              type="checkbox"
              checked={Boolean(dp.dsc)}
              onChange={(e) => setDp({ dsc: e.target.checked, fec: e.target.checked ? true : dp.fec })}
            />
            {t.dscEnableLabel}
          </label>
          {dp.dsc && (
            <label>
              {t.dscTargetBppLabel}
              <select
                value={dp.bppCompressed ?? 12}
                onChange={(e) => setDp({ bppCompressed: Number(e.target.value) })}
              >
                {[8, 9, 10, 12, 15, 16].map((bpp) => (
                  <option key={bpp} value={bpp}>
                    {bpp} bpp ({t.compressionRatio((24 / bpp).toFixed(2))})
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
            {t.dsiDataLanesLabel}
            <select value={dsi.lanes} onChange={(e) => setDsi({ lanes: Number(e.target.value) as DsiLaneCount })}>
              {DSI_LANE_COUNTS.filter((n) => n <= dsiSpec.lanes).map((n) => (
                <option key={n} value={n}>
                  {n} Lanes ({t.physicalBandwidth(((n * dsiSpec.laneMbps) / 1000).toFixed(1))})
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
            {t.dsiEvbSerdesLabel}
          </label>
        </>
      )}

      {settings.output === 'hdmi' && (
        <label>
          {t.hdmiFormatSelectLabel}
          <select
            value={hdmi.format}
            onChange={(e) => setHdmi({ format: e.target.value as HdmiColorFormat })}
          >
            {(Object.keys(t.hdmiFormatLabels) as HdmiColorFormat[]).map((fmt) => (
              <option key={fmt} value={fmt}>
                {t.hdmiFormatLabels[fmt]}
              </option>
            ))}
          </select>
        </label>
      )}
    </fieldset>
  )
}
