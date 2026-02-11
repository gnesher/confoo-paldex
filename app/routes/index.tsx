import { createRoute } from '@tanstack/solid-router'
import { createQuery } from '@tanstack/solid-query'
import { Suspense, Show, For } from 'solid-js'
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
  // Accept both string (from URL) and string[] (from router state) so
  // memory-history re-validation doesn't break.
  types: z.preprocess(
    (val) => (Array.isArray(val) ? val.join(',') : val),
    z
      .string()
      .optional()
      .transform((val) => (val ? val.split(',').filter(Boolean) : undefined)),
  ),
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
    <div class="flex min-h-screen">
      {/* FilterSidebar with Form and type multi-select */}
      <FilterSidebar
        initialValues={{
          q: search().q,
          types: search().types,
          atkMin: search().atkMin,
          atkMax: search().atkMax,
        }}
      />

      {/* Main content */}
      <main class="flex-1 p-6 overflow-hidden">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Paldex</h1>
          <p class="text-gray-600 mt-1">
            A Pokedex for Palworld - Built with the TanStack Ecosystem
          </p>
          <ActiveFilters search={search()} />
        </header>

        {/* Virtual grid with Suspense boundary */}
        <Suspense fallback={<LoadingSkeleton />}>
          <PalGridWithData search={search()} />
        </Suspense>
      </main>
    </div>
  )
}

/**
 * Display active filters as badges
 */
function ActiveFilters(props: { search: SearchParams }) {
  const hasFilters = () =>
    props.search.q ||
    props.search.types?.length ||
    props.search.atkMin !== undefined ||
    (props.search.atkMax !== undefined && props.search.atkMax < 200)

  return (
    <Show when={hasFilters()}>
      <div class="flex flex-wrap gap-2 mt-3">
        <Show when={props.search.q}>
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
            Search: "{props.search.q}"
          </span>
        </Show>
        <Show when={props.search.types?.length}>
          <For each={props.search.types}>
            {(type) => (
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
              >
                {type}
              </span>
            )}
          </For>
        </Show>
        <Show when={props.search.atkMin !== undefined || (props.search.atkMax !== undefined && props.search.atkMax < 200)}>
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
            Attack: {props.search.atkMin ?? 0} - {props.search.atkMax ?? 200}
          </span>
        </Show>
      </div>
    </Show>
  )
}

/**
 * Component that fetches and displays Pal data
 */
function PalGridWithData(props: { search: SearchParams }) {
  const query = createQuery(() => palsQueryOptions(props.search))

  return (
    <Show when={query.data}>
      {(pals) => (
        <div>
          <div class="text-sm text-gray-500 mb-4">{pals().length} Pals found</div>
          <PalGrid pals={pals()} />
        </div>
      )}
    </Show>
  )
}

/**
 * Loading skeleton
 */
function LoadingSkeleton() {
  return (
    <div>
      <div class="h-5 w-24 bg-gray-200 rounded animate-pulse mb-4" />
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <For each={Array.from({ length: 12 })}>
          {() => <PalCardSkeleton />}
        </For>
      </div>
    </div>
  )
}
