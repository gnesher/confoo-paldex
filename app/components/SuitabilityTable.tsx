import { For } from 'solid-js'
import {
  createColumnHelper,
  getCoreRowModel,
  createSolidTable,
} from '@tanstack/solid-table'
import type { Suitability } from '~/schemas/pal'
import { WORK_TYPE_ICONS } from '~/schemas/pal'
import { DataTable } from './DataTable'

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

export function SuitabilityTable(props: SuitabilityTableProps) {
  const table = createSolidTable({
    get data() { return props.data },
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
