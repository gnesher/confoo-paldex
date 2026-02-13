import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import DropsTable from './DropsTable.vue'
import { MOCK_DROPS } from '../../tests/helpers/fixtures'

describe('DropsTable', () => {
  it('should render table headers (Item, Quantity, Drop Rate)', async () => {
    const screen = render(DropsTable, {
      props: { data: MOCK_DROPS },
    })
    await expect.element(screen.getByText('Item')).toBeInTheDocument()
    await expect.element(screen.getByText('Quantity')).toBeInTheDocument()
    await expect.element(screen.getByText('Drop Rate')).toBeInTheDocument()
  })

  it('should render drop data rows', async () => {
    const screen = render(DropsTable, {
      props: { data: MOCK_DROPS },
    })
    await expect.element(screen.getByText('Flame Organ')).toBeInTheDocument()
    await expect.element(screen.getByText('Leather')).toBeInTheDocument()
    await expect.element(screen.getByText('Rare Gem')).toBeInTheDocument()
    await expect.element(screen.getByText('75%')).toBeInTheDocument()
    await expect.element(screen.getByText('50%')).toBeInTheDocument()
  })

  it('should show empty message when no data', async () => {
    const screen = render(DropsTable, {
      props: { data: [] },
    })
    await expect.element(
      screen.getByText('No drop data available.')
    ).toBeInTheDocument()
  })
})
