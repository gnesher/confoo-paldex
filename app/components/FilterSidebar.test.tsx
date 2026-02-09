import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { FilterSidebar } from './FilterSidebar'
import { renderWithProviders } from '../../tests/helpers/render'

// Mock useNavigate to verify navigation calls
const mockNavigate = vi.fn()
vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('FilterSidebar', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('should render the Filters heading', async () => {
    await renderWithProviders(
      <FilterSidebar initialValues={{}} />
    )
    expect(screen.getByText('Filters')).toBeInTheDocument()
  })

  it('should render search input with placeholder', async () => {
    await renderWithProviders(
      <FilterSidebar initialValues={{}} />
    )
    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Search Pals by name...')
    ).toBeInTheDocument()
  })

  it('should render search input with initial value', async () => {
    await renderWithProviders(
      <FilterSidebar initialValues={{ q: 'lam' }} />
    )
    expect(screen.getByDisplayValue('lam')).toBeInTheDocument()
  })

  it('should call navigate when search input changes (after debounce)', async () => {
    const { user } = await renderWithProviders(
      <FilterSidebar initialValues={{}} />
    )

    const input = screen.getByPlaceholderText('Search Pals by name...')
    await user.type(input, 'fox')

    // Debounced at 300ms, wait for it
    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalled()
      },
      { timeout: 1000 }
    )
  })

  it('should render the type multi-select button', async () => {
    await renderWithProviders(
      <FilterSidebar initialValues={{}} />
    )
    expect(screen.getByText('Select types...')).toBeInTheDocument()
  })

  it('should open type dropdown on click', async () => {
    const { user } = await renderWithProviders(
      <FilterSidebar initialValues={{}} />
    )
    await user.click(screen.getByText('Select types...'))

    // All 9 types should appear as checkboxes
    expect(screen.getByText('Fire')).toBeInTheDocument()
    expect(screen.getByText('Water')).toBeInTheDocument()
    expect(screen.getByText('Grass')).toBeInTheDocument()
    expect(screen.getByText('Electric')).toBeInTheDocument()
    expect(screen.getByText('Ice')).toBeInTheDocument()
    expect(screen.getByText('Dragon')).toBeInTheDocument()
  })

  it('should toggle a type checkbox and call navigate', async () => {
    const { user } = await renderWithProviders(
      <FilterSidebar initialValues={{}} />
    )

    // Open dropdown
    await user.click(screen.getByText('Select types...'))

    // Check Fire
    const fireCheckbox = screen.getByRole('checkbox', { name: /fire/i })
    await user.click(fireCheckbox)

    expect(mockNavigate).toHaveBeenCalled()
  })

  it('should display selected type count', async () => {
    await renderWithProviders(
      <FilterSidebar initialValues={{ types: ['Fire', 'Water'] }} />
    )
    expect(screen.getByText('2 type(s) selected')).toBeInTheDocument()
  })

  it('should display selected types as removable badges', async () => {
    await renderWithProviders(
      <FilterSidebar initialValues={{ types: ['Fire', 'Water'] }} />
    )
    // Badges are rendered below the dropdown
    const fireBadges = screen.getAllByText('Fire')
    expect(fireBadges.length).toBeGreaterThanOrEqual(1)
    const waterBadges = screen.getAllByText('Water')
    expect(waterBadges.length).toBeGreaterThanOrEqual(1)
  })

  it('should render attack range slider', async () => {
    await renderWithProviders(
      <FilterSidebar initialValues={{}} />
    )
    expect(screen.getByText('Attack Range')).toBeInTheDocument()
  })

  it('should not show "Clear all filters" when no filters are active', async () => {
    await renderWithProviders(
      <FilterSidebar initialValues={{}} />
    )
    expect(
      screen.queryByText('Clear all filters')
    ).not.toBeInTheDocument()
  })

  it('should show "Clear all filters" when a search is active', async () => {
    await renderWithProviders(
      <FilterSidebar initialValues={{ q: 'test' }} />
    )
    expect(screen.getByText('Clear all filters')).toBeInTheDocument()
  })

  it('should show "Clear all filters" when types are selected', async () => {
    await renderWithProviders(
      <FilterSidebar initialValues={{ types: ['Fire'] }} />
    )
    expect(screen.getByText('Clear all filters')).toBeInTheDocument()
  })
})
