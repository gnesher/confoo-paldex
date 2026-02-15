import path from 'node:path'
import type { Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

/**
 * Vite dev-server plugin that mounts REST API routes under /api.
 *
 * Routes:
 *   GET /api/pals            — list (with optional query-string filters)
 *   GET /api/pals/:id        — single pal by id
 *
 * The data lives in app/utils/pals.data.ts and is imported dynamically so
 * that HMR keeps working during development.
 */
export function paldexApiPlugin(): Plugin {
  let dataModulePath: string

  return {
    name: 'paldex-api',
    configResolved(config) {
      // Resolve the absolute path so ssrLoadModule can find the module
      // regardless of path-alias configuration.
      dataModulePath = path.resolve(config.root, 'app/utils/pals.data.ts')
    },
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const url = new URL(req.url ?? '/', `http://${req.headers.host}`)

        // --- GET /api/pals ---
        if (url.pathname === '/api/pals' && req.method === 'GET') {
          try {
            // Use Vite's ssrLoadModule so the source goes through the transform
            // pipeline (TypeScript, etc.) and we get HMR for free.
            const mod = await server.ssrLoadModule(dataModulePath)
            const { filterMockPals } = mod as typeof import('../app/utils/pals.data')

            const search = url.searchParams.get('search') ?? undefined
            const typesParam = url.searchParams.get('types')
            const types = typesParam ? typesParam.split(',').filter(Boolean) : undefined
            const minAttack = url.searchParams.has('minAttack')
              ? Number(url.searchParams.get('minAttack'))
              : undefined
            const maxAttack = url.searchParams.has('maxAttack')
              ? Number(url.searchParams.get('maxAttack'))
              : undefined

            const pals = filterMockPals({ search, types, minAttack, maxAttack })

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(pals))
          } catch (err) {
            console.error('[paldex-api] Error handling /api/pals:', err)
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Internal server error' }))
          }
          return
        }

        // --- GET /api/pals/:id ---
        const palIdMatch = url.pathname.match(/^\/api\/pals\/([^/]+)$/)
        if (palIdMatch && req.method === 'GET') {
          try {
            const mod = await server.ssrLoadModule(dataModulePath)
            const { getMockPalById } = mod as typeof import('../app/utils/pals.data')

            const pal = getMockPalById(palIdMatch[1])

            if (!pal) {
              res.statusCode = 404
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Pal not found' }))
              return
            }

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(pal))
          } catch (err) {
            console.error('[paldex-api] Error handling /api/pals/:id:', err)
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Internal server error' }))
          }
          return
        }

        // Not an API route — pass through to Vite / the SPA.
        next()
      })
    },
  }
}
