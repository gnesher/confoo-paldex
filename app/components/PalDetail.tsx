import { Suspense, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { palDetailQueryOptions } from '~/utils/queries'
import { SuitabilityTable } from '~/components/SuitabilityTable'
import { DropsTable } from '~/components/DropsTable'
import { TeamButton } from '~/components/TeamButton'
import { PalNotFoundState } from '~/components/EmptyState'
import { TypeBadge } from '~/components/TypeBadge'
import { PalImage } from '~/components/PalImage'

export function PalDetail({ palId }: { palId: string }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span className="mr-2">←</span>
            <span>Back to Paldex</span>
          </Link>
        </div>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <PalDetailContent palId={palId} />
      </Suspense>
    </div>
  )
}

function PalDetailContent({ palId }: { palId: string }) {
  const { data: pal } = useSuspenseQuery(palDetailQueryOptions(palId))

  useEffect(() => {
    if (pal) {
      document.title = `${pal.name} | Paldex`
    }
    return () => {
      document.title = 'Paldex - TanStack Ecosystem Demo'
    }
  }, [pal])

  if (!pal) {
    return <PalNotFoundState palId={palId} />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8">
            <PalImage
              src={pal.imageUrl}
              alt={pal.name}
              palId={pal.id}
              className="w-48 h-48 object-contain"
              fallbackIconSize="lg"
            />
          </div>

          <div className="md:w-2/3 p-6">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-gray-400 font-mono">#{pal.id}</span>
              <h1 className="text-3xl font-bold text-gray-900">{pal.name}</h1>
            </div>

            <div className="flex gap-2 mb-6">
              {pal.types.map((type) => (
                <TypeBadge key={type} type={type} size="md" />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatCard label="HP" value={pal.stats.hp} icon="❤️" color="red" />
              <StatCard label="Attack" value={pal.stats.attack} icon="⚔️" color="orange" />
              <StatCard label="Defense" value={pal.stats.defense} icon="🛡️" color="blue" />
            </div>

            {pal.description && (
              <p className="text-gray-600">{pal.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>🔧</span>
            <span>Work Suitability</span>
          </h2>
          <SuitabilityTable data={pal.suitability} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>📦</span>
            <span>Drops</span>
          </h2>
          <DropsTable data={pal.drops} />
        </div>
      </div>

      <div className="mt-8 text-center pb-20">
        <TeamButton pal={pal} size="lg" />
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
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
    <div className={`rounded-lg border p-3 ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-1">
        <span>{icon}</span>
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 bg-gray-200 h-64" />
          <div className="md:w-2/3 p-6">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="flex gap-2 mb-6">
              <div className="h-6 bg-gray-200 rounded-full w-20" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-20 bg-gray-200 rounded" />
              <div className="h-20 bg-gray-200 rounded" />
              <div className="h-20 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
