import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { Drop } from '~/schemas/pal'

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

/**
 * TanStack Table for displaying Pal item drops
 * FR-405: Page MUST display a Drops table using TanStack Table
 */
export function DropsTable({ data }: DropsTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (data.length === 0) {
    return (
      <div className="text-gray-500 text-sm py-4">
        No drop data available.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-4 py-3 text-sm text-gray-900"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
