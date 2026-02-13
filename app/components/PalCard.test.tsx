import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-vue'
import { renderWithProviders, renderSimple } from '../../tests/helpers/render'
import {
  MOCK_LAMBALL,
  MOCK_FOXPARKS,
  MOCK_PENGULLET,
} from '../../tests/helpers/fixtures'
import PalCard from './PalCard.vue'
import { PalCardSkeleton } from './PalCard'

describe('PalCard', () => {
  it('should render pal name, ID, types, and stats', async () => {
    const { screen } = await renderWithProviders(PalCard, {
      props: { pal: MOCK_LAMBALL },
    })
    await expect.element(screen.getByText('Lamball')).toBeInTheDocument()
    // #001 may appear in both the card ID badge and the image fallback
    const idElements = screen.getByText('#001').all()
    expect((await idElements).length).toBeGreaterThanOrEqual(1)
    await expect.element(screen.getByText('Neutral')).toBeInTheDocument()
    // Stats values appear multiple times (hp=70, atk=70, def=70), check at least one exists
    const statElements = screen.getByText(String(MOCK_LAMBALL.stats.hp)).all()
    expect((await statElements).length).toBeGreaterThanOrEqual(1)
  }, 10000)

  it('should have a link to /pals/$palId', async () => {
    const { screen } = await renderWithProviders(PalCard, {
      props: { pal: MOCK_LAMBALL },
    })
    const link = screen.getByRole('link')
    await expect.element(link).toHaveAttribute('href', '/pals/001')
  })

  it('should render dual type badges', async () => {
    const { screen } = await renderWithProviders(PalCard, {
      props: { pal: MOCK_PENGULLET },
    })
    await expect.element(screen.getByText('Water')).toBeInTheDocument()
    await expect.element(screen.getByText('Ice')).toBeInTheDocument()
  })

  it('should render stats for different pal', async () => {
    const { screen } = await renderWithProviders(PalCard, {
      props: { pal: MOCK_FOXPARKS },
    })
    await expect.element(screen.getByText('65')).toBeInTheDocument()
  })
})

describe('PalCardSkeleton', () => {
  it('should render with animate-pulse class', async () => {
    const { screen } = await renderSimple(PalCardSkeleton)
    const skeleton = screen.container.querySelector('.animate-pulse')
    expect(skeleton).not.toBeNull()
  })
})
