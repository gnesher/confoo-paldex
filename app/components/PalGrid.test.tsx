import { describe, it, expect } from 'vitest'
import { PalGrid, PalGridStats } from './PalGrid'
import { renderWithProviders, renderSimple } from '../../tests/helpers/render'
import { createMockPals } from '../../tests/helpers/fixtures'

describe('PalGrid', () => {
  it('should render 12 skeletons when loading', async () => {
    const { screen } = await renderWithProviders(
      <PalGrid pals={[]} isLoading={true} />
    )
    const skeletons = screen.container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBe(12)
  })

  it('should render empty state when no Pals and not loading', async () => {
    const { screen } = await renderWithProviders(<PalGrid pals={[]} />)
    await expect.element(screen.getByText('No Pals found')).toBeInTheDocument()
    await expect.element(
      screen.getByText('Try adjusting your search filters')
    ).toBeInTheDocument()
  })

  it('should render the virtualizer scroll container when Pals are provided', async () => {
    const pals = createMockPals(3)
    const { screen } = await renderWithProviders(<PalGrid pals={pals} />)
    const scrollContainer = screen.container.querySelector('.overflow-auto')
    expect(scrollContainer).not.toBeNull()
  })

  it('should not show empty state when Pals are provided', async () => {
    const pals = createMockPals(3)
    const { screen } = await renderWithProviders(<PalGrid pals={pals} />)
    await expect.element(screen.getByText('No Pals found')).not.toBeInTheDocument()
  })

  it('should not show skeletons when not loading', async () => {
    const pals = createMockPals(3)
    const { screen } = await renderWithProviders(<PalGrid pals={pals} />)
    const skeletons = screen.container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBe(0)
  })
})

describe('PalGridStats', () => {
  it('should render the visible and total counts', async () => {
    const { screen } = await renderSimple(<PalGridStats total={111} visible={20} />)
    await expect.element(
      screen.getByText('Showing 20 of 111 Pals (virtualized)')
    ).toBeInTheDocument()
  })
})
