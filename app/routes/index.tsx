import { createFileRoute } from '@tanstack/solid-router'
import { createQuery } from '@tanstack/solid-query'
import { Suspense, Show, For } from 'solid-js'
import { palListQueryOptions } from '~/utils/queries'
import { searchParamsSchema, hasActiveFilters, type SearchParams } from '~/schemas/search'
import { MAX_ATTACK_STAT } from '~/schemas/pal'
import { PalGrid } from '~/components/PalGrid'
import { PalCardSkeleton } from '~/components/PalCard'
import { FilterSidebar } from '~/components/FilterSidebar'

export const Route = createFileRoute('/')({
  validateSearch: searchParamsSchema,
  component: HomePage,
})

function HomePage() {
  const search = Route.useSearch()

  return (
    <div class="flex h-full">
      <FilterSidebar
        initialValues={{
          q: search().q,
          types: search().types,
          atkMin: search().atkMin,
          atkMax: search().atkMax,
        }}
      />

      <main class="flex-1 p-6 overflow-hidden flex flex-col">
        <header class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Paldex</h1>
          <p class="text-gray-600 mt-1">
            A Pokedex for Palworld - Built with the TanStack Ecosystem
          </p>
          <ActiveFilters search={search()} />
        </header>

        <Suspense fallback={<LoadingSkeleton />}>
          <PalGridWithData search={search()} />
        </Suspense>
      </main>
    </div>
  )
}

function ActiveFilters(props: { search: SearchParams }) {
  return (
    <Show when={hasActiveFilters(props.search)}>
      <div class="flex flex-wrap gap-2 mt-3">
        <Show when={props.search.q}>
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
            Search: &quot;{props.search.q}&quot;
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
        <Show when={props.search.atkMin !== undefined ||
          (props.search.atkMax !== undefined && props.search.atkMax < MAX_ATTACK_STAT)}>
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
            Attack: {props.search.atkMin ?? 0} - {props.search.atkMax ?? MAX_ATTACK_STAT}
          </span>
        </Show>
      </div>
    </Show>
  )
}

function PalGridWithData(props: { search: SearchParams }) {
  const query = createQuery(() => palListQueryOptions(props.search))

  return (
    <Show when={query.data}>
      {(pals) => (
        <div class="flex-1 min-h-0 flex flex-col">
          <div class="text-sm text-gray-500 mb-4">{pals().length} Pals found</div>
          <PalGrid pals={pals()} />
        </div>
      )}
    </Show>
  )
}

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
