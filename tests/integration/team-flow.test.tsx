import { describe, it, expect, beforeEach } from 'vitest'
import { render } from 'vitest-browser-vue'
import TeamButton from '~/components/TeamButton.vue'
import TeamBottomBar from '~/components/TeamBottomBar.vue'
import { addPal, clearTeam, teamStore } from '~/stores/team'
import { MOCK_LAMBALL, MOCK_FOXPARKS } from '../helpers/fixtures'
import { renderWithProviders } from '../helpers/render'

describe('Team Flow Integration', () => {
  beforeEach(() => {
    clearTeam()
  })

  it('should add a pal to the team via TeamButton', async () => {
    const screen = render(TeamButton, { props: { pal: MOCK_LAMBALL } })
    await expect.element(screen.getByText('Add to Team')).toBeInTheDocument()

    await screen.getByText('Add to Team').click()
    await expect.element(screen.getByText('Remove from Team')).toBeInTheDocument()
    expect(teamStore.state.pals).toHaveLength(1)
  })

  it('should remove a pal from the team via TeamButton', async () => {
    addPal(MOCK_LAMBALL)
    const screen = render(TeamButton, { props: { pal: MOCK_LAMBALL } })
    await expect.element(screen.getByText('Remove from Team')).toBeInTheDocument()

    await screen.getByText('Remove from Team').click()
    await expect.element(screen.getByText('Add to Team')).toBeInTheDocument()
    expect(teamStore.state.pals).toHaveLength(0)
  })

  it('should show team count in TeamBottomBar', async () => {
    addPal(MOCK_LAMBALL)
    addPal(MOCK_FOXPARKS)

    const { screen } = await renderWithProviders(TeamBottomBar)
    await expect.element(screen.getByText('2 Pals')).toBeInTheDocument()
  })

  it('should expand the bar and show team members', async () => {
    addPal(MOCK_LAMBALL)

    const { screen } = await renderWithProviders(TeamBottomBar)
    await screen.getByRole('button', { name: /my team/i }).click()

    await expect.element(screen.getByText('Lamball')).toBeInTheDocument()
  })

  it('should toggle button text between Add and Remove', async () => {
    const screen = render(TeamButton, { props: { pal: MOCK_LAMBALL } })

    await expect.element(screen.getByText('Add to Team')).toBeInTheDocument()

    await screen.getByText('Add to Team').click()
    await expect.element(screen.getByText('Remove from Team')).toBeInTheDocument()

    await screen.getByText('Remove from Team').click()
    await expect.element(screen.getByText('Add to Team')).toBeInTheDocument()
  })
})
