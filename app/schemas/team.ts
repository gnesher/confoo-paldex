import { z } from 'zod'
import { PalSchema, type Pal } from './pal'

/**
 * Team is an array of Pals stored client-side
 */
export const TeamSchema = z.array(PalSchema)

export type Team = z.infer<typeof TeamSchema>

/**
 * Team store state shape
 */
export interface TeamState {
  pals: Team
}

/**
 * Stored format for localStorage persistence
 */
export interface StoredTeam {
  version: 1
  pals: Pal[]
}

/**
 * localStorage key for team data
 */
export const TEAM_STORAGE_KEY = 'paldex-team'

/**
 * Current storage schema version
 */
export const TEAM_STORAGE_VERSION = 1
