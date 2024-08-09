"use client"

import * as React from "react"
import {
  ChevronDownIcon,
} from "@radix-ui/react-icons"
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

import { SetStateAction } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronsUpDown } from "lucide-react"
import { Spinner } from "./spinner"

interface cols {
  key: string,
  header: string,
  columnOrdering: boolean,
  actions: React.ReactNode
}

interface ActionsProps {
  row: any,
}
interface Props {
  data: unknown[] //
  cols: cols[] // columnas de la tabla
  showSelection: boolean
  rowSelection: RowSelectionState, // metodo para obtener las filas seleccionadas
  setRowSelection: React.Dispatch<SetStateAction<object>> // metodo para manejar las filas seleccionadas
  Actions: ({ row }: ActionsProps) => JSX.Element
  HeadActions: () => JSX.Element
  //optional
  showActions?: boolean
  customButtom?: React.ReactNode // Boton para manejar los datos seleccionados en la tabla
  className?: string
  deleteFunction?: any
}

export default function ReusableTable({data, cols, showSelection, showActions, rowSelection, customButtom, className, Actions, HeadActions, setRowSelection}: Props) {

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  const [filterValue, setFilterValue] = React.useState({
    header: "",
    key: ""
  })

  const columns: ColumnDef<unknown>[] = cols.map(col =>
    col.columnOrdering ? (
      {
        accessorKey: col.key,
        header: ({ column }) => {
          return (
            <div
              className="flex flex-row items-center justify-start gap-2 ml-2 px-2 w-fit"
            >
              <span>{col.header}</span>
              <Button
                className="px-2 text-start h-6 hover:bg-cover border"
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                <ChevronsUpDown size={10}/>
              </Button>
            </div>
          )
        },
        cell: ({ row }) => (
          <div className="px-2 ml-2">
            <span className="capitalize">
              {row.getValue(col.key)}
            </span>
          </div>
        )
      }
    ) : (
      {
        accessorKey: col.key,
        header: () => (
          <span className="text-left px-2">{col.header}</span>
        ),
        cell: ({ row }) => (
          <div className="px-2">
            <span className="capitalize">
              {row.getValue(col.key)}
            </span>
          </div>
        ),
      }
    )
  )

  const table = useReactTable({
    data,
    columns: [
      showSelection ? {
        id: "select",
        header: ({ table }) => (
          <div className="px-1 flex items-center justify-center">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="px-1 flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      } : {
        id: "list",
        enableHiding: false,
        cell: ({table}) => (
          <div className="flex items-center justify-center px-0 w-0 m-0">
            <div className="h-1.5 w-1.5 dark:bg-white bg-primary rounded-full"/>
          </div>
        )
      },
      ...columns,
      showActions ? {
        id: "actions",
        enableHiding: true,
        header: () => (
          <HeadActions />
        ),
        cell: ({ row }) => {
          return (
            <Actions row={row}/>
          )
        },
      } : {
        id: "list"
      }
    ],
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    debugTable: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    }
  })

  return (
    <div className="w-full">
      <div className="flex items-start justify-between pb-4 border-cover gap-2">
        <div className="flex flex-row gap-2">
          <div className="flex flex-col gap-1">
            <Input
              placeholder={`Buscar por ${filterValue.header.toLocaleLowerCase() === "" ? "..." : filterValue.header.toLocaleLowerCase()}`}
              value={(table.getColumn(filterValue.key)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(filterValue.key)?.setFilterValue(event.target.value)
              }
              disabled={filterValue.header === ""}
              className="max-w-xs border-cover"
            />
            {/* <span className={`text-[0.70rem] text-muted-foreground ml-1 ${filterValue.header === "" ? "text-muted-foreground" : "text-transparent"}`}>
              Selecciona una columna para buscar
            </span> */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto border-cover flex flex-row items-center gap-1 px-2">
                Buscar por: <ChevronDownIcon className="" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1 bg-background">
                {
                  cols.map(col => (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      key={Math.random()}
                      onClick={() => {
                        setFilterValue(col)
                      }}
                    >
                        {col.header}
                    </DropdownMenuItem>
                  ))
                }
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          {
            customButtom !== undefined && customButtom
          }
        </div>
      </div>
      <div className={`rounded-md border dark:border-cover border-cover shadow-lg overflow-hidden w-full h-fit ${className && className}`}>
        <Table className="text-center px-2 overflow-hidden">
          <TableHeader className="bg-transparent hover:bg-transparent">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-cover">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-left text-gray-400 min-w-[0.5em] first:max-w-[0.1em]">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
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
                  className="border-cover"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="max-h-14 text-left">
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
                  className="h-24 w-full text-center"
                >
                  <Spinner size="normal"/>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className={`flex flex-row items-start justify-between space-x-2 py-4 px-2`}>
        {
          showSelection === true ? (
            <div className="flex flex-col gap-1 items-start justify-center">
              <div className="flex text-xs text-muted-foreground">
                {
                  table.getPageCount() !== (table.getState().pagination.pageIndex + 1)
                    ? table.getRowModel().rows.length * (table.getState().pagination.pageIndex + 1)
                    : table.getCoreRowModel().rows.length
                } de{' '}
                {table.getCoreRowModel().rows.length} Elemento(s)
              </div>
              <div className="flex text-xs text-muted-foreground">
                Seleccionados(s): {table.getFilteredSelectedRowModel().rows.length} de{" "} {table.getFilteredRowModel().rows.length}
              </div>
            </div>
          ) : (
            <div className="flex text-xs text-muted-foreground">
              {
                table.getPageCount() !== (table.getState().pagination.pageIndex + 1)
                  ? table.getRowModel().rows.length * (table.getState().pagination.pageIndex + 1)
                  : table.getCoreRowModel().rows.length
              } de{' '}
              {table.getCoreRowModel().rows.length} Elemento(s)
            </div>
          )
        }
        <div className="flex flex-col gap-2 items-center justify-center">
          <div className="flex flex-row gap-2 items-center justify-center">
            <Button
              variant="outline"
              className="dark:border-cover text-primary h-8 w-8"
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="dark:border-cover text-primary h-8 w-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="dark:border-cover text-primary h-8 w-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              className="dark:border-cover text-primary h-8 w-8"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() -1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight />
            </Button>
          </div>
          <div className="flex text-xs text-muted-foreground">
            Página - {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" size={"sm"}>Mostrar - {table.getState().pagination.pageSize}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-fit">
            {[5, 10, 25, 50].map(pageSize => (
              <DropdownMenuItem
                key={pageSize} 
                onClick={() => table.setPageSize(pageSize)}
              >
                <span>Mostrar - {pageSize}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
