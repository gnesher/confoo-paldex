<script setup lang="ts">
import {
  createColumnHelper,
  getCoreRowModel,
  useVueTable,
  FlexRender,
} from '@tanstack/vue-table'
import type { Drop } from '~/schemas/pal'

const props = defineProps<{
  data: Drop[]
}>()

const columnHelper = createColumnHelper<Drop>()

const columns = [
  columnHelper.accessor('item', {
    header: 'Item',
  }),
  columnHelper.accessor('quantity', {
    header: 'Quantity',
  }),
  columnHelper.accessor('dropRate', {
    header: 'Drop Rate',
  }),
]

const table = useVueTable({
  get data() { return props.data },
  columns,
  getCoreRowModel: getCoreRowModel(),
})
</script>

<template>
  <div v-if="data.length === 0" class="text-gray-500 text-sm py-4">
    No drop data available.
  </div>
  <div v-else class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            <template v-if="!header.isPlaceholder">
              <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
            </template>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="row in table.getRowModel().rows" :key="row.id" class="hover:bg-gray-50">
          <td
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            class="px-4 py-3 text-sm text-gray-900"
          >
            <template v-if="cell.column.id === 'item'">
              <div class="flex items-center gap-2">
                <span class="text-gray-400">📦</span>
                <span><FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" /></span>
              </div>
            </template>
            <template v-else-if="cell.column.id === 'quantity'">
              <span class="font-mono">×{{ cell.getValue() }}</span>
            </template>
            <template v-else-if="cell.column.id === 'dropRate'">
              <span v-if="cell.getValue() === undefined" class="text-gray-400">—</span>
              <span v-else class="font-mono">{{ Math.round((cell.getValue() as number) * 100) }}%</span>
            </template>
            <template v-else>
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
