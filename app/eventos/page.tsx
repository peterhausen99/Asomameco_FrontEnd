import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarPlus, CalendarClock } from "lucide-react"
import { EventList } from "./event-list"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function EventosPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Eventos</h1>
        <Link href="/eventos/nuevo">
          <Button>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Crear Evento
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Evento</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<p className="text-sm text-muted-foreground">Cargando próximo evento...</p>}>
              <ProximoEvento />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resumen</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<p className="text-sm text-muted-foreground">Cargando resumen...</p>}>
              <ResumenEventos />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <Suspense fallback={<LoadingSpinner text="Cargando eventos..." />}>
        <EventList />
      </Suspense>
    </div>
  )
}

// Componente para mostrar el próximo evento
async function ProximoEvento() {
  try {
    const { eventoApi } = await import("@/lib/api")
    const eventos = await eventoApi.getAll()

    // Ordenar eventos por fecha y encontrar el próximo
    const hoy = new Date()
    const proximosEventos = eventos
      .filter((evento) => new Date(evento.fecha) >= hoy)
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())

    const proximoEvento = proximosEventos[0]

    if (!proximoEvento) {
      return (
        <div>
          <div className="text-lg font-medium">No hay eventos próximos</div>
          <p className="text-xs text-muted-foreground">Cree un nuevo evento</p>
        </div>
      )
    }

    return (
      <div>
        <div className="text-2xl font-bold">{proximoEvento.nombre}</div>
        <p className="text-xs text-muted-foreground">
          {new Date(proximoEvento.fecha).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <div className="mt-4">
          <Link href={`/eventos/${proximoEvento.id}/asistencia`}>
            <Button variant="outline" size="sm">
              Registrar Asistencia
            </Button>
          </Link>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error al cargar el próximo evento:", error)
    return <div className="text-sm text-red-500">Error al cargar el próximo evento</div>
  }
}

// Componente para mostrar el resumen de eventos
async function ResumenEventos() {
  try {
    const { eventoApi } = await import("@/lib/api")
    const eventos = await eventoApi.getAll()

    const hoy = new Date()
    const eventosProximos = eventos.filter((evento) => new Date(evento.fecha) >= hoy).length
    const eventosPasados = eventos.length - eventosProximos

    return (
      <div>
        <div className="text-2xl font-bold">{eventos.length} Eventos</div>
        <p className="text-xs text-muted-foreground">
          {eventosPasados} eventos pasados, {eventosProximos} próximos
        </p>
        <div className="mt-4">
          <Link href="/reportes">
            <Button variant="outline" size="sm">
              Ver Reportes
            </Button>
          </Link>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error al cargar el resumen de eventos:", error)
    return <div className="text-sm text-red-500">Error al cargar el resumen</div>
  }
}
