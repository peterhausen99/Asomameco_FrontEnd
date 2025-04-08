import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Users, FileSpreadsheet, BarChart3 } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center space-y-6 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">ASOMAMECO - Sistema de Asistencia</h1>
        <p className="text-muted-foreground max-w-[600px]">
          Gestione eventos, registre asistencia y genere reportes para las reuniones de la asociación.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Eventos</CardTitle>
            <CardDescription>Gestione los eventos de la asociación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-4">
              <CalendarDays className="h-12 w-12 text-primary" />
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/eventos" className="w-full">
              <Button className="w-full">Administrar Eventos</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Miembros</CardTitle>
            <CardDescription>Gestione los miembros de la asociación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-4">
              <Users className="h-12 w-12 text-primary" />
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/miembros" className="w-full">
              <Button className="w-full">Administrar Miembros</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Importar Datos</CardTitle>
            <CardDescription>Importe datos desde Excel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-4">
              <FileSpreadsheet className="h-12 w-12 text-primary" />
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/importar" className="w-full">
              <Button className="w-full">Importar Excel</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Reportes</CardTitle>
            <CardDescription>Genere reportes de asistencia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-4">
              <BarChart3 className="h-12 w-12 text-primary" />
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/reportes" className="w-full">
              <Button className="w-full">Ver Reportes</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
