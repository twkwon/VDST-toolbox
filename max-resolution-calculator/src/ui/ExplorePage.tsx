import { useState } from 'react'
import { explore, type ExploreRow } from '../core/explore'
import { pixelClockHz } from '../core/timing'
import { parsePositive } from './form'
import { formatMargin, formatMHz } from './format'
import { dpOptionsFor, type Settings } from './settings'
import { FallbackSelect, OptionsFieldset, TargetFieldset } from './SettingsFields'

type Props = {
  settings: Settings
  onSettingsChange: (settings: Settings) => void
}

export function ExplorePage({ settings, onSettingsChange }: Props) {
  const [fpsText, setFpsText] = useState('60')
  const [showFailed, setShowFailed] = useState(false)

  const fps = parsePositive(fpsText)
  const result = fps
    ? explore({
        chipsetId: settings.chipsetId,
        output: settings.output,
        fps,
        fallback: settings.fallback,
        scaler: settings.scaler,
        dp: dpOptionsFor(settings),
      })
    : undefined

  const rows = result?.supported ? result.rows : []
  const passing = rows.filter((r) => r.pass)
  const visible = showFailed ? rows : passing

  return (
    <div className="page">
      <form className="inputs" onSubmit={(e) => e.preventDefault()}>
        <TargetFieldset settings={settings} onChange={onSettingsChange} />

        <fieldset>
          <legend>탐색 조건</legend>
          <label>
            fps
            <input inputMode="decimal" value={fpsText} onChange={(e) => setFpsText(e.target.value)} />
          </label>
          <FallbackSelect settings={settings} onChange={onSettingsChange} />
          <label className="check">
            <input type="checkbox" checked={showFailed} onChange={(e) => setShowFailed(e.target.checked)} />
            불가 해상도도 표시
          </label>
        </fieldset>

        <OptionsFieldset settings={settings} onChange={onSettingsChange} />
      </form>

      <section className="output">
        {!fps && (
          <ul className="errors">
            <li>fps는 0보다 커야 합니다.</li>
          </ul>
        )}
        {result && !result.supported && (
          <div className="verdict verdict-unsupported">이 칩셋은 선택한 출력을 지원하지 않습니다.</div>
        )}
        {result?.supported && (
          <>
            <div className={passing.length > 0 ? 'verdict verdict-pass' : 'verdict verdict-fail'}>
              <strong>
                {passing.length > 0
                  ? `최대 ${passing[0].resolution.width}×${passing[0].resolution.height} @ ${fps}Hz`
                  : '출력 가능한 후보 없음'}
              </strong>
              <span>
                후보 {rows.length}개 중 {passing.length}개 출력 가능 (픽셀 수가 큰 순)
              </span>
            </div>
            <table className="constraints explore">
              <thead>
                <tr>
                  <th>해상도</th>
                  <th>타이밍 출처</th>
                  <th>Pixel Clock</th>
                  <th>{showFailed ? '병목 / 불가 조건' : '가장 여유가 적은 조건'}</th>
                  <th>여유</th>
                  <th>결과</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <ExploreTableRow key={`${r.resolution.width}x${r.resolution.height}`} row={r} />
                ))}
              </tbody>
            </table>
            <p className="source-note">
              후보 목록: CTA-861 표의 해상도 + 일반 패널 해상도 (잠정, docs/decisions-for-confirmation.md 2-8)
            </p>
          </>
        )}
      </section>
    </div>
  )
}

function ExploreTableRow({ row }: { row: ExploreRow }) {
  return (
    <tr className={row.pass ? undefined : 'row-fail'}>
      <td>
        {row.resolution.width}×{row.resolution.height}
      </td>
      <td>{row.timingSource}</td>
      <td>{formatMHz(pixelClockHz(row.timing))}</td>
      <td>{row.tightest.name}</td>
      <td>{formatMargin(row.tightest.margin)}</td>
      <td>{row.pass ? '가능' : '불가'}</td>
    </tr>
  )
}
