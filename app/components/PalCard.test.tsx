import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { PalCard, PalCardSkeleton } from './PalCard'
import { renderWithProviders, renderSimple } from '../../tests/helpers/render'
import {
  MOCK_LAMBALL,
  MOCK_PENGULLET,
  MOCK_FOXPARKS,
} from '../../tests/helpers/fixtures'

describe('PalCard', () => {
  it('should render the Pal name and ID badge', async () => {
    await renderWithProviders(<PalCard pal={MOCK_LAMBALL} />)
    expect(screen.getByText('Lamball')).toBeInTheDocument()
    expect(screen.getByText('#001')).toBeInTheDocument()
  })

  it('should render the Pal image with correct alt and src', async () => {
    await renderWithProviders(<PalCard pal={MOCK_LAMBALL} />)
    const img = screen.getByAltText('Lamball')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', MOCK_LAMBALL.imageUrl)
  })

  it('should render a single type badge', async () => {
    await renderWithProviders(<PalCard pal={MOCK_LAMBALL} />)
    expect(screen.getByText('Neutral')).toBeInTheDocument()
  })

  it('should render dual type badges', async () => {
    await renderWithProviders(<PalCard pal={MOCK_PENGULLET} />)
    expect(screen.getByText('Water')).toBeInTheDocument()
    expect(screen.getByText('Ice')).toBeInTheDocument()
  })

  it('should render HP, Attack, and Defense stat values', async () => {
    await renderWithProviders(<PalCard pal={MOCK_FOXPARKS} />)
    // Foxparks: hp=65, attack=70, defense=70
    expect(screen.getByText('65')).toBeInTheDocument()
    // attack and defense are same, just check they appear
    const seventies = screen.getAllByText('70')
    expect(seventies.length).toBeGreaterThanOrEqual(2)
  })

  it('should link to the Pal detail page', async () => {
    await renderWithProviders(<PalCard pal={MOCK_LAMBALL} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/pals/001')
  })
})

describe('PalCardSkeleton', () => {
  it('should render the skeleton with animate-pulse', () => {
    const { container } = renderSimple(<PalCardSkeleton />)
    const skeleton = container.firstElementChild as HTMLElement
    expect(skeleton).toHaveClass('animate-pulse')
  })

  it('should not render any Pal data', () => {
    renderSimple(<PalCardSkeleton />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
