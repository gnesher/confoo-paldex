import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, h, computed } from 'vue'
import { Link } from '@tanstack/vue-router'
import { useQuery } from '@tanstack/vue-query'
import { renderWithProviders } from '../helpers/render'
import { MOCK_LAMBALL } from '../helpers/fixtures'
import { clearTeam } from '~/stores/team'
import SuitabilityTable from '~/components/SuitabilityTable.vue'
import DropsTable from '~/components/DropsTable.vue'
import TeamButton from '~/components/TeamButton.vue'
import PalNotFoundState from '~/components/PalNotFoundState.vue'
import TypeBadge from '~/components/TypeBadge.vue'

vi.mock('~/utils/pals', () => ({
  getPals: vi.fn().mockResolvedValue([]),
  getPalById: vi.fn(),
}))

import { getPalById } from '~/utils/pals'

const mockedGetPalById = vi.mocked(getPalById)

const TestDetailPage = defineComponent({
  name: 'TestDetailPage',
  props: {
    palId: { type: String, required: true },
  },
  setup(props) {
    const { data: pal, isSuccess } = useQuery(computed(() => ({
      queryKey: ['pal', props.palId],
      queryFn: () => getPalById(props.palId),
    })))

    return () => {
      if (!isSuccess.value) return h('div', {}, 'Loading detail...')

      if (!pal.value) {
        return h(PalNotFoundState, { palId: props.palId })
      }

      const p = pal.value
      return h('div', { class: 'min-h-screen bg-gray-50' }, [
        h('div', { class: 'bg-white shadow' }, [
          h('div', { class: 'max-w-4xl mx-auto px-4 py-3' }, [
            h(Link, {
              to: '/',
              class: 'inline-flex items-center text-gray-600',
            }, () => [
              h('span', { class: 'mr-2' }, '←'),
              h('span', {}, 'Back to Paldex'),
            ]),
          ]),
        ]),
        h('div', { class: 'max-w-4xl mx-auto px-4 py-8' }, [
          h('div', { class: 'bg-white rounded-lg shadow-lg overflow-hidden mb-8' }, [
            h('div', { class: 'md:flex' }, [
              h('div', { class: 'md:w-1/3' }, [
                h('img', { src: p.imageUrl, alt: p.name, class: 'w-48 h-48 object-contain' }),
              ]),
              h('div', { class: 'md:w-2/3 p-6' }, [
                h('div', { class: 'flex items-baseline gap-3 mb-4' }, [
                  h('span', {}, `#${p.id}`),
                  h('h1', {}, p.name),
                ]),
                h('div', { class: 'flex gap-2 mb-6' },
                  p.types.map((type) => h(TypeBadge, { key: type, type }))
                ),
                h('div', { class: 'grid grid-cols-3 gap-4' }, [
                  h('div', {}, [h('span', {}, 'HP'), h('div', {}, String(p.stats.hp))]),
                  h('div', {}, [h('span', {}, 'Attack'), h('div', {}, String(p.stats.attack))]),
                  h('div', {}, [h('span', {}, 'Defense'), h('div', {}, String(p.stats.defense))]),
                ]),
              ]),
            ]),
          ]),
          h('div', { class: 'grid md:grid-cols-2 gap-8' }, [
            h('div', {}, [
              h('h2', {}, 'Work Suitability'),
              h(SuitabilityTable, { data: p.suitability }),
            ]),
            h('div', {}, [
              h('h2', {}, 'Drops'),
              h(DropsTable, { data: p.drops }),
            ]),
          ]),
          h('div', { class: 'mt-8 text-center pb-20' }, [
            h(TeamButton, { pal: p, size: 'lg' }),
          ]),
        ]),
      ])
    }
  },
})

describe('Detail Page Integration', () => {
  beforeEach(() => {
    clearTeam()
    mockedGetPalById.mockReset()
  })

  it('should render the Pal name and stats after loading', async () => {
    mockedGetPalById.mockResolvedValue(MOCK_LAMBALL)
    const { screen } = await renderWithProviders(TestDetailPage, {
      props: { palId: '001' },
    })

    await expect.element(screen.getByText('Lamball')).toBeInTheDocument()
    await expect.element(screen.getByText('HP')).toBeInTheDocument()
    await expect.element(screen.getByText('Attack')).toBeInTheDocument()
    await expect.element(screen.getByText('Defense')).toBeInTheDocument()
  })

  it('should render the Pal image', async () => {
    mockedGetPalById.mockResolvedValue(MOCK_LAMBALL)
    const { screen } = await renderWithProviders(TestDetailPage, {
      props: { palId: '001' },
    })

    await expect.element(screen.getByAltText('Lamball')).toBeInTheDocument()
  })

  it('should render type badges', async () => {
    mockedGetPalById.mockResolvedValue(MOCK_LAMBALL)
    const { screen } = await renderWithProviders(TestDetailPage, {
      props: { palId: '001' },
    })

    await expect.element(screen.getByText('Neutral')).toBeInTheDocument()
  })

  it('should render the SuitabilityTable section', async () => {
    mockedGetPalById.mockResolvedValue(MOCK_LAMBALL)
    const { screen } = await renderWithProviders(TestDetailPage, {
      props: { palId: '001' },
    })

    await expect.element(screen.getByText('Work Suitability')).toBeInTheDocument()
    await expect.element(screen.getByText('Handiwork')).toBeInTheDocument()
    await expect.element(screen.getByText('Transporting')).toBeInTheDocument()
    await expect.element(screen.getByText('Farming')).toBeInTheDocument()
  })

  it('should render the DropsTable section', async () => {
    mockedGetPalById.mockResolvedValue(MOCK_LAMBALL)
    const { screen } = await renderWithProviders(TestDetailPage, {
      props: { palId: '001' },
    })

    await expect.element(screen.getByText('Drops')).toBeInTheDocument()
    await expect.element(screen.getByText('Wool')).toBeInTheDocument()
  })

  it('should render the TeamButton', async () => {
    mockedGetPalById.mockResolvedValue(MOCK_LAMBALL)
    const { screen } = await renderWithProviders(TestDetailPage, {
      props: { palId: '001' },
    })

    await expect.element(screen.getByText('Add to Team')).toBeInTheDocument()
  })

  it('should toggle team membership via TeamButton', async () => {
    mockedGetPalById.mockResolvedValue(MOCK_LAMBALL)
    const { screen } = await renderWithProviders(TestDetailPage, {
      props: { palId: '001' },
    })

    await expect.element(screen.getByText('Add to Team')).toBeInTheDocument()
    await screen.getByText('Add to Team').click()
    await expect.element(screen.getByText('Remove from Team')).toBeInTheDocument()
    await screen.getByText('Remove from Team').click()
    await expect.element(screen.getByText('Add to Team')).toBeInTheDocument()
  })

  it('should render "Back to Paldex" link', async () => {
    mockedGetPalById.mockResolvedValue(MOCK_LAMBALL)
    const { screen } = await renderWithProviders(TestDetailPage, {
      props: { palId: '001' },
    })

    await expect.element(screen.getByText('Back to Paldex')).toBeInTheDocument()
  })

  it('should show PalNotFound when Pal does not exist', async () => {
    mockedGetPalById.mockResolvedValue(null)
    const { screen } = await renderWithProviders(TestDetailPage, {
      props: { palId: '999' },
    })

    await expect.element(screen.getByText('Pal Not Found')).toBeInTheDocument()
    await expect.element(screen.getByText(/No Pal with ID "999" exists/)).toBeInTheDocument()
  })
})
