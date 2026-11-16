import { dpMstPbnPerSlot, dpMstStreamPbn, dpMstTimeSlots } from '../core/constraints/dpMst'
import { dpLinkSymbolSlots, type DpSstOptions } from '../core/constraints/dpSst'
import { tightestConstraint, type ConstraintResult } from '../core/constraints/result'
import { describeTimingDerivation, pixelClockHz, type Timing } from '../core/timing'
import type { VerifyResult } from '../core/verify'
import { formatMargin, formatMHz, formatValue } from './format'

type Props = {
  result: VerifyResult
  timing: Timing
  timingSource: string
  dp?: DpSstOptions
}

export function ResultPanel({ result, timing, timingSource, dp }: Props) {
  if (!result.supported) {
    return (
      <div className="verdict-banner verdict-fail">
        <div className="verdict-badge badge-fail">UNSUPPORTED</div>
        <div>
          <strong>선택한 SoC 아키텍처에서 해당 출력 인터페이스를 지원하지 않습니다.</strong>
          <p>좌측 타깃 아키텍처 설정에서 지원되는 인터페이스 조합을 선택하십시오.</p>
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

  return (
    <div className="analysis-panel">
      <div className={result.pass ? 'verdict-banner verdict-pass' : 'verdict-banner verdict-fail'}>
        <div className={result.pass ? 'verdict-badge badge-pass' : 'verdict-badge badge-fail'}>
          {result.pass ? 'COMPLIANT (적합)' : 'NON-COMPLIANT (부적합)'}
        </div>
        <div className="verdict-body">
          <strong>
            {timing.hActive}×{timing.vActive} @ {timing.fps}Hz —{' '}
            {result.pass ? '모든 하드웨어 및 링크 대역폭 제약을 충족합니다.' : '하드웨어 또는 링크 대역폭 한계를 초과했습니다.'}
          </strong>
          <span>
            {result.pass
              ? `최소 여유 항목 (Primary Bottleneck): ${tightest.name} · 점유율 ${peakUtilization.toFixed(1)}% (여유 마진 ${formatMargin(tightest.margin)})`
              : `위반 항목: ${result.constraints
                  .filter((c) => !c.pass)
                  .map((c) => `${c.name} (${formatValue(c.actual, c.unit)} > ${formatValue(c.limit, c.unit)})`)
                  .join(' / ')}`}
          </span>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">PIXEL CLOCK</span>
          <strong className="kpi-value">{formatMHz(pclkHz)}</strong>
          <span className="kpi-sub">
            Total {timing.hTotal}×{timing.vTotal} ({timingSource})
          </span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">ACTIVE / BLANKING RATIO</span>
          <strong className="kpi-value">{activeRatio.toFixed(1)}% Active</strong>
          <span className="kpi-sub">
            H-Blank +{timing.hTotal - timing.hActive}px · V-Blank +{timing.vTotal - timing.vActive}lines
          </span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">PRIMARY BOTTLENECK</span>
          <strong className="kpi-value">{tightest.name}</strong>
          <span className="kpi-sub">
            {formatValue(tightest.actual, tightest.unit)} / {formatValue(tightest.limit, tightest.unit)}
          </span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">PEAK UTILIZATION / HEADROOM</span>
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
          <h3>1. 타이밍 및 픽셀 클럭 산출 수식 (Timing &amp; Pixel Clock Derivation)</h3>
          <span className="section-tag">{timingSource}</span>
        </div>
        <div className="formula-stack">
          <div className="formula-card">
            <div className="formula-card-head">
              <strong>Total 해상도 산출 (H_total × V_total)</strong>
              <span className="formula-result-pill">
                {timing.hTotal} × {timing.vTotal}
              </span>
            </div>
            <div className="formula-grid">
              <span className="formula-tag">적용 수식</span>
              <code>{derivation.blankingFormula}</code>
              <span className="formula-tag">값 대입</span>
              <code>{derivation.blankingSubstitution}</code>
            </div>
          </div>

          <div className="formula-card">
            <div className="formula-card-head">
              <strong>픽셀 클럭 산출 (Pixel Clock)</strong>
              <span className="formula-result-pill">{formatMHz(pclkHz)}</span>
            </div>
            <div className="formula-grid">
              <span className="formula-tag">적용 수식</span>
              <code>{derivation.clockFormula}</code>
              <span className="formula-tag">값 대입</span>
              <code>{derivation.clockSubstitution}</code>
            </div>
          </div>

          {symbolInfo && (
            <div className="formula-card">
              <div className="formula-card-head">
                <strong>DisplayPort Transfer Unit (TU) 필요 심볼 슬롯 (TRM 10.1.1 Table 10.4)</strong>
                <span className="formula-result-pill">
                  {symbolInfo.slots} / 64 slots ({symbolInfo.exact.toFixed(2)})
                </span>
              </div>
              <div className="formula-grid">
                <span className="formula-tag">적용 수식</span>
                <code>{symbolInfo.expression}</code>
                <span className="formula-tag">값 대입</span>
                <code>{symbolInfo.substitution}</code>
              </div>
            </div>
          )}

          {mstPbn !== undefined && mstPbnPerSlot !== undefined && mstSlots !== undefined && (
            <div className="formula-card">
              <div className="formula-card-head">
                <strong>DP MST Payload Bandwidth Number (PBN) &amp; Time Slot (Table 2~4)</strong>
                <span className="formula-result-pill">
                  {mstPbn} PBN → {mstSlots} / 63 slots
                </span>
              </div>
              <div className="formula-grid">
                <span className="formula-tag">적용 수식</span>
                <code>
                  PBN = CEIL((PixelClock_Hz × BPP × 1.006 × FEC) / 6,750,000), Time_Slots = CEIL(PBN /{' '}
                  {mstPbnPerSlot})
                </code>
                <span className="formula-tag">값 대입</span>
                <code>
                  1 Slot 당 {mstPbnPerSlot} PBN ({dp?.linkRate} × {dp?.lanes} lanes) → 스트림 요구 {mstPbn} PBN →{' '}
                  {mstSlots} Time Slots 할당
                </code>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="panel-section">
        <div className="section-header">
          <h3>2. 제약 조건 적합성 매트릭스 (Constraint Compliance Matrix)</h3>
          <span className="section-tag">총 {result.constraints.length}개 항목 검증</span>
        </div>
        <table className="constraints">
          <thead>
            <tr>
              <th>검증 항목 (Constraint)</th>
              <th>산출 요구값 (Actual)</th>
              <th>허용 한계값 (Limit)</th>
              <th>링크/자원 점유율</th>
              <th>여유 마진</th>
              <th>판정</th>
            </tr>
          </thead>
          <tbody>
            {result.constraints.map((c) => (
              <ConstraintRow key={c.name} constraint={c} tightest={c === tightest} />
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel-section">
        <div className="section-header">
          <h3>3. 항목별 적용 수식 및 값 대입 상세 풀이 (Detailed Formula &amp; Substitution Breakdown)</h3>
          <span className="section-tag">Step-by-Step Verification</span>
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
                    <strong>{c.name}</strong>
                    {c === tightest && <span className="bottleneck-tag">PRIMARY BOTTLENECK</span>}
                  </div>
                  <span className="formula-result-pill">
                    {formatValue(c.actual, c.unit)} ≤ {formatValue(c.limit, c.unit)} (점유율 {util.toFixed(1)}% · 여유{' '}
                    {formatMargin(c.margin)})
                  </span>
                </div>
                {c.formula && (
                  <div className="formula-grid">
                    <span className="formula-tag">판정 부등식</span>
                    <code>{c.formula.expression}</code>
                    <span className="formula-tag">요구값 대입</span>
                    <code>{c.formula.actualSubstitution}</code>
                    <span className="formula-tag">한계값 대입</span>
                    <code>{c.formula.limitSubstitution}</code>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <p className="source-note">스펙 근거: {tightest.source}</p>
      </section>
    </div>
  )
}

function ConstraintRow({ constraint: c, tightest }: { constraint: ConstraintResult; tightest: boolean }) {
  const className = !c.pass ? 'row-fail' : tightest ? 'row-tightest' : undefined
  const util = (c.actual / c.limit) * 100
  return (
    <tr className={className}>
      <td>
        <div className="cell-title">
          <span>{c.name}</span>
          {tightest && <span className="mini-badge">병목</span>}
        </div>
      </td>
      <td>{formatValue(c.actual, c.unit)}</td>
      <td>{formatValue(c.limit, c.unit)}</td>
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
