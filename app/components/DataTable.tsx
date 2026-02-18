import { For, Show } from 'solid-js'
import {
  flexRender,
  type Table,
} from '@tanstack/solid-table'

interface DataTableProps<T> {
  table: Table<T>
  emptyMessage?: string
}

export function DataTable<T>(props: DataTableProps<T>) {
  return (
    <Show
      when={props.table.getRowModel().rows.length > 0 || !props.emptyMessage}
      fallback={
        <div class="text-gray-500 text-sm py-4">
          {props.emptyMessage}
        </div>
      }
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <For each={props.table.getHeaderGroups()}>
              {(headerGroup) => (
                <tr>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <th
                        class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <For each={props.table.getRowModel().rows}>
              {(row) => (
                <tr class="hover:bg-gray-50">
                  <For each={row.getVisibleCells()}>
                    {(cell) => (
                      <td class="px-4 py-3 text-sm text-gray-900">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </Show>
  )
}
