import { z } from 'zod'
import { MAX_ATTACK_STAT } from './pal'

/**
 * Validated search / filter parameters used on the home page.
 *
 * The schema handles both URL string values and in-memory router state so
 * that memory-history re-validation doesn't break.
 */
export const searchParamsSchema = z.object({
  q: z.string().optional(),
  types: z.preprocess(
    (val) => (Array.isArray(val) ? val.join(',') : val),
    z
      .string()
      .optional()
      .transform((val) => (val ? val.split(',').filter(Boolean) : undefined)),
  ),
  atkMin: z.coerce.number().min(0).max(MAX_ATTACK_STAT).optional().catch(undefined),
  atkMax: z.coerce.number().min(0).max(MAX_ATTACK_STAT).optional().catch(undefined),
})

export type SearchParams = z.infer<typeof searchParamsSchema>

/** Returns true when any filter is actively narrowing results. */
export function hasActiveFilters(params: SearchParams): boolean {
  return !!(
    params.q ||
    (params.types && params.types.length > 0) ||
    params.atkMin !== undefined ||
    (params.atkMax !== undefined && params.atkMax < MAX_ATTACK_STAT)
  )
}
