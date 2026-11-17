import { useEffect, useState } from 'react'
import { CHIPSETS } from './data/chipsets'
import { ExplorePage } from './ui/ExplorePage'
import {
  I18nContext,
  LANGUAGES,
  loadInitialLang,
  STORAGE_LANG_KEY,
  TRANSLATIONS,
  type LangCode,
} from './ui/i18n'
import { MstPage } from './ui/MstPage'
import { INITIAL_SETTINGS } from './ui/settings'
import { VerifyPage } from './ui/VerifyPage'

type Tab = 'verify' | 'explore' | 'mst'

const TAB_IDS: Tab[] = ['verify', 'explore', 'mst']

function App() {
  const [tab, setTab] = useState<Tab>('verify')
  const [settings, setSettings] = useState(INITIAL_SETTINGS)
  const [lang, setLang] = useState<LangCode>(loadInitialLang)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LANG_KEY, lang)
    } catch {
      // ignore storage errors
    }
    const found = LANGUAGES.find((l) => l.code === lang)
    if (found) {
      document.documentElement.lang = found.htmlLang
    }
  }, [lang])

  const t = TRANSLATIONS[lang]
  const activeChipset = CHIPSETS.find((c) => c.id === settings.chipsetId)

  return (
    <I18nContext.Provider value={lang}>
      <div className="app-shell">
        <header className="topbar">
          <div className="topbar-inner">
            <div className="brand-group">
              <div className="brand-badge">TELECHIPS VDST</div>
              <div>
                <h1 className="brand-title">VIOC Display Output &amp; Bandwidth Analyzer</h1>
                <p className="brand-subtitle">{t.brandSubtitle}</p>
              </div>
            </div>
            <div className="topbar-meta">
              <div className="meta-chip">
                <span className="meta-label">{t.metaActiveTarget}</span>
                <strong>
                  {activeChipset?.name ?? settings.chipsetId} · {t.outputLabels[settings.output]}
                </strong>
              </div>
              <div className="meta-chip">
                <span className="meta-label">{t.metaSpecBaseline}</span>
                <strong>{t.specSource}</strong>
              </div>
              <div className="meta-chip lang-chip">
                <span className="meta-label">{t.metaLanguage}</span>
                <div className="lang-switcher" role="group" aria-label={t.metaLanguage}>
                  {LANGUAGES.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      className={item.code === lang ? 'lang-btn lang-btn-active' : 'lang-btn'}
                      onClick={() => setLang(item.code)}
                      title={`${item.badge} — ${item.nativeName}`}
                    >
                      <span className="lang-badge">{item.badge}</span>
                      <span className="lang-native">{item.nativeName}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <nav className="nav-tabs" aria-label={t.navAriaLabel}>
            <div className="nav-tabs-inner">
              {TAB_IDS.map((id) => {
                const tabText = t.tabs[id]
                return (
                  <button
                    key={id}
                    type="button"
                    className={id === tab ? 'nav-tab nav-tab-active' : 'nav-tab'}
                    onClick={() => setTab(id)}
                  >
                    <span className="nav-tab-title">{tabText.title}</span>
                    <span className="nav-tab-sub">{tabText.subtitle}</span>
                  </button>
                )
              })}
            </div>
          </nav>
        </header>

        <main className="workspace">
          {tab === 'verify' && <VerifyPage settings={settings} onSettingsChange={setSettings} />}
          {tab === 'explore' && <ExplorePage settings={settings} onSettingsChange={setSettings} />}
          {tab === 'mst' && <MstPage settings={settings} onSettingsChange={setSettings} />}
        </main>
      </div>
    </I18nContext.Provider>
  )
}

export default App
