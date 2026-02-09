import { z } from 'zod'
import type { Pal } from '~/schemas/pal'
import { filterMockPals, getMockPalById } from './pals.data'

/**
 * Parameters for getPals
 */
export const GetPalsParamsSchema = z.object({
  search: z.string().optional(),
  types: z.array(z.string()).optional(),
  minAttack: z.number().min(0).max(200).optional(),
  maxAttack: z.number().min(0).max(200).optional(),
})

export type GetPalsParams = z.infer<typeof GetPalsParamsSchema>

/**
 * Artificial delay for demonstrating Suspense loading states
 */
const ARTIFICIAL_DELAY_MS = 500

async function artificialDelay(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ARTIFICIAL_DELAY_MS))
}

/**
 * Get filtered list of Pals.
 * In production this would be a server function; for now it uses client-side mock data.
 */
export async function getPals(params: GetPalsParams): Promise<Pal[]> {
  const validated = GetPalsParamsSchema.parse(params)

  await artificialDelay()

  return filterMockPals({
    search: validated.search,
    types: validated.types,
    minAttack: validated.minAttack,
    maxAttack: validated.maxAttack,
  })
}

/**
 * Get a single Pal by ID.
 * Returns null if the Pal does not exist.
 */
export async function getPalById(id: string): Promise<Pal | null> {
  await artificialDelay()
  return getMockPalById(id) ?? null
}
