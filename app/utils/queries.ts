import type { SearchParams } from '~/schemas/search'
import { getPals, getPalById } from './pals'

/** React Query options for fetching the filtered Pal list. */
export function palListQueryOptions(params: SearchParams) {
  return {
    queryKey: ['pals', params] as const,
    queryFn: () =>
      getPals({
        search: params.q,
        types: params.types,
        minAttack: params.atkMin,
        maxAttack: params.atkMax,
      }),
  }
}

/** React Query options for fetching a single Pal by ID. */
export function palDetailQueryOptions(id: string) {
  return {
    queryKey: ['pal', id] as const,
    queryFn: () => getPalById(id),
  }
}
