"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, Edit, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { Evento } from "@/lib/api-types"
import { eventoApi, asistenciaApi } from "@/lib/api"

export function EventList() {
  const [eventos, setEventos] = useState<(Evento & { asistentes: number; estado: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function cargarEventos() {
      try {
        setLoading(true)

        // Cargar eventos y asistencias
        const [eventosData, asistenciasData] = await Promise.all([eventoApi.getAll(), asistenciaApi.getAll()])

        // Calcular asistentes por evento y determinar estado
        const hoy = new Date()
        const eventosConDetalles = eventosData.map((evento) => {
          const asistentes = asistenciasData.filter((a) => a.eventoId === evento.id).length
          const fechaEvento = new Date(evento.fecha)
          const estado = fechaEvento >= hoy ? "próximo" : "completado"

          return {
            ...evento,
            asistentes,
            estado,
          }
        })

        // Ordenar eventos: primero los próximos, luego los pasados por fecha descendente
        eventosConDetalles.sort((a, b) => {
          if (a.estado === "próximo" && b.estado !== "próximo") return -1
          if (a.estado !== "próximo" && b.estado === "próximo") return 1
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        })

        setEventos(eventosConDetalles)
      } catch (err) {
        console.error("Error al cargar eventos:", err)
        setError("No se pudieron cargar los eventos. Intente nuevamente.")
      } finally {
        setLoading(false)
      }
    }

    cargarEventos()
  }, [])

  if (loading) {
    return <LoadingSpinner text="Cargando eventos..." />
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

  if (eventos.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md">
        <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No hay eventos</h3>
        <p className="mt-1 text-sm text-muted-foreground">Comience creando su primer evento.</p>
        <Link href="/eventos/nuevo" className="mt-4 inline-block">
          <Button>Crear Evento</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Todos los Eventos</h2>

      {eventos.map((evento) => (
        <Card key={evento.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="bg-primary/10 p-4 flex items-center justify-center md:w-48">
                <div className="text-center">
                  <CalendarIcon className="h-8 w-8 mx-auto text-primary" />
                  <div className="mt-2 font-semibold">
                    {new Date(evento.fecha).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{evento.nombre}</h3>
                      <Badge variant={evento.estado === "próximo" ? "default" : "secondary"}>
                        {evento.estado === "próximo" ? "Próximo" : "Completado"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{evento.descripcion}</p>

                    {evento.estado === "completado" && (
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{evento.asistentes} asistentes</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Link href={`/eventos/${evento.id}/editar`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </Link>
                    <Link href={`/eventos/${evento.id}/asistencia`}>
                      <Button size="sm">
                        {evento.estado === "próximo" ? "Registrar Asistencia" : "Ver Asistencia"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
