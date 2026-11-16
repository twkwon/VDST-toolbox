import { useState } from 'react'
import { CHIPSETS, SPEC_SOURCE } from './data/chipsets'
import { ExplorePage } from './ui/ExplorePage'
import { OUTPUT_LABELS } from './ui/labels'
import { MstPage } from './ui/MstPage'
import { INITIAL_SETTINGS } from './ui/settings'
import { VerifyPage } from './ui/VerifyPage'

type Tab = 'verify' | 'explore' | 'mst'

const TABS: { id: Tab; title: string; subtitle: string }[] = [
  {
    id: 'verify',
    title: '단일 해상도 타이밍·대역폭 검증',
    subtitle: 'Single-Stream Timing & Bandwidth Compliance',
  },
  {
    id: 'explore',
    title: '최대 지원 해상도 탐색',
    subtitle: 'Maximum Achievable Resolution Explorer',
  },
  {
    id: 'mst',
    title: 'DP MST 다중 스트림 시뮬레이터',
    subtitle: 'Multi-Stream PBN & Time Slot Topology Analyzer',
  },
]

function App() {
  const [tab, setTab] = useState<Tab>('verify')
  const [settings, setSettings] = useState(INITIAL_SETTINGS)
  const activeChipset = CHIPSETS.find((c) => c.id === settings.chipsetId)

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand-group">
            <div className="brand-badge">TELECHIPS VDST</div>
            <div>
              <h1 className="brand-title">VIOC Display Output &amp; Bandwidth Analyzer</h1>
              <p className="brand-subtitle">
                차량용 SoC 디스플레이 서브시스템 타이밍 · 링크 대역폭 · 수식 검증 워크벤치
              </p>
            </div>
          </div>
          <div className="topbar-meta">
            <div className="meta-chip">
              <span className="meta-label">ACTIVE TARGET</span>
              <strong>
                {activeChipset?.name ?? settings.chipsetId} · {OUTPUT_LABELS[settings.output]}
              </strong>
            </div>
            <div className="meta-chip">
              <span className="meta-label">SPECIFICATION BASELINE</span>
              <strong>{SPEC_SOURCE}</strong>
            </div>
          </div>
        </div>

        <nav className="nav-tabs" aria-label="분석 모드 선택">
          <div className="nav-tabs-inner">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={t.id === tab ? 'nav-tab nav-tab-active' : 'nav-tab'}
                onClick={() => setTab(t.id)}
              >
                <span className="nav-tab-title">{t.title}</span>
                <span className="nav-tab-sub">{t.subtitle}</span>
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="workspace">
        {tab === 'verify' && <VerifyPage settings={settings} onSettingsChange={setSettings} />}
        {tab === 'explore' && <ExplorePage settings={settings} onSettingsChange={setSettings} />}
        {tab === 'mst' && <MstPage settings={settings} onSettingsChange={setSettings} />}
      </main>
    </div>
  )
}

export default App
