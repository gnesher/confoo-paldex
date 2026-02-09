import '@testing-library/jest-dom'
import '~/styles/globals.css'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'

// Delay (in ms) between each test so you can see the rendered components.
// Set to 0 to run at full speed.
const SLOW_DOWN_MS = 0

beforeEach(() => {
  localStorage.clear()
})

afterEach(async () => {
  if (SLOW_DOWN_MS > 0) {
    await new Promise((r) => setTimeout(r, SLOW_DOWN_MS))
  }
  cleanup()
})

// No ResizeObserver mock needed -- real browser has it natively
