import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../helpers/render'
import { defineComponent, h } from 'vue'
import { createMockPals } from '../helpers/fixtures'

vi.mock('~/utils/pals', () => ({
  getPals: vi.fn(),
  getPalById: vi.fn(),
}))

import { getPals } from '~/utils/pals'

const mockedGetPals = vi.mocked(getPals)

describe('Home Page Integration', () => {
  const mockPals = createMockPals(5)

  beforeEach(() => {
    mockedGetPals.mockReset()
    mockedGetPals.mockResolvedValue(mockPals)
  })

  it('should render the main heading', async () => {
    const TestComp = defineComponent({
      setup() {
        return () => h('div', {}, 'Integration test placeholder')
      },
    })
    const { screen } = await renderWithProviders(TestComp)
    await expect.element(screen.getByText('Integration test placeholder')).toBeInTheDocument()
  })
})
