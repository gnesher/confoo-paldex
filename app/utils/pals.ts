import { z } from 'zod'
import type { Pal } from '~/schemas/pal'
import { MAX_ATTACK_STAT } from '~/schemas/pal'

export const GetPalsParamsSchema = z.object({
  search: z.string().optional(),
  types: z.array(z.string()).optional(),
  minAttack: z.number().min(0).max(MAX_ATTACK_STAT).optional(),
  maxAttack: z.number().min(0).max(MAX_ATTACK_STAT).optional(),
})

export type GetPalsParams = z.infer<typeof GetPalsParamsSchema>

export async function getPals(params: GetPalsParams): Promise<Pal[]> {
  const validated = GetPalsParamsSchema.parse(params)

  const searchParams = new URLSearchParams()
  if (validated.search) searchParams.set('search', validated.search)
  if (validated.types?.length) searchParams.set('types', validated.types.join(','))
  if (validated.minAttack !== undefined) searchParams.set('minAttack', String(validated.minAttack))
  if (validated.maxAttack !== undefined) searchParams.set('maxAttack', String(validated.maxAttack))

  const qs = searchParams.toString()
  const url = `/api/pals${qs ? `?${qs}` : ''}`

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch pals: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function getPalById(id: string): Promise<Pal | null> {
  const res = await fetch(`/api/pals/${encodeURIComponent(id)}`)

  if (res.status === 404) {
    return null
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch pal ${id}: ${res.status} ${res.statusText}`)
  }

  return res.json()
}
