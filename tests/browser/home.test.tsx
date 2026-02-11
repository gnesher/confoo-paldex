import { describe, it, expect, vi, beforeEach } from 'vitest'
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
    const { screen } = await renderApp('/')

    await expect.element(
      screen.getByRole('heading', { level: 1 }),
      DATA_TIMEOUT
    ).toHaveTextContent('Paldex')

    await expect.element(screen.getByText(/A Pokedex for Palworld/)).toBeInTheDocument()
  })

  it('should load and display all Pals', async () => {
    const { screen } = await renderApp('/')

    await expect.element(
      screen.getByText(`${MOCK_PALS.length} Pals found`),
      DATA_TIMEOUT
    ).toBeInTheDocument()
  })

  it('should display the filter sidebar', async () => {
    const { screen } = await renderApp('/')

    await expect.element(screen.getByText('Filters'), DATA_TIMEOUT).toBeInTheDocument()

    await expect.element(screen.getByPlaceholder('Search Pals by name...')).toBeInTheDocument()
    await expect.element(screen.getByText('Types', { exact: true })).toBeInTheDocument()
    await expect.element(screen.getByText('Attack Range')).toBeInTheDocument()
  })

  it('should render Pal cards', async () => {
    const { screen } = await renderApp('/')

    await expect.element(
      screen.getByText(`${MOCK_PALS.length} Pals found`),
      DATA_TIMEOUT
    ).toBeInTheDocument()

    // In test environment, mock image URLs may fail to load,
    // so PalImage shows the fallback. Verify a Pal card rendered by checking the name.
    await expect.element(screen.getByText('Lamball')).toBeInTheDocument()
  })

  it('should display Pal name and ID on cards', async () => {
    const { screen } = await renderApp('/')

    await expect.element(screen.getByText('Lamball'), DATA_TIMEOUT).toBeInTheDocument()
    // PalImage fallback may also show #palId, so use first() to avoid strict mode violation
    await expect.element(screen.getByText('#001').first()).toBeInTheDocument()
  })

  it('should filter Pals by search text', async () => {
    const { screen } = await renderApp('/')

    await expect.element(
      screen.getByText(`${MOCK_PALS.length} Pals found`),
      DATA_TIMEOUT
    ).toBeInTheDocument()

    const searchInput = screen.getByPlaceholder('Search Pals by name...')
    await searchInput.clear()
    await searchInput.fill('fox')

    // Debounce fires, navigation updates params, query re-runs with filter
    await expect.element(screen.getByText('Foxparks'), DATA_TIMEOUT).toBeInTheDocument()
    await expect.element(screen.getByText('1 Pals found')).toBeInTheDocument()
  })

  it('should clear search and show all Pals again', async () => {
    const { screen } = await renderApp('/')

    await expect.element(
      screen.getByText(`${MOCK_PALS.length} Pals found`),
      DATA_TIMEOUT
    ).toBeInTheDocument()

    const searchInput = screen.getByPlaceholder('Search Pals by name...')
    await searchInput.fill('fox')

    await expect.element(screen.getByText('1 Pals found'), DATA_TIMEOUT).toBeInTheDocument()

    await searchInput.clear()

    await expect.element(
      screen.getByText(`${MOCK_PALS.length} Pals found`),
      DATA_TIMEOUT
    ).toBeInTheDocument()
  })

  it('should filter Pals by type', async () => {
    const { screen } = await renderApp('/')

    await expect.element(
      screen.getByText(`${MOCK_PALS.length} Pals found`),
      DATA_TIMEOUT
    ).toBeInTheDocument()

    // Open type dropdown and select Fire
    await screen.getByText('Select types...').click()
    await screen.getByRole('checkbox', { name: /Fire/ }).click()

    // Foxparks + Rooby = 2 Fire pals
    await expect.element(screen.getByText('2 Pals found'), DATA_TIMEOUT).toBeInTheDocument()
  })

  it('should navigate to Pal detail page when clicking a card', async () => {
    const { screen } = await renderApp('/')

    await expect.element(screen.getByText('Lamball'), DATA_TIMEOUT).toBeInTheDocument()

    await screen.getByText('Lamball').click()

    await expect.element(
      screen.getByRole('heading', { level: 1 }),
      DATA_TIMEOUT
    ).toHaveTextContent('Lamball')
    await expect.element(screen.getByText('Work Suitability')).toBeInTheDocument()
  })

  it('should show "Clear all filters" when filters are active', async () => {
    const { screen } = await renderApp('/')

    await expect.element(
      screen.getByText(`${MOCK_PALS.length} Pals found`),
      DATA_TIMEOUT
    ).toBeInTheDocument()

    const searchInput = screen.getByPlaceholder('Search Pals by name...')
    await searchInput.fill('test')

    await expect.element(
      screen.getByText('Clear all filters'),
      DATA_TIMEOUT
    ).toBeInTheDocument()
  })

  it('should display active filter badges', async () => {
    const { screen } = await renderApp('/')

    await expect.element(
      screen.getByText(`${MOCK_PALS.length} Pals found`),
      DATA_TIMEOUT
    ).toBeInTheDocument()

    const searchInput = screen.getByPlaceholder('Search Pals by name...')
    await searchInput.fill('lam')

    await expect.element(
      screen.getByText(/Search:.*"lam"/),
      DATA_TIMEOUT
    ).toBeInTheDocument()
  })
})
