import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./data-table-column-header";

// Me gusta. Ahora, cómo puedo hacer el gráfico multinivel?

export function getColumns(data: string[]): ColumnDef<any, any>[] {
  return data.map((item) => ({
    accessorKey: item,
    header: ({ column }) => <DataTableColumnHeader column={column} title={item} />,
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">{row.getValue(item)}</span>
      </div>
    ),
    filterFn: (row, id, value) => {
      if (value === undefined) return true;
      if (Array.isArray(value))
        if (value.length === 0) return true;
        else return value.includes(row.getValue(id));
      return row.getValue(id)?.toString().includes(value.toString()) ?? false;
    },
  }));
}
