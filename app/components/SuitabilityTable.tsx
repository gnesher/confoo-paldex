import { For, Show } from 'solid-js'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  createSolidTable,
} from '@tanstack/solid-table'
import type { Suitability } from '~/schemas/pal'
import { WORK_TYPE_ICONS } from '~/schemas/pal'

const columnHelper = createColumnHelper<Suitability>()

const columns = [
  columnHelper.accessor('workType', {
    header: 'Work Type',
    cell: (info) => (
      <div class="flex items-center gap-2">
        <span>{WORK_TYPE_ICONS[info.getValue()]}</span>
        <span>{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor('level', {
    header: 'Level',
    cell: (info) => (
      <div class="flex items-center gap-1">
        <For each={Array.from({ length: info.getValue() })}>
          {() => <span class="text-yellow-500">⭐</span>}
        </For>
        <For each={Array.from({ length: 4 - info.getValue() })}>
          {() => <span class="text-gray-300">☆</span>}
        </For>
      </div>
    ),
  }),
]

interface SuitabilityTableProps {
  data: Suitability[]
}

/**
 * TanStack Table for displaying Pal work suitability
 * FR-404: Page MUST display a Suitability table using TanStack Table
 */
export function SuitabilityTable(props: SuitabilityTableProps) {
  const table = createSolidTable({
    get data() { return props.data },
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Show
      when={props.data.length > 0}
      fallback={
        <div class="text-gray-500 text-sm py-4">
          No work suitability data available.
        </div>
      }
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <For each={table.getHeaderGroups()}>
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
            <For each={table.getRowModel().rows}>
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
