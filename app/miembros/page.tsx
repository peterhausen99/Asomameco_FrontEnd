import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { MemberList } from "./member-list"

export default function MiembrosPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Miembros</h1>
        <div className="flex gap-2">
          <Link href="/importar">
            <Button variant="outline">Importar desde Excel</Button>
          </Link>
          <Link href="/miembros/nuevo">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Nuevo Miembro
            </Button>
          </Link>
        </div>
      </div>

      <MemberList />
    </div>
  )
}
