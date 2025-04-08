import { AsociadosList } from "@/components/asociados/asociados-list"
import { Button } from "@/components/ui/button"
import { Plus, FileUp, FileDown } from "lucide-react"
import Link from "next/link"

export default function AsociadosPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Asociados</h2>
          <p className="text-muted-foreground">Gestione la información de los asociados de ASOMAMECO</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild>
            <Link href="/dashboard/asociados/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Asociado
            </Link>
          </Button>
          <Button variant="outline">
            <FileUp className="mr-2 h-4 w-4" />
            Importar
          </Button>
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>
      <AsociadosList />
    </div>
  )
}

