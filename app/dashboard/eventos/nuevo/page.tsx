import { EventoForm } from "@/components/eventos/evento-form"

export default function NuevoEventoPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Nuevo Evento</h2>
        <p className="text-muted-foreground">Complete el formulario para registrar un nuevo evento</p>
      </div>
      <EventoForm />
    </div>
  )
}

