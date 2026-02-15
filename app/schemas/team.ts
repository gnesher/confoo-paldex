import { z } from 'zod'
import { PalSchema, type Pal } from './pal'

export const TeamSchema = z.array(PalSchema)

export type Team = z.infer<typeof TeamSchema>

export interface TeamState {
  pals: Team
}

export interface StoredTeam {
  version: 1
  pals: Pal[]
}

export const TEAM_STORAGE_KEY = 'paldex-team'

export const TEAM_STORAGE_VERSION = 1
