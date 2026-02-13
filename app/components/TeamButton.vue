<script setup lang="ts">
import { useStore } from '@tanstack/vue-store'
import { teamStore, togglePal } from '~/stores/team'
import type { Pal } from '~/schemas/pal'

const props = withDefaults(defineProps<{
  pal: Pal
  size?: 'sm' | 'md' | 'lg'
  class?: string
}>(), {
  size: 'md',
  class: '',
})

const isInTeam = useStore(teamStore, (state) =>
  state.pals.some((p) => p.id === props.pal.id)
)

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

function handleClick() {
  togglePal(props.pal)
}
</script>

<template>
  <button
    type="button"
    @click="handleClick"
    :class="[
      sizeClasses[size],
      'font-semibold rounded-lg transition-all duration-200',
      isInTeam
        ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
        : 'bg-blue-600 text-white hover:bg-blue-700',
      props.class,
    ]"
  >
    <span v-if="isInTeam" class="flex items-center gap-2">
      <span>✓</span>
      <span>Remove from Team</span>
    </span>
    <span v-else class="flex items-center gap-2">
      <span>+</span>
      <span>Add to Team</span>
    </span>
  </button>
</template>
