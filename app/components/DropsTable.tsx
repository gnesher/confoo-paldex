import { For, Show } from 'solid-js'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  createSolidTable,
} from '@tanstack/solid-table'
import type { Drop } from '~/schemas/pal'

const columnHelper = createColumnHelper<Drop>()

const columns = [
  columnHelper.accessor('item', {
    header: 'Item',
    cell: (info) => (
      <div class="flex items-center gap-2">
        <span class="text-gray-400">📦</span>
        <span>{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor('quantity', {
    header: 'Quantity',
    cell: (info) => (
      <span class="font-mono">×{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('dropRate', {
    header: 'Drop Rate',
    cell: (info) => {
      const rate = info.getValue()
      if (rate === undefined) {
        return <span class="text-gray-400">—</span>
      }
      return (
        <span class="font-mono">
          {Math.round(rate * 100)}%
        </span>
      )
    },
  }),
]

interface DropsTableProps {
  data: Drop[]
}

/**
 * TanStack Table for displaying Pal item drops
 * FR-405: Page MUST display a Drops table using TanStack Table
 */
export function DropsTable(props: DropsTableProps) {
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
          No drop data available.
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
