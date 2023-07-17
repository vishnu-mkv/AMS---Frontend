import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/Button";
import { PaginatedResponse as Paginated } from "@/interfaces/common";
import { Fragment, useMemo, useState } from "react";
import { generatePaginationArray } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: Paginated<TData>;
  onPageChange?: (pagination: number) => void;
  hiddenColumns?: string[];
  showPagination?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onPageChange,
  hiddenColumns = [],
  showPagination = true,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    hiddenColumns.reduce((acc, column) => {
      acc[column] = false;
      return acc;
    }, {} as any)
  );

  const pagination = useMemo(
    () => ({
      pageIndex: data.page - 1,
      pageSize: data.limit,
    }),
    [data]
  );

  const table = useReactTable({
    data: data.docs || [],
    columns: [
      {
        header: "#",
        accessorFn: (_, index) => (data.page - 1) * data.limit + 1 + index,
      },
      ...columns,
    ],
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination,
      columnVisibility,
    },
    manualPagination: true,
    pageCount: data.totalPages,

    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <div className="grid">
      <ScrollArea
        className="border rounded-md max-w-full"
        orientation="horizontal"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      {showPagination && (
        <Fragment>
          <p className="m-3 text-sm text-gray-700">
            {/* showing 1- 10 of 20 results */}
            Showing {(data.page - 1) * data.limit + 1} -{" "}
            {Math.min(data.totalCount, data.page * data.limit)} of{" "}
            {data.totalCount} results
          </p>
          <div className="flex items-center justify-center space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(data.page - 1)}
              disabled={!table.getCanPreviousPage()}
              className="justify-self-start"
            >
              Previous
            </Button>
            {generatePaginationArray(data?.page, data.totalPages).map(
              (page, index) => {
                return (
                  <Button
                    key={index}
                    variant={page === data?.page ? "default" : "outline"}
                    onClick={() => {
                      // if page is not int, it is "..."
                      if (typeof page !== "number") return;
                      onPageChange?.(page);
                    }}
                  >
                    {page}
                  </Button>
                );
              }
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(data.page + 1)}
              disabled={!table.getCanNextPage()}
              className="justify-self-end"
            >
              Next
            </Button>
          </div>
        </Fragment>
      )}
    </div>
  );
}
