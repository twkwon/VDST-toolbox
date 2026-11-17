import { dpMstPbnPerSlot, dpMstStreamPbn, dpMstTimeSlots } from '../core/constraints/dpMst'
import { dpLinkSymbolSlots, type DpSstOptions } from '../core/constraints/dpSst'
import { tightestConstraint, type ConstraintResult } from '../core/constraints/result'
import { describeTimingDerivation, pixelClockHz, type Timing } from '../core/timing'
import type { VerifyResult } from '../core/verify'
import { formatMargin, formatMHz, formatValue } from './format'
import {
  translateConstraintName,
  translateFormulaText,
  translateTimingSource,
  useI18n,
  type LangCode,
} from './i18n'

type Props = {
  result: VerifyResult
  timing: Timing
  timingSource: string
  dp?: DpSstOptions
}

export function ResultPanel({ result, timing, timingSource, dp }: Props) {
  const { lang, t } = useI18n()

  if (!result.supported) {
    return (
      <div className="verdict-banner verdict-fail">
        <div className="verdict-badge badge-fail">UNSUPPORTED</div>
        <div>
          <strong>{t.unsupportedTitle}</strong>
          <p>{t.unsupportedDesc}</p>
        </div>
      </div>
    )
  }

  const tightest = tightestConstraint(result.constraints)
  const pclkHz = pixelClockHz(timing)
  const activePixels = timing.hActive * timing.vActive
  const totalPixels = timing.hTotal * timing.vTotal
  const activeRatio = (activePixels / totalPixels) * 100
  const derivation = describeTimingDerivation(timing, timingSource)

  const symbolInfo = dp ? dpLinkSymbolSlots(timing, dp) : undefined
  const mstPbn = dp && dp.mode === 'mst' ? dpMstStreamPbn(timing, dp) : undefined
  const mstPbnPerSlot = dp && dp.mode === 'mst' ? dpMstPbnPerSlot(dp.linkRate, dp.lanes) : undefined
  const mstSlots = dp && dp.mode === 'mst' ? dpMstTimeSlots(timing, dp) : undefined
  const peakUtilization = (tightest.actual / tightest.limit) * 100
  const displayTimingSource = translateTimingSource(timingSource, lang)

  return (
    <div className="analysis-panel">
      <div className={result.pass ? 'verdict-banner verdict-pass' : 'verdict-banner verdict-fail'}>
        <div className={result.pass ? 'verdict-badge badge-pass' : 'verdict-badge badge-fail'}>
          {result.pass ? t.verdictCompliant : t.verdictNonCompliant}
        </div>
        <div className="verdict-body">
          <strong>
            {timing.hActive}×{timing.vActive} @ {timing.fps}Hz —{' '}
            {result.pass ? t.verdictPassHeadline : t.verdictFailHeadline}
          </strong>
          <span>
            {result.pass
              ? t.verdictPassDetail(
                  translateConstraintName(tightest.name, lang),
                  peakUtilization.toFixed(1),
                  formatMargin(tightest.margin),
                )
              : `${t.verdictFailDetailPrefix}: ${result.constraints
                  .filter((c) => !c.pass)
                  .map(
                    (c) =>
                      `${translateConstraintName(c.name, lang)} (${formatValue(c.actual, c.unit, lang)} > ${formatValue(c.limit, c.unit, lang)})`,
                  )
                  .join(' / ')}`}
          </span>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">{t.kpiPixelClock}</span>
          <strong className="kpi-value">{formatMHz(pclkHz)}</strong>
          <span className="kpi-sub">
            Total {timing.hTotal}×{timing.vTotal} ({displayTimingSource})
          </span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">{t.kpiActiveBlanking}</span>
          <strong className="kpi-value">{activeRatio.toFixed(1)}% Active</strong>
          <span className="kpi-sub">
            H-Blank +{timing.hTotal - timing.hActive}px · V-Blank +{timing.vTotal - timing.vActive}lines
          </span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">{t.kpiPrimaryBottleneck}</span>
          <strong className="kpi-value">{translateConstraintName(tightest.name, lang)}</strong>
          <span className="kpi-sub">
            {formatValue(tightest.actual, tightest.unit, lang)} / {formatValue(tightest.limit, tightest.unit, lang)}
          </span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">{t.kpiPeakUtilization}</span>
          <strong className="kpi-value">
            {peakUtilization.toFixed(1)}% / {formatMargin(tightest.margin)}
          </strong>
          <div className="util-bar-track">
            <div
              className={
                !tightest.pass
                  ? 'util-bar-fill util-danger'
                  : peakUtilization > 85
                    ? 'util-bar-fill util-warn'
                    : 'util-bar-fill util-ok'
              }
              style={{ width: `${Math.min(100, Math.max(0, peakUtilization))}%` }}
            />
          </div>
        </div>
      </div>

      <section className="panel-section">
        <div className="section-header">
          <h3>{t.resultSection1Title}</h3>
          <span className="section-tag">{displayTimingSource}</span>
        </div>
        <div className="formula-stack">
          <div className="formula-card">
            <div className="formula-card-head">
              <strong>{t.totalResCardTitle}</strong>
              <span className="formula-result-pill">
                {timing.hTotal} × {timing.vTotal}
              </span>
            </div>
            <div className="formula-grid">
              <span className="formula-tag">{t.tagAppliedFormula}</span>
              <code>{translateFormulaText(derivation.blankingFormula, lang)}</code>
              <span className="formula-tag">{t.tagValueSubstitution}</span>
              <code>{translateFormulaText(derivation.blankingSubstitution, lang)}</code>
            </div>
          </div>

          <div className="formula-card">
            <div className="formula-card-head">
              <strong>{t.pixelClockCardTitle}</strong>
              <span className="formula-result-pill">{formatMHz(pclkHz)}</span>
            </div>
            <div className="formula-grid">
              <span className="formula-tag">{t.tagAppliedFormula}</span>
              <code>{derivation.clockFormula}</code>
              <span className="formula-tag">{t.tagValueSubstitution}</span>
              <code>{derivation.clockSubstitution}</code>
            </div>
          </div>

          {symbolInfo && (
            <div className="formula-card">
              <div className="formula-card-head">
                <strong>{t.dpTuCardTitle}</strong>
                <span className="formula-result-pill">
                  {symbolInfo.slots} / 64 slots ({symbolInfo.exact.toFixed(2)})
                </span>
              </div>
              <div className="formula-grid">
                <span className="formula-tag">{t.tagAppliedFormula}</span>
                <code>{symbolInfo.expression}</code>
                <span className="formula-tag">{t.tagValueSubstitution}</span>
                <code>{symbolInfo.substitution}</code>
              </div>
            </div>
          )}

          {mstPbn !== undefined && mstPbnPerSlot !== undefined && mstSlots !== undefined && dp && (
            <div className="formula-card">
              <div className="formula-card-head">
                <strong>{t.dpMstPbnCardTitle}</strong>
                <span className="formula-result-pill">
                  {mstPbn} PBN → {mstSlots} / 63 slots
                </span>
              </div>
              <div className="formula-grid">
                <span className="formula-tag">{t.tagAppliedFormula}</span>
                <code>
                  PBN = CEIL((PixelClock_Hz × BPP × 1.006 × FEC) / 6,750,000), Time_Slots = CEIL(PBN /{' '}
                  {mstPbnPerSlot})
                </code>
                <span className="formula-tag">{t.tagValueSubstitution}</span>
                <code>
                  {t.dpMstPbnSubstitution(mstPbnPerSlot, dp.linkRate, dp.lanes, mstPbn, mstSlots)}
                </code>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="panel-section">
        <div className="section-header">
          <h3>{t.resultSection2Title}</h3>
          <span className="section-tag">{t.resultSection2Tag(result.constraints.length)}</span>
        </div>
        <table className="constraints">
          <thead>
            <tr>
              <th>{t.colConstraint}</th>
              <th>{t.colActual}</th>
              <th>{t.colLimit}</th>
              <th>{t.colUtilization}</th>
              <th>{t.colMargin}</th>
              <th>{t.colVerdict}</th>
            </tr>
          </thead>
          <tbody>
            {result.constraints.map((c) => (
              <ConstraintRow
                key={c.name}
                constraint={c}
                tightest={c === tightest}
                lang={lang}
                miniBadge={t.miniBadgeBottleneck}
              />
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel-section">
        <div className="section-header">
          <h3>{t.resultSection3Title}</h3>
          <span className="section-tag">{t.resultSection3Tag}</span>
        </div>
        <div className="formula-stack">
          {result.constraints.map((c) => {
            const util = (c.actual / c.limit) * 100
            return (
              <div
                key={c.name}
                className={
                  !c.pass
                    ? 'formula-card formula-card-fail'
                    : c === tightest
                      ? 'formula-card formula-card-tightest'
                      : 'formula-card'
                }
              >
                <div className="formula-card-head">
                  <div className="formula-title-group">
                    <span className={c.pass ? 'status-pill pill-pass' : 'status-pill pill-fail'}>
                      {c.pass ? 'PASS' : 'FAIL'}
                    </span>
                    <strong>{translateConstraintName(c.name, lang)}</strong>
                    {c === tightest && <span className="bottleneck-tag">{t.primaryBottleneckBadge}</span>}
                  </div>
                  <span className="formula-result-pill">
                    {t.formulaPillSummary(
                      formatValue(c.actual, c.unit, lang),
                      formatValue(c.limit, c.unit, lang),
                      util.toFixed(1),
                      formatMargin(c.margin),
                    )}
                  </span>
                </div>
                {c.formula && (
                  <div className="formula-grid">
                    <span className="formula-tag">{t.tagInequality}</span>
                    <code>{translateFormulaText(c.formula.expression, lang)}</code>
                    <span className="formula-tag">{t.tagActualSubstitution}</span>
                    <code>{translateFormulaText(c.formula.actualSubstitution, lang)}</code>
                    <span className="formula-tag">{t.tagLimitSubstitution}</span>
                    <code>{translateFormulaText(c.formula.limitSubstitution, lang)}</code>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <p className="source-note">{t.specBasisNote(t.specSource)}</p>
      </section>
    </div>
  )
}

function ConstraintRow({
  constraint: c,
  tightest,
  lang,
  miniBadge,
}: {
  constraint: ConstraintResult
  tightest: boolean
  lang: LangCode
  miniBadge: string
}) {
  const className = !c.pass ? 'row-fail' : tightest ? 'row-tightest' : undefined
  const util = (c.actual / c.limit) * 100
  return (
    <tr className={className}>
      <td>
        <div className="cell-title">
          <span>{translateConstraintName(c.name, lang)}</span>
          {tightest && <span className="mini-badge">{miniBadge}</span>}
        </div>
      </td>
      <td>{formatValue(c.actual, c.unit, lang)}</td>
      <td>{formatValue(c.limit, c.unit, lang)}</td>
      <td className="util-cell">
        <div className="table-util-wrap">
          <div className="util-bar-track">
            <div
              className={
                !c.pass ? 'util-bar-fill util-danger' : util > 85 ? 'util-bar-fill util-warn' : 'util-bar-fill util-ok'
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
}
