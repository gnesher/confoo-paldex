<script setup lang="ts">
import type { PalType } from '~/schemas/pal'
import { PAL_TYPE_COLORS } from '~/schemas/pal'

const props = withDefaults(defineProps<{
  type: PalType
  size?: 'sm' | 'md'
}>(), {
  size: 'sm',
})

const sizeClasses = props.size === 'sm'
  ? 'px-2 py-0.5 text-xs'
  : 'px-3 py-1 text-sm'
</script>

<template>
  <span :class="[sizeClasses, 'rounded-full font-medium text-white', PAL_TYPE_COLORS[type]]">
    {{ type }}
  </span>
</template>
