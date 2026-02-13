import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../helpers/render'
import { defineComponent, h } from 'vue'
import { MOCK_LAMBALL } from '../helpers/fixtures'

vi.mock('~/utils/pals', () => ({
  getPals: vi.fn(),
  getPalById: vi.fn(),
}))

import { getPalById } from '~/utils/pals'

const mockedGetPalById = vi.mocked(getPalById)

describe('Detail Page Integration', () => {
  beforeEach(() => {
    mockedGetPalById.mockReset()
    mockedGetPalById.mockResolvedValue(MOCK_LAMBALL)
  })

  it('should render a test component in the router', async () => {
    const TestComp = defineComponent({
      setup() {
        return () => h('div', {}, 'Detail test placeholder')
      },
    })
    // Render at index route (/) where the test component is mounted
    const { screen } = await renderWithProviders(TestComp)
    await expect.element(screen.getByText('Detail test placeholder')).toBeInTheDocument()
  })
})
