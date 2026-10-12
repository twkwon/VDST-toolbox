import { DP_LANE_COUNTS, DP_LINK_RATES, type DpLaneCount, type DpLinkRate, type OutputId } from '../core/spec'
import type { FallbackTimingMethod } from '../core/timing'
import { CHIPSETS } from '../data/chipsets'
import { FALLBACK_LABELS, OUTPUT_LABELS } from './labels'
import { outputsOf, withChipset, type Settings } from './settings'

type Props = {
  settings: Settings
  onChange: (settings: Settings) => void
}

export function TargetFieldset({ settings, onChange }: Props) {
  return (
    <fieldset>
      <legend>대상</legend>
      <label>
        칩셋
        <select value={settings.chipsetId} onChange={(e) => onChange(withChipset(settings, e.target.value))}>
          {CHIPSETS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        출력
        <select
          value={settings.output}
          onChange={(e) => onChange({ ...settings, output: e.target.value as OutputId })}
        >
          {outputsOf(settings.chipsetId).map((o) => (
            <option key={o} value={o}>
              {OUTPUT_LABELS[o]}
            </option>
          ))}
        </select>
      </label>
    </fieldset>
  )
}

export function FallbackSelect({ settings, onChange, disabled }: Props & { disabled?: boolean }) {
  return (
    <label>
      CEA-861에 없을 때 계산 방식
      <select
        value={settings.fallback}
        disabled={disabled}
        onChange={(e) => onChange({ ...settings, fallback: e.target.value as FallbackTimingMethod })}
      >
        {(Object.keys(FALLBACK_LABELS) as FallbackTimingMethod[]).map((m) => (
          <option key={m} value={m}>
            {FALLBACK_LABELS[m]}
          </option>
        ))}
      </select>
    </label>
  )
}

export function OptionsFieldset({ settings, onChange }: Props) {
  const chipset = CHIPSETS.find((c) => c.id === settings.chipsetId)
  const dpSpec = chipset?.outputs.dp?.kind === 'dp' ? chipset.outputs.dp : undefined
  const { dp } = settings
  const setDp = (next: Partial<Settings['dp']>) => onChange({ ...settings, dp: { ...dp, ...next } })

  return (
    <fieldset>
      <legend>옵션</legend>
      <label className="check">
        <input
          type="checkbox"
          checked={settings.scaler}
          onChange={(e) => onChange({ ...settings, scaler: e.target.checked })}
        />
        Scaler 사용 (출력 Width ≤ 4088 가정)
      </label>
      {settings.output === 'dp' && dpSpec && (
        <>
          <div className="row">
            <label>
              Link Rate
              <select value={dp.linkRate} onChange={(e) => setDp({ linkRate: e.target.value as DpLinkRate })}>
                {DP_LINK_RATES.slice(0, DP_LINK_RATES.indexOf(dpSpec.maxLinkRate) + 1).map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Lane
              <select value={dp.lanes} onChange={(e) => setDp({ lanes: Number(e.target.value) as DpLaneCount })}>
                {DP_LANE_COUNTS.filter((n) => n <= dpSpec.maxLanes).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="check">
            <input type="checkbox" checked={dp.fec} onChange={(e) => setDp({ fec: e.target.checked })} />
            FEC
          </label>
          <label className="check">
            <input type="checkbox" checked={dp.ssc} onChange={(e) => setDp({ ssc: e.target.checked })} />
            SSC
          </label>
        </>
      )}
    </fieldset>
  )
}
