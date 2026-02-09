import { Store } from '@tanstack/store'
import type { Pal } from '~/schemas/pal'
import {
  TEAM_STORAGE_KEY,
  TEAM_STORAGE_VERSION,
  type StoredTeam,
  type TeamState,
} from '~/schemas/team'

/**
 * Load initial state from localStorage
 * Gracefully handles:
 * - SSR (no window)
 * - Missing data
 * - Invalid JSON
 * - Schema version mismatch
 */
function loadInitialState(): TeamState {
  // SSR check
  if (typeof window === 'undefined') {
    return { pals: [] }
  }

  try {
    const stored = localStorage.getItem(TEAM_STORAGE_KEY)
    if (!stored) {
      return { pals: [] }
    }

    const parsed: StoredTeam = JSON.parse(stored)

    // Version check for future migrations
    if (parsed.version !== TEAM_STORAGE_VERSION) {
      console.warn(
        `[TeamStore] Storage version mismatch: expected ${TEAM_STORAGE_VERSION}, got ${parsed.version}. Resetting.`
      )
      return { pals: [] }
    }

    return { pals: parsed.pals ?? [] }
  } catch (error) {
    console.warn('[TeamStore] Failed to load from localStorage:', error)
    return { pals: [] }
  }
}

/**
 * Persist state to localStorage
 */
function persistState(state: TeamState): void {
  // SSR check
  if (typeof window === 'undefined') {
    return
  }

  try {
    const stored: StoredTeam = {
      version: TEAM_STORAGE_VERSION,
      pals: state.pals,
    }
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(stored))
  } catch (error) {
    console.warn('[TeamStore] Failed to persist to localStorage:', error)
  }
}

/**
 * TanStack Store for team/favorites management
 * Constitution Principle III: State Management Strategy
 * - Global client state stored in TanStack Store
 * - Persisted to localStorage
 * - No React Context (FR-106)
 */
export const teamStore = new Store<TeamState>(loadInitialState())

// Subscribe to changes and persist to localStorage
teamStore.subscribe(() => {
  persistState(teamStore.state)
})

/**
 * Add a Pal to the team (FR-103)
 * No-op if Pal is already in team
 */
export function addPal(pal: Pal): void {
  teamStore.setState((prev) => {
    // Check if already in team
    if (prev.pals.some((p) => p.id === pal.id)) {
      return prev
    }
    return {
      pals: [...prev.pals, pal],
    }
  })
}

/**
 * Remove a Pal from the team by ID (FR-104)
 */
export function removePal(palId: string): void {
  teamStore.setState((prev) => ({
    pals: prev.pals.filter((p) => p.id !== palId),
  }))
}

/**
 * Toggle a Pal in the team (FR-105)
 * Adds if absent, removes if present
 */
export function togglePal(pal: Pal): void {
  teamStore.setState((prev) => {
    const exists = prev.pals.some((p) => p.id === pal.id)
    if (exists) {
      return { pals: prev.pals.filter((p) => p.id !== pal.id) }
    }
    return { pals: [...prev.pals, pal] }
  })
}

/**
 * Check if a Pal is in the team
 */
export function isInTeam(palId: string): boolean {
  return teamStore.state.pals.some((p) => p.id === palId)
}

/**
 * Get the current team size
 */
export function getTeamSize(): number {
  return teamStore.state.pals.length
}

/**
 * Clear the entire team
 */
export function clearTeam(): void {
  teamStore.setState({ pals: [] })
}
