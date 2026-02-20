import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CookieBanner } from './CookieBanner'

describe('CookieBanner (JSDOM)', () => {
  it('PASSES — user can check the checkbox and accept cookies', async () => {
    const user = userEvent.setup()
    render(<CookieBanner />)
    await user.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('checkbox')).toBeChecked()
    await user.click(screen.getByRole('button', { name: 'Accept' }))
    expect(screen.getByRole('status')).toHaveTextContent('Cookies accepted!')
  })
})
