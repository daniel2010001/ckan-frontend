import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./data-table-column-header";
import { Field } from "@/models/ckan";
import { formatDate } from "@/utils";

export function getColumns(fields: Field[]): ColumnDef<unknown, unknown>[] {
  return fields.map(({ id, type, info: { label, notes, unit, timestamp_format } = {} }) => ({
    id,
    accessorKey: id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={label || id} notes={notes} unit={unit} />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="truncate font-medium">
          {type === "timestamp" && timestamp_format
            ? formatDate(row.getValue(id), timestamp_format)
            : row.getValue(id)}
        </span>
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
//     accessorKey: id,
//     header: ({ column }) => <DataTableColumnHeader column={column} title={field} />,
//     cell: ({ row }) => (
//       <div className="flex space-x-2">
//         <span className="truncate font-medium">{row.getValue(field)}</span>
//       </div>
//     ),
//     filterFn: (row, id, value) => {
//       if (value === undefined) return true;
//       if (Array.isArray(value))
//         if (value.length === 0) return true;
//         else return value.includes(row.getValue(id));
//       return row.getValue(id)?.toString().includes(value.toString()) ?? false;
//     },
//   }));
// }
