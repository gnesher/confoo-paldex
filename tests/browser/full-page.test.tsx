import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderApp, MOCK_PALS, filterPals, DATA_TIMEOUT } from './helpers'

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

describe('Full Page – Home (/)', () => {
  describe('Initial render', () => {
    it('should render all major page sections at once', async () => {
      const { screen } = await renderApp('/')

      await expect.element(
        screen.getByRole('heading', { level: 1 }),
        DATA_TIMEOUT
      ).toHaveTextContent('Paldex')
      await expect.element(screen.getByText(/A Pokedex for Palworld/)).toBeInTheDocument()

      await expect.element(screen.getByText('Filters')).toBeInTheDocument()
      await expect.element(screen.getByPlaceholder('Search Pals by name...')).toBeInTheDocument()
      await expect.element(screen.getByText('Types', { exact: true })).toBeInTheDocument()
      await expect.element(screen.getByText('Attack Range')).toBeInTheDocument()

      await expect.element(screen.getByText(`${MOCK_PALS.length} Pals found`)).toBeInTheDocument()

      await expect.element(screen.getByText('Lamball')).toBeInTheDocument()
      await expect.element(screen.getByText('Foxparks')).toBeInTheDocument()
      await expect.element(screen.getByText('Pengullet')).toBeInTheDocument()
      await expect.element(screen.getByText('#001')).toBeInTheDocument()

      await expect.element(screen.getByAltText('Lamball')).toBeInTheDocument()
      await expect.element(screen.getByAltText('Foxparks')).toBeInTheDocument()
    })

    it('should not show team bar when team is empty', async () => {
      const { screen } = await renderApp('/')

      await expect.element(
        screen.getByText(`${MOCK_PALS.length} Pals found`),
        DATA_TIMEOUT
      ).toBeInTheDocument()

      expect(screen.container.querySelector('[class*="My Team"]')).toBeNull()
    })
  })

  describe('Search and filter flow', () => {
    it('should search, filter by type, and combine filters', async () => {
      const { screen } = await renderApp('/')

      await expect.element(
        screen.getByText(`${MOCK_PALS.length} Pals found`),
        DATA_TIMEOUT
      ).toBeInTheDocument()

      const searchInput = screen.getByPlaceholder('Search Pals by name...')
      await searchInput.fill('a')

      await expect.element(
        screen.getByText(/Search:.*"a"/),
        DATA_TIMEOUT
      ).toBeInTheDocument()

      await searchInput.clear()
      await expect.element(
        screen.getByText(`${MOCK_PALS.length} Pals found`),
        DATA_TIMEOUT
      ).toBeInTheDocument()

      await screen.getByText('Select types...').click()
      await screen.getByRole('checkbox', { name: /Fire/ }).click()

      await expect.element(screen.getByText('2 Pals found'), DATA_TIMEOUT).toBeInTheDocument()
      await expect.element(screen.getByText('Foxparks')).toBeInTheDocument()
      await expect.element(screen.getByText('Rooby')).toBeInTheDocument()
    })

    it('should clear all filters and restore full list', async () => {
      const { screen } = await renderApp('/')

      await expect.element(
        screen.getByText(`${MOCK_PALS.length} Pals found`),
        DATA_TIMEOUT
      ).toBeInTheDocument()

      const searchInput = screen.getByPlaceholder('Search Pals by name...')
      await searchInput.fill('fox')

      await expect.element(screen.getByText('1 Pals found'), DATA_TIMEOUT).toBeInTheDocument()
      await expect.element(screen.getByText('Clear all filters')).toBeInTheDocument()

      await screen.getByText('Clear all filters').click()

      await expect.element(
        screen.getByText(`${MOCK_PALS.length} Pals found`),
        DATA_TIMEOUT
      ).toBeInTheDocument()
    })
  })

  describe('Navigation flow', () => {
    it('should navigate to detail page and back', async () => {
      const { screen } = await renderApp('/')

      await expect.element(screen.getByText('Lamball'), DATA_TIMEOUT).toBeInTheDocument()

      await screen.getByText('Lamball').click()

      await expect.element(
        screen.getByRole('heading', { level: 1 }),
        DATA_TIMEOUT
      ).toHaveTextContent('Lamball')
      await expect.element(screen.getByText('Work Suitability')).toBeInTheDocument()
      await expect.element(screen.getByText('Drops')).toBeInTheDocument()

      await screen.getByText('Back to Paldex').click()

      await expect.element(
        screen.getByRole('heading', { level: 1 }),
        DATA_TIMEOUT
      ).toHaveTextContent('Paldex')
      await expect.element(
        screen.getByText(`${MOCK_PALS.length} Pals found`),
      ).toBeInTheDocument()
    })
  })

  describe('Team management flow', () => {
    it('should add Pal from detail page and see it on team bar back on home', async () => {
      const { screen } = await renderApp('/')

      await expect.element(screen.getByText('Lamball'), DATA_TIMEOUT).toBeInTheDocument()
      await screen.getByText('Lamball').click()

      await expect.element(screen.getByText('Add to Team'), DATA_TIMEOUT).toBeInTheDocument()
      await screen.getByText('Add to Team').click()

      await expect.element(screen.getByText('1 Pal')).toBeInTheDocument()
      await expect.element(screen.getByText('My Team')).toBeInTheDocument()

      await screen.getByText('Back to Paldex').click()

      await expect.element(
        screen.getByText(`${MOCK_PALS.length} Pals found`),
        DATA_TIMEOUT
      ).toBeInTheDocument()
      await expect.element(screen.getByText('1 Pal')).toBeInTheDocument()
      await expect.element(screen.getByText('My Team')).toBeInTheDocument()
    })

    it('should add multiple Pals and manage team from home page', async () => {
      const { screen } = await renderApp('/')

      await expect.element(screen.getByText('Lamball'), DATA_TIMEOUT).toBeInTheDocument()
      await screen.getByText('Lamball').click()
      await expect.element(screen.getByText('Add to Team'), DATA_TIMEOUT).toBeInTheDocument()
      await screen.getByText('Add to Team').click()
      await expect.element(screen.getByText('1 Pal')).toBeInTheDocument()

      await screen.getByText('Back to Paldex').click()
      await expect.element(screen.getByText('Foxparks'), DATA_TIMEOUT).toBeInTheDocument()
      await screen.getByText('Foxparks').click()
      await expect.element(screen.getByText('Add to Team'), DATA_TIMEOUT).toBeInTheDocument()
      await screen.getByText('Add to Team').click()
      await expect.element(screen.getByText('2 Pals')).toBeInTheDocument()

      await screen.getByText('Back to Paldex').click()
      await expect.element(
        screen.getByText(`${MOCK_PALS.length} Pals found`),
        DATA_TIMEOUT
      ).toBeInTheDocument()

      await screen.getByText('My Team').click()
      const removeButtons = screen.getByTitle('Remove from team')
      await expect.element(removeButtons.first()).toBeInTheDocument()
      await expect(removeButtons.elements()).toHaveLength(2)

      await removeButtons.first().click()
      await expect.element(screen.getByText('1 Pal')).toBeInTheDocument()
    })
  })

  describe('Combined end-to-end flow', () => {
    it('should search, navigate, add to team, filter, and return', async () => {
      const { screen } = await renderApp('/')

      await expect.element(
        screen.getByText(`${MOCK_PALS.length} Pals found`),
        DATA_TIMEOUT
      ).toBeInTheDocument()

      const searchInput = screen.getByPlaceholder('Search Pals by name...')
      await searchInput.fill('fox')
      await expect.element(screen.getByText('1 Pals found'), DATA_TIMEOUT).toBeInTheDocument()

      await screen.getByText('Foxparks').click()
      await expect.element(
        screen.getByRole('heading', { level: 1 }),
        DATA_TIMEOUT
      ).toHaveTextContent('Foxparks')
      await expect.element(screen.getByText('Fire')).toBeInTheDocument()

      await screen.getByText('Add to Team').click()
      await expect.element(screen.getByText('Remove from Team')).toBeInTheDocument()
      await expect.element(screen.getByText('1 Pal')).toBeInTheDocument()

      await screen.getByText('Back to Paldex').click()
      await expect.element(
        screen.getByRole('heading', { level: 1 }),
        DATA_TIMEOUT
      ).toHaveTextContent('Paldex')

      await expect.element(screen.getByText('1 Pal')).toBeInTheDocument()

      await screen.getByText('Select types...').click()
      await screen.getByRole('checkbox', { name: /Fire/ }).click()
      await expect.element(screen.getByText('2 Pals found'), DATA_TIMEOUT).toBeInTheDocument()
    })
  })
})
