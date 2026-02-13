<script setup lang="ts">
import {
  createColumnHelper,
  getCoreRowModel,
  useVueTable,
  FlexRender,
} from '@tanstack/vue-table'
import type { Suitability } from '~/schemas/pal'
import { WORK_TYPE_ICONS } from '~/schemas/pal'

const props = defineProps<{
  data: Suitability[]
}>()

const columnHelper = createColumnHelper<Suitability>()

const columns = [
  columnHelper.accessor('workType', {
    header: 'Work Type',
  }),
  columnHelper.accessor('level', {
    header: 'Level',
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
    No work suitability data available.
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
            <template v-if="cell.column.id === 'workType'">
              <div class="flex items-center gap-2">
                <span>{{ WORK_TYPE_ICONS[cell.getValue() as Suitability['workType']] }}</span>
                <span>{{ cell.getValue() }}</span>
              </div>
            </template>
            <template v-else-if="cell.column.id === 'level'">
              <div class="flex items-center gap-1">
                <span v-for="i in (cell.getValue() as number)" :key="'filled-'+i" class="text-yellow-500">⭐</span>
                <span v-for="i in (4 - (cell.getValue() as number))" :key="'empty-'+i" class="text-gray-300">☆</span>
              </div>
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
