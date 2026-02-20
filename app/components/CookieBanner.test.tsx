import { describe, it, expect } from 'vitest'
import { render } from 'vitest-browser-react'
import { CookieBanner } from './CookieBanner'

describe('CookieBanner (Browser)', () => {
  it('FAILS — user can check the checkbox and accept cookies', async () => {
    const screen = await render(<CookieBanner />)

    await screen.getByRole('checkbox').click()
    await expect.element(screen.getByRole('checkbox')).toBeChecked()

    await screen.getByRole('button', { name: 'Accept' }).click()

    await expect
      .element(screen.getByRole('status'))
      .toHaveTextContent('Cookies accepted!')
  })
})
