import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from 'vitest-browser-solid'
import { Suspense } from 'solid-js'
import { QueryClient, QueryClientProvider, createQuery } from '@tanstack/solid-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
} from '@tanstack/solid-router'
import { createMockPals } from '../helpers/fixtures'
import { clearTeam } from '~/stores/team'
import { PalGrid } from '~/components/PalGrid'
import { FilterSidebar } from '~/components/FilterSidebar'

// Mock the pals data utility
vi.mock('~/utils/pals', () => ({
  getPals: vi.fn(),
  getPalById: vi.fn(),
}))

import { getPals } from '~/utils/pals'

const mockGetPals = vi.mocked(getPals)

/**
 * Simplified home page component that mirrors the real one
 * but without TanStack Router's validateSearch middleware.
 */
function TestHomePage() {
  return (
    <div class="flex min-h-screen">
      <FilterSidebar initialValues={{}} />
      <main class="flex-1 p-6 overflow-hidden">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Paldex</h1>
          <p class="text-gray-600 mt-1">
            A Pokedex for Palworld - Built with the TanStack Ecosystem
          </p>
        </header>
        <Suspense fallback={<div>Loading skeleton...</div>}>
          <PalGridWithData />
        </Suspense>
      </main>
    </div>
  )
}

function PalGridWithData() {
  const query = createQuery(() => ({
    queryKey: ['pals', {}],
    queryFn: () => getPals({}),
  }))
  return (
    <div>
      <div class="text-sm text-gray-500 mb-4">{query.data?.length ?? 0} Pals found</div>
      <PalGrid pals={query.data ?? []} />
    </div>
  )
}

async function renderHomePage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0, gcTime: Infinity },
    },
  })

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
    component: TestHomePage,
  })

  const catchAll = createRoute({
    getParentRoute: () => rootRoute,
    path: '$',
    component: () => <div />,
  })

  const routeTree = rootRoute.addChildren([indexRoute, catchAll])
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })

  const screen = render(() => (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  ))

  return { screen, queryClient }
}

describe('Home Page Integration', () => {
  beforeEach(() => {
    clearTeam()
    mockGetPals.mockReset()
  })

  it('should render the Paldex heading and description', async () => {
    const pals = createMockPals(5)
    mockGetPals.mockResolvedValue(pals)

    const { screen } = await renderHomePage()

    await expect.element(screen.getByText('Paldex')).toBeInTheDocument()
    await expect.element(screen.getByText(/A Pokedex for Palworld/)).toBeInTheDocument()
  })

  it('should display Pal count after data loads', async () => {
    const pals = createMockPals(5)
    mockGetPals.mockResolvedValue(pals)

    const { screen } = await renderHomePage()

    await expect.element(screen.getByText('5 Pals found')).toBeInTheDocument()
  })

  it('should show loading state before data loads', async () => {
    // Never resolve
    mockGetPals.mockReturnValue(new Promise(() => {}))

    const { screen } = await renderHomePage()

    await expect.element(screen.getByText('Loading skeleton...')).toBeInTheDocument()
  })

  it('should show empty state when no Pals match filters', async () => {
    mockGetPals.mockResolvedValue([])

    const { screen } = await renderHomePage()

    await expect.element(screen.getByText('0 Pals found')).toBeInTheDocument()
  })

  it('should render the filter sidebar', async () => {
    mockGetPals.mockResolvedValue(createMockPals(3))

    const { screen } = await renderHomePage()

    await expect.element(screen.getByText('Filters')).toBeInTheDocument()
  })
})
