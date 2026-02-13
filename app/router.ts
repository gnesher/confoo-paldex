import { createRouter as createTanStackRouter } from '@tanstack/vue-router'
import { QueryClient } from '@tanstack/vue-query'
import { routeTree } from './routeTree.gen'

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  })

  const router = createTanStackRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    context: {
      queryClient,
    },
  })

  return { router, queryClient }
}

declare module '@tanstack/vue-router' {
  interface Register {
    router: ReturnType<typeof createRouter>['router']
  }
}
