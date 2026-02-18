<script setup lang="ts">
import { h } from 'vue'
import {
  createColumnHelper,
  getCoreRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import type { Suitability } from '~/schemas/pal'
import { WORK_TYPE_ICONS } from '~/schemas/pal'
import DataTable from './DataTable.vue'

const props = defineProps<{
  data: Suitability[]
}>()

const columnHelper = createColumnHelper<Suitability>()

const columns = [
  columnHelper.accessor('workType', {
    header: 'Work Type',
    cell: (info) =>
      h('div', { class: 'flex items-center gap-2' }, [
        h('span', {}, WORK_TYPE_ICONS[info.getValue()]),
        h('span', {}, info.getValue()),
      ]),
  }),
  columnHelper.accessor('level', {
    header: 'Level',
    cell: (info) =>
      h('div', { class: 'flex items-center gap-1' }, [
        ...Array.from({ length: info.getValue() }, (_, i) =>
          h('span', { key: `filled-${i}`, class: 'text-yellow-500' }, '⭐')
        ),
        ...Array.from({ length: 4 - info.getValue() }, (_, i) =>
          h('span', { key: `empty-${i}`, class: 'text-gray-300' }, '☆')
        ),
      ]),
  }),
]

const table = useVueTable({
  get data() { return props.data },
  columns,
  getCoreRowModel: getCoreRowModel(),
})
</script>

<template>
  <DataTable :table="table" empty-message="No work suitability data available." />
</template>
