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

describe('Detail Page', () => {
  it('should display the Pal name and ID', async () => {
    const { screen } = await renderApp('/pals/001')

    await expect.element(
      screen.getByRole('heading', { level: 1 }),
      DATA_TIMEOUT
    ).toHaveTextContent('Lamball')

    await expect.element(screen.getByText('#001')).toBeInTheDocument()
  })

  it('should display the Pal image', async () => {
    const { screen } = await renderApp('/pals/001')

    await expect.element(screen.getByAltText('Lamball'), DATA_TIMEOUT).toBeInTheDocument()
  })

  it('should display type badges', async () => {
    const { screen } = await renderApp('/pals/001')

    // Lamball is Neutral type
    await expect.element(screen.getByText('Neutral'), DATA_TIMEOUT).toBeInTheDocument()
  })

  it('should display dual type badges', async () => {
    // Pengullet (010) is Water + Ice
    const { screen } = await renderApp('/pals/010')

    await expect.element(screen.getByText('Water', { exact: true }), DATA_TIMEOUT).toBeInTheDocument()
    await expect.element(screen.getByText('Ice', { exact: true })).toBeInTheDocument()
  })

  it('should display HP, Attack, and Defense stats', async () => {
    const { screen } = await renderApp('/pals/001')

    await expect.element(screen.getByText('HP'), DATA_TIMEOUT).toBeInTheDocument()
    await expect.element(screen.getByText('Attack')).toBeInTheDocument()
    await expect.element(screen.getByText('Defense')).toBeInTheDocument()
  })

  it('should display the Work Suitability table', async () => {
    const { screen } = await renderApp('/pals/001')

    await expect.element(screen.getByText('Work Suitability'), DATA_TIMEOUT).toBeInTheDocument()

    // Lamball has Handiwork, Transporting, Farming
    await expect.element(screen.getByText('Handiwork')).toBeInTheDocument()
    await expect.element(screen.getByText('Transporting')).toBeInTheDocument()
    await expect.element(screen.getByText('Farming')).toBeInTheDocument()
  })

  it('should display the Drops table', async () => {
    const { screen } = await renderApp('/pals/001')

    await expect.element(screen.getByText('Drops'), DATA_TIMEOUT).toBeInTheDocument()
    await expect.element(screen.getByText('Wool')).toBeInTheDocument()
  })

  it('should display the "Add to Team" button', async () => {
    const { screen } = await renderApp('/pals/001')

    await expect.element(screen.getByText('Add to Team'), DATA_TIMEOUT).toBeInTheDocument()
  })

  it('should add a Pal to the team', async () => {
    const { screen } = await renderApp('/pals/001')

    await expect.element(screen.getByText('Add to Team'), DATA_TIMEOUT).toBeInTheDocument()

    await screen.getByText('Add to Team').click()

    await expect.element(screen.getByText('Remove from Team')).toBeInTheDocument()
    await expect.element(screen.getByText('1 Pal')).toBeInTheDocument()
    await expect.element(screen.getByText('My Team')).toBeInTheDocument()
  })

  it('should remove a Pal from the team', async () => {
    const { screen } = await renderApp('/pals/001')

    await expect.element(screen.getByText('Add to Team'), DATA_TIMEOUT).toBeInTheDocument()

    await screen.getByText('Add to Team').click()
    await expect.element(screen.getByText('Remove from Team')).toBeInTheDocument()

    await screen.getByText('Remove from Team').click()
    await expect.element(screen.getByText('Add to Team')).toBeInTheDocument()
  })

  it('should expand the team bar to show Pal thumbnails', async () => {
    const { screen } = await renderApp('/pals/001')

    await expect.element(screen.getByText('Add to Team'), DATA_TIMEOUT).toBeInTheDocument()

    await screen.getByText('Add to Team').click()
    await screen.getByText('My Team').click()

    // Expanded bar shows the per-member remove button
    await expect.element(screen.getByTitle('Remove from team')).toBeInTheDocument()
  })

  it('should persist team across page navigation', async () => {
    const { screen } = await renderApp('/pals/001')

    await expect.element(screen.getByText('Add to Team'), DATA_TIMEOUT).toBeInTheDocument()

    await screen.getByText('Add to Team').click()
    await expect.element(screen.getByText('1 Pal')).toBeInTheDocument()

    // Navigate back to home
    await screen.getByText('Back to Paldex').click()

    await expect.element(
      screen.getByRole('heading', { level: 1 }),
      DATA_TIMEOUT
    ).toHaveTextContent('Paldex')

    // Team bar should still show
    await expect.element(screen.getByText('1 Pal')).toBeInTheDocument()
  })

  it('should have a working "Back to Paldex" link', async () => {
    const { screen } = await renderApp('/pals/001')

    await expect.element(screen.getByText('Back to Paldex'), DATA_TIMEOUT).toBeInTheDocument()

    await screen.getByText('Back to Paldex').click()

    await expect.element(
      screen.getByRole('heading', { level: 1 }),
      DATA_TIMEOUT
    ).toHaveTextContent('Paldex')
  })

  it('should show "Pal Not Found" for invalid ID', async () => {
    const { screen } = await renderApp('/pals/999')

    await expect.element(screen.getByText('Pal Not Found'), DATA_TIMEOUT).toBeInTheDocument()
    await expect.element(screen.getByText(/No Pal with ID "999" exists/)).toBeInTheDocument()
  })

  it('should display different Pals correctly', async () => {
    // Foxparks is Fire type with Kindling suitability
    const { screen } = await renderApp('/pals/005')

    await expect.element(
      screen.getByRole('heading', { level: 1 }),
      DATA_TIMEOUT
    ).toHaveTextContent('Foxparks')

    await expect.element(screen.getByText('Fire')).toBeInTheDocument()
    await expect.element(screen.getByText('Kindling')).toBeInTheDocument()
  })
})
