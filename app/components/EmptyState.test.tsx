import { describe, it, expect } from 'vitest'
import { renderWithProviders } from '../../tests/helpers/render'
import EmptyState from './EmptyState.vue'
import NotFoundState from './NotFoundState.vue'
import PalNotFoundState from './PalNotFoundState.vue'

describe('EmptyState', () => {
  it('should render default props', async () => {
    const { screen } = await renderWithProviders(EmptyState)
    await expect.element(screen.getByText('No Pals found')).toBeInTheDocument()
    await expect.element(
      screen.getByText('Try adjusting your search filters')
    ).toBeInTheDocument()
    await expect.element(screen.getByText('🔍')).toBeInTheDocument()
  })

  it('should render the "Clear all filters" link by default', async () => {
    const { screen } = await renderWithProviders(EmptyState)
    await expect.element(
      screen.getByRole('link', { name: /clear all filters/i })
    ).toBeInTheDocument()
  })

  it('should render custom props', async () => {
    const { screen } = await renderWithProviders(EmptyState, {
      props: {
        title: 'Custom Title',
        message: 'Custom message',
        icon: '🎯',
      },
    })
    await expect.element(screen.getByText('Custom Title')).toBeInTheDocument()
    await expect.element(screen.getByText('Custom message')).toBeInTheDocument()
    await expect.element(screen.getByText('🎯')).toBeInTheDocument()
  })

  it('should hide clear button when showClearButton is false', async () => {
    const { screen } = await renderWithProviders(EmptyState, {
      props: { showClearButton: false },
    })
    const links = await screen.getByRole('link').all()
    expect(links).toHaveLength(0)
  })
})

describe('NotFoundState', () => {
  it('should render', async () => {
    const { screen } = await renderWithProviders(NotFoundState)
    await expect.element(screen.getByText('Page Not Found')).toBeInTheDocument()
    await expect.element(
      screen.getByText('The page you are looking for does not exist.')
    ).toBeInTheDocument()
    await expect.element(
      screen.getByRole('link', { name: /go to home/i })
    ).toBeInTheDocument()
  })

  it('should render custom message when provided', async () => {
    const { screen } = await renderWithProviders(NotFoundState, {
      props: { message: 'Custom not found' },
    })
    await expect.element(screen.getByText('Custom not found')).toBeInTheDocument()
  })
})

describe('PalNotFoundState', () => {
  it('should render with palId', async () => {
    const { screen } = await renderWithProviders(PalNotFoundState, {
      props: { palId: '999' },
    })
    await expect.element(screen.getByText('Pal Not Found')).toBeInTheDocument()
    await expect.element(
      screen.getByText(/No Pal with ID "999" exists in the Paldex/)
    ).toBeInTheDocument()
  })

  it('should have a link to browse all Pals', async () => {
    const { screen } = await renderWithProviders(PalNotFoundState, {
      props: { palId: '999' },
    })
    await expect.element(
      screen.getByRole('link', { name: /browse all pals/i })
    ).toBeInTheDocument()
  })
})
