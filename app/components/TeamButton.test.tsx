import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { TeamButton, TeamButtonCompact } from './TeamButton'
import { renderWithProviders } from '../../tests/helpers/render'
import { MOCK_LAMBALL } from '../../tests/helpers/fixtures'
import { addPal, clearTeam } from '~/stores/team'

describe('TeamButton', () => {
  beforeEach(() => {
    clearTeam()
  })

  it('should show "Add to Team" when Pal is not in team', async () => {
    await renderWithProviders(<TeamButton pal={MOCK_LAMBALL} />)
    expect(screen.getByText('Add to Team')).toBeInTheDocument()
    expect(screen.getByText('+')).toBeInTheDocument()
  })

  it('should show "Remove from Team" when Pal is in team', async () => {
    addPal(MOCK_LAMBALL)
    await renderWithProviders(<TeamButton pal={MOCK_LAMBALL} />)
    expect(screen.getByText('Remove from Team')).toBeInTheDocument()
    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('should toggle team membership on click', async () => {
    const { user } = await renderWithProviders(<TeamButton pal={MOCK_LAMBALL} />)

    // Initially "Add to Team"
    expect(screen.getByText('Add to Team')).toBeInTheDocument()

    // Click to add
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Remove from Team')).toBeInTheDocument()

    // Click to remove
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Add to Team')).toBeInTheDocument()
  })

  it('should apply size classes for sm size', async () => {
    await renderWithProviders(<TeamButton pal={MOCK_LAMBALL} size="sm" />)
    const button = screen.getByRole('button')
    expect(button.className).toContain('px-3')
    expect(button.className).toContain('py-1.5')
  })

  it('should apply size classes for lg size', async () => {
    await renderWithProviders(<TeamButton pal={MOCK_LAMBALL} size="lg" />)
    const button = screen.getByRole('button')
    expect(button.className).toContain('px-6')
    expect(button.className).toContain('py-3')
  })
})

describe('TeamButtonCompact', () => {
  beforeEach(() => {
    clearTeam()
  })

  it('should show + when Pal is not in team', async () => {
    await renderWithProviders(<TeamButtonCompact pal={MOCK_LAMBALL} />)
    expect(screen.getByRole('button')).toHaveTextContent('+')
    expect(screen.getByRole('button')).toHaveAttribute(
      'title',
      'Add to Team'
    )
  })

  it('should show checkmark when Pal is in team', async () => {
    addPal(MOCK_LAMBALL)
    await renderWithProviders(<TeamButtonCompact pal={MOCK_LAMBALL} />)
    expect(screen.getByRole('button')).toHaveTextContent('✓')
    expect(screen.getByRole('button')).toHaveAttribute(
      'title',
      'Remove from Team'
    )
  })

  it('should toggle on click', async () => {
    const { user } = await renderWithProviders(
      <TeamButtonCompact pal={MOCK_LAMBALL} />
    )
    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toHaveTextContent('✓')
  })
})
