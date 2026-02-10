import { describe, it, expect, beforeEach } from 'vitest'
import { render } from 'vitest-browser-react'
import { Suspense } from 'react'
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

  async function renderTeamFlow() {
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

    const screen = await render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    )

    return { screen }
  }

  it('should add a Pal and see it appear in the bottom bar', async () => {
    const { screen } = await renderTeamFlow()

    await expect.element(screen.getByText('Add to Team').first()).toBeInTheDocument()

    // Initially no bottom bar
    await expect.element(screen.getByText('My Team')).not.toBeInTheDocument()

    // Add Lamball to team
    await screen.getByText('Add to Team').first().click()

    // Bottom bar should appear with count
    await expect.element(screen.getByText('My Team')).toBeInTheDocument()
    await expect.element(screen.getByText('1 Pal')).toBeInTheDocument()
  })

  it('should expand the bar and show team members', async () => {
    const { screen } = await renderTeamFlow()

    await expect.element(screen.getByText('Add to Team').first()).toBeInTheDocument()

    // Add Lamball
    await screen.getByText('Add to Team').first().click()

    // Expand
    await screen.getByText('My Team').click()

    // Should see Lamball in the expanded bar
    await expect.element(screen.getByText('Lamball')).toBeInTheDocument()
  })

  it('should update count when adding multiple Pals', async () => {
    const { screen } = await renderTeamFlow()

    await expect.element(screen.getByText('Add to Team').first()).toBeInTheDocument()

    // Add Lamball
    await screen.getByText('Add to Team').first().click()
    // Add Foxparks (it's the remaining "Add to Team" button)
    await screen.getByText('Add to Team').first().click()

    await expect.element(screen.getByText('2 Pals')).toBeInTheDocument()
  })

  it('should remove a Pal from the team via the bottom bar', async () => {
    const { screen } = await renderTeamFlow()

    await expect.element(screen.getByText('Add to Team').first()).toBeInTheDocument()

    // Add Lamball
    await screen.getByText('Add to Team').first().click()

    // Expand
    await screen.getByText('My Team').click()

    // Remove via the remove button in the bar
    await screen.getByTitle('Remove from team').click()

    // Team should be empty
    expect(teamStore.state.pals).toHaveLength(0)
  })

  it('should toggle button text between Add and Remove', async () => {
    const { screen } = await renderTeamFlow()

    await expect.element(screen.getByText('Add to Team').first()).toBeInTheDocument()

    // Add Lamball
    await screen.getByText('Add to Team').first().click()

    // Button should now say "Remove from Team"
    await expect.element(screen.getByText('Remove from Team')).toBeInTheDocument()

    // Click to remove
    await screen.getByText('Remove from Team').click()

    // Should be back to "Add to Team" (both buttons)
    const addButtons = await screen.getByText('Add to Team').all()
    expect(addButtons).toHaveLength(2)
  })
})
