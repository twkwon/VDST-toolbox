import { useState } from 'react'
import { explore, type ExploreRow } from '../core/explore'
import { pixelClockHz } from '../core/timing'
import { parsePositive } from './form'
import { formatMargin, formatMHz, formatValue } from './format'
import { ResultPanel } from './ResultPanel'
import { dpOptionsFor, dsiOptionsFor, hdmiOptionsFor, type Settings } from './settings'
import { FallbackSelect, OptionsFieldset, TargetFieldset } from './SettingsFields'

type Props = {
  settings: Settings
  onSettingsChange: (settings: Settings) => void
}

export function ExplorePage({ settings, onSettingsChange }: Props) {
  const [fpsText, setFpsText] = useState('60')
  const [showFailed, setShowFailed] = useState(true)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  const fps = parsePositive(fpsText)
  const dpOptions = dpOptionsFor(settings)
  const result = fps
    ? explore({
        chipsetId: settings.chipsetId,
        output: settings.output,
        fps,
        fallback: settings.fallback,
        scaler: settings.scaler,
        dp: dpOptions,
        dsi: dsiOptionsFor(settings),
        hdmi: hdmiOptionsFor(settings),
      })
    : undefined

  const rows = result?.supported ? result.rows : []
  const passing = rows.filter((r) => r.pass)
  const visible = showFailed ? rows : passing

  const selectedRow =
    visible.find((r) => `${r.resolution.width}x${r.resolution.height}` === selectedKey) ??
    passing[0] ??
    visible[0]

  return (
    <div className="page">
      <form className="inputs" onSubmit={(e) => e.preventDefault()}>
        <TargetFieldset settings={settings} onChange={onSettingsChange} />

        <fieldset className="control-group">
          <legend>2. 탐색 조건 설정 (Sweep Parameters)</legend>
          <label>
            목표 주사율 (Target Frame Rate, Hz)
            <input inputMode="decimal" value={fpsText} onChange={(e) => setFpsText(e.target.value)} />
          </label>
          <FallbackSelect settings={settings} onChange={onSettingsChange} />
          <label className="check">
            <input type="checkbox" checked={showFailed} onChange={(e) => setShowFailed(e.target.checked)} />
            부적합(FAIL) 후보 해상도 포함 표시
          </label>
        </fieldset>

        <OptionsFieldset settings={settings} onChange={onSettingsChange} />
      </form>

      <section className="output">
        {!fps && (
          <ul className="errors">
            <li>목표 주사율(Frame Rate)은 0보다 커야 합니다.</li>
          </ul>
        )}
        {result && !result.supported && (
          <div className="verdict-banner verdict-fail">
            <div className="verdict-badge badge-fail">UNSUPPORTED</div>
            <div>
              <strong>선택한 SoC 아키텍처에서 해당 출력 인터페이스를 지원하지 않습니다.</strong>
            </div>
          </div>
        )}
        {result?.supported && (
          <div className="analysis-panel">
            <div className={passing.length > 0 ? 'verdict-banner verdict-pass' : 'verdict-banner verdict-fail'}>
              <div className={passing.length > 0 ? 'verdict-badge badge-pass' : 'verdict-badge badge-fail'}>
                {passing.length > 0 ? 'MAX ACHIEVABLE' : 'NO CANDIDATE'}
              </div>
              <div className="verdict-body">
                <strong>
                  {passing.length > 0
                    ? `최대 지원 가능 해상도: ${passing[0].resolution.width}×${passing[0].resolution.height} @ ${fps}Hz`
                    : `${fps}Hz 조건에서 출력 가능한 후보 해상도가 없습니다.`}
                </strong>
                <span>
                  전체 후보 {rows.length}개 중 적합(PASS) {passing.length}개 · 부적합(FAIL){' '}
                  {rows.length - passing.length}개 (행 클릭 시 하단에 상세 수식 및 대입 풀이 표시)
                </span>
              </div>
            </div>

            <section className="panel-section">
              <div className="section-header">
                <h3>1. 후보 해상도 적격성 평가 테이블 (Candidate Resolution Matrix)</h3>
                <span className="section-tag">행을 클릭하면 하단 수식 풀이가 갱신됩니다</span>
              </div>
              <table className="constraints explore">
                <thead>
                  <tr>
                    <th>후보 해상도</th>
                    <th>적용 타이밍 규격</th>
                    <th>Pixel Clock</th>
                    <th>핵심 병목 항목 (Primary Bottleneck)</th>
                    <th>요구값 / 한계값</th>
                    <th>여유 마진</th>
                    <th>판정</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((r) => {
                    const key = `${r.resolution.width}x${r.resolution.height}`
                    const isSelected =
                      selectedRow &&
                      selectedRow.resolution.width === r.resolution.width &&
                      selectedRow.resolution.height === r.resolution.height
                    return (
                      <ExploreTableRow
                        key={key}
                        row={r}
                        selected={Boolean(isSelected)}
                        onSelect={() => setSelectedKey(key)}
                      />
                    )
                  })}
                </tbody>
              </table>
            </section>

            {selectedRow && (
              <section className="panel-section">
                <div className="section-header">
                  <h3>
                    2. 선택 해상도 수식 및 대입 상세 분석:{' '}
                    {selectedRow.resolution.width}×{selectedRow.resolution.height} @ {fps}Hz
                  </h3>
                  <span className="section-tag">{selectedRow.timingSource}</span>
                </div>
                <ResultPanel
                  result={{ supported: true, pass: selectedRow.pass, constraints: selectedRow.constraints }}
                  timing={selectedRow.timing}
                  timingSource={selectedRow.timingSource}
                  dp={dpOptions}
                />
              </section>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

function ExploreTableRow({
  row,
  selected,
  onSelect,
}: {
  row: ExploreRow
  selected: boolean
  onSelect: () => void
}) {
  const rowClass = [
    !row.pass ? 'row-fail' : '',
    selected ? 'row-selected' : '',
    'row-clickable',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <tr className={rowClass} onClick={onSelect}>
      <td>
        <strong>
          {row.resolution.width}×{row.resolution.height}
        </strong>
      </td>
      <td>{row.timingSource}</td>
      <td>{formatMHz(pixelClockHz(row.timing))}</td>
      <td>{row.tightest.name}</td>
      <td>
        {formatValue(row.tightest.actual, row.tightest.unit)} / {formatValue(row.tightest.limit, row.tightest.unit)}
      </td>
      <td>{formatMargin(row.tightest.margin)}</td>
      <td>
        <span className={row.pass ? 'status-pill pill-pass' : 'status-pill pill-fail'}>
          {row.pass ? 'PASS' : 'FAIL'}
        </span>
      </td>
    </tr>
  )
}
