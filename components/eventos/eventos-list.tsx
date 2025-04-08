"use client"

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
import { ArrowUpDown, ChevronDown, MoreHorizontal, UserCheck } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import type { Evento } from "@/types"
import { useRouter } from "next/navigation"

// Datos de ejemplo
const data: (Evento & { asistentes: number })[] = [
  {
    IdEvento: 1,
    Nombre: "Asamblea General Ordinaria",
    Fecha: "2023-10-15",
    Descripcion: "Asamblea anual para todos los asociados",
    asistentes: 156,
  },
  {
    IdEvento: 2,
    Nombre: "Capacitación: Nuevas técnicas médicas",
    Fecha: "2023-11-05",
    Descripcion: "Actualización profesional para asociados",
    asistentes: 87,
  },
  {
    IdEvento: 3,
    Nombre: "Conferencia: Ética médica",
    Fecha: "2023-12-10",
    Descripcion: "Conferencia sobre ética en la práctica médica",
    asistentes: 112,
  },
  {
    IdEvento: 4,
    Nombre: "Taller: Manejo del estrés",
    Fecha: "2024-01-20",
    Descripcion: "Taller para mejorar la salud mental de los profesionales",
    asistentes: 45,
  },
  {
    IdEvento: 5,
    Nombre: "Reunión de Junta Directiva",
    Fecha: "2024-02-05",
    Descripcion: "Reunión mensual de la junta directiva",
    asistentes: 12,
  },
]

export const columns: ColumnDef<Evento & { asistentes: number }>[] = [
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
    accessorKey: "Fecha",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const fecha = new Date(row.getValue("Fecha"))
      const formattedDate = fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })

      const today = new Date()
      const isPast = fecha < today

      return (
        <div className="flex items-center">
          {formattedDate}
          {isPast && (
            <Badge variant="outline" className="ml-2 bg-gray-100">
              Pasado
            </Badge>
          )}
          {!isPast && fecha.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000 && (
            <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">
              Próximo
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "Descripcion",
    header: "Descripción",
    cell: ({ row }) => <div className="truncate max-w-xs">{row.getValue("Descripcion")}</div>,
  },
  {
    accessorKey: "asistentes",
    header: "Asistentes",
    cell: ({ row }) => (
      <div className="flex items-center">
        <UserCheck className="mr-2 h-4 w-4 text-muted-foreground" />
        <span>{row.getValue("asistentes")}</span>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const evento = row.original
      const fecha = new Date(evento.Fecha)
      const today = new Date()
      const isPast = fecha < today
      const router = useRouter()

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(evento.IdEvento.toString())}>
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/dashboard/eventos/${evento.IdEvento}`} className="w-full">
                Ver detalles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/dashboard/eventos/${evento.IdEvento}/editar`} className="w-full">
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/eventos/${evento.IdEvento}/asistencia`)}>
              Registrar asistencia
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function EventosList() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const router = useRouter()

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center py-4">
        <Input
          placeholder="Buscar eventos..."
          value={(table.getColumn("Nombre")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("Nombre")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2 ml-auto">
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
                        : column.id === "Fecha"
                          ? "Fecha"
                          : column.id === "Descripcion"
                            ? "Descripción"
                            : column.id === "asistentes"
                              ? "Asistentes"
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
                  No se encontraron eventos.
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

