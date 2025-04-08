import { EventosList } from "@/components/eventos/eventos-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function EventosPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Eventos</h2>
          <p className="text-muted-foreground">Gestione los eventos y registre la asistencia</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/eventos/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Evento
          </Link>
        </Button>
      </div>
      <EventosList />
    </div>
  )
}

