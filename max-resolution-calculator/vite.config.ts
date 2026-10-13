import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // 상대 경로로 빌드해 GitHub Pages 하위 경로와 사내 서버 어느 경로에 올려도 동작하게 한다.
  base: './',
  plugins: [react()],
})
