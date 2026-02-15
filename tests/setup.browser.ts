import 'vitest-browser-react'
import '~/styles/globals.css'
import { afterEach, beforeEach } from 'vitest'

// Set to > 0 to add a delay between tests for visual inspection
const SLOW_DOWN_MS = 0

beforeEach(() => {
  localStorage.clear()
})

afterEach(async () => {
  if (SLOW_DOWN_MS > 0) {
    await new Promise((r) => setTimeout(r, SLOW_DOWN_MS))
  }
})
