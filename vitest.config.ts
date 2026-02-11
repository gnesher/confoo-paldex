import { defineConfig } from 'vitest/config'
import solid from 'vite-plugin-solid'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [solid()],
  test: {
    globals: true,
    setupFiles: ['./tests/setup.browser.ts'],
    include: [
      'tests/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'app/**/*.{test,spec}.{js,ts,jsx,tsx}',
    ],
    exclude: [
      'node_modules/**',
    ],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      headless: false,
      viewport: { width: 1280, height: 720 },
    },
  },
  resolve: {
    alias: {
      '~': '/app',
    },
  },
})
