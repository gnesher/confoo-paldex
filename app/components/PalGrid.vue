<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'
import type { Pal } from '~/schemas/pal'
import PalCard from './PalCard.vue'
import { PalCardSkeleton } from './PalCard'

const props = withDefaults(defineProps<{
  pals: Pal[]
  isLoading?: boolean
}>(), {
  isLoading: false,
})

const parentRef = ref<HTMLDivElement | null>(null)
const columns = ref(4)
const containerWidth = ref(800)

const gap = 20

const cardWidth = computed(() => Math.floor((containerWidth.value - (columns.value - 1) * gap) / columns.value))
const cardHeight = computed(() => Math.floor(cardWidth.value * 0.75) + 90)
const rowCount = computed(() => Math.ceil(props.pals.length / columns.value))

function calculateColumns(width: number): number {
  if (width < 640) return 2
  if (width < 1024) return 3
  if (width < 1280) return 4
  return 5
}

function handleResize() {
  if (parentRef.value) {
    const width = parentRef.value.clientWidth
    containerWidth.value = width
    columns.value = calculateColumns(width)
  }
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (parentRef.value) {
    handleResize()
    resizeObserver = new ResizeObserver(() => handleResize())
    resizeObserver.observe(parentRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

const virtualizer = useVirtualizer(computed(() => ({
  count: rowCount.value,
  getScrollElement: () => parentRef.value,
  estimateSize: () => cardHeight.value + gap,
  overscan: 3,
})))

watch([columns, containerWidth], () => {
  virtualizer.value.measure()
})
</script>

<template>
  <!-- Loading state -->
  <div
    v-if="isLoading"
    class="grid gap-5"
    :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
  >
    <PalCardSkeleton v-for="i in 12" :key="i" />
  </div>

  <!-- Empty state -->
  <div v-else-if="pals.length === 0" class="flex flex-col items-center justify-center py-16 text-gray-500">
    <span class="text-6xl mb-4">🔍</span>
    <h3 class="text-xl font-semibold mb-2">No Pals found</h3>
    <p class="text-sm">Try adjusting your search filters</p>
  </div>

  <!-- Virtualized grid -->
  <div
    v-else
    ref="parentRef"
    class="h-[calc(100vh-220px)] overflow-auto"
  >
    <div
      :style="{
        height: `${virtualizer.getTotalSize()}px`,
        width: '100%',
        position: 'relative',
      }"
    >
      <div
        v-for="virtualRow in virtualizer.getVirtualItems()"
        :key="virtualRow.key"
        :data-index="virtualRow.index"
        :ref="(el) => virtualizer.measureElement(el as Element)"
        :style="{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          transform: `translateY(${virtualRow.start}px)`,
          paddingBottom: `${gap}px`,
        }"
      >
        <div
          :style="{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gap: `${gap}px`,
          }"
        >
          <PalCard
            v-for="pal in pals.slice(virtualRow.index * columns, virtualRow.index * columns + columns)"
            :key="pal.id"
            :pal="pal"
          />
        </div>
      </div>
    </div>
  </div>
</template>
