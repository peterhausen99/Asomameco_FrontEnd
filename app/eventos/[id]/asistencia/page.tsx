"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, UserCheck, UserPlus } from "lucide-react"
import { AttendanceList } from "./attendance-list"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { eventoApi, asociadoApi, asistenciaApi } from "@/lib/api"
import type { Evento, Asociado } from "@/lib/api-types"

export default function AsistenciaPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Asociado[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [evento, setEvento] = useState<Evento | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const eventoId = Number.parseInt(params.id)

  // Cargar datos del evento
  useEffect(() => {
    async function cargarEvento() {
      try {
        setLoading(true)
        const eventoData = await eventoApi.getById(eventoId)
        setEvento(eventoData)
      } catch (err) {
        console.error("Error al cargar evento:", err)
        setError("No se pudo cargar la información del evento")
      } finally {
        setLoading(false)
      }
    }

    cargarEvento()
  }, [eventoId])

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    try {
      setIsSearching(true)
      setHasSearched(true)

      // Buscar asociados por cédula o número de asociado
      const results = await asociadoApi.buscar(searchTerm)

      // Filtrar asociados que ya registraron asistencia
      const asistencias = await asistenciaApi.getByEvento(eventoId)
      const asociadosConAsistencia = asistencias.map((a) => a.asociadoId)

      const filteredResults = results.filter((asociado) => !asociadosConAsistencia.includes(asociado.id!))

      setSearchResults(filteredResults)
    } catch (err) {
      console.error("Error al buscar:", err)
      toast({
        title: "Error",
        description: "No se pudo realizar la búsqueda",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleRegisterAttendance = async (asociadoId: number) => {
    try {
      setIsRegistering(true)

      // Registrar asistencia
      await asistenciaApi.create({
        eventoId,
        asociadoId,
        fechaHora: new Date().toISOString(),
      })

      // Actualizar resultados para quitar el asociado registrado
      setSearchResults((prev) => prev.filter((a) => a.id !== asociadoId))

      toast({
        title: "Asistencia registrada",
        description: "La asistencia ha sido registrada exitosamente",
      })
    } catch (err) {
      console.error("Error al registrar asistencia:", err)
      toast({
        title: "Error",
        description: "No se pudo registrar la asistencia",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Cargando información del evento..." />
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-800">
          <p>{error}</p>
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Registro de Asistencia</h1>
      <p className="text-muted-foreground mb-6">
        Evento: {evento?.nombre} -{" "}
        {evento &&
          new Date(evento.fecha).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
      </p>

      <Tabs defaultValue="registro" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="registro">Registrar Asistencia</TabsTrigger>
          <TabsTrigger value="lista">Lista de Asistentes</TabsTrigger>
        </TabsList>

        <TabsContent value="registro" className="mt-6">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Buscar Miembro</CardTitle>
              <CardDescription>
                Ingrese el número de cédula o número de asociado para registrar la asistencia.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="search" className="sr-only">
                    Buscar
                  </Label>
                  <Input
                    id="search"
                    placeholder="Cédula o número de asociado"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    disabled={isSearching}
                  />
                </div>
                <Button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? (
                    "Buscando..."
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>

              {hasSearched && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-3">Resultados de búsqueda</h3>

                  {isSearching ? (
                    <LoadingSpinner text="Buscando..." className="py-4" />
                  ) : searchResults.length === 0 ? (
                    <div className="text-center py-8">
                      <UserPlus className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">No se encontraron miembros con esa información.</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => (window.location.href = "/miembros/nuevo")}
                      >
                        Agregar Nuevo Miembro
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {searchResults.map((miembro) => (
                        <Card key={miembro.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{miembro.nombre}</p>
                                <div className="text-sm text-muted-foreground">
                                  <span>Cédula: {miembro.cedula}</span>
                                  <span className="mx-2">•</span>
                                  <span>Asociado: {miembro.numeroAsociado}</span>
                                </div>
                              </div>
                              <Button onClick={() => handleRegisterAttendance(miembro.id!)} disabled={isRegistering}>
                                <UserCheck className="h-4 w-4 mr-2" />
                                {isRegistering ? "Registrando..." : "Registrar"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lista" className="mt-6">
          <AttendanceList eventId={eventoId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
