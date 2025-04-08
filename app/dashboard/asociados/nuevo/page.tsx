import { AsociadoForm } from "@/components/asociados/asociado-form"

export default function NuevoAsociadoPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Nuevo Asociado</h2>
        <p className="text-muted-foreground">Complete el formulario para registrar un nuevo asociado</p>
      </div>
      <AsociadoForm />
    </div>
  )
}

