import React, { Suspense } from 'react'
import { render, act, waitFor, type RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router'

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

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
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
 * Uses `act()` to wait for the router to finish initializing before returning.
 * Returns all @testing-library queries plus a `user` for userEvent interactions.
 */
export async function renderWithProviders(
  ui: React.ReactElement,
  options: RenderWithProvidersOptions = {},
) {
  const { initialPath = '/', queryClient, ...renderOptions } = options
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
    component: () => ui,
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

  const user = userEvent.setup()

  let result!: ReturnType<typeof render>
  await act(async () => {
    result = render(
      <QueryClientProvider client={testQueryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
      renderOptions,
    )
  })

  return { ...result, user, queryClient: testQueryClient, router }
}

/**
 * Simpler render that only wraps in QueryClientProvider (no router).
 * Useful for components that don't use Link/navigation.
 */
export function renderWithQuery(
  ui: React.ReactElement,
  options: Omit<RenderWithProvidersOptions, 'initialPath'> = {},
) {
  const { queryClient, ...renderOptions } = options
  const testQueryClient = queryClient ?? createTestQueryClient()

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={testQueryClient}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </QueryClientProvider>
    )
  }

  const result = render(ui, { wrapper: Wrapper, ...renderOptions })
  const user = userEvent.setup()

  return { ...result, user, queryClient: testQueryClient }
}

/**
 * Minimal render with just Suspense (no router, no query client).
 * Useful for pure presentational components.
 */
export function renderSimple(
  ui: React.ReactElement,
  options: Omit<RenderOptions, 'wrapper'> = {},
) {
  const result = render(ui, options)
  const user = userEvent.setup()
  return { ...result, user }
}
