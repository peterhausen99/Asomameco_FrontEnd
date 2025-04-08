import { RegistroAsistencia } from "@/components/eventos/registro-asistencia"

export default function AsistenciaPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Registro de Asistencia</h2>
        <p className="text-muted-foreground">Registre la asistencia de asociados al evento</p>
      </div>
      <RegistroAsistencia eventoId={Number.parseInt(params.id)} />
    </div>
  )
}

