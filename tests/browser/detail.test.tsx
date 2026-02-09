import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderApp, MOCK_PALS, filterPals, DATA_TIMEOUT } from './helpers'

// ---- mock the data layer (no real API / no artificial delay) ----
vi.mock('~/utils/pals', () => ({
  getPals: vi.fn(),
  getPalById: vi.fn(),
}))

import { getPals, getPalById } from '~/utils/pals'

const mockGetPals = vi.mocked(getPals)
const mockGetPalById = vi.mocked(getPalById)

beforeEach(() => {
  mockGetPals.mockImplementation(async (params) => filterPals(MOCK_PALS, params))
  mockGetPalById.mockImplementation(async (id) => MOCK_PALS.find((p) => p.id === id) ?? null)
})

// ---- tests ----

describe('Detail Page', () => {
  it('should display the Pal name and ID', async () => {
    await renderApp('/pals/001')

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Lamball')
    }, DATA_TIMEOUT)

    expect(screen.getByText('#001')).toBeInTheDocument()
  })

  it('should display the Pal image', async () => {
    await renderApp('/pals/001')

    await waitFor(() => {
      expect(screen.getByAltText('Lamball')).toBeInTheDocument()
    }, DATA_TIMEOUT)
  })

  it('should display type badges', async () => {
    await renderApp('/pals/001')

    await waitFor(() => {
      // Lamball is Neutral type
      expect(screen.getByText('Neutral')).toBeInTheDocument()
    }, DATA_TIMEOUT)
  })

  it('should display dual type badges', async () => {
    // Pengullet (010) is Water + Ice
    await renderApp('/pals/010')

    await waitFor(() => {
      expect(screen.getByText('Water')).toBeInTheDocument()
      expect(screen.getByText('Ice')).toBeInTheDocument()
    }, DATA_TIMEOUT)
  })

  it('should display HP, Attack, and Defense stats', async () => {
    await renderApp('/pals/001')

    await waitFor(() => {
      expect(screen.getByText('HP')).toBeInTheDocument()
    }, DATA_TIMEOUT)

    expect(screen.getByText('Attack')).toBeInTheDocument()
    expect(screen.getByText('Defense')).toBeInTheDocument()
  })

  it('should display the Work Suitability table', async () => {
    await renderApp('/pals/001')

    await waitFor(() => {
      expect(screen.getByText('Work Suitability')).toBeInTheDocument()
    }, DATA_TIMEOUT)

    // Lamball has Handiwork, Transporting, Farming
    expect(screen.getByText('Handiwork')).toBeInTheDocument()
    expect(screen.getByText('Transporting')).toBeInTheDocument()
    expect(screen.getByText('Farming')).toBeInTheDocument()
  })

  it('should display the Drops table', async () => {
    await renderApp('/pals/001')

    await waitFor(() => {
      expect(screen.getByText('Drops')).toBeInTheDocument()
    }, DATA_TIMEOUT)

    expect(screen.getByText('Wool')).toBeInTheDocument()
  })

  it('should display the "Add to Team" button', async () => {
    await renderApp('/pals/001')

    await waitFor(() => {
      expect(screen.getByText('Add to Team')).toBeInTheDocument()
    }, DATA_TIMEOUT)
  })

  it('should add a Pal to the team', async () => {
    const { user } = await renderApp('/pals/001')

    await waitFor(() => {
      expect(screen.getByText('Add to Team')).toBeInTheDocument()
    }, DATA_TIMEOUT)

    await user.click(screen.getByText('Add to Team'))

    expect(screen.getByText('Remove from Team')).toBeInTheDocument()
    expect(screen.getByText('1 Pal')).toBeInTheDocument()
    expect(screen.getByText('My Team')).toBeInTheDocument()
  })

  it('should remove a Pal from the team', async () => {
    const { user } = await renderApp('/pals/001')

    await waitFor(() => {
      expect(screen.getByText('Add to Team')).toBeInTheDocument()
    }, DATA_TIMEOUT)

    await user.click(screen.getByText('Add to Team'))
    expect(screen.getByText('Remove from Team')).toBeInTheDocument()

    await user.click(screen.getByText('Remove from Team'))
    expect(screen.getByText('Add to Team')).toBeInTheDocument()
  })

  it('should expand the team bar to show Pal thumbnails', async () => {
    const { user } = await renderApp('/pals/001')

    await waitFor(() => {
      expect(screen.getByText('Add to Team')).toBeInTheDocument()
    }, DATA_TIMEOUT)

    await user.click(screen.getByText('Add to Team'))
    await user.click(screen.getByText('My Team'))

    // Expanded bar shows the per-member remove button
    await waitFor(() => {
      expect(screen.getByTitle('Remove from team')).toBeInTheDocument()
    })
  })

  it('should persist team across page navigation', async () => {
    const { user } = await renderApp('/pals/001')

    await waitFor(() => {
      expect(screen.getByText('Add to Team')).toBeInTheDocument()
    }, DATA_TIMEOUT)

    await user.click(screen.getByText('Add to Team'))
    expect(screen.getByText('1 Pal')).toBeInTheDocument()

    // Navigate back to home
    await user.click(screen.getByText('Back to Paldex'))

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Paldex')
    }, DATA_TIMEOUT)

    // Team bar should still show
    expect(screen.getByText('1 Pal')).toBeInTheDocument()
  })

  it('should have a working "Back to Paldex" link', async () => {
    const { user } = await renderApp('/pals/001')

    await waitFor(() => {
      expect(screen.getByText('Back to Paldex')).toBeInTheDocument()
    }, DATA_TIMEOUT)

    await user.click(screen.getByText('Back to Paldex'))

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Paldex')
    }, DATA_TIMEOUT)
  })

  it('should show "Pal Not Found" for invalid ID', async () => {
    await renderApp('/pals/999')

    await waitFor(() => {
      expect(screen.getByText('Pal Not Found')).toBeInTheDocument()
    }, DATA_TIMEOUT)

    expect(screen.getByText(/No Pal with ID "999" exists/)).toBeInTheDocument()
  })

  it('should display different Pals correctly', async () => {
    // Foxparks is Fire type with Kindling suitability
    await renderApp('/pals/005')

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Foxparks')
    }, DATA_TIMEOUT)

    expect(screen.getByText('Fire')).toBeInTheDocument()
    expect(screen.getByText('Kindling')).toBeInTheDocument()
  })
})
