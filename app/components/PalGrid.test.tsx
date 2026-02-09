import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { PalGrid, PalGridStats } from './PalGrid'
import { renderWithProviders, renderSimple } from '../../tests/helpers/render'
import { createMockPals } from '../../tests/helpers/fixtures'

describe('PalGrid', () => {
  it('should render 12 skeletons when loading', async () => {
    const { container } = await renderWithProviders(
      <PalGrid pals={[]} isLoading={true} />
    )
    // Skeletons have animate-pulse class
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBe(12)
  })

  it('should render empty state when no Pals and not loading', async () => {
    await renderWithProviders(<PalGrid pals={[]} />)
    expect(screen.getByText('No Pals found')).toBeInTheDocument()
    expect(
      screen.getByText('Try adjusting your search filters')
    ).toBeInTheDocument()
  })

  it('should render the virtualizer scroll container when Pals are provided', async () => {
    const pals = createMockPals(3)
    const { container } = await renderWithProviders(<PalGrid pals={pals} />)
    // The virtualizer renders its container div even in jsdom
    // (cards may not be visible because clientWidth=0 in jsdom, which is expected)
    const scrollContainer = container.querySelector('.overflow-auto')
    expect(scrollContainer).toBeInTheDocument()
  })

  it('should not show empty state when Pals are provided', async () => {
    const pals = createMockPals(3)
    await renderWithProviders(<PalGrid pals={pals} />)
    expect(screen.queryByText('No Pals found')).not.toBeInTheDocument()
  })

  it('should not show skeletons when not loading', async () => {
    const pals = createMockPals(3)
    const { container } = await renderWithProviders(<PalGrid pals={pals} />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBe(0)
  })
})

describe('PalGridStats', () => {
  it('should render the visible and total counts', () => {
    renderSimple(<PalGridStats total={111} visible={20} />)
    expect(
      screen.getByText('Showing 20 of 111 Pals (virtualized)')
    ).toBeInTheDocument()
  })
})
