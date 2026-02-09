import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { EmptyState, NotFoundState, PalNotFoundState } from './EmptyState'
import { renderWithProviders } from '../../tests/helpers/render'

describe('EmptyState', () => {
  it('should render default title, message, and icon', async () => {
    await renderWithProviders(<EmptyState />)
    expect(screen.getByText('No Pals found')).toBeInTheDocument()
    expect(
      screen.getByText('Try adjusting your search filters')
    ).toBeInTheDocument()
    expect(screen.getByText('🔍')).toBeInTheDocument()
  })

  it('should render the "Clear all filters" link by default', async () => {
    await renderWithProviders(<EmptyState />)
    expect(
      screen.getByRole('link', { name: /clear all filters/i })
    ).toBeInTheDocument()
  })

  it('should render custom props when provided', async () => {
    await renderWithProviders(
      <EmptyState
        title="Custom Title"
        message="Custom message"
        icon="🎯"
      />
    )
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom message')).toBeInTheDocument()
    expect(screen.getByText('🎯')).toBeInTheDocument()
  })

  it('should hide the clear button when showClearButton is false', async () => {
    await renderWithProviders(<EmptyState showClearButton={false} />)
    expect(
      screen.queryByRole('link', { name: /clear all filters/i })
    ).not.toBeInTheDocument()
  })
})

describe('NotFoundState', () => {
  it('should render 404 message and "Go to Home" link', async () => {
    await renderWithProviders(<NotFoundState />)
    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
    expect(
      screen.getByText('The page you are looking for does not exist.')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /go to home/i })
    ).toBeInTheDocument()
  })

  it('should render custom message', async () => {
    await renderWithProviders(<NotFoundState message="Custom not found" />)
    expect(screen.getByText('Custom not found')).toBeInTheDocument()
  })
})

describe('PalNotFoundState', () => {
  it('should render the Pal ID in the message', async () => {
    await renderWithProviders(<PalNotFoundState palId="999" />)
    expect(screen.getByText('Pal Not Found')).toBeInTheDocument()
    expect(
      screen.getByText(/No Pal with ID "999" exists in the Paldex/)
    ).toBeInTheDocument()
  })

  it('should have a link to browse all Pals', async () => {
    await renderWithProviders(<PalNotFoundState palId="999" />)
    expect(
      screen.getByRole('link', { name: /browse all pals/i })
    ).toBeInTheDocument()
  })
})
