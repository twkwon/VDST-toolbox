import { useState } from 'react'
import type { DpSstOptions } from '../core/constraints/dpSst'
import { DP_LANE_COUNTS, DP_LINK_RATES, type DpLaneCount, type DpLinkRate, type OutputId } from '../core/spec'
import {
  DEFAULT_FALLBACK_TIMING,
  resolveTiming,
  type FallbackTimingMethod,
  type ResolvedTiming,
} from '../core/timing'
import { verify } from '../core/verify'
import { CHIPSETS } from '../data/chipsets'
import { CEA861_MODES } from '../data/timings'
import { FALLBACK_LABELS, OUTPUT_LABELS } from './labels'
import { ResultPanel } from './ResultPanel'

const DEFAULT_DP: DpSstOptions = { linkRate: 'HBR3', lanes: 4, fec: false, ssc: false }

function parsePositiveInt(text: string): number | undefined {
  const n = Number(text)
  return Number.isInteger(n) && n > 0 ? n : undefined
}

function parsePositive(text: string): number | undefined {
  const n = Number(text)
  return Number.isFinite(n) && n > 0 ? n : undefined
}

function outputsOf(chipsetId: string): OutputId[] {
  const chipset = CHIPSETS.find((c) => c.id === chipsetId)
  return chipset ? (Object.keys(chipset.outputs) as OutputId[]) : []
}

export function VerifyPage() {
  const [chipsetId, setChipsetId] = useState(CHIPSETS[0].id)
  const [output, setOutput] = useState<OutputId>(outputsOf(CHIPSETS[0].id)[0])
  const [widthText, setWidthText] = useState('1920')
  const [heightText, setHeightText] = useState('1080')
  const [fpsText, setFpsText] = useState('60')
  const [fallback, setFallback] = useState<FallbackTimingMethod>(DEFAULT_FALLBACK_TIMING)
  const [manual, setManual] = useState(false)
  const [hTotalText, setHTotalText] = useState('')
  const [vTotalText, setVTotalText] = useState('')
  const [scaler, setScaler] = useState(false)
  const [dp, setDp] = useState<DpSstOptions>(DEFAULT_DP)

  const chipset = CHIPSETS.find((c) => c.id === chipsetId)!
  const outputs = outputsOf(chipsetId)
  const dpSpec = chipset.outputs.dp?.kind === 'dp' ? chipset.outputs.dp : undefined

  const width = parsePositiveInt(widthText)
  const height = parsePositiveInt(heightText)
  const fps = parsePositive(fpsText)
  const errors: string[] = []
  if (!width) errors.push('Width는 양의 정수여야 합니다.')
  if (!height) errors.push('Height는 양의 정수여야 합니다.')
  if (!fps) errors.push('fps는 0보다 커야 합니다.')

  const resolved: ResolvedTiming | undefined =
    width && height && fps ? resolveTiming({ hActive: width, vActive: height, fps }, fallback) : undefined

  let timing = resolved?.timing
  let timingSource = resolved?.source ?? ''
  if (manual && width && height && fps) {
    const hTotal = parsePositiveInt(hTotalText)
    const vTotal = parsePositiveInt(vTotalText)
    if (!hTotal || hTotal < width) errors.push('Htotal은 Width 이상의 정수여야 합니다.')
    if (!vTotal || vTotal < height) errors.push('Vtotal은 Height 이상의 정수여야 합니다.')
    timing = hTotal && vTotal ? { hActive: width, vActive: height, hTotal, vTotal, fps } : undefined
    timingSource = '직접 입력'
  }

  const result =
    timing && errors.length === 0
      ? verify({ chipsetId, output, timing, scaler, dp: output === 'dp' ? dp : undefined })
      : undefined

  function selectChipset(id: string) {
    setChipsetId(id)
    const next = outputsOf(id)
    if (!next.includes(output)) setOutput(next[0])
  }

  function selectPreset(index: string) {
    const mode = CEA861_MODES[Number(index)]
    if (!mode) return
    setWidthText(String(mode.hActive))
    setHeightText(String(mode.vActive))
    setFpsText(String(mode.fps))
  }

  function toggleManual(on: boolean) {
    setManual(on)
    if (on && resolved) {
      setHTotalText(String(resolved.timing.hTotal))
      setVTotalText(String(resolved.timing.vTotal))
    }
  }

  const linkRates = dpSpec ? DP_LINK_RATES.slice(0, DP_LINK_RATES.indexOf(dpSpec.maxLinkRate) + 1) : []
  const laneCounts = dpSpec ? DP_LANE_COUNTS.filter((n) => n <= dpSpec.maxLanes) : []

  return (
    <div className="verify">
      <form className="inputs" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend>대상</legend>
          <label>
            칩셋
            <select value={chipsetId} onChange={(e) => selectChipset(e.target.value)}>
              {CHIPSETS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            출력
            <select value={output} onChange={(e) => setOutput(e.target.value as OutputId)}>
              {outputs.map((o) => (
                <option key={o} value={o}>
                  {OUTPUT_LABELS[o]}
                </option>
              ))}
            </select>
          </label>
        </fieldset>

        <fieldset>
          <legend>해상도</legend>
          <label>
            표준 해상도 불러오기
            <select value="" onChange={(e) => selectPreset(e.target.value)}>
              <option value="">선택…</option>
              {CEA861_MODES.map((m, i) => (
                <option key={m.vic} value={i}>
                  {m.hActive}×{m.vActive} @ {m.fps}Hz (VIC {m.vic})
                </option>
              ))}
            </select>
          </label>
          <div className="row">
            <label>
              Width
              <input inputMode="numeric" value={widthText} onChange={(e) => setWidthText(e.target.value)} />
            </label>
            <label>
              Height
              <input inputMode="numeric" value={heightText} onChange={(e) => setHeightText(e.target.value)} />
            </label>
            <label>
              fps
              <input inputMode="decimal" value={fpsText} onChange={(e) => setFpsText(e.target.value)} />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>타이밍</legend>
          <label>
            CEA-861에 없을 때 계산 방식
            <select
              value={fallback}
              disabled={manual}
              onChange={(e) => setFallback(e.target.value as FallbackTimingMethod)}
            >
              {(Object.keys(FALLBACK_LABELS) as FallbackTimingMethod[]).map((m) => (
                <option key={m} value={m}>
                  {FALLBACK_LABELS[m]}
                </option>
              ))}
            </select>
          </label>
          <label className="check">
            <input type="checkbox" checked={manual} onChange={(e) => toggleManual(e.target.checked)} />
            Htotal / Vtotal 직접 입력
          </label>
          {manual && (
            <div className="row">
              <label>
                Htotal
                <input inputMode="numeric" value={hTotalText} onChange={(e) => setHTotalText(e.target.value)} />
              </label>
              <label>
                Vtotal
                <input inputMode="numeric" value={vTotalText} onChange={(e) => setVTotalText(e.target.value)} />
              </label>
            </div>
          )}
        </fieldset>

        <fieldset>
          <legend>옵션</legend>
          <label className="check">
            <input type="checkbox" checked={scaler} onChange={(e) => setScaler(e.target.checked)} />
            Scaler 사용 (출력 Width ≤ 4088 가정)
          </label>
          {output === 'dp' && dpSpec && (
            <>
              <div className="row">
                <label>
                  Link Rate
                  <select
                    value={dp.linkRate}
                    onChange={(e) => setDp({ ...dp, linkRate: e.target.value as DpLinkRate })}
                  >
                    {linkRates.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Lane
                  <select
                    value={dp.lanes}
                    onChange={(e) => setDp({ ...dp, lanes: Number(e.target.value) as DpLaneCount })}
                  >
                    {laneCounts.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="check">
                <input type="checkbox" checked={dp.fec} onChange={(e) => setDp({ ...dp, fec: e.target.checked })} />
                FEC
              </label>
              <label className="check">
                <input type="checkbox" checked={dp.ssc} onChange={(e) => setDp({ ...dp, ssc: e.target.checked })} />
                SSC
              </label>
            </>
          )}
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
        {result && timing && <ResultPanel result={result} timing={timing} timingSource={timingSource} />}
      </section>
    </div>
  )
}
