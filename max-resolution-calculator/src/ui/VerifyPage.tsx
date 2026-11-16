import { useState } from 'react'
import { resolveTiming, type ResolvedTiming } from '../core/timing'
import { verify } from '../core/verify'
import { CEA861_MODES } from '../data/timings'
import { parsePositive, parsePositiveInt } from './form'
import { ResultPanel } from './ResultPanel'
import { dpOptionsFor, dsiOptionsFor, hdmiOptionsFor, type Settings } from './settings'
import { FallbackSelect, OptionsFieldset, TargetFieldset } from './SettingsFields'

type Props = {
  settings: Settings
  onSettingsChange: (settings: Settings) => void
}

export function VerifyPage({ settings, onSettingsChange }: Props) {
  const [widthText, setWidthText] = useState('3840')
  const [heightText, setHeightText] = useState('2160')
  const [fpsText, setFpsText] = useState('60')
  const [manual, setManual] = useState(false)
  const [hTotalText, setHTotalText] = useState('')
  const [vTotalText, setVTotalText] = useState('')

  const width = parsePositiveInt(widthText)
  const height = parsePositiveInt(heightText)
  const fps = parsePositive(fpsText)
  const errors: string[] = []
  if (!width) errors.push('수평 해상도(H_active)는 양의 정수여야 합니다.')
  if (!height) errors.push('수직 해상도(V_active)는 양의 정수여야 합니다.')
  if (!fps) errors.push('주사율(Frame Rate)은 0보다 커야 합니다.')

  const resolved: ResolvedTiming | undefined =
    width && height && fps ? resolveTiming({ hActive: width, vActive: height, fps }, settings.fallback) : undefined

  let timing = resolved?.timing
  let timingSource = resolved?.source ?? ''
  if (manual && width && height && fps) {
    const hTotal = parsePositiveInt(hTotalText)
    const vTotal = parsePositiveInt(vTotalText)
    if (!hTotal || hTotal < width) errors.push('H_total은 H_active 이상의 정수여야 합니다.')
    if (!vTotal || vTotal < height) errors.push('V_total은 V_active 이상의 정수여야 합니다.')
    timing = hTotal && vTotal ? { hActive: width, vActive: height, hTotal, vTotal, fps } : undefined
    timingSource = '사용자 정의 타이밍 (Manual H_total / V_total)'
  }

  const dpOptions = dpOptionsFor(settings)
  const result =
    timing && errors.length === 0
      ? verify({
          chipsetId: settings.chipsetId,
          output: settings.output,
          timing,
          scaler: settings.scaler,
          dp: dpOptions,
          dsi: dsiOptionsFor(settings),
          hdmi: hdmiOptionsFor(settings),
        })
      : undefined

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

  return (
    <div className="page">
      <form className="inputs" onSubmit={(e) => e.preventDefault()}>
        <TargetFieldset settings={settings} onChange={onSettingsChange} />

        <fieldset className="control-group">
          <legend>2. 비디오 타이밍 파라미터 (Video Timing)</legend>
          <label>
            CTA-861 표준 프리셋 (Standard VIC Modes)
            <select value="" onChange={(e) => selectPreset(e.target.value)}>
              <option value="">프리셋 선택 (수동 입력 중)…</option>
              {CEA861_MODES.map((m, i) => (
                <option key={m.vic} value={i}>
                  {m.hActive}×{m.vActive} @ {m.fps}Hz — VIC {m.vic} (Total {m.hTotal}×{m.vTotal})
                </option>
              ))}
            </select>
          </label>
          <div className="row">
            <label>
              H_active (Width, px)
              <input inputMode="numeric" value={widthText} onChange={(e) => setWidthText(e.target.value)} />
            </label>
            <label>
              V_active (Height, px)
              <input inputMode="numeric" value={heightText} onChange={(e) => setHeightText(e.target.value)} />
            </label>
            <label>
              Frame Rate (Hz)
              <input inputMode="decimal" value={fpsText} onChange={(e) => setFpsText(e.target.value)} />
            </label>
          </div>
        </fieldset>

        <fieldset className="control-group">
          <legend>3. 블랭킹 산출 규격 (Blanking &amp; Total Timing)</legend>
          <FallbackSelect settings={settings} onChange={onSettingsChange} disabled={manual} />
          <label className="check">
            <input type="checkbox" checked={manual} onChange={(e) => toggleManual(e.target.checked)} />
            패널 규격서 H_total / V_total 직접 지정 (Manual Override)
          </label>
          {manual && (
            <div className="row">
              <label>
                H_total (px)
                <input inputMode="numeric" value={hTotalText} onChange={(e) => setHTotalText(e.target.value)} />
              </label>
              <label>
                V_total (lines)
                <input inputMode="numeric" value={vTotalText} onChange={(e) => setVTotalText(e.target.value)} />
              </label>
            </div>
          )}
        </fieldset>

        <OptionsFieldset settings={settings} onChange={onSettingsChange} />
      </form>

      <section className="output">
        {errors.length > 0 && (
          <ul className="errors">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
        {result && timing && (
          <ResultPanel result={result} timing={timing} timingSource={timingSource} dp={dpOptions} />
        )}
      </section>
    </div>
  )
}
