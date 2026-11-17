import { useState } from 'react'
import { MAX_MST_STREAMS, verifyMstStreams, type MstStreamInput } from '../core/mst'
import {
  DP_LANE_COUNTS,
  DP_LINK_RATES,
  DP_LINK_RATE_MBPS,
  type DpLaneCount,
  type DpLinkRate,
  type ScalerMode,
} from '../core/spec'
import { resolveTiming } from '../core/timing'
import { CHIPSETS } from '../data/chipsets'
import { CEA861_MODES } from '../data/timings'
import { parsePositive, parsePositiveInt } from './form'
import { formatMargin, formatMHz, formatValue } from './format'
import { translateConstraintName, translateFormulaText, translateTimingSource, useI18n } from './i18n'
import { FallbackSelect } from './SettingsFields'
import type { Settings } from './settings'

type StreamDraft = {
  id: number
  widthText: string
  heightText: string
  fpsText: string
}

type Props = {
  settings: Settings
  onSettingsChange: (settings: Settings) => void
}

const REFERENCE_4CH_STREAMS: StreamDraft[] = [
  { id: 1, widthText: '3840', heightText: '2160', fpsText: '60' },
  { id: 2, widthText: '1920', heightText: '1080', fpsText: '60' },
  { id: 3, widthText: '1920', heightText: '1080', fpsText: '60' },
  { id: 4, widthText: '1920', heightText: '1080', fpsText: '60' },
]

export function MstPage({ settings, onSettingsChange }: Props) {
  const { lang, t } = useI18n()
  const [streams, setStreams] = useState<StreamDraft[]>(REFERENCE_4CH_STREAMS)

  const dpChipsets = CHIPSETS.filter((c) => c.outputs.dp?.kind === 'dp' && c.outputs.dp.mst)
  const activeChipset = dpChipsets.find((c) => c.id === settings.chipsetId) ?? dpChipsets[0]
  const dpSpec = activeChipset.outputs.dp?.kind === 'dp' ? activeChipset.outputs.dp : undefined
  const { dp } = settings

  const setDp = (next: Partial<Settings['dp']>) =>
    onSettingsChange({ ...settings, dp: { ...dp, ...next, mode: 'mst' } })

  const errors: string[] = []
  const resolvedStreams: MstStreamInput[] = []

  for (let i = 0; i < streams.length; i++) {
    const s = streams[i]
    const w = parsePositiveInt(s.widthText)
    const h = parsePositiveInt(s.heightText)
    const fps = parsePositive(s.fpsText)
    if (!w || !h || !fps) {
      errors.push(t.mstStreamError(i + 1))
      continue
    }
    const r = resolveTiming({ hActive: w, vActive: h, fps }, settings.fallback)
    resolvedStreams.push({ timing: r.timing, timingSource: r.source })
  }

  const result =
    errors.length === 0 && resolvedStreams.length === streams.length
      ? verifyMstStreams({
          chipsetId: activeChipset.id,
          scaler: settings.scaler,
          dp: { ...dp, mode: 'mst' },
          streams: resolvedStreams,
        })
      : undefined

  function updateStream(idx: number, patch: Partial<StreamDraft>) {
    setStreams((prev) => prev.map((item, i) => (i === idx ? { ...item, ...patch } : item)))
  }

  function applyPreset(idx: number, modeIndex: string) {
    const mode = CEA861_MODES[Number(modeIndex)]
    if (!mode) return
    updateStream(idx, {
      widthText: String(mode.hActive),
      heightText: String(mode.vActive),
      fpsText: String(mode.fps),
    })
  }

  function addStream() {
    if (streams.length >= MAX_MST_STREAMS) return
    setStreams((prev) => [
      ...prev,
      { id: Date.now(), widthText: '1920', heightText: '1080', fpsText: '60' },
    ])
  }

  function removeStream(idx: number) {
    if (streams.length <= 1) return
    setStreams((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <div className="page">
      <form className="inputs" onSubmit={(e) => e.preventDefault()}>
        <fieldset className="control-group">
          <legend>{t.mstLinkConfigLegend}</legend>
          <label>
            {t.mstTargetSocLabel}
            <select
              value={activeChipset.id}
              onChange={(e) => onSettingsChange({ ...settings, chipsetId: e.target.value, output: 'dp' })}
            >
              {dpChipsets.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          {dpSpec && (
            <div className="row">
              <label>
                {t.linkRateGradeLabel}
                <select value={dp.linkRate} onChange={(e) => setDp({ linkRate: e.target.value as DpLinkRate })}>
                  {DP_LINK_RATES.slice(0, DP_LINK_RATES.indexOf(dpSpec.maxLinkRate) + 1).map((r) => (
                    <option key={r} value={r}>
                      {r} ({(DP_LINK_RATE_MBPS[r] / 1000).toFixed(2)} Gbps)
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
          )}
          <label>
            {t.scalerPipelineLabel}
            <select
              value={settings.scaler}
              onChange={(e) => onSettingsChange({ ...settings, scaler: e.target.value as ScalerMode })}
            >
              {(Object.keys(t.scalerLabels) as ScalerMode[]).map((mode) => (
                <option key={mode} value={mode}>
                  {t.scalerLabels[mode]}
                </option>
              ))}
            </select>
          </label>
          <FallbackSelect settings={settings} onChange={onSettingsChange} />
          <label className="check">
            <input
              type="checkbox"
              checked={dp.dsc ? true : dp.fec}
              disabled={Boolean(dp.dsc)}
              onChange={(e) => setDp({ fec: e.target.checked })}
            />
            {t.fecEnableLabel} {dp.dsc ? t.fecMandatoryDscSuffix : t.mstFecOverheadSuffix}
          </label>
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
        </fieldset>

        <fieldset className="control-group">
          <legend>{t.mstTopologyLegend(MAX_MST_STREAMS)}</legend>
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={() => setStreams(REFERENCE_4CH_STREAMS)}>
              {t.mstLoadReferenceBtn}
            </button>
            <button
              type="button"
              className="btn"
              disabled={streams.length >= MAX_MST_STREAMS}
              onClick={addStream}
            >
              {t.mstAddStreamBtn(streams.length, MAX_MST_STREAMS)}
            </button>
          </div>

          {streams.map((s, idx) => (
            <div key={s.id} className="stream-box">
              <div className="stream-header">
                <strong>VC Stream #{idx + 1}</strong>
                {streams.length > 1 && (
                  <button type="button" className="btn-small" onClick={() => removeStream(idx)}>
                    {t.mstRemoveStreamBtn}
                  </button>
                )}
              </div>
              <label>
                {t.mstPresetLabel}
                <select value="" onChange={(e) => applyPreset(idx, e.target.value)}>
                  <option value="">{t.mstPresetPlaceholder}</option>
                  {CEA861_MODES.map((m, i) => (
                    <option key={m.vic} value={i}>
                      {m.hActive}×{m.vActive} @ {m.fps}Hz (VIC {m.vic})
                    </option>
                  ))}
                </select>
              </label>
              <div className="row">
                <label>
                  H_active (px)
                  <input
                    inputMode="numeric"
                    value={s.widthText}
                    onChange={(e) => updateStream(idx, { widthText: e.target.value })}
                  />
                </label>
                <label>
                  V_active (px)
                  <input
                    inputMode="numeric"
                    value={s.heightText}
                    onChange={(e) => updateStream(idx, { heightText: e.target.value })}
                  />
                </label>
                <label>
                  Frame Rate (Hz)
                  <input
                    inputMode="decimal"
                    value={s.fpsText}
                    onChange={(e) => updateStream(idx, { fpsText: e.target.value })}
                  />
                </label>
              </div>
            </div>
          ))}
        </fieldset>
      </form>

      <section className="output">
        {errors.length > 0 && (
          <ul className="errors">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
        {result && result.supported && (
          <div className="analysis-panel">
            <div className={result.pass ? 'verdict-banner verdict-pass' : 'verdict-banner verdict-fail'}>
              <div className={result.pass ? 'verdict-badge badge-pass' : 'verdict-badge badge-fail'}>
                {result.pass ? 'TOPOLOGY VALID' : 'OVER ALLOCATED'}
              </div>
              <div className="verdict-body">
                <strong>
                  {result.pass ? t.mstVerdictPassTitle(result.streams.length) : t.mstVerdictFailTitle}
                </strong>
                <span>
                  {t.mstVerdictSummary(
                    result.totalTimeSlots,
                    result.totalTuSymbolSlots,
                    (result.totalPayloadBps / 1e9).toFixed(3),
                    (result.maxPayloadBps / 1e9).toFixed(3),
                  )}
                </span>
              </div>
            </div>

            <div className="kpi-grid">
              <div className="kpi-card">
                <span className="kpi-label">TOTAL MST TIME SLOTS</span>
                <strong className="kpi-value">{result.totalTimeSlots} / 63 slots</strong>
                <span className="kpi-sub">{t.mstKpiTimeSlotsSub}</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">TOTAL TU LINK SYMBOLS</span>
                <strong className="kpi-value">{result.totalTuSymbolSlots} / 64 slots</strong>
                <span className="kpi-sub">{t.mstKpiTuSymbolsSub}</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">TOTAL PAYLOAD BANDWIDTH</span>
                <strong className="kpi-value">{(result.totalPayloadBps / 1e9).toFixed(3)} Gbps</strong>
                <span className="kpi-sub">{t.mstKpiPayloadSub((result.maxPayloadBps / 1e9).toFixed(3))}</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-label">TOTAL STREAM PBN</span>
                <strong className="kpi-value">{result.totalPbn} PBN</strong>
                <span className="kpi-sub">{t.mstKpiPbnSub(result.pbnPerSlot)}</span>
              </div>
            </div>

            <section className="panel-section">
              <div className="section-header">
                <h3>{t.mstSection1Title}</h3>
                <span className="section-tag">
                  {dp.linkRate} × {dp.lanes} Lanes ({result.pbnPerSlot} PBN/slot)
                </span>
              </div>
              <table className="constraints">
                <thead>
                  <tr>
                    <th>{t.mstColAggregateItem}</th>
                    <th>{t.mstColAggregateActual}</th>
                    <th>{t.mstColLinkLimit}</th>
                    <th>{t.mstColUtilization}</th>
                    <th>{t.mstColMargin}</th>
                    <th>{t.mstColVerdict}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.linkConstraints.map((c) => {
                    const util = (c.actual / c.limit) * 100
                    return (
                      <tr key={c.name} className={c.pass ? undefined : 'row-fail'}>
                        <td>{translateConstraintName(c.name, lang)}</td>
                        <td>{formatValue(c.actual, c.unit, lang)}</td>
                        <td>{formatValue(c.limit, c.unit, lang)}</td>
                        <td className="util-cell">
                          <div className="table-util-wrap">
                            <div className="util-bar-track">
                              <div
                                className={
                                  !c.pass
                                    ? 'util-bar-fill util-danger'
                                    : util > 85
                                      ? 'util-bar-fill util-warn'
                                      : 'util-bar-fill util-ok'
                                }
                                style={{ width: `${Math.min(100, Math.max(0, util))}%` }}
                              />
                            </div>
                            <span>{util.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td>{formatMargin(c.margin)}</td>
                        <td>
                          <span className={c.pass ? 'status-pill pill-pass' : 'status-pill pill-fail'}>
                            {c.pass ? 'PASS' : 'FAIL'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              <div className="formula-stack" style={{ marginTop: '14px' }}>
                {result.linkConstraints.map((c) => (
                  <div key={c.name} className={c.pass ? 'formula-card' : 'formula-card formula-card-fail'}>
                    <div className="formula-card-head">
                      <strong>{t.mstFormulaCardTitle(translateConstraintName(c.name, lang))}</strong>
                      <span className="formula-result-pill">
                        {formatValue(c.actual, c.unit, lang)} ≤ {formatValue(c.limit, c.unit, lang)}
                      </span>
                    </div>
                    {c.formula && (
                      <div className="formula-grid">
                        <span className="formula-tag">{t.mstTagInequality}</span>
                        <code>{translateFormulaText(c.formula.expression, lang)}</code>
                        <span className="formula-tag">{t.mstTagSumSubstitution}</span>
                        <code>{translateFormulaText(c.formula.actualSubstitution, lang)}</code>
                        <span className="formula-tag">{t.mstTagLimitSubstitution}</span>
                        <code>{translateFormulaText(c.formula.limitSubstitution, lang)}</code>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="panel-section">
              <div className="section-header">
                <h3>{t.mstSection2Title}</h3>
                <span className="section-tag">{t.mstSection2Tag(result.streams.length)}</span>
              </div>
              <table className="constraints explore">
                <thead>
                  <tr>
                    <th>{t.mstColVcChannel}</th>
                    <th>{t.mstColResTiming}</th>
                    <th>{t.exploreColPixelClock}</th>
                    <th>{t.mstColReqBandwidth}</th>
                    <th>{t.mstColAllocPbn}</th>
                    <th>{t.mstColMstSlot}</th>
                    <th>{t.mstColTuSymbol}</th>
                    <th>{t.mstColVerdict}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.streams.map((s) => (
                    <tr key={s.index} className={s.pass ? undefined : 'row-fail'}>
                      <td>
                        <strong>VC #{s.index}</strong>
                      </td>
                      <td>
                        {s.timing.hActive}×{s.timing.vActive}@{s.timing.fps}Hz (
                        {translateTimingSource(s.timingSource, lang)})
                      </td>
                      <td>{formatMHz(s.pixelClockHz)}</td>
                      <td>{(s.payloadBps / 1e9).toFixed(3)} Gbps</td>
                      <td>{s.pbn} PBN</td>
                      <td>{s.timeSlots} slots</td>
                      <td>
                        {s.tuSymbolSlots} slots ({s.tuSymbolExact.toFixed(1)})
                      </td>
                      <td>
                        <span className={s.pass ? 'status-pill pill-pass' : 'status-pill pill-fail'}>
                          {s.pass ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="formula-stack" style={{ marginTop: '14px' }}>
                {result.streams.map((s) => (
                  <div key={s.index} className={s.pass ? 'formula-card' : 'formula-card formula-card-fail'}>
                    <div className="formula-card-head">
                      <strong>
                        {t.mstStreamFormulaTitle(
                          s.index,
                          s.timing.hActive,
                          s.timing.vActive,
                          s.timing.fps,
                          s.timing.hTotal,
                          s.timing.vTotal,
                        )}
                      </strong>
                      <span className="formula-result-pill">
                        {s.pbn} PBN · {s.timeSlots} Time Slots · {s.tuSymbolSlots} TU Symbols
                      </span>
                    </div>
                    <div className="formula-grid">
                      <span className="formula-tag">Pixel Clock</span>
                      <code>
                        {s.timing.hTotal} × {s.timing.vTotal} × {s.timing.fps} Hz = {formatMHz(s.pixelClockHz)}
                      </code>
                      <span className="formula-tag">Table 3 PBN</span>
                      <code>{s.pbnSubstitution}</code>
                      <span className="formula-tag">Table 4 Slot</span>
                      <code>{s.timeSlotSubstitution}</code>
                      <span className="formula-tag">TRM 10.1.1 TU</span>
                      <code>{s.tuSymbolSubstitution}</code>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </section>
    </div>
  )
}
