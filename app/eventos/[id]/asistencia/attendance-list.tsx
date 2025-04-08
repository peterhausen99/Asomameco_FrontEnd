"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Search } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { asistenciaApi, asociadoApi } from "@/lib/api"
import type { Asistencia, Asociado } from "@/lib/api-types"

interface AsistenciaConDetalles extends Asistencia {
  asociadoNombre: string
  asociadoCedula: string
  asociadoNumero: string
}

export function AttendanceList({ eventId }: { eventId: number }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [asistencias, setAsistencias] = useState<AsistenciaConDetalles[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function cargarAsistencias() {
      try {
        setLoading(true)

        // Cargar asistencias del evento y todos los asociados
        const [asistenciasData, asociadosData] = await Promise.all([
          asistenciaApi.getByEvento(eventId),
          asociadoApi.getAll(),
        ])

        // Crear un mapa de asociados para acceso rápido
        const asociadosMap = new Map<number, Asociado>()
        asociadosData.forEach((asociado) => {
          if (asociado.id) {
            asociadosMap.set(asociado.id, asociado)
          }
        })

        // Combinar datos de asistencia con información de asociados
        const asistenciasConDetalles = asistenciasData.map((asistencia) => {
          const asociado = asociadosMap.get(asistencia.asociadoId)

          return {
            ...asistencia,
            asociadoNombre: asociado?.nombre || "Desconocido",
            asociadoCedula: asociado?.cedula || "N/A",
            asociadoNumero: asociado?.numeroAsociado || "N/A",
          }
        })

        // Ordenar por hora de registro (más reciente primero)
        asistenciasConDetalles.sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime())

        setAsistencias(asistenciasConDetalles)
      } catch (err) {
        console.error("Error al cargar asistencias:", err)
        setError("No se pudieron cargar las asistencias")
      } finally {
        setLoading(false)
      }
    }

    cargarAsistencias()
  }, [eventId])

  const filteredAsistencias = asistencias.filter(
    (asistencia) =>
      asistencia.asociadoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asistencia.asociadoCedula.includes(searchTerm) ||
      asistencia.asociadoNumero.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleExportExcel = () => {
    // Aquí iría la lógica para exportar a Excel
    alert("Funcionalidad de exportación a Excel en desarrollo")
  }

  if (loading) {
    return <LoadingSpinner text="Cargando asistencias..." />
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
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Lista de Asistentes</CardTitle>
            <CardDescription>Total de asistentes registrados: {asistencias.length}</CardDescription>
          </div>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, cédula o número de asociado"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Cédula</TableHead>
                <TableHead>Número Asociado</TableHead>
                <TableHead>Hora de Registro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAsistencias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAsistencias.map((asistencia) => (
                  <TableRow key={asistencia.id}>
                    <TableCell className="font-medium">{asistencia.asociadoNombre}</TableCell>
                    <TableCell>{asistencia.asociadoCedula}</TableCell>
                    <TableCell>{asistencia.asociadoNumero}</TableCell>
                    <TableCell>
                      {new Date(asistencia.fechaHora).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
