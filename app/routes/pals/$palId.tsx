import { createFileRoute, Link } from '@tanstack/solid-router'
import { createQuery } from '@tanstack/solid-query'
import { Suspense, Show, For, createEffect, onCleanup } from 'solid-js'
import { palDetailQueryOptions } from '~/utils/queries'
import { SuitabilityTable } from '~/components/SuitabilityTable'
import { DropsTable } from '~/components/DropsTable'
import { TeamButton } from '~/components/TeamButton'
import { PalNotFoundState } from '~/components/EmptyState'
import { TypeBadge } from '~/components/TypeBadge'
import { PalImage } from '~/components/PalImage'

export const Route = createFileRoute('/pals/$palId')({
  component: PalDetailPage,
})

function PalDetailPage() {
  const params = Route.useParams()

  return (
    <div class="min-h-screen bg-gray-50">
      <div class="bg-white shadow">
        <div class="max-w-4xl mx-auto px-4 py-3">
          <Link
            to="/"
            class="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span class="mr-2">←</span>
            <span>Back to Paldex</span>
          </Link>
        </div>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <PalDetailContent palId={params().palId} />
      </Suspense>
    </div>
  )
}

function PalDetailContent(props: { palId: string }) {
  const query = createQuery(() => palDetailQueryOptions(props.palId))

  createEffect(() => {
    const pal = query.data
    if (pal) {
      document.title = `${pal.name} | Paldex`
    }
    onCleanup(() => {
      document.title = 'Paldex - TanStack Ecosystem Demo'
    })
  })

  return (
    <Show
      when={query.data}
      fallback={
        <Show when={query.isSuccess}>
          <PalNotFoundState palId={props.palId} />
        </Show>
      }
    >
      {(pal) => (
        <div class="max-w-4xl mx-auto px-4 py-8">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div class="md:flex">
              <div class="md:w-1/3 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8">
                <PalImage
                  src={pal().imageUrl}
                  alt={pal().name}
                  palId={pal().id}
                  class="w-48 h-48 object-contain"
                  fallbackIconSize="lg"
                />
              </div>

              <div class="md:w-2/3 p-6">
                <div class="flex items-baseline gap-3 mb-4">
                  <span class="text-gray-400 font-mono">#{pal().id}</span>
                  <h1 class="text-3xl font-bold text-gray-900">{pal().name}</h1>
                </div>

                <div class="flex gap-2 mb-6">
                  <For each={pal().types}>
                    {(type) => <TypeBadge type={type} size="md" />}
                  </For>
                </div>

                <div class="grid grid-cols-3 gap-4 mb-6">
                  <StatCard label="HP" value={pal().stats.hp} icon="❤️" color="red" />
                  <StatCard label="Attack" value={pal().stats.attack} icon="⚔️" color="orange" />
                  <StatCard label="Defense" value={pal().stats.defense} icon="🛡️" color="blue" />
                </div>

                <Show when={pal().description}>
                  <p class="text-gray-600">{pal().description}</p>
                </Show>
              </div>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-8">
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>🔧</span>
                <span>Work Suitability</span>
              </h2>
              <SuitabilityTable data={pal().suitability} />
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>📦</span>
                <span>Drops</span>
              </h2>
              <DropsTable data={pal().drops} />
            </div>
          </div>

          <div class="mt-8 text-center pb-20">
            <TeamButton pal={pal()} size="lg" />
          </div>
        </div>
      )}
    </Show>
  )
}

function StatCard(props: {
  label: string
  value: number
  icon: string
  color: string
}) {
  const colorClasses: Record<string, string> = {
    red: 'bg-red-50 border-red-200',
    orange: 'bg-orange-50 border-orange-200',
    blue: 'bg-blue-50 border-blue-200',
  }

  return (
    <div class={`rounded-lg border p-3 ${colorClasses[props.color]}`}>
      <div class="flex items-center gap-2 mb-1">
        <span>{props.icon}</span>
        <span class="text-sm text-gray-600">{props.label}</span>
      </div>
      <div class="text-2xl font-bold text-gray-900">{props.value}</div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div class="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div class="md:flex">
          <div class="md:w-1/3 bg-gray-200 h-64" />
          <div class="md:w-2/3 p-6">
            <div class="h-8 bg-gray-200 rounded w-1/2 mb-4" />
            <div class="flex gap-2 mb-6">
              <div class="h-6 bg-gray-200 rounded-full w-20" />
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div class="h-20 bg-gray-200 rounded" />
              <div class="h-20 bg-gray-200 rounded" />
              <div class="h-20 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
