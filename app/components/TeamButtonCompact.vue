<script setup lang="ts">
import { computed } from 'vue'
import { togglePal, useIsInTeam } from '~/stores/team'
import type { Pal } from '~/schemas/pal'

const props = defineProps<{
  pal: Pal
}>()

const isInTeam = useIsInTeam(computed(() => props.pal.id))

function handleClick(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  togglePal(props.pal)
}
</script>

<template>
  <button
    type="button"
    @click="handleClick"
    :class="[
      'p-2 rounded-full transition-all duration-200',
      isInTeam
        ? 'bg-red-100 text-red-600 hover:bg-red-200'
        : 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    ]"
    :title="isInTeam ? 'Remove from Team' : 'Add to Team'"
  >
    {{ isInTeam ? '✓' : '+' }}
  </button>
</template>
