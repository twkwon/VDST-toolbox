import { useState } from 'react'
import { explore, type ExploreRow } from '../core/explore'
import { pixelClockHz } from '../core/timing'
import { parsePositive } from './form'
import { formatMargin, formatMHz, formatValue } from './format'
import { translateConstraintName, translateTimingSource, useI18n, type LangCode } from './i18n'
import { ResultPanel } from './ResultPanel'
import { dpOptionsFor, dsiOptionsFor, hdmiOptionsFor, type Settings } from './settings'
import { FallbackSelect, OptionsFieldset, TargetFieldset } from './SettingsFields'

type Props = {
  settings: Settings
  onSettingsChange: (settings: Settings) => void
}

export function ExplorePage({ settings, onSettingsChange }: Props) {
  const { lang, t } = useI18n()
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
          <legend>{t.exploreSweepLegend}</legend>
          <label>
            {t.exploreTargetFpsLabel}
            <input inputMode="decimal" value={fpsText} onChange={(e) => setFpsText(e.target.value)} />
          </label>
          <FallbackSelect settings={settings} onChange={onSettingsChange} />
          <label className="check">
            <input type="checkbox" checked={showFailed} onChange={(e) => setShowFailed(e.target.checked)} />
            {t.exploreShowFailedLabel}
          </label>
        </fieldset>

        <OptionsFieldset settings={settings} onChange={onSettingsChange} />
      </form>

      <section className="output">
        {!fps && (
          <ul className="errors">
            <li>{t.exploreErrFpsPositive}</li>
          </ul>
        )}
        {result && !result.supported && (
          <div className="verdict-banner verdict-fail">
            <div className="verdict-badge badge-fail">UNSUPPORTED</div>
            <div>
              <strong>{t.unsupportedTitle}</strong>
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
                    ? t.exploreMaxAchievableTitle(passing[0].resolution.width, passing[0].resolution.height, fps!)
                    : t.exploreNoCandidateTitle(fps!)}
                </strong>
                <span>{t.exploreSummaryText(rows.length, passing.length, rows.length - passing.length)}</span>
              </div>
            </div>

            <section className="panel-section">
              <div className="section-header">
                <h3>{t.exploreSection1Title}</h3>
                <span className="section-tag">{t.exploreSection1Tag}</span>
              </div>
              <table className="constraints explore">
                <thead>
                  <tr>
                    <th>{t.exploreColResolution}</th>
                    <th>{t.exploreColTimingSpec}</th>
                    <th>{t.exploreColPixelClock}</th>
                    <th>{t.exploreColBottleneck}</th>
                    <th>{t.exploreColActualLimit}</th>
                    <th>{t.exploreColMargin}</th>
                    <th>{t.exploreColVerdict}</th>
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
                        lang={lang}
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
                    {t.exploreSection2Title(
                      selectedRow.resolution.width,
                      selectedRow.resolution.height,
                      fps!,
                    )}
                  </h3>
                  <span className="section-tag">{translateTimingSource(selectedRow.timingSource, lang)}</span>
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
  lang,
  selected,
  onSelect,
}: {
  row: ExploreRow
  lang: LangCode
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
      <td>{translateTimingSource(row.timingSource, lang)}</td>
      <td>{formatMHz(pixelClockHz(row.timing))}</td>
      <td>{translateConstraintName(row.tightest.name, lang)}</td>
      <td>
        {formatValue(row.tightest.actual, row.tightest.unit, lang)} /{' '}
        {formatValue(row.tightest.limit, row.tightest.unit, lang)}
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
