import { describe, it, expect } from 'vitest'
import { renderWithProviders, renderSimple } from '../../tests/helpers/render'
import { createMockPals } from '../../tests/helpers/fixtures'
import PalGrid from './PalGrid.vue'
import { PalGridStats } from './PalGridStats'

describe('PalGrid', () => {
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
