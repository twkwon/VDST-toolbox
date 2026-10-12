import { useState } from 'react'
import { SPEC_SOURCE } from './data/chipsets'
import { ExplorePage } from './ui/ExplorePage'
import { INITIAL_SETTINGS } from './ui/settings'
import { VerifyPage } from './ui/VerifyPage'

type Tab = 'verify' | 'explore'

const TABS: { id: Tab; label: string }[] = [
  { id: 'verify', label: '검증: 이 해상도가 되나?' },
  { id: 'explore', label: '탐색: 어디까지 되나?' },
]

function App() {
  const [tab, setTab] = useState<Tab>('verify')
  const [settings, setSettings] = useState(INITIAL_SETTINGS)

  return (
    <div className="app">
      <header>
        <h1>최대 출력 해상도 Calculator</h1>
        <p className="provisional">
          잠정 기준: {SPEC_SOURCE} + 담당자 미확인 가정 포함 (docs/decisions-for-confirmation.md)
        </p>
        <nav className="tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={t.id === tab ? 'tab tab-active' : 'tab'}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      <main>
        {tab === 'verify' ? (
          <VerifyPage settings={settings} onSettingsChange={setSettings} />
        ) : (
          <ExplorePage settings={settings} onSettingsChange={setSettings} />
        )}
      </main>
    </div>
  )
}

export default App
