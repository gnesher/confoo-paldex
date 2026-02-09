import { createRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { z } from 'zod'
import { Route as rootRoute } from './__root'
import { getPals } from '~/utils/pals'
import { PalGrid } from '~/components/PalGrid'
import { PalCardSkeleton } from '~/components/PalCard'
import { FilterSidebar } from '~/components/FilterSidebar'

/**
 * Search params schema for URL validation
 * FR-302: Route MUST define search params schema
 * FR-303: Route MUST use validateSearch from TanStack Router
 */
const searchParamsSchema = z.object({
  q: z.string().optional(),
  types: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(',').filter(Boolean) : undefined)),
  atkMin: z.coerce.number().min(0).max(200).optional().catch(undefined),
  atkMax: z.coerce.number().min(0).max(200).optional().catch(undefined),
})

type SearchParams = z.infer<typeof searchParamsSchema>

// Query options factory for getPals
function palsQueryOptions(params: SearchParams) {
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

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: searchParamsSchema,
  component: HomePage,
})

function HomePage() {
  const search = Route.useSearch()

  return (
    <div className="flex min-h-screen">
      {/* FilterSidebar with Form and type multi-select */}
      <FilterSidebar
        initialValues={{
          q: search.q,
          types: search.types,
          atkMin: search.atkMin,
          atkMax: search.atkMax,
        }}
      />

      {/* Main content */}
      <main className="flex-1 p-6 overflow-hidden">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Paldex</h1>
          <p className="text-gray-600 mt-1">
            A Pokedex for Palworld - Built with the TanStack Ecosystem
          </p>
          <ActiveFilters search={search} />
        </header>

        {/* Virtual grid with Suspense boundary */}
        <Suspense fallback={<LoadingSkeleton />}>
          <PalGridWithData search={search} />
        </Suspense>
      </main>
    </div>
  )
}

/**
 * Display active filters as badges
 */
function ActiveFilters({ search }: { search: SearchParams }) {
  const hasFilters =
    search.q ||
    search.types?.length ||
    search.atkMin !== undefined ||
    (search.atkMax !== undefined && search.atkMax < 200)

  if (!hasFilters) return null

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {search.q && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
          Search: "{search.q}"
        </span>
      )}
      {search.types?.map((type) => (
        <span
          key={type}
          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
        >
          {type}
        </span>
      ))}
      {(search.atkMin !== undefined || (search.atkMax !== undefined && search.atkMax < 200)) && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
          Attack: {search.atkMin ?? 0} - {search.atkMax ?? 200}
        </span>
      )}
    </div>
  )
}

/**
 * Component that fetches and displays Pal data
 */
function PalGridWithData({ search }: { search: SearchParams }) {
  const { data: pals } = useSuspenseQuery(palsQueryOptions(search))

  return (
    <div>
      <div className="text-sm text-gray-500 mb-4">{pals.length} Pals found</div>
      <PalGrid pals={pals} />
    </div>
  )
}

/**
 * Loading skeleton
 */
function LoadingSkeleton() {
  return (
    <div>
      <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <PalCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
