import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor, act } from '@testing-library/react'
import { TeamBottomBar } from './TeamBottomBar'
import { renderWithProviders } from '../../tests/helpers/render'
import { MOCK_LAMBALL, MOCK_FOXPARKS } from '../../tests/helpers/fixtures'
import { addPal, clearTeam } from '~/stores/team'

describe('TeamBottomBar', () => {
  beforeEach(() => {
    clearTeam()
  })

  it('should not render when team is empty', async () => {
    const { container } = await renderWithProviders(<TeamBottomBar />)
    // The component returns null when team is empty and not expanded
    expect(container.querySelector('.fixed')).not.toBeInTheDocument()
  })

  it('should show "My Team" bar when team has members', async () => {
    addPal(MOCK_LAMBALL)
    await renderWithProviders(<TeamBottomBar />)
    expect(screen.getByText('My Team')).toBeInTheDocument()
  })

  it('should display correct singular Pal count', async () => {
    addPal(MOCK_LAMBALL)
    await renderWithProviders(<TeamBottomBar />)
    expect(screen.getByText('1 Pal')).toBeInTheDocument()
  })

  it('should display correct plural Pals count', async () => {
    addPal(MOCK_LAMBALL)
    addPal(MOCK_FOXPARKS)
    await renderWithProviders(<TeamBottomBar />)
    expect(screen.getByText('2 Pals')).toBeInTheDocument()
  })

  it('should expand to show Pal thumbnails on click', async () => {
    addPal(MOCK_LAMBALL)
    const { user } = await renderWithProviders(<TeamBottomBar />)

    // Click to expand
    await user.click(screen.getByText('My Team'))

    // Should show the Pal name in the expanded section
    expect(screen.getByText('Lamball')).toBeInTheDocument()
  })

  it('should collapse on second click', async () => {
    addPal(MOCK_LAMBALL)
    const { user } = await renderWithProviders(<TeamBottomBar />)

    // Expand
    await user.click(screen.getByText('My Team'))
    expect(screen.getByText('Lamball')).toBeInTheDocument()

    // Collapse
    await user.click(screen.getByText('My Team'))
    expect(screen.queryByText('Lamball')).not.toBeInTheDocument()
  })

  it('should show empty message when expanded with no Pals', async () => {
    // Add a Pal so the bar appears, then expand, then remove the Pal
    addPal(MOCK_LAMBALL)
    const { user } = await renderWithProviders(<TeamBottomBar />)

    // Expand
    await user.click(screen.getByText('My Team'))

    // Remove the Pal via the remove button in the expanded panel
    const removeButton = screen.getByTitle('Remove from team')
    await user.click(removeButton)

    // The expanded view should now show the empty message
    await waitFor(() => {
      expect(
        screen.getByText('No Pals in your team yet.')
      ).toBeInTheDocument()
    })
  })

  it('should remove a Pal when the remove button is clicked', async () => {
    addPal(MOCK_LAMBALL)
    addPal(MOCK_FOXPARKS)
    const { user } = await renderWithProviders(<TeamBottomBar />)

    // Expand
    await user.click(screen.getByText('My Team'))

    // Find and click a remove button
    const removeButtons = screen.getAllByTitle('Remove from team')
    await user.click(removeButtons[0])

    // One Pal should remain
    expect(screen.getByText('1 Pal')).toBeInTheDocument()
  })
})
