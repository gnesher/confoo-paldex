import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FilterSidebar } from './FilterSidebar'
import { renderWithProviders } from '../../tests/helpers/render'

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
    const { screen } = await renderWithProviders(
      <FilterSidebar initialValues={{}} />
    )
    await expect.element(screen.getByText('Filters')).toBeInTheDocument()
  })

  it('should render search input with placeholder', async () => {
    const { screen } = await renderWithProviders(
      <FilterSidebar initialValues={{}} />
    )
    await expect.element(screen.getByText('Search')).toBeInTheDocument()
    await expect.element(
      screen.getByPlaceholder('Search Pals by name...')
    ).toBeInTheDocument()
  })

  it('should render search input with initial value', async () => {
    const { screen } = await renderWithProviders(
      <FilterSidebar initialValues={{ q: 'lam' }} />
    )
    await expect.element(
      screen.getByPlaceholder('Search Pals by name...')
    ).toHaveValue('lam')
  })

  it('should call navigate when search input changes (after debounce)', async () => {
    const { screen } = await renderWithProviders(
      <FilterSidebar initialValues={{}} />
    )

    const input = screen.getByPlaceholder('Search Pals by name...')
    await input.fill('fox')

    await vi.waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalled()
      },
      { timeout: 1000 }
    )
  })

  it('should render the type multi-select button', async () => {
    const { screen } = await renderWithProviders(
      <FilterSidebar initialValues={{}} />
    )
    await expect.element(screen.getByText('Select types...')).toBeInTheDocument()
  })

  it('should open type dropdown on click', async () => {
    const { screen } = await renderWithProviders(
      <FilterSidebar initialValues={{}} />
    )
    await screen.getByText('Select types...').click()

    await expect.element(screen.getByText('Fire')).toBeInTheDocument()
    await expect.element(screen.getByText('Water')).toBeInTheDocument()
    await expect.element(screen.getByText('Grass')).toBeInTheDocument()
    await expect.element(screen.getByText('Electric')).toBeInTheDocument()
    await expect.element(screen.getByText('Ice')).toBeInTheDocument()
    await expect.element(screen.getByText('Dragon')).toBeInTheDocument()
  })

  it('should toggle a type checkbox and call navigate', async () => {
    const { screen } = await renderWithProviders(
      <FilterSidebar initialValues={{}} />
    )

    await screen.getByText('Select types...').click()

    const fireCheckbox = screen.getByRole('checkbox', { name: /fire/i })
    await fireCheckbox.click()

    expect(mockNavigate).toHaveBeenCalled()
  })

  it('should display selected type count', async () => {
    const { screen } = await renderWithProviders(
      <FilterSidebar initialValues={{ types: ['Fire', 'Water'] }} />
    )
    await expect.element(screen.getByText('2 type(s) selected')).toBeInTheDocument()
  })

  it('should display selected types as removable badges', async () => {
    const { screen } = await renderWithProviders(
      <FilterSidebar initialValues={{ types: ['Fire', 'Water'] }} />
    )
    const fireBadges = await screen.getByText('Fire').all()
    expect(fireBadges.length).toBeGreaterThanOrEqual(1)
    const waterBadges = await screen.getByText('Water').all()
    expect(waterBadges.length).toBeGreaterThanOrEqual(1)
  })

  it('should render attack range slider', async () => {
    const { screen } = await renderWithProviders(
      <FilterSidebar initialValues={{}} />
    )
    await expect.element(screen.getByText('Attack Range')).toBeInTheDocument()
  })

  it('should not show "Clear all filters" when no filters are active', async () => {
    const { screen } = await renderWithProviders(
      <FilterSidebar initialValues={{}} />
    )
    await expect.element(
      screen.getByText('Clear all filters')
    ).not.toBeInTheDocument()
  })

  it('should show "Clear all filters" when a search is active', async () => {
    const { screen } = await renderWithProviders(
      <FilterSidebar initialValues={{ q: 'test' }} />
    )
    await expect.element(screen.getByText('Clear all filters')).toBeInTheDocument()
  })

  it('should show "Clear all filters" when types are selected', async () => {
    const { screen } = await renderWithProviders(
      <FilterSidebar initialValues={{ types: ['Fire'] }} />
    )
    await expect.element(screen.getByText('Clear all filters')).toBeInTheDocument()
  })
})
