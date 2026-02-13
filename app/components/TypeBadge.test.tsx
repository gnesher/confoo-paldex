import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import TypeBadge from './TypeBadge.vue'

describe('TypeBadge', () => {
  it('should render the type text', async () => {
    const screen = render(TypeBadge, {
      props: { type: 'Fire' },
    })
    await expect.element(screen.getByText('Fire')).toBeInTheDocument()
  })

  it('should apply correct color class', async () => {
    const screen = render(TypeBadge, {
      props: { type: 'Water' },
    })
    const badge = screen.getByText('Water')
    await expect.element(badge).toHaveClass('bg-water')
  })

  it('should render Neutral type', async () => {
    const screen = render(TypeBadge, {
      props: { type: 'Neutral' },
    })
    await expect.element(screen.getByText('Neutral')).toBeInTheDocument()
    const badge = screen.getByText('Neutral')
    await expect.element(badge).toHaveClass('bg-neutral')
  })
})
