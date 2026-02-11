import { describe, it, expect } from 'vitest'
import { DropsTable } from './DropsTable'
import { renderSimple } from '../../tests/helpers/render'
import { MOCK_DROPS } from '../../tests/helpers/fixtures'

describe('DropsTable', () => {
  it('should render column headers', async () => {
    const { screen } = await renderSimple(() => <DropsTable data={MOCK_DROPS} />)
    await expect.element(screen.getByText('Item')).toBeInTheDocument()
    await expect.element(screen.getByText('Quantity')).toBeInTheDocument()
    await expect.element(screen.getByText('Drop Rate')).toBeInTheDocument()
  })

  it('should render item names', async () => {
    const { screen } = await renderSimple(() => <DropsTable data={MOCK_DROPS} />)
    await expect.element(screen.getByText('Flame Organ')).toBeInTheDocument()
    await expect.element(screen.getByText('Leather')).toBeInTheDocument()
    await expect.element(screen.getByText('Rare Gem')).toBeInTheDocument()
  })

  it('should render quantities with multiplication prefix', async () => {
    const { screen } = await renderSimple(() => <DropsTable data={MOCK_DROPS} />)
    await expect.element(screen.getByText('×2')).toBeInTheDocument()
    // Two items with quantity 1
    const ones = await screen.getByText('×1').all()
    expect(ones).toHaveLength(2)
  })

  it('should render drop rates as percentages', async () => {
    const { screen } = await renderSimple(() => <DropsTable data={MOCK_DROPS} />)
    await expect.element(screen.getByText('75%')).toBeInTheDocument()
    await expect.element(screen.getByText('50%')).toBeInTheDocument()
  })

  it('should render a dash for undefined drop rate', async () => {
    const { screen } = await renderSimple(() => <DropsTable data={MOCK_DROPS} />)
    // Rare Gem has no dropRate
    await expect.element(screen.getByText('—')).toBeInTheDocument()
  })

  it('should show empty state when no data', async () => {
    const { screen } = await renderSimple(() => <DropsTable data={[]} />)
    await expect.element(screen.getByText('No drop data available.')).toBeInTheDocument()
  })
})
