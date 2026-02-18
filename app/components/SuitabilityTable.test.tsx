import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import SuitabilityTable from './SuitabilityTable.vue'
import { MOCK_SUITABILITY } from '../../tests/helpers/fixtures'

describe('SuitabilityTable', () => {
  it('should render table headers (Work Type, Level)', async () => {
    const screen = render(SuitabilityTable, {
      props: { data: MOCK_SUITABILITY },
    })
    await expect.element(screen.getByText('Work Type')).toBeInTheDocument()
    await expect.element(screen.getByText('Level')).toBeInTheDocument()
  })

  it('should render suitability data rows with stars', async () => {
    const screen = render(SuitabilityTable, {
      props: { data: MOCK_SUITABILITY },
    })
    await expect.element(screen.getByText('Kindling')).toBeInTheDocument()
    await expect.element(screen.getByText('Mining')).toBeInTheDocument()
    await expect.element(screen.getByText('Handiwork')).toBeInTheDocument()
    // Stars are rendered for level - check for work type icons
    await expect.element(screen.getByText('🔥')).toBeInTheDocument()
  })

  it('should render work type icons', async () => {
    const screen = render(SuitabilityTable, {
      props: { data: MOCK_SUITABILITY },
    })
    await expect.element(screen.getByText('🔥')).toBeInTheDocument()
    await expect.element(screen.getByText('⛏️')).toBeInTheDocument()
    await expect.element(screen.getByText('🔧')).toBeInTheDocument()
  })

  it('should render correct number of filled stars for level', async () => {
    const screen = render(SuitabilityTable, {
      props: { data: [{ workType: 'Kindling', level: 3 }] },
    })
    const filledStars = await screen.getByText('⭐').all()
    const emptyStars = await screen.getByText('☆').all()
    expect(filledStars).toHaveLength(3)
    expect(emptyStars).toHaveLength(1)
  })

  it('should show empty message when no data', async () => {
    const screen = render(SuitabilityTable, {
      props: { data: [] },
    })
    await expect.element(
      screen.getByText('No work suitability data available.')
    ).toBeInTheDocument()
  })
})
