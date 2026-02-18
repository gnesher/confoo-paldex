<script setup lang="ts">
import { h } from 'vue'
import {
  createColumnHelper,
  getCoreRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import type { Drop } from '~/schemas/pal'
import DataTable from './DataTable.vue'

const props = defineProps<{
  data: Drop[]
}>()

const columnHelper = createColumnHelper<Drop>()

const columns = [
  columnHelper.accessor('item', {
    header: 'Item',
    cell: (info) =>
      h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'text-gray-400' }, '📦'),
        h('span', {}, info.getValue()),
      ]),
  }),
  columnHelper.accessor('quantity', {
    header: 'Quantity',
    cell: (info) =>
      h('span', { class: 'font-mono' }, `×${info.getValue()}`),
  }),
  columnHelper.accessor('dropRate', {
    header: 'Drop Rate',
    cell: (info) => {
      const rate = info.getValue()
      if (rate === undefined) {
        return h('span', { class: 'text-gray-400' }, '—')
      }
      return h('span', { class: 'font-mono' }, `${Math.round(rate * 100)}%`)
    },
  }),
]

const table = useVueTable({
  get data() { return props.data },
  columns,
  getCoreRowModel: getCoreRowModel(),
})
</script>

<template>
  <DataTable :table="table" empty-message="No drop data available." />
</template>
