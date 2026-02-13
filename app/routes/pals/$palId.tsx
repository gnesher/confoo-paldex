import { computed, defineComponent, h, watchEffect } from 'vue'
import { createRoute, Link, useParams } from '@tanstack/vue-router'
import { useQuery } from '@tanstack/vue-query'
import { Route as rootRoute } from '../__root'
import { getPalById } from '~/utils/pals'
import SuitabilityTable from '~/components/SuitabilityTable.vue'
import DropsTable from '~/components/DropsTable.vue'
import TeamButton from '~/components/TeamButton.vue'
import { PalNotFoundState } from '~/components/EmptyState'
import TypeBadge from '~/components/TypeBadge.vue'
import PalImage from '~/components/PalImage.vue'

/**
 * Query options factory for getPalById
 */
function palQueryOptions(id: string) {
  return {
    queryKey: ['pal', id] as const,
    queryFn: () => getPalById(id),
  }
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pals/$palId',
  component: defineComponent({
    name: 'PalDetailPage',
    setup() {
      const params = useParams({ from: '/pals/$palId' })

      return () => {
        const palId = params.value.palId
        return h('div', { class: 'min-h-screen bg-gray-50' }, [
          // Back navigation
          h('div', { class: 'bg-white shadow' }, [
            h('div', { class: 'max-w-4xl mx-auto px-4 py-3' }, [
              h(Link, {
                to: '/',
                class: 'inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors',
              }, () => [
                h('span', { class: 'mr-2' }, '←'),
                h('span', {}, 'Back to Paldex'),
              ]),
            ]),
          ]),
          h(PalDetailContent, { palId }),
        ])
      }
    },
  }),
})

/**
 * Pal detail content with data fetching
 */
const PalDetailContent = defineComponent({
  name: 'PalDetailContent',
  props: {
    palId: { type: String, required: true },
  },
  setup(props) {
    const { data: pal, isLoading } = useQuery(computed(() => palQueryOptions(props.palId)))

    // Update document title
    watchEffect(() => {
      if (pal.value) {
        document.title = `${pal.value.name} | Paldex`
      }
    })

    return () => {
      if (isLoading.value) {
        return h(DetailLoadingSkeleton)
      }

      if (!pal.value) {
        return h(PalNotFoundState, { palId: props.palId })
      }

      const p = pal.value
      return h('div', { class: 'max-w-4xl mx-auto px-4 py-8' }, [
        // Hero Section
        h('div', { class: 'bg-white rounded-lg shadow-lg overflow-hidden mb-8' }, [
          h('div', { class: 'md:flex' }, [
            // Image
            h('div', { class: 'md:w-1/3 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8' }, [
              h(PalImage, {
                src: p.imageUrl,
                alt: p.name,
                palId: p.id,
                class: 'w-48 h-48 object-contain',
                fallbackIconSize: 'lg',
              }),
            ]),
            // Info
            h('div', { class: 'md:w-2/3 p-6' }, [
              h('div', { class: 'flex items-baseline gap-3 mb-4' }, [
                h('span', { class: 'text-gray-400 font-mono' }, `#${p.id}`),
                h('h1', { class: 'text-3xl font-bold text-gray-900' }, p.name),
              ]),
              // Types
              h('div', { class: 'flex gap-2 mb-6' },
                p.types.map((type) => h(TypeBadge, { key: type, type, size: 'md' }))
              ),
              // Stats
              h('div', { class: 'grid grid-cols-3 gap-4 mb-6' }, [
                h(StatCard, { label: 'HP', value: p.stats.hp, icon: '❤️', color: 'red' }),
                h(StatCard, { label: 'Attack', value: p.stats.attack, icon: '⚔️', color: 'orange' }),
                h(StatCard, { label: 'Defense', value: p.stats.defense, icon: '🛡️', color: 'blue' }),
              ]),
              // Description
              p.description
                ? h('p', { class: 'text-gray-600' }, p.description)
                : null,
            ]),
          ]),
        ]),
        // Tables Section
        h('div', { class: 'grid md:grid-cols-2 gap-8' }, [
          h('div', { class: 'bg-white rounded-lg shadow p-6' }, [
            h('h2', { class: 'text-xl font-semibold mb-4 flex items-center gap-2' }, [
              h('span', {}, '🔧'),
              h('span', {}, 'Work Suitability'),
            ]),
            h(SuitabilityTable, { data: p.suitability }),
          ]),
          h('div', { class: 'bg-white rounded-lg shadow p-6' }, [
            h('h2', { class: 'text-xl font-semibold mb-4 flex items-center gap-2' }, [
              h('span', {}, '📦'),
              h('span', {}, 'Drops'),
            ]),
            h(DropsTable, { data: p.drops }),
          ]),
        ]),
        // Team Button
        h('div', { class: 'mt-8 text-center pb-20' }, [
          h(TeamButton, { pal: p, size: 'lg' }),
        ]),
      ])
    }
  },
})

/**
 * Stat card component
 */
const StatCard = defineComponent({
  name: 'StatCard',
  props: {
    label: { type: String, required: true },
    value: { type: Number, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true },
  },
  setup(props) {
    const colorClasses: Record<string, string> = {
      red: 'bg-red-50 border-red-200',
      orange: 'bg-orange-50 border-orange-200',
      blue: 'bg-blue-50 border-blue-200',
    }

    return () =>
      h('div', { class: `rounded-lg border p-3 ${colorClasses[props.color]}` }, [
        h('div', { class: 'flex items-center gap-2 mb-1' }, [
          h('span', {}, props.icon),
          h('span', { class: 'text-sm text-gray-600' }, props.label),
        ]),
        h('div', { class: 'text-2xl font-bold text-gray-900' }, String(props.value)),
      ])
  },
})

/**
 * Loading skeleton
 */
const DetailLoadingSkeleton = defineComponent({
  name: 'DetailLoadingSkeleton',
  setup() {
    return () =>
      h('div', { class: 'max-w-4xl mx-auto px-4 py-8 animate-pulse' }, [
        h('div', { class: 'bg-white rounded-lg shadow-lg overflow-hidden mb-8' }, [
          h('div', { class: 'md:flex' }, [
            h('div', { class: 'md:w-1/3 bg-gray-200 h-64' }),
            h('div', { class: 'md:w-2/3 p-6' }, [
              h('div', { class: 'h-8 bg-gray-200 rounded w-1/2 mb-4' }),
              h('div', { class: 'flex gap-2 mb-6' }, [
                h('div', { class: 'h-6 bg-gray-200 rounded-full w-20' }),
              ]),
              h('div', { class: 'grid grid-cols-3 gap-4' }, [
                h('div', { class: 'h-20 bg-gray-200 rounded' }),
                h('div', { class: 'h-20 bg-gray-200 rounded' }),
                h('div', { class: 'h-20 bg-gray-200 rounded' }),
              ]),
            ]),
          ]),
        ]),
      ])
  },
})
