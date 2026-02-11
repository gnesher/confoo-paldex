import { describe, it, expect, beforeEach } from 'vitest'
import { render } from 'vitest-browser-solid'
import { Suspense } from 'solid-js'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
} from '@tanstack/solid-router'

import { PalCard, PalCardSkeleton } from '~/components/PalCard'
import { SuitabilityTable } from '~/components/SuitabilityTable'
import { DropsTable } from '~/components/DropsTable'
import { EmptyState, PalNotFoundState } from '~/components/EmptyState'
import { ErrorFallback } from '~/components/ErrorBoundary'
import { TeamButton } from '~/components/TeamButton'
import { PalGridStats } from '~/components/PalGrid'
import { clearTeam, addPal } from '~/stores/team'
import {
  MOCK_LAMBALL,
  MOCK_PENGULLET,
  MOCK_SUITABILITY,
  MOCK_DROPS,
} from '../helpers/fixtures'
import type { JSX } from 'solid-js'

/**
 * Helper to wrap components that need Router context in a minimal provider.
 */
async function renderWithRouter(ui: () => JSX.Element) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
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
    component: ui,
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

  return screen
}

describe('Visual Snapshots', () => {
  beforeEach(() => {
    clearTeam()
  })

  describe('PalCard', () => {
    it('should match snapshot for single-type Pal', async () => {
      const screen = await renderWithRouter(() => <PalCard pal={MOCK_LAMBALL} />)
      expect(screen.container.innerHTML).toMatchSnapshot()
    })

    it('should match snapshot for dual-type Pal', async () => {
      const screen = await renderWithRouter(() => <PalCard pal={MOCK_PENGULLET} />)
      expect(screen.container.innerHTML).toMatchSnapshot()
    })
  })

  describe('PalCardSkeleton', () => {
    it('should match snapshot', async () => {
      const screen = render(() => <PalCardSkeleton />)
      expect(screen.container.innerHTML).toMatchSnapshot()
    })
  })

  describe('SuitabilityTable', () => {
    it('should match snapshot with sample data', async () => {
      const screen = render(() => <SuitabilityTable data={MOCK_SUITABILITY} />)
      expect(screen.container.innerHTML).toMatchSnapshot()
    })

    it('should match snapshot for empty state', async () => {
      const screen = render(() => <SuitabilityTable data={[]} />)
      expect(screen.container.innerHTML).toMatchSnapshot()
    })
  })

  describe('DropsTable', () => {
    it('should match snapshot with sample data', async () => {
      const screen = render(() => <DropsTable data={MOCK_DROPS} />)
      expect(screen.container.innerHTML).toMatchSnapshot()
    })

    it('should match snapshot for empty state', async () => {
      const screen = render(() => <DropsTable data={[]} />)
      expect(screen.container.innerHTML).toMatchSnapshot()
    })
  })

  describe('EmptyState', () => {
    it('should match snapshot with defaults', async () => {
      const screen = await renderWithRouter(() => <EmptyState />)
      expect(screen.container.innerHTML).toMatchSnapshot()
    })
  })

  describe('PalNotFoundState', () => {
    it('should match snapshot', async () => {
      const screen = await renderWithRouter(() => <PalNotFoundState palId="999" />)
      expect(screen.container.innerHTML).toMatchSnapshot()
    })
  })

  describe('ErrorFallback', () => {
    it('should match snapshot with error', async () => {
      const screen = await renderWithRouter(
        () => <ErrorFallback error={new Error('Something broke')} />
      )
      expect(screen.container.innerHTML).toMatchSnapshot()
    })

    it('should match snapshot with reset callback', async () => {
      const screen = await renderWithRouter(
        () => <ErrorFallback
          error={new Error('Something broke')}
          resetErrorBoundary={() => {}}
        />
      )
      expect(screen.container.innerHTML).toMatchSnapshot()
    })
  })

  describe('TeamButton', () => {
    it('should match snapshot in "add" state', async () => {
      const screen = await renderWithRouter(
        () => <TeamButton pal={MOCK_LAMBALL} />
      )
      expect(screen.container.innerHTML).toMatchSnapshot()
    })

    it('should match snapshot in "remove" state', async () => {
      addPal(MOCK_LAMBALL)
      const screen = await renderWithRouter(
        () => <TeamButton pal={MOCK_LAMBALL} />
      )
      expect(screen.container.innerHTML).toMatchSnapshot()
    })
  })

  describe('PalGridStats', () => {
    it('should match snapshot', async () => {
      const screen = render(() => <PalGridStats total={111} visible={20} />)
      expect(screen.container.innerHTML).toMatchSnapshot()
    })
  })
})
