import { describe, it, expect } from 'vitest'
import { PalCard, PalCardSkeleton } from './PalCard'
import { renderWithProviders, renderSimple } from '../../tests/helpers/render'
import {
  MOCK_LAMBALL,
  MOCK_PENGULLET,
  MOCK_FOXPARKS,
} from '../../tests/helpers/fixtures'

describe('PalCard', () => {
  it('should render the Pal name and ID badge', async () => {
    const { screen } = await renderWithProviders(<PalCard pal={MOCK_LAMBALL} />)
    await expect.element(screen.getByText('Lamball')).toBeInTheDocument()
    await expect.element(screen.getByText('#001')).toBeInTheDocument()
  })

  it('should render the Pal image with correct alt and src', async () => {
    const { screen } = await renderWithProviders(<PalCard pal={MOCK_LAMBALL} />)
    const img = screen.getByAltText('Lamball')
    await expect.element(img).toBeInTheDocument()
    await expect.element(img).toHaveAttribute('src', MOCK_LAMBALL.imageUrl)
  })

  it('should render a single type badge', async () => {
    const { screen } = await renderWithProviders(<PalCard pal={MOCK_LAMBALL} />)
    await expect.element(screen.getByText('Neutral')).toBeInTheDocument()
  })

  it('should render dual type badges', async () => {
    const { screen } = await renderWithProviders(<PalCard pal={MOCK_PENGULLET} />)
    await expect.element(screen.getByText('Water')).toBeInTheDocument()
    await expect.element(screen.getByText('Ice')).toBeInTheDocument()
  })

  it('should render HP, Attack, and Defense stat values', async () => {
    const pal = { ...MOCK_FOXPARKS, stats: { hp: 80, attack: 95, defense: 60 } }
    const { screen } = await renderWithProviders(<PalCard pal={pal} />)
    await expect.element(screen.getByText('❤️')).toBeInTheDocument()
    await expect.element(screen.getByText('80')).toBeInTheDocument()
    await expect.element(screen.getByText('⚔️')).toBeInTheDocument()
    await expect.element(screen.getByText('95')).toBeInTheDocument()
    await expect.element(screen.getByText('🛡️')).toBeInTheDocument()
    await expect.element(screen.getByText('60')).toBeInTheDocument()
  })

  it('should link to the Pal detail page', async () => {
    const { screen } = await renderWithProviders(<PalCard pal={MOCK_LAMBALL} />)
    const link = screen.getByRole('link')
    await expect.element(link).toHaveAttribute('href', '/pals/001')
  })
})

describe('PalCardSkeleton', () => {
  it('should render the skeleton with animate-pulse', async () => {
    const { screen } = await renderSimple(<PalCardSkeleton />)
    const skeleton = screen.container.querySelector('.animate-pulse')
    expect(skeleton).not.toBeNull()
  })

  it('should not render any Pal data', async () => {
    const { screen } = await renderSimple(<PalCardSkeleton />)
    await expect.element(screen.getByRole('link')).not.toBeInTheDocument()
    await expect.element(screen.getByRole('img')).not.toBeInTheDocument()
  })
})
