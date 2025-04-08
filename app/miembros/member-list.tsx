"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Search, UserCog } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { asociadoApi } from "@/lib/api"
import type { Asociado } from "@/lib/api-types"

export function MemberList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [miembros, setMiembros] = useState<Asociado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function cargarMiembros() {
      try {
        setLoading(true)
        const data = await asociadoApi.getAll()
        setMiembros(data)
      } catch (err) {
        console.error("Error al cargar miembros:", err)
        setError("No se pudieron cargar los miembros. Intente nuevamente.")
      } finally {
        setLoading(false)
      }
    }

    cargarMiembros()
  }, [])

  const filteredMiembros = miembros.filter(
    (miembro) =>
      miembro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      miembro.cedula.includes(searchTerm) ||
      miembro.numeroAsociado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (miembro.email && miembro.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (loading) {
    return <LoadingSpinner text="Cargando miembros..." />
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-800">
        <p>{error}</p>
        <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar miembro..."
            className="pl-8 w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground">Total: {miembros.length} miembros</div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Cédula</TableHead>
              <TableHead>Número Asociado</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Teléfono</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMiembros.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            ) : (
              filteredMiembros.map((miembro) => (
                <TableRow key={miembro.id}>
                  <TableCell className="font-medium">{miembro.nombre}</TableCell>
                  <TableCell>{miembro.cedula}</TableCell>
                  <TableCell>{miembro.numeroAsociado}</TableCell>
                  <TableCell className="hidden md:table-cell">{miembro.email || "-"}</TableCell>
                  <TableCell className="hidden md:table-cell">{miembro.telefono || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/miembros/${miembro.id}`}>
                        <Button variant="ghost" size="icon">
                          <UserCog className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/miembros/${miembro.id}/editar`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
