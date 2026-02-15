import { describe, it, expect } from 'vitest'
import { SuitabilityTable } from './SuitabilityTable'
import { renderSimple } from '../../tests/helpers/render'
import { MOCK_SUITABILITY } from '../../tests/helpers/fixtures'

describe('SuitabilityTable', () => {
  it('should render column headers', async () => {
    const { screen } = await renderSimple(<SuitabilityTable data={MOCK_SUITABILITY} />)
    await expect.element(screen.getByText('Work Type')).toBeInTheDocument()
    await expect.element(screen.getByText('Level')).toBeInTheDocument()
  })

  it('should render a row for each suitability entry', async () => {
    const { screen } = await renderSimple(<SuitabilityTable data={MOCK_SUITABILITY} />)
    await expect.element(screen.getByText('Kindling')).toBeInTheDocument()
    await expect.element(screen.getByText('Mining')).toBeInTheDocument()
    await expect.element(screen.getByText('Handiwork')).toBeInTheDocument()
  })

  it('should render work type icons', async () => {
    const { screen } = await renderSimple(<SuitabilityTable data={MOCK_SUITABILITY} />)
    await expect.element(screen.getByText('🔥')).toBeInTheDocument()
    await expect.element(screen.getByText('⛏️')).toBeInTheDocument()
    await expect.element(screen.getByText('🔧')).toBeInTheDocument()
  })

  it('should render correct number of filled stars for level', async () => {
    const { screen } = await renderSimple(
      <SuitabilityTable data={[{ workType: 'Kindling', level: 3 }]} />
    )
    const filledStars = await screen.getByText('⭐').all()
    const emptyStars = await screen.getByText('☆').all()
    expect(filledStars).toHaveLength(3)
    expect(emptyStars).toHaveLength(1)
  })

  it('should show empty state when no data', async () => {
    const { screen } = await renderSimple(<SuitabilityTable data={[]} />)
    await expect.element(
      screen.getByText('No work suitability data available.')
    ).toBeInTheDocument()
  })
})
