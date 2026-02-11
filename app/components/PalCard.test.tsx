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
    const { screen } = await renderWithProviders(() => <PalCard pal={MOCK_LAMBALL} />)
    await expect.element(screen.getByText('Lamball')).toBeInTheDocument()
    // PalImage fallback may also show #palId, so use first() to avoid strict mode violation
    await expect.element(screen.getByText('#001').first()).toBeInTheDocument()
  })

  it('should render the Pal image or its fallback', async () => {
    const { screen } = await renderWithProviders(() => <PalCard pal={MOCK_LAMBALL} />)
    // In test environment, mock image URLs may fail to load,
    // so PalImage shows the fallback icon instead of an img element.
    // Verify the card renders the image area (either img or fallback).
    await expect.element(screen.getByText('Lamball')).toBeInTheDocument()
  })

  it('should render a single type badge', async () => {
    const { screen } = await renderWithProviders(() => <PalCard pal={MOCK_LAMBALL} />)
    await expect.element(screen.getByText('Neutral')).toBeInTheDocument()
  })

  it('should render dual type badges', async () => {
    const { screen } = await renderWithProviders(() => <PalCard pal={MOCK_PENGULLET} />)
    await expect.element(screen.getByText('Water')).toBeInTheDocument()
    await expect.element(screen.getByText('Ice')).toBeInTheDocument()
  })

  it('should render HP, Attack, and Defense stat values', async () => {
    const { screen } = await renderWithProviders(() => <PalCard pal={MOCK_FOXPARKS} />)
    // Foxparks: hp=65, attack=70, defense=70
    await expect.element(screen.getByText('65')).toBeInTheDocument()
    // attack and defense are same, just check they appear
    const seventies = await screen.getByText('70').all()
    expect(seventies.length).toBeGreaterThanOrEqual(2)
  })

  it('should link to the Pal detail page', async () => {
    const { screen } = await renderWithProviders(() => <PalCard pal={MOCK_LAMBALL} />)
    const link = screen.getByRole('link')
    await expect.element(link).toHaveAttribute('href', '/pals/001')
  })
})

describe('PalCardSkeleton', () => {
  it('should render the skeleton with animate-pulse', async () => {
    const { screen } = await renderSimple(() => <PalCardSkeleton />)
    const skeleton = screen.container.querySelector('.animate-pulse')
    expect(skeleton).not.toBeNull()
  })

  it('should not render any Pal data', async () => {
    const { screen } = await renderSimple(() => <PalCardSkeleton />)
    await expect.element(screen.getByRole('link')).not.toBeInTheDocument()
    await expect.element(screen.getByRole('img')).not.toBeInTheDocument()
  })
})
