import { render, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createRouter,
  createMemoryHistory,
  RouterProvider,
} from '@tanstack/react-router'
import { routeTree } from '~/routeTree.gen'
import { clearTeam } from '~/stores/team'
import type { Pal } from '~/schemas/pal'
import {
  createMockPal,
  MOCK_LAMBALL,
  MOCK_FOXPARKS,
  MOCK_PENGULLET,
} from '../helpers/fixtures'

/**
 * A focused mock dataset with enough variety for filter / search / type tests.
 *
 *   3 Neutral, 2 Fire, 2 Grass, 1 Water, 1 Electric, 1 Water+Ice = 10 pals
 */
export const MOCK_PALS: Pal[] = [
  MOCK_LAMBALL,  // 001, Neutral
  createMockPal({ id: '002', name: 'Cattiva', types: ['Neutral'] }),
  createMockPal({ id: '003', name: 'Chikipi', types: ['Neutral'] }),
  createMockPal({ id: '004', name: 'Lifmunk', types: ['Grass'] }),
  MOCK_FOXPARKS, // 005, Fire
  createMockPal({ id: '006', name: 'Fuack', types: ['Water'] }),
  createMockPal({ id: '007', name: 'Sparkit', types: ['Electric'] }),
  createMockPal({ id: '008', name: 'Tanzee', types: ['Grass'] }),
  createMockPal({ id: '009', name: 'Rooby', types: ['Fire'], stats: { hp: 75, attack: 100, defense: 75 }, suitability: [{ workType: 'Kindling', level: 1 }], drops: [{ item: 'Flame Organ', quantity: 1 }] }),
  MOCK_PENGULLET, // 010, Water + Ice
]

/** Standard timeout for waitFor — generous enough even on slow CI. */
export const DATA_TIMEOUT = { timeout: 2000 }

/**
 * Render the full Paldex app (real route tree, mocked data) in vitest browser
 * mode.  Memory history makes navigation testable without a dev server.
 *
 * **Important:** The calling test file must `vi.mock('~/utils/pals')` and
 * configure mock return values (see home / detail test files for examples).
 */
export async function renderApp(initialPath = '/') {
  clearTeam()
  localStorage.clear()

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
    defaultPreload: false,
  })

  const user = userEvent.setup()

  let result!: ReturnType<typeof render>
  await act(async () => {
    result = render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )
  })

  return { ...result, user, router, queryClient }
}

/**
 * Helper: filter MOCK_PALS the same way the real `filterMockPals` does,
 * so mocks return realistic results.
 */
export function filterPals(
  pals: Pal[],
  params: { search?: string; types?: string[]; minAttack?: number; maxAttack?: number },
): Pal[] {
  let filtered = [...pals]

  if (params.search) {
    const q = params.search.toLowerCase()
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(q))
  }

  if (params.types?.length) {
    filtered = filtered.filter((p) => p.types.some((t) => params.types!.includes(t)))
  }

  if (params.minAttack !== undefined) {
    filtered = filtered.filter((p) => p.stats.attack >= params.minAttack!)
  }

  if (params.maxAttack !== undefined) {
    filtered = filtered.filter((p) => p.stats.attack <= params.maxAttack!)
  }

  return filtered
}
