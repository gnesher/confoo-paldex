import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { DropsTable } from './DropsTable'
import { renderSimple } from '../../tests/helpers/render'
import { MOCK_DROPS } from '../../tests/helpers/fixtures'

describe('DropsTable', () => {
  it('should render column headers', () => {
    renderSimple(<DropsTable data={MOCK_DROPS} />)
    expect(screen.getByText('Item')).toBeInTheDocument()
    expect(screen.getByText('Quantity')).toBeInTheDocument()
    expect(screen.getByText('Drop Rate')).toBeInTheDocument()
  })

  it('should render item names', () => {
    renderSimple(<DropsTable data={MOCK_DROPS} />)
    expect(screen.getByText('Flame Organ')).toBeInTheDocument()
    expect(screen.getByText('Leather')).toBeInTheDocument()
    expect(screen.getByText('Rare Gem')).toBeInTheDocument()
  })

  it('should render quantities with multiplication prefix', () => {
    renderSimple(<DropsTable data={MOCK_DROPS} />)
    expect(screen.getByText('×2')).toBeInTheDocument()
    // Two items with quantity 1
    const ones = screen.getAllByText('×1')
    expect(ones).toHaveLength(2)
  })

  it('should render drop rates as percentages', () => {
    renderSimple(<DropsTable data={MOCK_DROPS} />)
    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('should render a dash for undefined drop rate', () => {
    renderSimple(<DropsTable data={MOCK_DROPS} />)
    // Rare Gem has no dropRate
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('should show empty state when no data', () => {
    renderSimple(<DropsTable data={[]} />)
    expect(screen.getByText('No drop data available.')).toBeInTheDocument()
  })
})
