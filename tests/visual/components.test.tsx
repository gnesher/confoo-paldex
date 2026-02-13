import { describe, it, expect, beforeEach } from 'vitest'
import { render } from 'vitest-browser-vue'
import { renderWithProviders } from '../helpers/render'

import PalCard from '~/components/PalCard.vue'
import { PalCardSkeleton } from '~/components/PalCard'
import TypeBadge from '~/components/TypeBadge.vue'
import { PalGridStats } from '~/components/PalGridStats'
import SuitabilityTable from '~/components/SuitabilityTable.vue'
import DropsTable from '~/components/DropsTable.vue'
import EmptyState from '~/components/EmptyState.vue'
import PalNotFoundState from '~/components/PalNotFoundState.vue'
import ErrorFallback from '~/components/ErrorFallback.vue'
import TeamButton from '~/components/TeamButton.vue'

import {
  MOCK_LAMBALL,
  MOCK_SUITABILITY,
  MOCK_DROPS,
} from '../helpers/fixtures'
import { addPal, clearTeam } from '~/stores/team'

describe('Visual Snapshot Tests', () => {
  beforeEach(() => {
    clearTeam()
  })

  describe('TypeBadge', () => {
    it('should match snapshot for Fire type', async () => {
      const screen = render(TypeBadge, { props: { type: 'Fire', size: 'sm' } })
      expect(screen.container.innerHTML).toMatchSnapshot()
    })

    it('should match snapshot for Water type (md)', async () => {
      const screen = render(TypeBadge, { props: { type: 'Water', size: 'md' } })
      expect(screen.container.innerHTML).toMatchSnapshot()
    })
  })

  describe('PalCardSkeleton', () => {
    it('should match snapshot', async () => {
      const screen = render(PalCardSkeleton)
      expect(screen.container.innerHTML).toMatchSnapshot()
    })
  })

  describe('PalCard', () => {
    it('should match snapshot', async () => {
      const { screen } = await renderWithProviders(PalCard, {
        props: { pal: MOCK_LAMBALL },
      })
      expect(screen.container.innerHTML).toMatchSnapshot()
    })
  })

  describe('SuitabilityTable', () => {
    it('should match snapshot with data', async () => {
      const screen = render(SuitabilityTable, { props: { data: MOCK_SUITABILITY } })
      expect(screen.container.innerHTML).toMatchSnapshot()
    })

    it('should match snapshot when empty', async () => {
      const screen = render(SuitabilityTable, { props: { data: [] } })
      expect(screen.container.innerHTML).toMatchSnapshot()
    })
  })

  describe('DropsTable', () => {
    it('should match snapshot with data', async () => {
      const screen = render(DropsTable, { props: { data: MOCK_DROPS } })
      expect(screen.container.innerHTML).toMatchSnapshot()
    })

    it('should match snapshot when empty', async () => {
      const screen = render(DropsTable, { props: { data: [] } })
      expect(screen.container.innerHTML).toMatchSnapshot()
    })
  })

  describe('EmptyState', () => {
    it('should match snapshot with defaults', async () => {
      const { screen } = await renderWithProviders(EmptyState)
      expect(screen.container.innerHTML).toMatchSnapshot()
    })
  })

  describe('PalNotFoundState', () => {
    it('should match snapshot', async () => {
      const { screen } = await renderWithProviders(PalNotFoundState, {
        props: { palId: '999' },
      })
      expect(screen.container.innerHTML).toMatchSnapshot()
    })
  })

  describe('ErrorFallback', () => {
    it('should match snapshot with error', async () => {
      const { screen } = await renderWithProviders(ErrorFallback, {
        props: { error: new Error('Something broke') },
      })
      expect(screen.container.innerHTML).toMatchSnapshot()
    })

    it('should match snapshot with reset callback', async () => {
      const { screen } = await renderWithProviders(ErrorFallback, {
        props: {
          error: new Error('Something broke'),
          resetErrorBoundary: () => {},
        },
      })
      expect(screen.container.innerHTML).toMatchSnapshot()
    })
  })

  describe('TeamButton', () => {
    it('should match snapshot in "add" state', async () => {
      const screen = render(TeamButton, { props: { pal: MOCK_LAMBALL } })
      expect(screen.container.innerHTML).toMatchSnapshot()
    })

    it('should match snapshot in "remove" state', async () => {
      addPal(MOCK_LAMBALL)
      const screen = render(TeamButton, { props: { pal: MOCK_LAMBALL } })
      expect(screen.container.innerHTML).toMatchSnapshot()
    })
  })

  describe('PalGridStats', () => {
    it('should match snapshot', async () => {
      const screen = render(PalGridStats, { props: { total: 111, visible: 20 } })
      expect(screen.container.innerHTML).toMatchSnapshot()
    })
  })
})
