import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
import { TeamBottomBar } from '~/components/TeamBottomBar'
import { TeamButton } from '~/components/TeamButton'
import { MOCK_LAMBALL, MOCK_FOXPARKS } from '../helpers/fixtures'
import { clearTeam, teamStore } from '~/stores/team'

describe('Team Management Flow', () => {
  beforeEach(() => {
    clearTeam()
  })

  function renderTeamFlow() {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: 0, gcTime: Infinity },
      },
    })

    const rootRoute = createRootRoute({
      component: () => (
        <>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
          <TeamBottomBar />
        </>
      ),
    })

    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      component: () => (
        <div>
          <h1>Paldex</h1>
          <TeamButton pal={MOCK_LAMBALL} />
          <TeamButton pal={MOCK_FOXPARKS} />
        </div>
      ),
    })

    const catchAllRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '$',
      component: () => <div />,
    })

    const routeTree = rootRoute.addChildren([indexRoute, catchAllRoute])
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({ initialEntries: ['/'] }),
    })

    const user = userEvent.setup()

    let result!: ReturnType<typeof render>
    act(() => {
      result = render(
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      )
    })

    return { ...result!, user }
  }

  it('should add a Pal and see it appear in the bottom bar', async () => {
    const { user } = renderTeamFlow()

    await waitFor(() => {
      expect(screen.getAllByText('Add to Team').length).toBe(2)
    })

    // Initially no bottom bar
    expect(screen.queryByText('My Team')).not.toBeInTheDocument()

    // Add Lamball to team
    const addButtons = screen.getAllByText('Add to Team')
    await user.click(addButtons[0])

    // Bottom bar should appear with count
    expect(screen.getByText('My Team')).toBeInTheDocument()
    expect(screen.getByText('1 Pal')).toBeInTheDocument()
  })

  it('should expand the bar and show team members', async () => {
    const { user } = renderTeamFlow()

    await waitFor(() => {
      expect(screen.getAllByText('Add to Team').length).toBe(2)
    })

    // Add Lamball
    const addButtons = screen.getAllByText('Add to Team')
    await user.click(addButtons[0])

    // Expand
    await user.click(screen.getByText('My Team'))

    // Should see Lamball in the expanded bar
    expect(screen.getByText('Lamball')).toBeInTheDocument()
  })

  it('should update count when adding multiple Pals', async () => {
    const { user } = renderTeamFlow()

    await waitFor(() => {
      expect(screen.getAllByText('Add to Team').length).toBe(2)
    })

    // Add Lamball
    await user.click(screen.getAllByText('Add to Team')[0])
    // Add Foxparks (it's the remaining "Add to Team" button)
    await user.click(screen.getAllByText('Add to Team')[0])

    expect(screen.getByText('2 Pals')).toBeInTheDocument()
  })

  it('should remove a Pal from the team via the bottom bar', async () => {
    const { user } = renderTeamFlow()

    await waitFor(() => {
      expect(screen.getAllByText('Add to Team').length).toBe(2)
    })

    // Add Lamball
    await user.click(screen.getAllByText('Add to Team')[0])

    // Expand
    await user.click(screen.getByText('My Team'))

    // Remove via the remove button in the bar
    const removeButton = screen.getByTitle('Remove from team')
    await user.click(removeButton)

    // Team should be empty
    expect(teamStore.state.pals).toHaveLength(0)
  })

  it('should toggle button text between Add and Remove', async () => {
    const { user } = renderTeamFlow()

    await waitFor(() => {
      expect(screen.getAllByText('Add to Team').length).toBe(2)
    })

    // Add Lamball
    await user.click(screen.getAllByText('Add to Team')[0])

    // Button should now say "Remove from Team"
    expect(screen.getByText('Remove from Team')).toBeInTheDocument()

    // Click to remove
    await user.click(screen.getByText('Remove from Team'))

    // Should be back to "Add to Team" (both buttons)
    const addButtons = screen.getAllByText('Add to Team')
    expect(addButtons).toHaveLength(2)
  })
})
