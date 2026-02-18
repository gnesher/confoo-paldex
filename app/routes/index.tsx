import { createFileRoute, useSearch } from '@tanstack/vue-router'
import { computed, defineComponent, h } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { palListQueryOptions } from '~/utils/queries'
import { searchParamsSchema, hasActiveFilters, type SearchParams } from '~/schemas/search'
import { MAX_ATTACK_STAT } from '~/schemas/pal'
import PalGrid from '~/components/PalGrid.vue'
import { PalCardSkeleton } from '~/components/PalCard'
import FilterSidebar from '~/components/FilterSidebar.vue'

export const Route = createFileRoute('/')({
  validateSearch: searchParamsSchema,
  component: defineComponent({
    name: 'HomePage',
    setup() {
      const search = useSearch({ from: '/' })

      return () => {
        const s = search.value
        return h('div', { class: 'flex h-full' }, [
          h(FilterSidebar, {
            initialValues: {
              q: s.q,
              types: s.types,
              atkMin: s.atkMin,
              atkMax: s.atkMax,
            },
          }),
          h('main', { class: 'flex-1 p-6 overflow-hidden flex flex-col' }, [
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

const ActiveFilters = defineComponent({
  name: 'ActiveFilters',
  props: {
    search: { type: Object as () => SearchParams, required: true },
  },
  setup(props) {
    return () => {
      const search = props.search
      if (!hasActiveFilters(search)) return null

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

      if (search.atkMin !== undefined || (search.atkMax !== undefined && search.atkMax < MAX_ATTACK_STAT)) {
        badges.push(
          h('span', { class: 'inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800' },
            `Attack: ${search.atkMin ?? 0} - ${search.atkMax ?? MAX_ATTACK_STAT}`)
        )
      }

      return h('div', { class: 'flex flex-wrap gap-2 mt-3' }, badges)
    }
  },
})

const PalGridWithData = defineComponent({
  name: 'PalGridWithData',
  props: {
    search: { type: Object as () => SearchParams, required: true },
  },
  setup(props) {
    const { data: pals, isLoading } = useQuery(computed(() => palListQueryOptions(props.search)))

    return () => {
      if (isLoading.value) {
        return h(LoadingSkeleton)
      }

      const palsList = pals.value ?? []
      return h('div', { class: 'flex-1 min-h-0 flex flex-col' }, [
        h('div', { class: 'text-sm text-gray-500 mb-4' }, `${palsList.length} Pals found`),
        h(PalGrid, { pals: palsList }),
      ])
    }
  },
})

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
