import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.jsdom.ts'],
    include: [
      '**/*.jsdom.test.{js,ts,jsx,tsx}',
    ],
  },
  resolve: {
    alias: {
      '~': '/app',
    },
  },
})
