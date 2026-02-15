<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useNavigate } from '@tanstack/vue-router'
import { useDebouncedCallback } from '~/composables/useDebouncedCallback'
import type { PalType } from '~/schemas/pal'
import { MAX_ATTACK_STAT } from '~/schemas/pal'
import { hasActiveFilters, type SearchParams } from '~/schemas/search'

const PAL_TYPES: PalType[] = [
  'Neutral', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Ground', 'Dark', 'Dragon',
]

const props = defineProps<{
  initialValues: SearchParams
}>()

const navigate = useNavigate()

/**
 * Merge a partial update into the current filter values, converting each
 * field into its URL-friendly representation (undefined = omit from URL).
 */
function buildSearchUpdate(
  updates: Partial<SearchParams>,
  current: SearchParams,
) {
  const q = updates.q !== undefined ? updates.q : current.q
  const types = updates.types !== undefined ? updates.types : current.types
  const atkMin = updates.atkMin !== undefined ? updates.atkMin : current.atkMin
  const atkMax = updates.atkMax !== undefined ? updates.atkMax : current.atkMax

  return {
    q: q || undefined,
    types: types?.length ? types.join(',') : undefined,
    atkMin: atkMin && atkMin > 0 ? atkMin : undefined,
    atkMax: atkMax !== undefined && atkMax < MAX_ATTACK_STAT ? atkMax : undefined,
  }
}

function updateSearch(updates: Partial<SearchParams>) {
  navigate({
    to: '/',
    search: buildSearchUpdate(updates, props.initialValues),
  })
}

const debouncedSearch = useDebouncedCallback(
  (q: string) => updateSearch({ q }),
  { wait: 300 },
)

const debouncedAttackChange = useDebouncedCallback(
  (min: number, max: number) => updateSearch({ atkMin: min, atkMax: max }),
  { wait: 300 },
)

// --- Search Input ---
const searchValue = ref(props.initialValues.q ?? '')
watch(() => props.initialValues.q, (val) => {
  searchValue.value = val ?? ''
})

function onSearchInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  searchValue.value = val
  debouncedSearch(val)
}

// --- Type Multi-Select ---
const isTypeDropdownOpen = ref(false)
const typeContainerRef = ref<HTMLDivElement | null>(null)
const selectedTypes = ref<string[]>(props.initialValues.types ?? [])

watch(() => props.initialValues.types, (val) => {
  selectedTypes.value = val ?? []
})

function toggleType(type: string) {
  const newTypes = selectedTypes.value.includes(type)
    ? selectedTypes.value.filter((t) => t !== type)
    : [...selectedTypes.value, type]
  selectedTypes.value = newTypes
  updateSearch({ types: newTypes })
}

function handleClickOutside(event: MouseEvent) {
  if (typeContainerRef.value && !typeContainerRef.value.contains(event.target as Node)) {
    isTypeDropdownOpen.value = false
  }
}

watch(isTypeDropdownOpen, (open) => {
  if (open) {
    document.addEventListener('mousedown', handleClickOutside)
  } else {
    document.removeEventListener('mousedown', handleClickOutside)
  }
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

// --- Attack Range ---
const minValue = ref(props.initialValues.atkMin ?? 0)
const maxValue = ref(props.initialValues.atkMax ?? MAX_ATTACK_STAT)

watch(() => [props.initialValues.atkMin, props.initialValues.atkMax], ([min, max]) => {
  minValue.value = min ?? 0
  maxValue.value = max ?? MAX_ATTACK_STAT
})

function onMinChange(e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  if (val <= maxValue.value) {
    minValue.value = val
    debouncedAttackChange(val, maxValue.value)
  }
}

function onMaxChange(e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  if (val >= minValue.value) {
    maxValue.value = val
    debouncedAttackChange(minValue.value, val)
  }
}

// --- Clear Filters ---
const hasFiltersActive = ref(false)
watch(() => props.initialValues, (v) => {
  hasFiltersActive.value = hasActiveFilters(v)
}, { immediate: true, deep: true })

function clearFilters() {
  navigate({ to: '/', search: {} })
}
</script>

<template>
  <aside class="w-64 flex-shrink-0 bg-white shadow-lg p-4 hidden md:block">
    <h2 class="text-lg font-semibold mb-4">Filters</h2>

    <div class="space-y-6">
      <!-- Search Input -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input
          type="text"
          :value="searchValue"
          @input="onSearchInput"
          placeholder="Search Pals by name..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>

      <!-- Type Multi-Select -->
      <div class="relative" ref="typeContainerRef">
        <label class="block text-sm font-medium text-gray-700 mb-1">Types</label>
        <button
          type="button"
          @click="isTypeDropdownOpen = !isTypeDropdownOpen"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-left bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <span v-if="selectedTypes.length === 0" class="text-gray-400">Select types...</span>
          <span v-else>{{ selectedTypes.length }} type(s) selected</span>
          <span class="float-right">{{ isTypeDropdownOpen ? '▲' : '▼' }}</span>
        </button>

        <div
          v-if="isTypeDropdownOpen"
          class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          <label
            v-for="type in PAL_TYPES"
            :key="type"
            class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              :checked="selectedTypes.includes(type)"
              @change="toggleType(type)"
              class="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm">{{ type }}</span>
          </label>
        </div>

        <div v-if="selectedTypes.length > 0" class="flex flex-wrap gap-1 mt-2">
          <span
            v-for="type in selectedTypes"
            :key="type"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800"
          >
            {{ type }}
            <button type="button" @click="toggleType(type)" class="ml-1 text-blue-600 hover:text-blue-800">×</button>
          </span>
        </div>
      </div>

      <!-- Attack Range Slider -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Attack Range</label>
        <div class="flex justify-between text-xs text-gray-500 mb-2">
          <span>{{ minValue }}</span>
          <span>{{ maxValue }}</span>
        </div>

        <div class="relative h-2">
          <div class="absolute w-full h-2 bg-gray-200 rounded-full" />
          <div
            class="absolute h-2 bg-blue-500 rounded-full"
            :style="{
              left: `${(minValue / MAX_ATTACK_STAT) * 100}%`,
              width: `${((maxValue - minValue) / MAX_ATTACK_STAT) * 100}%`,
            }"
          />
          <input
            type="range"
            :min="0"
            :max="MAX_ATTACK_STAT"
            :step="5"
            :value="minValue"
            @input="onMinChange"
            class="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <input
            type="range"
            :min="0"
            :max="MAX_ATTACK_STAT"
            :step="5"
            :value="maxValue"
            @input="onMaxChange"
            class="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>

        <div class="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span>
          <span>{{ MAX_ATTACK_STAT }}</span>
        </div>
      </div>

      <!-- Clear Filters -->
      <button
        v-if="hasFiltersActive"
        type="button"
        @click="clearFilters"
        class="w-full px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        Clear all filters
      </button>
    </div>
  </aside>
</template>
