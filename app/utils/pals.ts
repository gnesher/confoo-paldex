import { z } from 'zod'
import type { Pal } from '~/schemas/pal'
import { filterMockPals, getMockPalById } from './pals.data'

export const GetPalsParamsSchema = z.object({
  search: z.string().optional(),
  types: z.array(z.string()).optional(),
  minAttack: z.number().min(0).max(200).optional(),
  maxAttack: z.number().min(0).max(200).optional(),
})

export type GetPalsParams = z.infer<typeof GetPalsParamsSchema>

// Artificial delay to demonstrate Suspense loading states
const ARTIFICIAL_DELAY_MS = 500

async function artificialDelay(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ARTIFICIAL_DELAY_MS))
}

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

export async function getPalById(id: string): Promise<Pal | null> {
  await artificialDelay()
  return getMockPalById(id) ?? null
}
