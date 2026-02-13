import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderApp, MOCK_PALS, DATA_TIMEOUT } from './helpers'
import { MOCK_LAMBALL } from '../helpers/fixtures'

vi.mock('~/utils/pals', () => ({
  getPals: vi.fn(),
  getPalById: vi.fn(),
}))

import { getPals, getPalById } from '~/utils/pals'

const mockedGetPals = vi.mocked(getPals)
const mockedGetPalById = vi.mocked(getPalById)

describe('Detail Page (Browser)', () => {
  beforeEach(() => {
    mockedGetPals.mockReset()
    mockedGetPalById.mockReset()
    mockedGetPals.mockResolvedValue(MOCK_PALS)
    mockedGetPalById.mockImplementation(async (id) => {
      return MOCK_PALS.find((p) => p.id === id) ?? null
    })
  })

  it('should render pal detail when navigating to /pals/$palId', async () => {
    const { screen } = await renderApp(`/pals/${MOCK_LAMBALL.id}`)
    await expect.element(screen.getByText(MOCK_LAMBALL.name), DATA_TIMEOUT).toBeInTheDocument()
  })

  it('should show back navigation link', async () => {
    const { screen } = await renderApp(`/pals/${MOCK_LAMBALL.id}`)
    await expect.element(screen.getByText('Back to Paldex'), DATA_TIMEOUT).toBeInTheDocument()
  })

  it('should display pal stats', async () => {
    const { screen } = await renderApp(`/pals/${MOCK_LAMBALL.id}`)
    await expect.element(screen.getByText('HP'), DATA_TIMEOUT).toBeInTheDocument()
    await expect.element(screen.getByText('Attack'), DATA_TIMEOUT).toBeInTheDocument()
    await expect.element(screen.getByText('Defense'), DATA_TIMEOUT).toBeInTheDocument()
  })

  it('should show Pal Not Found for invalid ID', async () => {
    mockedGetPalById.mockResolvedValue(null)
    const { screen } = await renderApp('/pals/999')
    await expect.element(screen.getByText('Pal Not Found'), DATA_TIMEOUT).toBeInTheDocument()
  })
})
