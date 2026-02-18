import { describe, it, expect, beforeEach } from 'vitest'
import { renderWithProviders } from '../../tests/helpers/render'
import { MOCK_LAMBALL, MOCK_FOXPARKS } from '../../tests/helpers/fixtures'
import { addPal, clearTeam } from '~/stores/team'
import TeamBottomBar from './TeamBottomBar.vue'

describe('TeamBottomBar', () => {
  beforeEach(() => {
    clearTeam()
  })

  it('should not render when team is empty', async () => {
    const { screen } = await renderWithProviders(TeamBottomBar)
    expect(screen.container.querySelector('.fixed')).toBeNull()
  })

  it('should show team count when pals are added', async () => {
    addPal(MOCK_LAMBALL)
    const { screen } = await renderWithProviders(TeamBottomBar)
    await expect.element(screen.getByText('My Team')).toBeInTheDocument()
    await expect.element(screen.getByText('1 Pal')).toBeInTheDocument()
  })

  it('should show plural count for multiple pals', async () => {
    addPal(MOCK_LAMBALL)
    addPal(MOCK_FOXPARKS)
    const { screen } = await renderWithProviders(TeamBottomBar)
    await expect.element(screen.getByText('2 Pals')).toBeInTheDocument()
  })

  it('should expand on click', async () => {
    addPal(MOCK_LAMBALL)
    const { screen } = await renderWithProviders(TeamBottomBar)
    await screen.getByRole('button', { name: /my team/i }).click()
    await expect.element(screen.getByText('Lamball')).toBeInTheDocument()
  })

  it('should collapse on second click', async () => {
    addPal(MOCK_LAMBALL)
    const { screen } = await renderWithProviders(TeamBottomBar)

    await screen.getByRole('button', { name: /my team/i }).click()
    await expect.element(screen.getByText('Lamball')).toBeInTheDocument()

    await screen.getByRole('button', { name: /my team/i }).click()
    await expect.element(screen.getByText('Lamball')).not.toBeInTheDocument()
  })

  it('should show empty message when expanded with no Pals', async () => {
    addPal(MOCK_LAMBALL)
    const { screen } = await renderWithProviders(TeamBottomBar)

    await screen.getByRole('button', { name: /my team/i }).click()
    await screen.getByTitle('Remove from team').click()

    await expect.element(
      screen.getByText('No Pals in your team yet.')
    ).toBeInTheDocument()
  })

  it('should remove a Pal when the remove button is clicked', async () => {
    addPal(MOCK_LAMBALL)
    addPal(MOCK_FOXPARKS)
    const { screen } = await renderWithProviders(TeamBottomBar)

    await screen.getByRole('button', { name: /my team/i }).click()
    await screen.getByTitle('Remove from team').first().click()

    await expect.element(screen.getByText('1 Pal')).toBeInTheDocument()
  })
})
