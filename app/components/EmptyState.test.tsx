import { describe, it, expect } from 'vitest'
import { EmptyState, NotFoundState, PalNotFoundState } from './EmptyState'
import { renderWithProviders } from '../../tests/helpers/render'

describe('EmptyState', () => {
  it('should render default title, message, and icon', async () => {
    const { screen } = await renderWithProviders(() => <EmptyState />)
    await expect.element(screen.getByText('No Pals found')).toBeInTheDocument()
    await expect.element(
      screen.getByText('Try adjusting your search filters')
    ).toBeInTheDocument()
    await expect.element(screen.getByText('🔍')).toBeInTheDocument()
  })

  it('should render the "Clear all filters" link by default', async () => {
    const { screen } = await renderWithProviders(() => <EmptyState />)
    await expect.element(
      screen.getByRole('link', { name: /clear all filters/i })
    ).toBeInTheDocument()
  })

  it('should render custom props when provided', async () => {
    const { screen } = await renderWithProviders(
      () => <EmptyState
        title="Custom Title"
        message="Custom message"
        icon="🎯"
      />
    )
    await expect.element(screen.getByText('Custom Title')).toBeInTheDocument()
    await expect.element(screen.getByText('Custom message')).toBeInTheDocument()
    await expect.element(screen.getByText('🎯')).toBeInTheDocument()
  })

  it('should hide the clear button when showClearButton is false', async () => {
    const { screen } = await renderWithProviders(() => <EmptyState showClearButton={false} />)
    await expect.element(
      screen.getByRole('link', { name: /clear all filters/i })
    ).not.toBeInTheDocument()
  })
})

describe('NotFoundState', () => {
  it('should render 404 message and "Go to Home" link', async () => {
    const { screen } = await renderWithProviders(() => <NotFoundState />)
    await expect.element(screen.getByText('Page Not Found')).toBeInTheDocument()
    await expect.element(
      screen.getByText('The page you are looking for does not exist.')
    ).toBeInTheDocument()
    await expect.element(
      screen.getByRole('link', { name: /go to home/i })
    ).toBeInTheDocument()
  })

  it('should render custom message', async () => {
    const { screen } = await renderWithProviders(() => <NotFoundState message="Custom not found" />)
    await expect.element(screen.getByText('Custom not found')).toBeInTheDocument()
  })
})

describe('PalNotFoundState', () => {
  it('should render the Pal ID in the message', async () => {
    const { screen } = await renderWithProviders(() => <PalNotFoundState palId="999" />)
    await expect.element(screen.getByText('Pal Not Found')).toBeInTheDocument()
    await expect.element(
      screen.getByText(/No Pal with ID "999" exists in the Paldex/)
    ).toBeInTheDocument()
  })

  it('should have a link to browse all Pals', async () => {
    const { screen } = await renderWithProviders(() => <PalNotFoundState palId="999" />)
    await expect.element(
      screen.getByRole('link', { name: /browse all pals/i })
    ).toBeInTheDocument()
  })
})
