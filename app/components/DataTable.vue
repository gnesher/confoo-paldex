<script setup lang="ts" generic="T">
import { FlexRender, type Table } from '@tanstack/vue-table'

defineProps<{
  table: Table<T>
  emptyMessage?: string
}>()
</script>

<template>
  <div v-if="table.getRowModel().rows.length === 0 && emptyMessage" class="text-gray-500 text-sm py-4">
    {{ emptyMessage }}
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
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
