import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DateFormat, Field, fieldTypes } from "@/models/ckan";
import { formatDate } from "@/utils";

export function getColumns(fields: Field[]): ColumnDef<unknown, unknown>[] {
  return fields.map(
    ({ id, type, info: { label, notes, unit, timestamp_format, type_override } = {} }) => ({
      id,
      accessorKey: id,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={label || id} notes={notes} unit={unit} />
      ),
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <span className="truncate font-medium">
            {row.getValue(id) === "null" || row.getValue(id) === null
              ? "-"
              : (type_override === fieldTypes.TIMESTAMP.value ||
                  type_override === fieldTypes.DATE.value ||
                  type === fieldTypes.TIMESTAMP.value ||
                  type === fieldTypes.DATE.value) &&
                timestamp_format
              ? formatDate(row.getValue(id), timestamp_format as DateFormat)
              : String(row.getValue(id))}
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
    })
  );
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
