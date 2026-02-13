import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderApp, MOCK_PALS, DATA_TIMEOUT, filterPals } from './helpers'

// Mock the data layer
vi.mock('~/utils/pals', () => ({
  getPals: vi.fn(),
  getPalById: vi.fn(),
}))

import { getPals, getPalById } from '~/utils/pals'

const mockedGetPals = vi.mocked(getPals)
const mockedGetPalById = vi.mocked(getPalById)

describe('Home Page (Browser)', () => {
  beforeEach(() => {
    mockedGetPals.mockReset()
    mockedGetPalById.mockReset()
    mockedGetPals.mockResolvedValue(MOCK_PALS)
    mockedGetPalById.mockResolvedValue(null)
  })

  it('should render the Paldex heading', async () => {
    const { screen } = await renderApp()
    await expect.element(screen.getByText('Paldex'), DATA_TIMEOUT).toBeInTheDocument()
  })

  it('should display pal cards after data loads', async () => {
    const { screen } = await renderApp()
    await expect.element(screen.getByText('Lamball'), DATA_TIMEOUT).toBeInTheDocument()
    await expect.element(screen.getByText('Foxparks'), DATA_TIMEOUT).toBeInTheDocument()
  })

  it('should display the pal count', async () => {
    const { screen } = await renderApp()
    await expect.element(screen.getByText(`${MOCK_PALS.length} Pals found`), DATA_TIMEOUT).toBeInTheDocument()
  })

  it('should show the filter sidebar', async () => {
    const { screen } = await renderApp()
    await expect.element(screen.getByText('Filters'), DATA_TIMEOUT).toBeInTheDocument()
  })
})
