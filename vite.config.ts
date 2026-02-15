import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { paldexApiPlugin } from './server/api-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    paldexApiPlugin(),
    react(),
  ],
  server: {
    port: 3000,
  },
})
