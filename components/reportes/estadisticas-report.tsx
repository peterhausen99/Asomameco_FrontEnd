"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts"

// Datos de ejemplo para gráficos
const asistenciaMensual = [
  { name: "Ene", asistentes: 132 },
  { name: "Feb", asistentes: 156 },
  { name: "Mar", asistentes: 178 },
  { name: "Abr", asistentes: 145 },
  { name: "May", asistentes: 189 },
  { name: "Jun", asistentes: 167 },
  { name: "Jul", asistentes: 198 },
  { name: "Ago", asistentes: 187 },
  { name: "Sep", asistentes: 210 },
  { name: "Oct", asistentes: 176 },
  { name: "Nov", asistentes: 192 },
  { name: "Dic", asistentes: 168 },
]

const asistenciaPorTipoEvento = [
  { name: "Asambleas", value: 156 },
  { name: "Capacitaciones", value: 87 },
  { name: "Conferencias", value: 112 },
  { name: "Talleres", value: 45 },
  { name: "Reuniones", value: 12 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

const tendenciaAsistencia = [
  { name: "2020", promedio: 45 },
  { name: "2021", promedio: 52 },
  { name: "2022", promedio: 58 },
  { name: "2023", promedio: 64 },
  { name: "2024", promedio: 68 },
]

export function EstadisticasReport() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Últimos 12 meses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio Asistencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">+4% respecto al año anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evento Más Concurrido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">210</div>
            <p className="text-xs text-muted-foreground">Asamblea General (Septiembre)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asociados Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">198</div>
            <p className="text-xs text-muted-foreground">80.8% del total</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mensual" className="space-y-4">
        <TabsList>
          <TabsTrigger value="mensual">Asistencia Mensual</TabsTrigger>
          <TabsTrigger value="tipo">Por Tipo de Evento</TabsTrigger>
          <TabsTrigger value="tendencia">Tendencia Anual</TabsTrigger>
        </TabsList>
        <TabsContent value="mensual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asistencia Mensual</CardTitle>
              <CardDescription>Número de asistentes por mes durante el último año</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={asistenciaMensual}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} asistentes`, "Total"]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar dataKey="asistentes" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tipo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asistencia por Tipo de Evento</CardTitle>
              <CardDescription>Distribución de asistentes según el tipo de evento</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={asistenciaPorTipoEvento}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {asistenciaPorTipoEvento.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} asistentes`, "Total"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tendencia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Asistencia Anual</CardTitle>
              <CardDescription>Promedio de asistencia a eventos por año</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tendenciaAsistencia}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip formatter={(value) => [`${value}%`, "Promedio"]} />
                  <Line type="monotone" dataKey="promedio" stroke="#8884d8" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

