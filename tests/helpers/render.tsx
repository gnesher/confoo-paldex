import { Suspense } from 'solid-js'
import type { JSX } from 'solid-js'
import { render } from 'vitest-browser-solid'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
  Outlet,
} from '@tanstack/solid-router'

/**
 * Create a fresh QueryClient configured for testing.
 * - No retries (tests should fail fast)
 * - No stale time caching
 * - No garbage collection during tests
 */
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: Infinity,
      },
    },
  })
}

interface RenderWithProvidersOptions {
  /** Initial URL path for the router, defaults to '/' */
  initialPath?: string
  /** Provide a pre-configured QueryClient (otherwise a fresh one is created) */
  queryClient?: QueryClient
}

/**
 * Async render helper that wraps the component in:
 * 1. QueryClientProvider (fresh or provided)
 * 2. TanStack Router (memory history, catch-all route)
 * 3. Suspense boundary
 *
 * Returns vitest-browser-solid screen (with locator methods) plus queryClient/router.
 */
export async function renderWithProviders(
  ui: () => JSX.Element,
  options: RenderWithProvidersOptions = {},
) {
  const { initialPath = '/', queryClient } = options
  const testQueryClient = queryClient ?? createTestQueryClient()

  // Build a minimal route tree that renders our test UI
  const rootRoute = createRootRoute({
    component: () => (
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    ),
  })

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: ui,
  })

  // Catch-all route so any Link href doesn't cause a 404
  const catchAllRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '$',
    component: () => <div data-testid="routed-page" />,
  })

  const routeTree = rootRoute.addChildren([indexRoute, catchAllRoute])

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  })

  const screen = render(() => (
    <QueryClientProvider client={testQueryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  ))

  return { screen, queryClient: testQueryClient, router }
}

/**
 * Simpler render that only wraps in QueryClientProvider (no router).
 * Useful for components that don't use Link/navigation.
 */
export async function renderWithQuery(
  ui: () => JSX.Element,
  options: Omit<RenderWithProvidersOptions, 'initialPath'> = {},
) {
  const { queryClient } = options
  const testQueryClient = queryClient ?? createTestQueryClient()

  const screen = render(() => (
    <QueryClientProvider client={testQueryClient}>
      <Suspense fallback={<div>Loading...</div>}>{ui()}</Suspense>
    </QueryClientProvider>
  ))

  return { screen, queryClient: testQueryClient }
}

/**
 * Minimal render with just Suspense (no router, no query client).
 * Useful for pure presentational components.
 */
export async function renderSimple(ui: () => JSX.Element) {
  const screen = render(ui)
  return { screen }
}
