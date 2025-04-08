import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AsistenciaEventosReport } from "@/components/reportes/asistencia-eventos-report"
import { AsistenciaAsociadosReport } from "@/components/reportes/asistencia-asociados-report"
import { EstadisticasReport } from "@/components/reportes/estadisticas-report"

export default function ReportesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Reportes</h2>
      </div>
      <Tabs defaultValue="eventos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="eventos">Asistencia por Evento</TabsTrigger>
          <TabsTrigger value="asociados">Asistencia por Asociado</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas Globales</TabsTrigger>
        </TabsList>
        <TabsContent value="eventos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Asistencia por Evento</CardTitle>
              <CardDescription>Visualice la asistencia registrada en cada evento</CardDescription>
            </CardHeader>
            <CardContent>
              <AsistenciaEventosReport />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="asociados" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Asistencia por Asociado</CardTitle>
              <CardDescription>Visualice el historial de participación de cada asociado</CardDescription>
            </CardHeader>
            <CardContent>
              <AsistenciaAsociadosReport />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="estadisticas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas Globales</CardTitle>
              <CardDescription>Visualice estadísticas generales de asistencia</CardDescription>
            </CardHeader>
            <CardContent>
              <EstadisticasReport />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

