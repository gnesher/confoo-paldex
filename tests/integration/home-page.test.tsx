import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, h, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { renderWithProviders } from '../helpers/render'
import { createMockPals } from '../helpers/fixtures'
import { clearTeam } from '~/stores/team'
import FilterSidebar from '~/components/FilterSidebar.vue'

vi.mock('~/utils/pals', () => ({
  getPals: vi.fn(),
  getPalById: vi.fn(),
}))

import { getPals } from '~/utils/pals'

const mockedGetPals = vi.mocked(getPals)

const TestHomePage = defineComponent({
  name: 'TestHomePage',
  setup() {
    const query = useQuery(computed(() => ({
      queryKey: ['pals', {}],
      queryFn: () => getPals({}),
    })))

    return () =>
      h('div', { class: 'flex min-h-screen' }, [
        h(FilterSidebar, { initialValues: {} }),
        h('main', { class: 'flex-1 p-6 overflow-hidden' }, [
          h('header', { class: 'mb-6' }, [
            h('h1', { class: 'text-3xl font-bold text-gray-900' }, 'Paldex'),
            h('p', { class: 'text-gray-600 mt-1' },
              'A Pokedex for Palworld - Built with the TanStack Ecosystem'),
          ]),
          query.isLoading.value
            ? h('div', {}, 'Loading skeleton...')
            : h('div', {}, [
                h('div', { class: 'text-sm text-gray-500 mb-4' },
                  `${query.data.value?.length ?? 0} Pals found`),
              ]),
        ]),
      ])
  },
})

describe('Home Page Integration', () => {
  beforeEach(() => {
    clearTeam()
    mockedGetPals.mockReset()
  })

  it('should render the Paldex heading and description', async () => {
    mockedGetPals.mockResolvedValue(createMockPals(5))
    const { screen } = await renderWithProviders(TestHomePage)

    await expect.element(screen.getByText('Paldex')).toBeInTheDocument()
    await expect.element(screen.getByText(/A Pokedex for Palworld/)).toBeInTheDocument()
  })

  it('should display Pal count after data loads', async () => {
    mockedGetPals.mockResolvedValue(createMockPals(5))
    const { screen } = await renderWithProviders(TestHomePage)

    await expect.element(screen.getByText('5 Pals found')).toBeInTheDocument()
  })

  it('should show loading state before data loads', async () => {
    mockedGetPals.mockReturnValue(new Promise(() => {}))
    const { screen } = await renderWithProviders(TestHomePage)

    await expect.element(screen.getByText('Loading skeleton...')).toBeInTheDocument()
  })

  it('should show empty state when no Pals match filters', async () => {
    mockedGetPals.mockResolvedValue([])
    const { screen } = await renderWithProviders(TestHomePage)

    await expect.element(screen.getByText('0 Pals found')).toBeInTheDocument()
  })

  it('should render the filter sidebar', async () => {
    mockedGetPals.mockResolvedValue(createMockPals(3))
    const { screen } = await renderWithProviders(TestHomePage)

    await expect.element(screen.getByText('Filters')).toBeInTheDocument()
  })
})
