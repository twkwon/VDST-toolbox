import { useState } from 'react'
import { resolveTiming, type ResolvedTiming } from '../core/timing'
import { verify } from '../core/verify'
import { CEA861_MODES } from '../data/timings'
import { parsePositive, parsePositiveInt } from './form'
import { ResultPanel } from './ResultPanel'
import { dpOptionsFor, type Settings } from './settings'
import { FallbackSelect, OptionsFieldset, TargetFieldset } from './SettingsFields'

type Props = {
  settings: Settings
  onSettingsChange: (settings: Settings) => void
}

export function VerifyPage({ settings, onSettingsChange }: Props) {
  const [widthText, setWidthText] = useState('1920')
  const [heightText, setHeightText] = useState('1080')
  const [fpsText, setFpsText] = useState('60')
  const [manual, setManual] = useState(false)
  const [hTotalText, setHTotalText] = useState('')
  const [vTotalText, setVTotalText] = useState('')

  const width = parsePositiveInt(widthText)
  const height = parsePositiveInt(heightText)
  const fps = parsePositive(fpsText)
  const errors: string[] = []
  if (!width) errors.push('Width는 양의 정수여야 합니다.')
  if (!height) errors.push('Height는 양의 정수여야 합니다.')
  if (!fps) errors.push('fps는 0보다 커야 합니다.')

  const resolved: ResolvedTiming | undefined =
    width && height && fps ? resolveTiming({ hActive: width, vActive: height, fps }, settings.fallback) : undefined

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
      ? verify({
          chipsetId: settings.chipsetId,
          output: settings.output,
          timing,
          scaler: settings.scaler,
          dp: dpOptionsFor(settings),
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
          <FallbackSelect settings={settings} onChange={onSettingsChange} disabled={manual} />
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
        {result && timing && <ResultPanel result={result} timing={timing} timingSource={timingSource} />}
      </section>
    </div>
  )
}
