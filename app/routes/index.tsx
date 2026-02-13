import { computed, defineComponent, h } from 'vue'
import { createRoute, useSearch } from '@tanstack/vue-router'
import { useQuery } from '@tanstack/vue-query'
import { z } from 'zod'
import { Route as rootRoute } from './__root'
import { getPals } from '~/utils/pals'
import PalGrid from '~/components/PalGrid.vue'
import { PalCardSkeleton } from '~/components/PalCard'
import FilterSidebar from '~/components/FilterSidebar.vue'

/**
 * Search params schema for URL validation
 */
const searchParamsSchema = z.object({
  q: z.string().optional(),
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
  component: defineComponent({
    name: 'HomePage',
    setup() {
      const search = useSearch({ from: '/' })

      return () => {
        const s = search.value
        return h('div', { class: 'flex min-h-screen' }, [
          h(FilterSidebar, {
            initialValues: {
              q: s.q,
              types: s.types,
              atkMin: s.atkMin,
              atkMax: s.atkMax,
            },
          }),
          h('main', { class: 'flex-1 p-6 overflow-hidden' }, [
            h('header', { class: 'mb-6' }, [
              h('h1', { class: 'text-3xl font-bold text-gray-900' }, 'Paldex'),
              h('p', { class: 'text-gray-600 mt-1' }, 'A Pokedex for Palworld - Built with the TanStack Ecosystem'),
              h(ActiveFilters, { search: s }),
            ]),
            h(PalGridWithData, { search: s }),
          ]),
        ])
      }
    },
  }),
})

/**
 * Display active filters as badges
 */
const ActiveFilters = defineComponent({
  name: 'ActiveFilters',
  props: {
    search: { type: Object as () => SearchParams, required: true },
  },
  setup(props) {
    return () => {
      const search = props.search
      const hasFilters =
        search.q ||
        search.types?.length ||
        search.atkMin !== undefined ||
        (search.atkMax !== undefined && search.atkMax < 200)

      if (!hasFilters) return null

      const badges: ReturnType<typeof h>[] = []

      if (search.q) {
        badges.push(
          h('span', { class: 'inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800' },
            `Search: "${search.q}"`)
        )
      }

      if (search.types) {
        for (const type of search.types) {
          badges.push(
            h('span', {
              key: type,
              class: 'inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800',
            }, type)
          )
        }
      }

      if (search.atkMin !== undefined || (search.atkMax !== undefined && search.atkMax < 200)) {
        badges.push(
          h('span', { class: 'inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800' },
            `Attack: ${search.atkMin ?? 0} - ${search.atkMax ?? 200}`)
        )
      }

      return h('div', { class: 'flex flex-wrap gap-2 mt-3' }, badges)
    }
  },
})

/**
 * Component that fetches and displays Pal data
 */
const PalGridWithData = defineComponent({
  name: 'PalGridWithData',
  props: {
    search: { type: Object as () => SearchParams, required: true },
  },
  setup(props) {
    const { data: pals, isLoading } = useQuery(computed(() => palsQueryOptions(props.search)))

    return () => {
      if (isLoading.value) {
        return h(LoadingSkeleton)
      }

      const palsList = pals.value ?? []
      return h('div', {}, [
        h('div', { class: 'text-sm text-gray-500 mb-4' }, `${palsList.length} Pals found`),
        h(PalGrid, { pals: palsList }),
      ])
    }
  },
})

/**
 * Loading skeleton
 */
const LoadingSkeleton = defineComponent({
  name: 'LoadingSkeleton',
  setup() {
    return () =>
      h('div', {}, [
        h('div', { class: 'h-5 w-24 bg-gray-200 rounded animate-pulse mb-4' }),
        h('div', { class: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4' },
          Array.from({ length: 12 }).map((_, i) =>
            h(PalCardSkeleton, { key: i })
          )
        ),
      ])
  },
})
