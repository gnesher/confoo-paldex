import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tsconfigPaths from 'vite-tsconfig-paths'
import { paldexApiPlugin } from './server/api-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    paldexApiPlugin(),
    vue(),
    vueJsx(),
  ],
  server: {
    port: 3000,
  },
})
