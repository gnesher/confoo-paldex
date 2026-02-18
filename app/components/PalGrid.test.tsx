import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, renderSimple } from '../../tests/helpers/render'
import { createMockPals } from '../../tests/helpers/fixtures'
import PalGrid from './PalGrid.vue'
import { PalGridStats } from './PalGridStats'

describe('PalGrid', () => {
  it('should render 12 skeletons when loading', async () => {
    const { screen } = await renderWithProviders(PalGrid, {
      props: { pals: [], isLoading: true },
    })
    await vi.waitFor(() => {
      const skeletons = screen.container.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBe(12)
    }, { timeout: 2000 })
  })

  it('with empty array should show "No Pals found"', async () => {
    const { screen } = await renderWithProviders(PalGrid, {
      props: { pals: [] },
    })
    await expect.element(screen.getByText('No Pals found')).toBeInTheDocument()
    await expect.element(
      screen.getByText('Try adjusting your search filters')
    ).toBeInTheDocument()
  })

  it('with pals should render cards', async () => {
    const pals = createMockPals(3)
    const { screen } = await renderWithProviders(PalGrid, {
      props: { pals },
    })
    await expect.element(screen.getByText('Pal001')).toBeInTheDocument()
    await expect.element(screen.getByText('Pal002')).toBeInTheDocument()
    await expect.element(screen.getByText('Pal003')).toBeInTheDocument()
  })

  it('should not show empty state when Pals are provided', async () => {
    const pals = createMockPals(3)
    const { screen } = await renderWithProviders(PalGrid, {
      props: { pals },
    })
    await expect.element(screen.getByText('No Pals found')).not.toBeInTheDocument()
  })

  it('should not show skeletons when not loading', async () => {
    const pals = createMockPals(3)
    const { screen } = await renderWithProviders(PalGrid, {
      props: { pals },
    })
    const skeletons = screen.container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBe(0)
  })
})

describe('PalGridStats', () => {
  it('should show count text', async () => {
    const { screen } = await renderSimple(PalGridStats, {
      props: { total: 111, visible: 20 },
    })
    await expect.element(
      screen.getByText('Showing 20 of 111 Pals (virtualized)')
    ).toBeInTheDocument()
  })
})
