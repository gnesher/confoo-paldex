import { describe, it, expect, beforeEach } from 'vitest'
import { TeamButton, TeamButtonCompact } from './TeamButton'
import { renderWithProviders } from '../../tests/helpers/render'
import { MOCK_LAMBALL } from '../../tests/helpers/fixtures'
import { addPal, clearTeam } from '~/stores/team'

describe('TeamButton', () => {
  beforeEach(() => {
    clearTeam()
  })

  it('should show "Add to Team" when Pal is not in team', async () => {
    const { screen } = await renderWithProviders(<TeamButton pal={MOCK_LAMBALL} />)
    await expect.element(screen.getByText('Add to Team')).toBeInTheDocument()
    await expect.element(screen.getByText('+')).toBeInTheDocument()
  })

  it('should show "Remove from Team" when Pal is in team', async () => {
    addPal(MOCK_LAMBALL)
    const { screen } = await renderWithProviders(<TeamButton pal={MOCK_LAMBALL} />)
    await expect.element(screen.getByText('Remove from Team')).toBeInTheDocument()
    await expect.element(screen.getByText('✓')).toBeInTheDocument()
  })

  it('should toggle team membership on click', async () => {
    const { screen } = await renderWithProviders(<TeamButton pal={MOCK_LAMBALL} />)

    await expect.element(screen.getByText('Add to Team')).toBeInTheDocument()

    await screen.getByRole('button').click()
    await expect.element(screen.getByText('Remove from Team')).toBeInTheDocument()

    await screen.getByRole('button').click()
    await expect.element(screen.getByText('Add to Team')).toBeInTheDocument()
  })

  it('should apply size classes for sm size', async () => {
    const { screen } = await renderWithProviders(<TeamButton pal={MOCK_LAMBALL} size="sm" />)
    const button = screen.getByRole('button')
    await expect.element(button).toHaveClass('px-3')
    await expect.element(button).toHaveClass('py-1.5')
  })

  it('should apply size classes for lg size', async () => {
    const { screen } = await renderWithProviders(<TeamButton pal={MOCK_LAMBALL} size="lg" />)
    const button = screen.getByRole('button')
    await expect.element(button).toHaveClass('px-6')
    await expect.element(button).toHaveClass('py-3')
  })
})

describe('TeamButtonCompact', () => {
  beforeEach(() => {
    clearTeam()
  })

  it('should show + when Pal is not in team', async () => {
    const { screen } = await renderWithProviders(<TeamButtonCompact pal={MOCK_LAMBALL} />)
    await expect.element(screen.getByRole('button')).toHaveTextContent('+')
    await expect.element(screen.getByRole('button')).toHaveAttribute(
      'title',
      'Add to Team'
    )
  })

  it('should show checkmark when Pal is in team', async () => {
    addPal(MOCK_LAMBALL)
    const { screen } = await renderWithProviders(<TeamButtonCompact pal={MOCK_LAMBALL} />)
    await expect.element(screen.getByRole('button')).toHaveTextContent('✓')
    await expect.element(screen.getByRole('button')).toHaveAttribute(
      'title',
      'Remove from Team'
    )
  })

  it('should toggle on click', async () => {
    const { screen } = await renderWithProviders(
      <TeamButtonCompact pal={MOCK_LAMBALL} />
    )
    await screen.getByRole('button').click()
    await expect.element(screen.getByRole('button')).toHaveTextContent('✓')
  })
})
