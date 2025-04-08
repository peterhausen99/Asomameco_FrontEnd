"use client"

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
import { ArrowUpDown, Download, UserCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EventoAsistencia {
  id: number
  nombre: string
  fecha: string
  totalAsociados: number
  asistentes: number
  porcentaje: number
}

// Datos de ejemplo
const data: EventoAsistencia[] = [
  {
    id: 1,
    nombre: "Asamblea General Ordinaria",
    fecha: "15/10/2023",
    totalAsociados: 245,
    asistentes: 156,
    porcentaje: 63.7,
  },
  {
    id: 2,
    nombre: "Capacitación: Nuevas técnicas médicas",
    fecha: "05/11/2023",
    totalAsociados: 245,
    asistentes: 87,
    porcentaje: 35.5,
  },
  {
    id: 3,
    nombre: "Conferencia: Ética médica",
    fecha: "10/12/2023",
    totalAsociados: 245,
    asistentes: 112,
    porcentaje: 45.7,
  },
  {
    id: 4,
    nombre: "Taller: Manejo del estrés",
    fecha: "20/01/2024",
    totalAsociados: 245,
    asistentes: 45,
    porcentaje: 18.4,
  },
  {
    id: 5,
    nombre: "Reunión de Junta Directiva",
    fecha: "05/02/2024",
    totalAsociados: 12,
    asistentes: 12,
    porcentaje: 100,
  },
]

export const columns: ColumnDef<EventoAsistencia>[] = [
  {
    accessorKey: "nombre",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Evento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("nombre")}</div>,
  },
  {
    accessorKey: "fecha",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "asistentes",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Asistentes
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <UserCheck className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("asistentes")}</span>
          <span className="ml-1 text-muted-foreground">/ {row.original.totalAsociados}</span>
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

      return (
        <div className="flex w-full items-center gap-2">
          <Progress value={porcentaje} className="h-2" />
          <span className="w-10 text-right">{porcentaje.toFixed(1)}%</span>
        </div>
      )
    },
  },
]

export function AsistenciaEventosReport() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [periodo, setPeriodo] = useState<string>("todos")

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center py-4">
        <Input
          placeholder="Buscar eventos..."
          value={(table.getColumn("nombre")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("nombre")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2 ml-auto">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los períodos</SelectItem>
              <SelectItem value="2023">Año 2023</SelectItem>
              <SelectItem value="2024">Año 2024</SelectItem>
              <SelectItem value="ultimo">Últimos 3 meses</SelectItem>
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
          {table.getFilteredRowModel().rows.length} evento(s) encontrado(s).
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

