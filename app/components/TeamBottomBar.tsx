import { useStore } from '@tanstack/react-store'
import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { teamStore, removePal } from '~/stores/team'
import { PalImage } from '~/components/PalImage'
import type { Pal } from '~/schemas/pal'

export function TeamBottomBar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [storageWarning, setStorageWarning] = useState(false)

  const team = useStore(teamStore, (state) => state.pals)

  useEffect(() => {
    try {
      const testKey = '__paldex_storage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
    } catch {
      setStorageWarning(true)
    }
  }, [])

  if (team.length === 0 && !isExpanded) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {storageWarning && (
        <div className="bg-yellow-100 border-t border-yellow-300 px-4 py-2 text-sm text-yellow-800 text-center">
          ⚠️ localStorage unavailable. Team data will not persist across sessions.
        </div>
      )}

      <div
        className={`bg-white border-t border-gray-200 shadow-lg transition-all duration-300 ${
          isExpanded ? 'h-48' : 'h-14'
        }`}
      >
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full h-14 px-4 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">👥</span>
            <span className="font-semibold">My Team</span>
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">
              {team.length} Pal{team.length !== 1 ? 's' : ''}
            </span>
          </div>
          <span className="text-xl transition-transform duration-200" style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
          }}>
            ▲
          </span>
        </button>

        {isExpanded && (
          <div className="h-[calc(100%-3.5rem)] overflow-hidden">
            {team.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <span className="text-3xl mb-2 block">🎮</span>
                  <p>No Pals in your team yet.</p>
                  <p className="text-sm">Click "Add to Team" on any Pal to get started!</p>
                </div>
              </div>
            ) : (
              <div className="h-full p-4 overflow-x-auto">
                <div className="flex gap-4">
                  {team.map((pal) => (
                    <TeamPalCard key={pal.id} pal={pal} onRemove={() => removePal(pal.id)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function TeamPalCard({
  pal,
  onRemove,
}: {
  pal: Pal
  onRemove: () => void
}) {
  return (
    <div className="relative flex-shrink-0 w-24 group">
      <Link
        to="/pals/$palId"
        params={{ palId: pal.id }}
        className="block bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all"
      >
        <div className="aspect-square flex items-center justify-center p-2">
          <PalImage
            src={pal.imageUrl}
            alt={pal.name}
            palId={pal.id}
            fallbackIconSize="sm"
          />
        </div>
        <div className="px-2 py-1 text-center">
          <span className="text-xs font-medium text-gray-700 truncate block">
            {pal.name}
          </span>
        </div>
      </Link>
      
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          onRemove()
        }}
        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        title="Remove from team"
      >
        ×
      </button>
    </div>
  )
}
