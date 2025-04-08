"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Download, Users } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { estadisticasApi } from "@/lib/api"
import type { EstadisticasEvento, EstadisticasAsociado } from "@/lib/api-types"

export default function ReportesPage() {
  const [selectedEvent, setSelectedEvent] = useState<string>("all")
  const [estadisticasEventos, setEstadisticasEventos] = useState<EstadisticasEvento[]>([])
  const [estadisticasAsociados, setEstadisticasAsociados] = useState<EstadisticasAsociado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resumen, setResumen] = useState({
    totalEventos: 0,
    promedioAsistencia: 0,
    totalMiembros: 0,
  })

  useEffect(() => {
    async function cargarEstadisticas() {
      try {
        setLoading(true)

        // Cargar estadísticas
        const [eventosStats, asociadosStats] = await Promise.all([
          estadisticasApi.getEstadisticasEventos(),
          estadisticasApi.getEstadisticasAsociados(),
        ])

        // Filtrar eventos completados (con asistentes)
        const eventosCompletados = eventosStats.filter((e) => e.asistentes > 0)

        // Calcular promedio de asistencia
        const promedioAsistencia =
          eventosCompletados.length > 0
            ? Math.round(eventosCompletados.reduce((sum, e) => sum + e.porcentaje, 0) / eventosCompletados.length)
            : 0

        setEstadisticasEventos(eventosStats)
        setEstadisticasAsociados(asociadosStats)
        setResumen({
          totalEventos: eventosCompletados.length,
          promedioAsistencia,
          totalMiembros: asociadosStats.length,
        })
      } catch (err) {
        console.error("Error al cargar estadísticas:", err)
        setError("No se pudieron cargar las estadísticas. Intente nuevamente.")
      } finally {
        setLoading(false)
      }
    }

    cargarEstadisticas()
  }, [])

  const handleExportExcel = () => {
    // Aquí iría la lógica para exportar a Excel
    alert("Funcionalidad de exportación a Excel en desarrollo")
  }

  // Filtrar estadísticas de asociados por evento seleccionado
  const filteredAsociados = selectedEvent === "all" ? estadisticasAsociados : estadisticasAsociados // En una implementación real, se filtrarían por evento

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Reportes de Asistencia</h1>
        <LoadingSpinner text="Cargando estadísticas..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Reportes de Asistencia</h1>
        <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-800">
          <p>{error}</p>
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Reportes de Asistencia</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumen.totalEventos}</div>
            <p className="text-xs text-muted-foreground">Eventos completados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio de Asistencia</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumen.promedioAsistencia}%</div>
            <p className="text-xs text-muted-foreground">De los miembros registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Miembros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumen.totalMiembros}</div>
            <p className="text-xs text-muted-foreground">Miembros registrados</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="eventos" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="eventos">Por Eventos</TabsTrigger>
          <TabsTrigger value="miembros">Por Miembros</TabsTrigger>
        </TabsList>

        <TabsContent value="eventos" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Asistencia por Eventos</CardTitle>
                  <CardDescription>Resumen de asistencia a cada evento.</CardDescription>
                </div>
                <Button variant="outline" onClick={handleExportExcel}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Evento</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Asistentes</TableHead>
                      <TableHead className="text-right">Porcentaje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {estadisticasEventos
                      .filter((e) => e.asistentes > 0)
                      .map((evento) => (
                        <TableRow key={evento.id}>
                          <TableCell className="font-medium">{evento.nombre}</TableCell>
                          <TableCell>
                            {new Date(evento.fecha).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="text-right">{evento.asistentes}</TableCell>
                          <TableCell className="text-right">{evento.porcentaje}%</TableCell>
                        </TableRow>
                      ))}

                    {estadisticasEventos.filter((e) => e.asistentes > 0).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No hay datos de asistencia disponibles.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="miembros" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Asistencia por Miembros</CardTitle>
                  <CardDescription>Resumen de asistencia de cada miembro.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los eventos</SelectItem>
                      {estadisticasEventos
                        .filter((e) => e.asistentes > 0)
                        .map((evento) => (
                          <SelectItem key={evento.id} value={evento.id.toString()}>
                            {evento.nombre}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={handleExportExcel}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Excel
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Miembro</TableHead>
                      <TableHead>Número Asociado</TableHead>
                      <TableHead className="text-right">Asistencias</TableHead>
                      <TableHead className="text-right">Porcentaje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAsociados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No hay datos de asistencia disponibles.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAsociados.map((asistente) => (
                        <TableRow key={asistente.id}>
                          <TableCell className="font-medium">{asistente.nombre}</TableCell>
                          <TableCell>{asistente.numeroAsociado}</TableCell>
                          <TableCell className="text-right">{asistente.asistencias}</TableCell>
                          <TableCell className="text-right">{asistente.porcentaje}%</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
