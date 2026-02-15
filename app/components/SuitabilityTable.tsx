import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { Suitability } from '~/schemas/pal'
import { WORK_TYPE_ICONS } from '~/schemas/pal'
import { DataTable } from './DataTable'

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

export function SuitabilityTable({ data }: SuitabilityTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <DataTable
      table={table}
      emptyMessage="No work suitability data available."
    />
  )
}
