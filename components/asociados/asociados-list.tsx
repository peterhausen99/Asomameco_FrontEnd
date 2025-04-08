"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Asociado } from "@/types"

// Datos de ejemplo
const data: Asociado[] = [
  {
    IdAsociado: 1,
    Nombre: "Juan Pérez",
    NumeroCedula: "1-1234-5678",
    Estatus1: "Activo",
    Estado2: "Verificado",
    Correo: "juan.perez@ejemplo.com",
    Telefono: "8888-8888",
    FechaRegistro: "2023-01-15",
    FechaModificacion: "2023-06-20",
    IdUsuario: 1,
  },
  {
    IdAsociado: 2,
    Nombre: "María Rodríguez",
    NumeroCedula: "2-3456-7890",
    Estatus1: "Activo",
    Estado2: "Confirmado",
    Correo: "maria.rodriguez@ejemplo.com",
    Telefono: "7777-7777",
    FechaRegistro: "2023-02-10",
    FechaModificacion: "2023-05-15",
    IdUsuario: 1,
  },
  {
    IdAsociado: 3,
    Nombre: "Carlos Jiménez",
    NumeroCedula: "3-4567-8901",
    Estatus1: "Inactivo",
    Estado2: "Pendiente",
    Correo: "carlos.jimenez@ejemplo.com",
    Telefono: "6666-6666",
    FechaRegistro: "2023-03-05",
    FechaModificacion: "2023-04-10",
    IdUsuario: 2,
  },
  {
    IdAsociado: 4,
    Nombre: "Ana Sánchez",
    NumeroCedula: "4-5678-9012",
    Estatus1: "Activo",
    Estado2: "Verificado",
    Correo: "ana.sanchez@ejemplo.com",
    Telefono: "5555-5555",
    FechaRegistro: "2023-04-20",
    FechaModificacion: "2023-07-05",
    IdUsuario: 2,
  },
  {
    IdAsociado: 5,
    Nombre: "Pedro Mora",
    NumeroCedula: "5-6789-0123",
    Estatus1: "Activo",
    Estado2: "No",
    Correo: "pedro.mora@ejemplo.com",
    Telefono: "4444-4444",
    FechaRegistro: "2023-05-12",
    FechaModificacion: "2023-08-01",
    IdUsuario: 1,
  },
]

export const columns: ColumnDef<Asociado>[] = [
  {
    accessorKey: "Nombre",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("Nombre")}</div>,
  },
  {
    accessorKey: "NumeroCedula",
    header: "Cédula",
    cell: ({ row }) => <div>{row.getValue("NumeroCedula")}</div>,
  },
  {
    accessorKey: "Estatus1",
    header: "Estatus",
    cell: ({ row }) => {
      const status = row.getValue("Estatus1") as string
      return <Badge variant={status === "Activo" ? "default" : "secondary"}>{status}</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "Estado2",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.getValue("Estado2") as string
      return (
        <Badge
          variant={
            estado === "Verificado"
              ? "success"
              : estado === "Confirmado"
                ? "default"
                : estado === "Pendiente"
                  ? "warning"
                  : "destructive"
          }
          className={
            estado === "Verificado"
              ? "bg-green-100 text-green-800"
              : estado === "Confirmado"
                ? "bg-blue-100 text-blue-800"
                : estado === "Pendiente"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
          }
        >
          {estado}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "Correo",
    header: "Correo",
    cell: ({ row }) => <div>{row.getValue("Correo")}</div>,
  },
  {
    accessorKey: "Telefono",
    header: "Teléfono",
    cell: ({ row }) => <div>{row.getValue("Telefono")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const asociado = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(asociado.IdAsociado.toString())}>
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/dashboard/asociados/${asociado.IdAsociado}`} className="w-full">
                Ver detalles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/dashboard/asociados/${asociado.IdAsociado}/editar`} className="w-full">
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className={asociado.Estatus1 === "Activo" ? "text-red-600" : "text-green-600"}>
              {asociado.Estatus1 === "Activo" ? "Desactivar" : "Activar"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function AsociadosList() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [estatusFilter, setEstatusFilter] = useState<string>("todos")
  const [estadoFilter, setEstadoFilter] = useState<string>("todos")

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Aplicar filtros de estatus y estado
  React.useEffect(() => {
    if (estatusFilter !== "todos") {
      table.getColumn("Estatus1")?.setFilterValue([estatusFilter])
    } else {
      table.getColumn("Estatus1")?.setFilterValue(undefined)
    }

    if (estadoFilter !== "todos") {
      table.getColumn("Estado2")?.setFilterValue([estadoFilter])
    } else {
      table.getColumn("Estado2")?.setFilterValue(undefined)
    }
  }, [estatusFilter, estadoFilter, table])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center py-4">
        <Input
          placeholder="Buscar por nombre o cédula..."
          value={(table.getColumn("Nombre")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("Nombre")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2 ml-auto">
          <Select value={estatusFilter} onValueChange={setEstatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estatus</SelectItem>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>

          <Select value={estadoFilter} onValueChange={setEstadoFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="Verificado">Verificado</SelectItem>
              <SelectItem value="Confirmado">Confirmado</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columnas <ChevronDown className="ml-2 h-4 w-4" />
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
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id === "Nombre"
                        ? "Nombre"
                        : column.id === "NumeroCedula"
                          ? "Cédula"
                          : column.id === "Estatus1"
                            ? "Estatus"
                            : column.id === "Estado2"
                              ? "Estado"
                              : column.id === "Correo"
                                ? "Correo"
                                : column.id === "Telefono"
                                  ? "Teléfono"
                                  : column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} asociado(s) encontrado(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}

