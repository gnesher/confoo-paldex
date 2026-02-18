import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { palListQueryOptions } from '~/utils/queries'
import { searchParamsSchema, hasActiveFilters, type SearchParams } from '~/schemas/search'
import { PalGrid } from '~/components/PalGrid'
import { PalCardSkeleton } from '~/components/PalCard'
import { FilterSidebar } from '~/components/FilterSidebar'
import { MAX_ATTACK_STAT } from '~/schemas/pal'

export const Route = createFileRoute('/')({
  validateSearch: searchParamsSchema,
  component: HomePage,
})

function HomePage() {
  const search = Route.useSearch()

  return (
    <div className="flex h-full">
      <FilterSidebar
        initialValues={{
          q: search.q,
          types: search.types,
          atkMin: search.atkMin,
          atkMax: search.atkMax,
        }}
      />

      <main className="flex-1 p-6 overflow-hidden flex flex-col">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Paldex</h1>
          <p className="text-gray-600 mt-1">
            A Pokedex for Palworld - Built with the TanStack Ecosystem
          </p>
          <ActiveFilters search={search} />
        </header>

        <Suspense fallback={<LoadingSkeleton />}>
          <PalGridWithData search={search} />
        </Suspense>
      </main>
    </div>
  )
}

function ActiveFilters({ search }: { search: SearchParams }) {
  if (!hasActiveFilters(search)) return null

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {search.q && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
          Search: &quot;{search.q}&quot;
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
      {(search.atkMin !== undefined ||
        (search.atkMax !== undefined && search.atkMax < MAX_ATTACK_STAT)) && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
          Attack: {search.atkMin ?? 0} - {search.atkMax ?? MAX_ATTACK_STAT}
        </span>
      )}
    </div>
  )
}

function PalGridWithData({ search }: { search: SearchParams }) {
  const { data: pals } = useSuspenseQuery(palListQueryOptions(search))

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="text-sm text-gray-500 mb-4">{pals.length} Pals found</div>
      <PalGrid pals={pals} />
    </div>
  )
}

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
