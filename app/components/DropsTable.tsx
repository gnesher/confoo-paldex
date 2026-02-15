import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { Drop } from '~/schemas/pal'
import { DataTable } from './DataTable'

const columnHelper = createColumnHelper<Drop>()

const columns = [
  columnHelper.accessor('item', {
    header: 'Item',
    cell: (info) => (
      <div className="flex items-center gap-2">
        <span className="text-gray-400">📦</span>
        <span>{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor('quantity', {
    header: 'Quantity',
    cell: (info) => (
      <span className="font-mono">×{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('dropRate', {
    header: 'Drop Rate',
    cell: (info) => {
      const rate = info.getValue()
      if (rate === undefined) {
        return <span className="text-gray-400">—</span>
      }
      return (
        <span className="font-mono">
          {Math.round(rate * 100)}%
        </span>
      )
    },
  }),
]

interface DropsTableProps {
  data: Drop[]
}

export function DropsTable({ data }: DropsTableProps) {
  const table = useReactTable({
    data,
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
