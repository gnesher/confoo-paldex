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

describe('Home Page', () => {
  it('should display the page heading and description', async () => {
    await renderApp('/')

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Paldex')
    }, DATA_TIMEOUT)

    expect(screen.getByText(/A Pokedex for Palworld/)).toBeInTheDocument()
  })

  it('should load and display all Pals', async () => {
    await renderApp('/')

    await waitFor(() => {
      expect(screen.getByText(`${MOCK_PALS.length} Pals found`)).toBeInTheDocument()
    }, DATA_TIMEOUT)
  })

  it('should display the filter sidebar', async () => {
    await renderApp('/')

    await waitFor(() => {
      expect(screen.getByText('Filters')).toBeInTheDocument()
    }, DATA_TIMEOUT)

    expect(screen.getByPlaceholderText('Search Pals by name...')).toBeInTheDocument()
    expect(screen.getByText('Types')).toBeInTheDocument()
    expect(screen.getByText('Attack Range')).toBeInTheDocument()
  })

  it('should render Pal cards with images', async () => {
    await renderApp('/')

    await waitFor(() => {
      expect(screen.getByText(`${MOCK_PALS.length} Pals found`)).toBeInTheDocument()
    }, DATA_TIMEOUT)

    const img = screen.getByAltText('Lamball')
    expect(img).toBeInTheDocument()
  })

  it('should display Pal name and ID on cards', async () => {
    await renderApp('/')

    await waitFor(() => {
      expect(screen.getByText('Lamball')).toBeInTheDocument()
    }, DATA_TIMEOUT)

    expect(screen.getByText('#001')).toBeInTheDocument()
  })

  it('should filter Pals by search text', async () => {
    const { user } = await renderApp('/')

    await waitFor(() => {
      expect(screen.getByText(`${MOCK_PALS.length} Pals found`)).toBeInTheDocument()
    }, DATA_TIMEOUT)

    const searchInput = screen.getByPlaceholderText('Search Pals by name...')
    await user.clear(searchInput)
    await user.type(searchInput, 'fox')

    // Debounce fires, navigation updates params, query re-runs with filter
    await waitFor(() => {
      expect(screen.getByText('Foxparks')).toBeInTheDocument()
      expect(screen.getByText('1 Pals found')).toBeInTheDocument()
    }, DATA_TIMEOUT)
  })

  it('should clear search and show all Pals again', async () => {
    const { user } = await renderApp('/')

    await waitFor(() => {
      expect(screen.getByText(`${MOCK_PALS.length} Pals found`)).toBeInTheDocument()
    }, DATA_TIMEOUT)

    const searchInput = screen.getByPlaceholderText('Search Pals by name...')
    await user.type(searchInput, 'fox')

    await waitFor(() => {
      expect(screen.getByText('1 Pals found')).toBeInTheDocument()
    }, DATA_TIMEOUT)

    await user.clear(searchInput)

    await waitFor(() => {
      expect(screen.getByText(`${MOCK_PALS.length} Pals found`)).toBeInTheDocument()
    }, DATA_TIMEOUT)
  })

  it('should filter Pals by type', async () => {
    const { user } = await renderApp('/')

    await waitFor(() => {
      expect(screen.getByText(`${MOCK_PALS.length} Pals found`)).toBeInTheDocument()
    }, DATA_TIMEOUT)

    // Open type dropdown and select Fire
    await user.click(screen.getByText('Select types...'))
    await user.click(screen.getByRole('checkbox', { name: /Fire/ }))

    // Foxparks + Rooby = 2 Fire pals
    await waitFor(() => {
      expect(screen.getByText('2 Pals found')).toBeInTheDocument()
    }, DATA_TIMEOUT)
  })

  it('should navigate to Pal detail page when clicking a card', async () => {
    const { user } = await renderApp('/')

    await waitFor(() => {
      expect(screen.getByText('Lamball')).toBeInTheDocument()
    }, DATA_TIMEOUT)

    await user.click(screen.getByText('Lamball'))

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Lamball')
      expect(screen.getByText('Work Suitability')).toBeInTheDocument()
    }, DATA_TIMEOUT)
  })

  it('should show "Clear all filters" when filters are active', async () => {
    const { user } = await renderApp('/')

    await waitFor(() => {
      expect(screen.getByText(`${MOCK_PALS.length} Pals found`)).toBeInTheDocument()
    }, DATA_TIMEOUT)

    const searchInput = screen.getByPlaceholderText('Search Pals by name...')
    await user.type(searchInput, 'test')

    await waitFor(() => {
      expect(screen.getByText('Clear all filters')).toBeInTheDocument()
    }, DATA_TIMEOUT)
  })

  it('should display active filter badges', async () => {
    const { user } = await renderApp('/')

    await waitFor(() => {
      expect(screen.getByText(`${MOCK_PALS.length} Pals found`)).toBeInTheDocument()
    }, DATA_TIMEOUT)

    const searchInput = screen.getByPlaceholderText('Search Pals by name...')
    await user.type(searchInput, 'lam')

    await waitFor(() => {
      expect(screen.getByText(/Search:.*"lam"/)).toBeInTheDocument()
    }, DATA_TIMEOUT)
  })
})
