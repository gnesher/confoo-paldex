import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { paldexApiPlugin } from './server/api-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'vue',
      routesDirectory: './app/routes',
      generatedRouteTree: './app/routeTree.gen.ts',
      autoCodeSplitting: true,
    }),
    tsconfigPaths(),
    paldexApiPlugin(),
    vue(),
    vueJsx(),
  ],
  server: {
    port: 3000,
  },
})
