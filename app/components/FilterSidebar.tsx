import { useDebouncedCallback } from '@tanstack/react-pacer'
import { useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useCallback, useRef } from 'react'
import type { PalType } from '~/schemas/pal'
import { MAX_ATTACK_STAT } from '~/schemas/pal'
import { hasActiveFilters, type SearchParams } from '~/schemas/search'

const PAL_TYPES: PalType[] = [
  'Neutral', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Ground', 'Dark', 'Dragon',
]

interface FilterSidebarProps {
  initialValues: SearchParams
}

/**
 * Merge a partial update into the current filter values, converting each
 * field into its URL-friendly representation (undefined = omit from URL).
 */
function buildSearchUpdate(
  updates: Partial<SearchParams>,
  current: SearchParams,
) {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/16453a1a-f466-41b4-97e4-a64e28a7d718',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'FilterSidebar.tsx:buildSearchUpdate',message:'buildSearchUpdate called',data:{updates,current},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
  // #endregion

  const q = updates.q !== undefined ? updates.q : current.q
  const types = updates.types !== undefined ? updates.types : current.types
  const atkMin = updates.atkMin !== undefined ? updates.atkMin : current.atkMin
  const atkMax = updates.atkMax !== undefined ? updates.atkMax : current.atkMax

  const result = {
    q: q || undefined,
    types: types?.length ? types.join(',') : undefined,
    atkMin: atkMin && atkMin > 0 ? atkMin : undefined,
    atkMax: atkMax !== undefined && atkMax < MAX_ATTACK_STAT ? atkMax : undefined,
  }

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/16453a1a-f466-41b4-97e4-a64e28a7d718',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'FilterSidebar.tsx:buildSearchUpdate',message:'buildSearchUpdate result',data:{merged:{q,types,atkMin,atkMax},result},timestamp:Date.now(),hypothesisId:'H4'})}).catch(()=>{});
  // #endregion

  return result
}

export function FilterSidebar({ initialValues }: FilterSidebarProps) {
  const navigate = useNavigate()

  // Keep a ref so debounced callbacks always read the latest values,
  // avoiding stale closures from useDebouncedCallback caching.
  const initialValuesRef = useRef(initialValues)
  initialValuesRef.current = initialValues

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/16453a1a-f466-41b4-97e4-a64e28a7d718',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'FilterSidebar.tsx:render',message:'FilterSidebar rendering',data:{initialValues},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
  // #endregion

  const updateSearch = useCallback(
    (updates: Partial<SearchParams>) => {
      const current = initialValuesRef.current
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/16453a1a-f466-41b4-97e4-a64e28a7d718',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'FilterSidebar.tsx:updateSearch',message:'updateSearch called',data:{updates,initialValues_in_closure:current},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      navigate({
        to: '/',
        search: buildSearchUpdate(updates, current),
      })
    },
    [navigate],
  )

  const debouncedSearch = useDebouncedCallback(
    (q: string) => {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/16453a1a-f466-41b4-97e4-a64e28a7d718',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'FilterSidebar.tsx:debouncedSearch',message:'debouncedSearch firing',data:{q},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
      // #endregion
      updateSearch({ q })
    },
    { wait: 300 },
  )

  const debouncedAttackChange = useDebouncedCallback(
    (min: number, max: number) => {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/16453a1a-f466-41b4-97e4-a64e28a7d718',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'FilterSidebar.tsx:debouncedAttackChange',message:'debouncedAttackChange firing',data:{min,max},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
      // #endregion
      updateSearch({ atkMin: min, atkMax: max })
    },
    { wait: 300 },
  )

  return (
    <aside className="w-64 flex-shrink-0 bg-white shadow-lg p-4 hidden md:block">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      <div className="space-y-6">
        <SearchInput
          defaultValue={initialValues.q ?? ''}
          onChange={debouncedSearch}
        />

        <TypeMultiSelect
          selected={initialValues.types ?? []}
          onChange={(types) => updateSearch({ types })}
        />

        <AttackRangeSlider
          min={initialValues.atkMin ?? 0}
          max={initialValues.atkMax ?? MAX_ATTACK_STAT}
          onChange={debouncedAttackChange}
        />

        <ClearFiltersButton hasFilters={hasActiveFilters(initialValues)} />
      </div>
    </aside>
  )
}

function SearchInput({
  defaultValue,
  onChange,
}: {
  defaultValue: string
  onChange: (value: string) => void
}) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Search
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        placeholder="Search Pals by name..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
    </div>
  )
}

function TypeMultiSelect({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (types: string[]) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const toggleType = (type: string) => {
    if (selected.includes(type)) {
      onChange(selected.filter((t) => t !== type))
    } else {
      onChange([...selected, type])
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Types
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-left bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        {selected.length === 0 ? (
          <span className="text-gray-400">Select types...</span>
        ) : (
          <span>{selected.length} type(s) selected</span>
        )}
        <span className="float-right">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {PAL_TYPES.map((type) => (
            <label
              key={type}
              className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(type)}
                onChange={() => toggleType(type)}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      )}

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selected.map((type) => (
            <span
              key={type}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800"
            >
              {type}
              <button
                type="button"
                onClick={() => toggleType(type)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function AttackRangeSlider({
  min,
  max,
  onChange,
}: {
  min: number
  max: number
  onChange: (min: number, max: number) => void
}) {
  const [minValue, setMinValue] = useState(min)
  const [maxValue, setMaxValue] = useState(max)

  useEffect(() => {
    setMinValue(min)
    setMaxValue(max)
  }, [min, max])

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    if (val <= maxValue) {
      setMinValue(val)
      onChange(val, maxValue)
    }
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    if (val >= minValue) {
      setMaxValue(val)
      onChange(minValue, val)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Attack Range
      </label>
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>{minValue}</span>
        <span>{maxValue}</span>
      </div>

      <div className="relative h-2">
        <div className="absolute w-full h-2 bg-gray-200 rounded-full" />
        <div
          className="absolute h-2 bg-blue-500 rounded-full"
          style={{
            left: `${(minValue / MAX_ATTACK_STAT) * 100}%`,
            width: `${((maxValue - minValue) / MAX_ATTACK_STAT) * 100}%`,
          }}
        />
        <input
          type="range"
          min={0}
          max={MAX_ATTACK_STAT}
          step={5}
          value={minValue}
          onChange={handleMinChange}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <input
          type="range"
          min={0}
          max={MAX_ATTACK_STAT}
          step={5}
          value={maxValue}
          onChange={handleMaxChange}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>

      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>0</span>
        <span>{MAX_ATTACK_STAT}</span>
      </div>
    </div>
  )
}

function ClearFiltersButton({ hasFilters }: { hasFilters: boolean }) {
  const navigate = useNavigate()

  if (!hasFilters) return null

  return (
    <button
      type="button"
      onClick={() => navigate({ to: '/', search: {} })}
      className="w-full px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
    >
      Clear all filters
    </button>
  )
}
