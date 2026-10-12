import { SPEC_SOURCE } from '../../data/chipsets'

export type ConstraintUnit = 'bps' | 'px' | 'pixels' | 'fps'

export type ConstraintResult = {
  name: string
  pass: boolean
  actual: number
  limit: number
  unit: ConstraintUnit
  margin: number
  source: string
}

// 한계값이 0.8 같은 소수 계수의 곱이라 부동소수 오차로 경계값(같거나 작으면 가능)이 뒤집히지 않게 한다.
const RELATIVE_TOLERANCE = 1e-9

export function atMost(
  name: string,
  actual: number,
  limit: number,
  unit: ConstraintUnit,
  source: string = SPEC_SOURCE,
): ConstraintResult {
  return {
    name,
    pass: actual <= limit * (1 + RELATIVE_TOLERANCE),
    actual,
    limit,
    unit,
    margin: (limit - actual) / limit,
    source,
  }
}
