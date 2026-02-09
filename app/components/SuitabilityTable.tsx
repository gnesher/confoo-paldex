import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { Suitability } from '~/schemas/pal'
import { WORK_TYPE_ICONS } from '~/schemas/pal'

const columnHelper = createColumnHelper<Suitability>()

const columns = [
  columnHelper.accessor('workType', {
    header: 'Work Type',
    cell: (info) => (
      <div className="flex items-center gap-2">
        <span>{WORK_TYPE_ICONS[info.getValue()]}</span>
        <span>{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor('level', {
    header: 'Level',
    cell: (info) => (
      <div className="flex items-center gap-1">
        {Array.from({ length: info.getValue() }).map((_, i) => (
          <span key={i} className="text-yellow-500">⭐</span>
        ))}
        {Array.from({ length: 4 - info.getValue() }).map((_, i) => (
          <span key={i} className="text-gray-300">☆</span>
        ))}
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
export function SuitabilityTable({ data }: SuitabilityTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (data.length === 0) {
    return (
      <div className="text-gray-500 text-sm py-4">
        No work suitability data available.
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
