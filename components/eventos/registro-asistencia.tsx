"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Search, UserCheck, X, Check, Filter, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Asociado } from "@/types"

// Datos de ejemplo
const asociados: Asociado[] = [
  {
    IdAsociado: 1,
    Nombre: "Juan Pérez",
    NumeroCedula: "1-1234-5678",
    Estatus1: "Activo",
    Estado2: "Verificado",
    Correo: "juan.perez@ejemplo.com",
    Telefono: "8888-8888",
    FechaRegistro: "2023-01-15",
    FechaModificacion: "2023-06-20",
    IdUsuario: 1,
  },
  {
    IdAsociado: 2,
    Nombre: "María Rodríguez",
    NumeroCedula: "2-3456-7890",
    Estatus1: "Activo",
    Estado2: "Confirmado",
    Correo: "maria.rodriguez@ejemplo.com",
    Telefono: "7777-7777",
    FechaRegistro: "2023-02-10",
    FechaModificacion: "2023-05-15",
    IdUsuario: 1,
  },
  {
    IdAsociado: 3,
    Nombre: "Carlos Jiménez",
    NumeroCedula: "3-4567-8901",
    Estatus1: "Inactivo",
    Estado2: "Pendiente",
    Correo: "carlos.jimenez@ejemplo.com",
    Telefono: "6666-6666",
    FechaRegistro: "2023-03-05",
    FechaModificacion: "2023-04-10",
    IdUsuario: 2,
  },
  {
    IdAsociado: 4,
    Nombre: "Ana Sánchez",
    NumeroCedula: "4-5678-9012",
    Estatus1: "Activo",
    Estado2: "Verificado",
    Correo: "ana.sanchez@ejemplo.com",
    Telefono: "5555-5555",
    FechaRegistro: "2023-04-20",
    FechaModificacion: "2023-07-05",
    IdUsuario: 2,
  },
  {
    IdAsociado: 5,
    Nombre: "Pedro Mora",
    NumeroCedula: "5-6789-0123",
    Estatus1: "Activo",
    Estado2: "No",
    Correo: "pedro.mora@ejemplo.com",
    Telefono: "4444-4444",
    FechaRegistro: "2023-05-12",
    FechaModificacion: "2023-08-01",
    IdUsuario: 1,
  },
  {
    IdAsociado: 6,
    Nombre: "Laura Vargas",
    NumeroCedula: "6-7890-1234",
    Estatus1: "Activo",
    Estado2: "Verificado",
    Correo: "laura.vargas@ejemplo.com",
    Telefono: "3333-3333",
    FechaRegistro: "2023-06-18",
    FechaModificacion: "2023-09-10",
    IdUsuario: 2,
  },
  {
    IdAsociado: 7,
    Nombre: "Roberto Mendoza",
    NumeroCedula: "7-8901-2345",
    Estatus1: "Activo",
    Estado2: "Confirmado",
    Correo: "roberto.mendoza@ejemplo.com",
    Telefono: "2222-2222",
    FechaRegistro: "2023-07-22",
    FechaModificacion: "2023-10-15",
    IdUsuario: 1,
  },
  {
    IdAsociado: 8,
    Nombre: "Carmen Solís",
    NumeroCedula: "8-9012-3456",
    Estatus1: "Inactivo",
    Estado2: "No",
    Correo: "carmen.solis@ejemplo.com",
    Telefono: "1111-1111",
    FechaRegistro: "2023-08-05",
    FechaModificacion: "2023-11-20",
    IdUsuario: 2,
  },
]

// Función para obtener datos del evento (simulado)
const getEventoData = (eventoId: number) => {
  // En una aplicación real, esto sería una llamada a la API
  return {
    IdEvento: eventoId,
    Nombre: "Asamblea General Ordinaria",
    Fecha: "2023-10-15",
    Descripcion: "Asamblea anual para todos los asociados",
  }
}

const searchSchema = z.object({
  busqueda: z.string().optional(),
})

type SearchFormValues = z.infer<typeof searchSchema>

interface AsistenteRegistrado {
  asociado: Asociado
  horaRegistro: string
}

export function RegistroAsistencia({ eventoId }: { eventoId: number }) {
  const [asistentes, setAsistentes] = useState<AsistenteRegistrado[]>([])
  const [filteredAsociados, setFilteredAsociados] = useState<Asociado[]>(asociados)
  const [searchTerm, setSearchTerm] = useState("")
  const [estatusFilter, setEstatusFilter] = useState<string>("todos")
  const [estadoFilter, setEstadoFilter] = useState<string>("todos")
  const [eventoData, setEventoData] = useState(getEventoData(eventoId))
  const { toast } = useToast()

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      busqueda: "",
    },
  })

  // Cargar asistentes (simulado)
  useEffect(() => {
    // En una aplicación real, esto sería una llamada a la API para obtener los asistentes del evento
    const asistentesIniciales: AsistenteRegistrado[] = [
      {
        asociado: asociados[0],
        horaRegistro: "09:15:23",
      },
      {
        asociado: asociados[1],
        horaRegistro: "09:22:45",
      },
    ]
    setAsistentes(asistentesIniciales)

    // Cargar datos del evento
    setEventoData(getEventoData(eventoId))
  }, [eventoId])

  // Filtrar asociados basado en búsqueda y filtros
  useEffect(() => {
    let filtered = [...asociados]

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (asociado) =>
          asociado.Nombre.toLowerCase().includes(term) || asociado.NumeroCedula.toLowerCase().includes(term),
      )
    }

    // Filtrar por estatus
    if (estatusFilter !== "todos") {
      filtered = filtered.filter((asociado) => asociado.Estatus1 === estatusFilter)
    }

    // Filtrar por estado
    if (estadoFilter !== "todos") {
      filtered = filtered.filter((asociado) => asociado.Estado2 === estadoFilter)
    }

    setFilteredAsociados(filtered)
  }, [searchTerm, estatusFilter, estadoFilter])

  function onSubmit(data: SearchFormValues) {
    setSearchTerm(data.busqueda || "")
  }

  function toggleAsistencia(asociado: Asociado) {
    // Verificar si el asociado ya está registrado
    const index = asistentes.findIndex((a) => a.asociado.IdAsociado === asociado.IdAsociado)

    if (index >= 0) {
      // Si ya está registrado, lo eliminamos
      const nuevosAsistentes = [...asistentes]
      nuevosAsistentes.splice(index, 1)
      setAsistentes(nuevosAsistentes)

      toast({
        title: "Asistencia eliminada",
        description: `Se ha eliminado la asistencia de ${asociado.Nombre}.`,
      })
    } else {
      // Si no está registrado, lo agregamos
      const now = new Date()
      const horaRegistro = now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })

      setAsistentes((prev) => [
        ...prev,
        {
          asociado,
          horaRegistro,
        },
      ])

      toast({
        title: "Asistencia registrada",
        description: `Se ha registrado la asistencia de ${asociado.Nombre}.`,
      })
    }
  }

  function isAsistente(idAsociado: number): boolean {
    return asistentes.some((a) => a.asociado.IdAsociado === idAsociado)
  }

  function getHoraRegistro(idAsociado: number): string {
    const asistente = asistentes.find((a) => a.asociado.IdAsociado === idAsociado)
    return asistente ? asistente.horaRegistro : ""
  }

  function registrarAsistenciaPorCedula(cedula: string) {
    const asociado = asociados.find((a) => a.NumeroCedula === cedula)

    if (asociado) {
      if (!isAsistente(asociado.IdAsociado)) {
        toggleAsistencia(asociado)
        form.reset()
        return true
      } else {
        toast({
          variant: "warning",
          title: "Asociado ya registrado",
          description: `${asociado.Nombre} ya ha sido registrado en este evento.`,
        })
        return false
      }
    } else {
      toast({
        variant: "destructive",
        title: "Asociado no encontrado",
        description: "No se encontró ningún asociado con esa cédula.",
      })
      return false
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      const cedula = e.currentTarget.value
      if (cedula) {
        registrarAsistenciaPorCedula(cedula)
        // Limpiar el campo después de registrar
        e.currentTarget.value = ""
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Evento: {eventoData.Nombre}</CardTitle>
          <CardDescription>Fecha: {new Date(eventoData.Fecha).toLocaleDateString("es-ES")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <Input
                placeholder="Escanear cédula o ingresar manualmente (Enter para registrar)"
                className="w-full"
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-sm py-1.5">
                Total Asociados: {asociados.length}
              </Badge>
              <Badge variant="outline" className="bg-green-100 text-green-800 text-sm py-1.5">
                Asistentes: {asistentes.length}
              </Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 text-sm py-1.5">
                {((asistentes.length / asociados.length) * 100).toFixed(1)}% Asistencia
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="todos">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="todos">Todos los Asociados</TabsTrigger>
            <TabsTrigger value="asistentes">Asistentes ({asistentes.length})</TabsTrigger>
            <TabsTrigger value="pendientes">Pendientes ({asociados.length - asistentes.length})</TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar Asistencia
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full sm:max-w-sm">
                  <FormField
                    control={form.control}
                    name="busqueda"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input
                              placeholder="Buscar por nombre o cédula..."
                              className="pl-10"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e)
                                setSearchTerm(e.target.value)
                              }}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>

              <div className="flex flex-wrap gap-2">
                <Select value={estatusFilter} onValueChange={setEstatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Estatus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Verificado">Verificado</SelectItem>
                    <SelectItem value="Confirmado">Confirmado</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <TabsContent value="todos">
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAsociados.map((asociado) => (
                      <Card
                        key={asociado.IdAsociado}
                        className={`
                        ${isAsistente(asociado.IdAsociado) ? "border-green-500 bg-green-50" : ""}
                        ${asociado.Estatus1 === "Inactivo" ? "opacity-70" : ""}
                      `}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>
                                  {asociado.Nombre.split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .substring(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium text-sm">{asociado.Nombre}</h3>
                                <p className="text-xs text-muted-foreground">{asociado.NumeroCedula}</p>
                                <div className="mt-1 flex gap-1">
                                  <Badge
                                    variant={asociado.Estatus1 === "Activo" ? "default" : "secondary"}
                                    className="text-xs"
                                  >
                                    {asociado.Estatus1}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs
                                      ${
                                        asociado.Estado2 === "Verificado"
                                          ? "bg-green-100 text-green-800"
                                          : asociado.Estado2 === "Confirmado"
                                            ? "bg-blue-100 text-blue-800"
                                            : asociado.Estado2 === "Pendiente"
                                              ? "bg-yellow-100 text-yellow-800"
                                              : "bg-red-100 text-red-800"
                                      }
                                    `}
                                  >
                                    {asociado.Estado2}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div>
                              {isAsistente(asociado.IdAsociado) ? (
                                <div className="flex flex-col items-end">
                                  <Badge variant="outline" className="bg-green-100 text-green-800 mb-1">
                                    <Check className="mr-1 h-3 w-3" />
                                    Presente
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {getHoraRegistro(asociado.IdAsociado)}
                                  </span>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleAsistencia(asociado)}
                                  disabled={asociado.Estatus1 === "Inactivo"}
                                >
                                  <UserCheck className="mr-1 h-4 w-4" />
                                  Registrar
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {filteredAsociados.length === 0 && (
                      <div className="col-span-full flex h-40 items-center justify-center">
                        <p className="text-muted-foreground">
                          No se encontraron asociados con los criterios de búsqueda
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </TabsContent>

          <TabsContent value="asistentes">
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {asistentes.length > 0 ? (
                      asistentes.map((asistente) => (
                        <Card key={asistente.asociado.IdAsociado} className="border-green-500 bg-green-50">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>
                                    {asistente.asociado.Nombre.split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .substring(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-medium text-sm">{asistente.asociado.Nombre}</h3>
                                  <p className="text-xs text-muted-foreground">{asistente.asociado.NumeroCedula}</p>
                                  <div className="mt-1 flex gap-1">
                                    <Badge
                                      variant={asistente.asociado.Estatus1 === "Activo" ? "default" : "secondary"}
                                      className="text-xs"
                                    >
                                      {asistente.asociado.Estatus1}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <Badge variant="outline" className="bg-green-100 text-green-800 mb-1">
                                  <Check className="mr-1 h-3 w-3" />
                                  Presente
                                </Badge>
                                <span className="text-xs text-muted-foreground">{asistente.horaRegistro}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 h-6 mt-1 px-2"
                                  onClick={() => toggleAsistencia(asistente.asociado)}
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Eliminar
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full flex h-40 items-center justify-center">
                        <p className="text-muted-foreground">No hay asistentes registrados</p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </TabsContent>

          <TabsContent value="pendientes">
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAsociados
                      .filter((asociado) => !isAsistente(asociado.IdAsociado))
                      .map((asociado) => (
                        <Card
                          key={asociado.IdAsociado}
                          className={`
                          ${asociado.Estatus1 === "Inactivo" ? "opacity-70" : ""}
                        `}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>
                                    {asociado.Nombre.split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .substring(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-medium text-sm">{asociado.Nombre}</h3>
                                  <p className="text-xs text-muted-foreground">{asociado.NumeroCedula}</p>
                                  <div className="mt-1 flex gap-1">
                                    <Badge
                                      variant={asociado.Estatus1 === "Activo" ? "default" : "secondary"}
                                      className="text-xs"
                                    >
                                      {asociado.Estatus1}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs
                                        ${
                                          asociado.Estado2 === "Verificado"
                                            ? "bg-green-100 text-green-800"
                                            : asociado.Estado2 === "Confirmado"
                                              ? "bg-blue-100 text-blue-800"
                                              : asociado.Estado2 === "Pendiente"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                        }
                                      `}
                                    >
                                      {asociado.Estado2}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleAsistencia(asociado)}
                                disabled={asociado.Estatus1 === "Inactivo"}
                              >
                                <UserCheck className="mr-1 h-4 w-4" />
                                Registrar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                    {filteredAsociados.filter((asociado) => !isAsistente(asociado.IdAsociado)).length === 0 && (
                      <div className="col-span-full flex h-40 items-center justify-center">
                        <p className="text-muted-foreground">No hay asociados pendientes de asistencia</p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </TabsContent>

          <CardFooter className="border-t p-4 flex justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredAsociados.length} de {asociados.length} asociados
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Más filtros
              </Button>
            </div>
          </CardFooter>
        </Card>
      </Tabs>
    </div>
  )
}

