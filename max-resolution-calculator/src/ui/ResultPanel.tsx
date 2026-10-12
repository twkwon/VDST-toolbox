import { tightestConstraint, type ConstraintResult } from '../core/constraints/result'
import { pixelClockHz, type Timing } from '../core/timing'
import type { VerifyResult } from '../core/verify'
import { formatMargin, formatMHz, formatValue } from './format'

type Props = {
  result: VerifyResult
  timing: Timing
  timingSource: string
}

export function ResultPanel({ result, timing, timingSource }: Props) {
  if (!result.supported) {
    return <div className="verdict verdict-unsupported">이 칩셋은 선택한 출력을 지원하지 않습니다.</div>
  }

  const tightest = tightestConstraint(result.constraints)

  return (
    <div className="result">
      <div className={result.pass ? 'verdict verdict-pass' : 'verdict verdict-fail'}>
        <strong>{result.pass ? '출력 가능' : '출력 불가'}</strong>
        <span>
          {result.pass
            ? `가장 여유가 적은 조건: ${tightest.name} (여유 ${formatMargin(tightest.margin)})`
            : `불가 조건: ${result.constraints
                .filter((c) => !c.pass)
                .map((c) => c.name)
                .join(', ')}`}
        </span>
      </div>

      <dl className="timing-summary">
        <dt>타이밍 출처</dt>
        <dd>{timingSource}</dd>
        <dt>Htotal × Vtotal</dt>
        <dd>
          {timing.hTotal} × {timing.vTotal}
        </dd>
        <dt>Pixel Clock</dt>
        <dd>{formatMHz(pixelClockHz(timing))}</dd>
      </dl>

      <table className="constraints">
        <thead>
          <tr>
            <th>조건</th>
            <th>실제값</th>
            <th>한계값</th>
            <th>여유</th>
            <th>결과</th>
          </tr>
        </thead>
        <tbody>
          {result.constraints.map((c) => (
            <ConstraintRow key={c.name} constraint={c} tightest={c === tightest} />
          ))}
        </tbody>
      </table>
      <p className="source-note">근거: {tightest.source}</p>
    </div>
  )
}

function ConstraintRow({ constraint: c, tightest }: { constraint: ConstraintResult; tightest: boolean }) {
  const className = !c.pass ? 'row-fail' : tightest ? 'row-tightest' : undefined
  return (
    <tr className={className}>
      <td>{c.name}</td>
      <td>{formatValue(c.actual, c.unit)}</td>
      <td>{formatValue(c.limit, c.unit)}</td>
      <td>{formatMargin(c.margin)}</td>
      <td>{c.pass ? '가능' : '불가'}</td>
    </tr>
  )
}
