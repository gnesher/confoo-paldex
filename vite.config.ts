import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { paldexApiPlugin } from './server/api-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'solid',
      routesDirectory: './app/routes',
      generatedRouteTree: './app/routeTree.gen.ts',
      autoCodeSplitting: true,
    }),
    tsconfigPaths(),
    paldexApiPlugin(),
    solid(),
  ],
  server: {
    port: 3000,
  },
})
