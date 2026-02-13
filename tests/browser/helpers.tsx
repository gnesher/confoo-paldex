import { defineComponent, h } from 'vue'
import { render } from 'vitest-browser-vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import {
  createRouter,
  RouterProvider,
} from '@tanstack/vue-router'
import { createMemoryHistory } from '@tanstack/history'
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
 */
export const MOCK_PALS: Pal[] = [
  MOCK_LAMBALL,
  createMockPal({ id: '002', name: 'Cattiva', types: ['Neutral'] }),
  createMockPal({ id: '003', name: 'Chikipi', types: ['Neutral'] }),
  createMockPal({ id: '004', name: 'Lifmunk', types: ['Grass'] }),
  MOCK_FOXPARKS,
  createMockPal({ id: '006', name: 'Fuack', types: ['Water'] }),
  createMockPal({ id: '007', name: 'Sparkit', types: ['Electric'] }),
  createMockPal({ id: '008', name: 'Tanzee', types: ['Grass'] }),
  createMockPal({ id: '009', name: 'Rooby', types: ['Fire'], stats: { hp: 75, attack: 100, defense: 75 }, suitability: [{ workType: 'Kindling', level: 1 }], drops: [{ item: 'Flame Organ', quantity: 1 }] }),
  MOCK_PENGULLET,
]

/** Standard timeout for expect.element */
export const DATA_TIMEOUT = { timeout: 2000 }

/**
 * Render the full Paldex app with memory history for browser tests.
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
    context: { queryClient },
  })

  const Wrapper = defineComponent({
    setup() {
      return () => h(RouterProvider, { router })
    },
  })

  const screen = render(Wrapper, {
    global: {
      plugins: [[VueQueryPlugin, { queryClient }]],
    },
  })

  return { screen, router, queryClient }
}

/**
 * Helper: filter pals the same way the real filterMockPals does.
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
