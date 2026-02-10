import { describe, it, expect, beforeEach } from 'vitest'
import { TeamBottomBar } from './TeamBottomBar'
import { renderWithProviders } from '../../tests/helpers/render'
import { MOCK_LAMBALL, MOCK_FOXPARKS } from '../../tests/helpers/fixtures'
import { addPal, clearTeam } from '~/stores/team'

describe('TeamBottomBar', () => {
  beforeEach(() => {
    clearTeam()
  })

  it('should not render when team is empty', async () => {
    const { screen } = await renderWithProviders(<TeamBottomBar />)
    // The component returns null when team is empty and not expanded
    expect(screen.container.querySelector('.fixed')).toBeNull()
  })

  it('should show "My Team" bar when team has members', async () => {
    addPal(MOCK_LAMBALL)
    const { screen } = await renderWithProviders(<TeamBottomBar />)
    await expect.element(screen.getByText('My Team')).toBeInTheDocument()
  })

  it('should display correct singular Pal count', async () => {
    addPal(MOCK_LAMBALL)
    const { screen } = await renderWithProviders(<TeamBottomBar />)
    await expect.element(screen.getByText('1 Pal')).toBeInTheDocument()
  })

  it('should display correct plural Pals count', async () => {
    addPal(MOCK_LAMBALL)
    addPal(MOCK_FOXPARKS)
    const { screen } = await renderWithProviders(<TeamBottomBar />)
    await expect.element(screen.getByText('2 Pals')).toBeInTheDocument()
  })

  it('should expand to show Pal thumbnails on click', async () => {
    addPal(MOCK_LAMBALL)
    const { screen } = await renderWithProviders(<TeamBottomBar />)

    // Click to expand
    await screen.getByText('My Team').click()

    // Should show the Pal name in the expanded section
    await expect.element(screen.getByText('Lamball')).toBeInTheDocument()
  })

  it('should collapse on second click', async () => {
    addPal(MOCK_LAMBALL)
    const { screen } = await renderWithProviders(<TeamBottomBar />)

    // Expand
    await screen.getByText('My Team').click()
    await expect.element(screen.getByText('Lamball')).toBeInTheDocument()

    // Collapse
    await screen.getByText('My Team').click()
    await expect.element(screen.getByText('Lamball')).not.toBeInTheDocument()
  })

  it('should show empty message when expanded with no Pals', async () => {
    // Add a Pal so the bar appears, then expand, then remove the Pal
    addPal(MOCK_LAMBALL)
    const { screen } = await renderWithProviders(<TeamBottomBar />)

    // Expand
    await screen.getByText('My Team').click()

    // Remove the Pal via the remove button in the expanded panel
    await screen.getByTitle('Remove from team').click()

    // The expanded view should now show the empty message
    await expect.element(
      screen.getByText('No Pals in your team yet.')
    ).toBeInTheDocument()
  })

  it('should remove a Pal when the remove button is clicked', async () => {
    addPal(MOCK_LAMBALL)
    addPal(MOCK_FOXPARKS)
    const { screen } = await renderWithProviders(<TeamBottomBar />)

    // Expand
    await screen.getByText('My Team').click()

    // Find and click a remove button
    await screen.getByTitle('Remove from team').first().click()

    // One Pal should remain
    await expect.element(screen.getByText('1 Pal')).toBeInTheDocument()
  })
})
