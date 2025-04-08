"use client"

import React from "react"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, Calendar, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AsociadoAsistencia {
  id: number
  nombre: string
  cedula: string
  estatus: "Activo" | "Inactivo"
  totalEventos: number
  eventosAsistidos: number
  porcentaje: number
  ultimaAsistencia: string
}

// Datos de ejemplo
const data: AsociadoAsistencia[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    cedula: "1-1234-5678",
    estatus: "Activo",
    totalEventos: 5,
    eventosAsistidos: 4,
    porcentaje: 80,
    ultimaAsistencia: "15/10/2023",
  },
  {
    id: 2,
    nombre: "María Rodríguez",
    cedula: "2-3456-7890",
    estatus: "Activo",
    totalEventos: 5,
    eventosAsistidos: 5,
    porcentaje: 100,
    ultimaAsistencia: "05/02/2024",
  },
  {
    id: 3,
    nombre: "Carlos Jiménez",
    cedula: "3-4567-8901",
    estatus: "Inactivo",
    totalEventos: 5,
    eventosAsistidos: 1,
    porcentaje: 20,
    ultimaAsistencia: "15/10/2023",
  },
  {
    id: 4,
    nombre: "Ana Sánchez",
    cedula: "4-5678-9012",
    estatus: "Activo",
    totalEventos: 5,
    eventosAsistidos: 3,
    porcentaje: 60,
    ultimaAsistencia: "10/12/2023",
  },
  {
    id: 5,
    nombre: "Pedro Mora",
    cedula: "5-6789-0123",
    estatus: "Activo",
    totalEventos: 5,
    eventosAsistidos: 2,
    porcentaje: 40,
    ultimaAsistencia: "05/11/2023",
  },
]

export const columns: ColumnDef<AsociadoAsistencia>[] = [
  {
    accessorKey: "nombre",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("nombre")}</div>,
  },
  {
    accessorKey: "cedula",
    header: "Cédula",
  },
  {
    accessorKey: "estatus",
    header: "Estatus",
    cell: ({ row }) => {
      const status = row.getValue("estatus") as string
      return <Badge variant={status === "Activo" ? "default" : "secondary"}>{status}</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "eventosAsistidos",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Asistencia
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue("eventosAsistidos")}</span>
          <span className="ml-1 text-muted-foreground">/ {row.original.totalEventos}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "porcentaje",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Porcentaje
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const porcentaje = Number.parseFloat(row.getValue("porcentaje"))

      return <div>{porcentaje}%</div>
    },
  },
  {
    accessorKey: "ultimaAsistencia",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Última Asistencia
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("ultimaAsistencia")}</span>
        </div>
      )
    },
  },
]

export function AsistenciaAsociadosReport() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [estatusFilter, setEstatusFilter] = useState<string>("todos")

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  // Aplicar filtro de estatus
  React.useEffect(() => {
    if (estatusFilter !== "todos") {
      table.getColumn("estatus")?.setFilterValue([estatusFilter])
    } else {
      table.getColumn("estatus")?.setFilterValue(undefined)
    }
  }, [estatusFilter, table])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center py-4">
        <Input
          placeholder="Buscar por nombre o cédula..."
          value={(table.getColumn("nombre")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("nombre")?.setFilterValue(event.target.value)}
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

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
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

