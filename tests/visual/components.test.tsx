import { describe, it, expect, beforeEach } from 'vitest'
import { render, act } from '@testing-library/react'
import React, { Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router'

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

/**
 * Helper to wrap components that need Router context in a minimal provider.
 * Async to allow router to initialize.
 */
async function renderWithRouter(ui: React.ReactElement) {
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
    component: () => ui,
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

  let result!: ReturnType<typeof render>
  await act(async () => {
    result = render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    )
  })

  return result
}

describe('Visual Snapshots', () => {
  beforeEach(() => {
    clearTeam()
  })

  describe('PalCard', () => {
    it('should match snapshot for single-type Pal', async () => {
      const { container } = await renderWithRouter(<PalCard pal={MOCK_LAMBALL} />)
      expect(container.innerHTML).toMatchSnapshot()
    })

    it('should match snapshot for dual-type Pal', async () => {
      const { container } = await renderWithRouter(<PalCard pal={MOCK_PENGULLET} />)
      expect(container.innerHTML).toMatchSnapshot()
    })
  })

  describe('PalCardSkeleton', () => {
    it('should match snapshot', () => {
      const { container } = render(<PalCardSkeleton />)
      expect(container.innerHTML).toMatchSnapshot()
    })
  })

  describe('SuitabilityTable', () => {
    it('should match snapshot with sample data', () => {
      const { container } = render(<SuitabilityTable data={MOCK_SUITABILITY} />)
      expect(container.innerHTML).toMatchSnapshot()
    })

    it('should match snapshot for empty state', () => {
      const { container } = render(<SuitabilityTable data={[]} />)
      expect(container.innerHTML).toMatchSnapshot()
    })
  })

  describe('DropsTable', () => {
    it('should match snapshot with sample data', () => {
      const { container } = render(<DropsTable data={MOCK_DROPS} />)
      expect(container.innerHTML).toMatchSnapshot()
    })

    it('should match snapshot for empty state', () => {
      const { container } = render(<DropsTable data={[]} />)
      expect(container.innerHTML).toMatchSnapshot()
    })
  })

  describe('EmptyState', () => {
    it('should match snapshot with defaults', async () => {
      const { container } = await renderWithRouter(<EmptyState />)
      expect(container.innerHTML).toMatchSnapshot()
    })
  })

  describe('PalNotFoundState', () => {
    it('should match snapshot', async () => {
      const { container } = await renderWithRouter(<PalNotFoundState palId="999" />)
      expect(container.innerHTML).toMatchSnapshot()
    })
  })

  describe('ErrorFallback', () => {
    it('should match snapshot with error', async () => {
      const { container } = await renderWithRouter(
        <ErrorFallback error={new Error('Something broke')} />
      )
      expect(container.innerHTML).toMatchSnapshot()
    })

    it('should match snapshot with reset callback', async () => {
      const { container } = await renderWithRouter(
        <ErrorFallback
          error={new Error('Something broke')}
          resetErrorBoundary={() => {}}
        />
      )
      expect(container.innerHTML).toMatchSnapshot()
    })
  })

  describe('TeamButton', () => {
    it('should match snapshot in "add" state', async () => {
      const { container } = await renderWithRouter(
        <TeamButton pal={MOCK_LAMBALL} />
      )
      expect(container.innerHTML).toMatchSnapshot()
    })

    it('should match snapshot in "remove" state', async () => {
      addPal(MOCK_LAMBALL)
      const { container } = await renderWithRouter(
        <TeamButton pal={MOCK_LAMBALL} />
      )
      expect(container.innerHTML).toMatchSnapshot()
    })
  })

  describe('PalGridStats', () => {
    it('should match snapshot', () => {
      const { container } = render(<PalGridStats total={111} visible={20} />)
      expect(container.innerHTML).toMatchSnapshot()
    })
  })
})
