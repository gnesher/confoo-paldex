import { describe, it, expect, vi, beforeEach } from 'vitest'
import { page } from 'vitest/browser'
import { renderApp, MOCK_PALS, filterPals, DATA_TIMEOUT } from '../browser/helpers'

vi.mock('~/utils/pals', () => ({
  getPals: vi.fn(),
  getPalById: vi.fn(),
}))

import { getPals, getPalById } from '~/utils/pals'

const mockGetPals = vi.mocked(getPals)
const mockGetPalById = vi.mocked(getPalById)

const SCREENSHOT_OPTIONS = {
  comparatorOptions: {
    threshold: 0.1,
    allowedMismatchedPixelRatio: 0.02,
  },
}

beforeEach(() => {
  mockGetPals.mockImplementation(async (params) => filterPals(MOCK_PALS, params))
  mockGetPalById.mockImplementation(async (id) => MOCK_PALS.find((p) => p.id === id) ?? null)
})

describe('Visual Snapshots', () => {
  describe('Home Page', () => {
    it('should match screenshot with Pals loaded', async () => {
      const { screen } = await renderApp('/')

      await expect.element(
        screen.getByText(`${MOCK_PALS.length} Pals found`),
        DATA_TIMEOUT,
      ).toBeInTheDocument()

      await expect(page.elementLocator(screen.container)).toMatchScreenshot(
        'home-loaded',
        SCREENSHOT_OPTIONS,
      )
    })

    it('should match screenshot with empty results', async () => {
      mockGetPals.mockResolvedValue([])
      const { screen } = await renderApp('/')

      await expect.element(
        screen.getByText('No Pals found'),
        DATA_TIMEOUT,
      ).toBeInTheDocument()

      await expect(page.elementLocator(screen.container)).toMatchScreenshot(
        'home-empty',
        SCREENSHOT_OPTIONS,
      )
    })
  })

  describe('Detail Page', () => {
    it('should match screenshot for single-type Pal', async () => {
      const { screen } = await renderApp('/pals/001')

      await expect.element(
        screen.getByRole('heading', { level: 1 }),
        DATA_TIMEOUT,
      ).toHaveTextContent('Lamball')

      await expect(page.elementLocator(screen.container)).toMatchScreenshot(
        'detail-single-type',
        SCREENSHOT_OPTIONS,
      )
    })

    it('should match screenshot for dual-type Pal', async () => {
      const { screen } = await renderApp('/pals/010')

      await expect.element(
        screen.getByRole('heading', { level: 1 }),
        DATA_TIMEOUT,
      ).toHaveTextContent('Pengullet')

      await expect(page.elementLocator(screen.container)).toMatchScreenshot(
        'detail-dual-type',
        SCREENSHOT_OPTIONS,
      )
    })

    it('should match screenshot for Pal not found', async () => {
      const { screen } = await renderApp('/pals/999')

      await expect.element(
        screen.getByText('Pal Not Found'),
        DATA_TIMEOUT,
      ).toBeInTheDocument()

      await expect(page.elementLocator(screen.container)).toMatchScreenshot(
        'detail-not-found',
        SCREENSHOT_OPTIONS,
      )
    })

    it('should match screenshot with team bar visible', async () => {
      const { screen } = await renderApp('/pals/001')

      await expect.element(
        screen.getByText('Add to Team'),
        DATA_TIMEOUT,
      ).toBeInTheDocument()

      await screen.getByText('Add to Team').click()
      await expect.element(screen.getByText('My Team')).toBeInTheDocument()

      await expect(page.elementLocator(screen.container)).toMatchScreenshot(
        'detail-with-team-bar',
        SCREENSHOT_OPTIONS,
      )
    })
  })
})
