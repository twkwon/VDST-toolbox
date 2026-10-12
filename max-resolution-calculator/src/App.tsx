import { SPEC_SOURCE } from './data/chipsets'
import { VerifyPage } from './ui/VerifyPage'

function App() {
  return (
    <div className="app">
      <header>
        <h1>최대 출력 해상도 Calculator</h1>
        <p className="provisional">
          잠정 기준: {SPEC_SOURCE} + 담당자 미확인 가정 포함 (docs/decisions-for-confirmation.md)
        </p>
      </header>
      <main>
        <VerifyPage />
      </main>
    </div>
  )
}

export default App
