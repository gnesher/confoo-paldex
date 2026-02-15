import { Suspense } from 'react'
import { render } from 'vitest-browser-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router'

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
  initialPath?: string
  queryClient?: QueryClient
}

export async function renderWithProviders(
  ui: React.ReactElement,
  options: RenderWithProvidersOptions = {},
) {
  const { initialPath = '/', queryClient } = options
  const testQueryClient = queryClient ?? createTestQueryClient()

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

  // Catch-all so Link hrefs don't cause 404s
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

  const screen = await render(
    <QueryClientProvider client={testQueryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )

  return { screen, queryClient: testQueryClient, router }
}

export async function renderWithQuery(
  ui: React.ReactElement,
  options: Omit<RenderWithProvidersOptions, 'initialPath'> = {},
) {
  const { queryClient } = options
  const testQueryClient = queryClient ?? createTestQueryClient()

  const screen = await render(
    <QueryClientProvider client={testQueryClient}>
      <Suspense fallback={<div>Loading...</div>}>{ui}</Suspense>
    </QueryClientProvider>,
  )

  return { screen, queryClient: testQueryClient }
}

export async function renderSimple(ui: React.ReactElement) {
  const screen = await render(ui)
  return { screen }
}
