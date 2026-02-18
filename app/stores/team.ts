import { Store } from '@tanstack/store'
import { useStore } from '@tanstack/solid-store'
import type { Pal } from '~/schemas/pal'
import {
  TEAM_STORAGE_KEY,
  TEAM_STORAGE_VERSION,
  type StoredTeam,
  type TeamState,
} from '~/schemas/team'

function loadInitialState(): TeamState {
  if (typeof window === 'undefined') {
    return { pals: [] }
  }

  try {
    const stored = localStorage.getItem(TEAM_STORAGE_KEY)
    if (!stored) {
      return { pals: [] }
    }

    const parsed: StoredTeam = JSON.parse(stored)

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

function persistState(state: TeamState): void {
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

export const teamStore = new Store<TeamState>(loadInitialState())

teamStore.subscribe(() => {
  persistState(teamStore.state)
})

export function addPal(pal: Pal): void {
  teamStore.setState((prev) => {
    if (prev.pals.some((p) => p.id === pal.id)) {
      return prev
    }
    return {
      pals: [...prev.pals, pal],
    }
  })
}

export function removePal(palId: string): void {
  teamStore.setState((prev) => ({
    pals: prev.pals.filter((p) => p.id !== palId),
  }))
}

export function togglePal(pal: Pal): void {
  teamStore.setState((prev) => {
    const exists = prev.pals.some((p) => p.id === pal.id)
    if (exists) {
      return { pals: prev.pals.filter((p) => p.id !== pal.id) }
    }
    return { pals: [...prev.pals, pal] }
  })
}

export function isInTeam(palId: string): boolean {
  return teamStore.state.pals.some((p) => p.id === palId)
}

export function getTeamSize(): number {
  return teamStore.state.pals.length
}

export function clearTeam(): void {
  teamStore.setState({ pals: [] })
}

/** Reactive accessor -- returns true when the given Pal is on the team. */
export function useIsInTeam(palId: () => string) {
  return useStore(teamStore, (state) => state.pals.some((p) => p.id === palId()))
}
