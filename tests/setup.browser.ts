import 'vitest-browser-solid'
import '~/styles/globals.css'
import { afterEach, beforeEach } from 'vitest'

const SLOW_DOWN_MS = 0

beforeEach(() => {
  localStorage.clear()
})

afterEach(async () => {
  if (SLOW_DOWN_MS > 0) {
    await new Promise((r) => setTimeout(r, SLOW_DOWN_MS))
  }
})
