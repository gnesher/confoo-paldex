import {
  createColumnHelper,
  getCoreRowModel,
  createSolidTable,
} from '@tanstack/solid-table'
import type { Drop } from '~/schemas/pal'
import { DataTable } from './DataTable'

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

export function DropsTable(props: DropsTableProps) {
  const table = createSolidTable({
    get data() { return props.data },
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <DataTable
      table={table}
      emptyMessage="No drop data available."
    />
  )
}
