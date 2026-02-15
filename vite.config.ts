import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tsconfigPaths from 'vite-tsconfig-paths'
import { paldexApiPlugin } from './server/api-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    paldexApiPlugin(),
    solid(),
  ],
  server: {
    port: 3000,
  },
})
