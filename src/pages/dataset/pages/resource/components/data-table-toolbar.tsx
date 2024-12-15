"use client";

import { Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter, DataTableFacetedFilterProps } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

import { TableIcon, X } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [columnFilter, setColumnFilter] = useState(table.getAllColumns()[0]);
  const columns = table.getAllColumns();
  const isVisible = columnFilter.getIsVisible();
  const facetedFilters: Map<
    (typeof columns)[number],
    DataTableFacetedFilterProps<TData, any>
  > = new Map();

  useEffect(() => {
    if (!isVisible) setColumnFilter(columns.find((column) => column.getIsVisible()) ?? columns[0]);
  }, [isVisible, columns]);

  columns.forEach((column) => {
    const options = Array.from(column.getFacetedUniqueValues().entries(), ([value]) => ({
      label: value,
      value,
    })).sort((a, b) => {
      if (typeof a.label === "string" && typeof b.label === "string")
        return a.label.localeCompare(b.label);
      return a.value - b.value;
    });
    if (column.getCanHide() && options.length > 1 && options.length < 6)
      facetedFilters.set(column, {
        column,
        title: column.id,
        options,
      });
  });

  const getFilter = () => {
    const filter = facetedFilters.get(columnFilter);
    if (filter && filter.column)
      return <DataTableFacetedFilter key={filter.column.id} {...filter} />;
    return (
      <Input
        placeholder="Buscar en la columna..."
        value={(columnFilter.getFilterValue() as string) ?? ""}
        onChange={(event) => columnFilter.setFilterValue(event.target.value)}
        className="mr-auto h-8 w-[150px] lg:w-[250px]"
      />
    );
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="hidden lg:flex">
                <TableIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[150px]">
              <DropdownMenuLabel>Seleccionar columna</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                .map(
                  (column) =>
                    column.getIsVisible() && (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.id === columnFilter.id}
                        onCheckedChange={(checked) => checked && setColumnFilter(column)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                )}
            </DropdownMenuContent>
          </DropdownMenu>
          {getFilter()}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Quitar filtros
              <X />
            </Button>
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>
      {Array.from(facetedFilters.values()).map(
        (filter) =>
          filter.column &&
          filter.column !== columnFilter &&
          filter.column.getIsFiltered() && (
            <DataTableFacetedFilter key={`${filter.column.id}-${filter.title}`} {...filter} />
          )
      )}
    </>
  );
}
