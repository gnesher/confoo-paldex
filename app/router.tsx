import { createRouter as createTanStackRouter } from '@tanstack/solid-router'
import { QueryClient } from '@tanstack/solid-query'
import { routeTree } from './routeTree.gen'

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
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

declare module '@tanstack/solid-router' {
  interface Register {
    router: ReturnType<typeof createRouter>['router']
  }
}
