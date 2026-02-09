import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { SuitabilityTable } from './SuitabilityTable'
import { renderSimple } from '../../tests/helpers/render'
import { MOCK_SUITABILITY } from '../../tests/helpers/fixtures'

describe('SuitabilityTable', () => {
  it('should render column headers', () => {
    renderSimple(<SuitabilityTable data={MOCK_SUITABILITY} />)
    expect(screen.getByText('Work Type')).toBeInTheDocument()
    expect(screen.getByText('Level')).toBeInTheDocument()
  })

  it('should render a row for each suitability entry', () => {
    renderSimple(<SuitabilityTable data={MOCK_SUITABILITY} />)
    expect(screen.getByText('Kindling')).toBeInTheDocument()
    expect(screen.getByText('Mining')).toBeInTheDocument()
    expect(screen.getByText('Handiwork')).toBeInTheDocument()
  })

  it('should render work type icons', () => {
    renderSimple(<SuitabilityTable data={MOCK_SUITABILITY} />)
    // Kindling icon is fire emoji
    expect(screen.getByText('🔥')).toBeInTheDocument()
    // Mining icon is pickaxe
    expect(screen.getByText('⛏️')).toBeInTheDocument()
    // Handiwork icon is wrench
    expect(screen.getByText('🔧')).toBeInTheDocument()
  })

  it('should render correct number of filled stars for level', () => {
    const { container } = renderSimple(
      <SuitabilityTable data={[{ workType: 'Kindling', level: 3 }]} />
    )
    const rows = container.querySelectorAll('tbody tr')
    expect(rows).toHaveLength(1)
    const row = rows[0]
    // 3 filled stars + 1 empty star
    const filledStars = within(row).getAllByText('⭐')
    const emptyStars = within(row).getAllByText('☆')
    expect(filledStars).toHaveLength(3)
    expect(emptyStars).toHaveLength(1)
  })

  it('should show empty state when no data', () => {
    renderSimple(<SuitabilityTable data={[]} />)
    expect(
      screen.getByText('No work suitability data available.')
    ).toBeInTheDocument()
  })
})

// Import within for row-scoped queries
import { within } from '@testing-library/react'
