import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { MOCK_LAMBALL } from '../../tests/helpers/fixtures'
import { addPal, clearTeam } from '~/stores/team'
import TeamButton from './TeamButton.vue'
import TeamButtonCompact from './TeamButtonCompact.vue'

describe('TeamButton', () => {
  beforeEach(() => {
    clearTeam()
  })

  it('should render "Add to Team" when pal is not in team', async () => {
    const screen = render(TeamButton, {
      props: { pal: MOCK_LAMBALL },
    })
    await expect.element(screen.getByText('Add to Team')).toBeInTheDocument()
  })

  it('should render "Remove from Team" when pal is in team', async () => {
    addPal(MOCK_LAMBALL)
    const screen = render(TeamButton, {
      props: { pal: MOCK_LAMBALL },
    })
    await expect.element(screen.getByText('Remove from Team')).toBeInTheDocument()
  })

  it('should toggle team state on click', async () => {
    const screen = render(TeamButton, {
      props: { pal: MOCK_LAMBALL },
    })
    await expect.element(screen.getByText('Add to Team')).toBeInTheDocument()
    await screen.getByRole('button').click()
    // Wait for Vue reactivity to update the DOM
    await vi.waitFor(
      async () => {
        await expect.element(screen.getByText('Remove from Team')).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
    await screen.getByRole('button').click()
    await vi.waitFor(
      async () => {
        await expect.element(screen.getByText('Add to Team')).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  })
})

describe('TeamButtonCompact', () => {
  beforeEach(() => {
    clearTeam()
  })

  it('should render + when pal is not in team', async () => {
    const screen = render(TeamButtonCompact, {
      props: { pal: MOCK_LAMBALL },
    })
    await expect.element(screen.getByRole('button')).toHaveTextContent('+')
  })

  it('should render checkmark when pal is in team', async () => {
    addPal(MOCK_LAMBALL)
    const screen = render(TeamButtonCompact, {
      props: { pal: MOCK_LAMBALL },
    })
    await expect.element(screen.getByRole('button')).toHaveTextContent('✓')
  })

  it('should toggle on click', async () => {
    const screen = render(TeamButtonCompact, {
      props: { pal: MOCK_LAMBALL },
    })
    await screen.getByRole('button').click()
    await vi.waitFor(
      async () => {
        await expect.element(screen.getByRole('button')).toHaveTextContent('✓')
      },
      { timeout: 2000 }
    )
  })
})
