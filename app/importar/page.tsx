"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileSpreadsheet, AlertCircle, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { asociadoApi } from "@/lib/api"
import type { Asociado } from "@/lib/api-types"

// Simulación de lectura de Excel
// En una implementación real, se usaría una biblioteca como xlsx
const simularLecturaExcel = (file: File): Promise<Asociado[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData: Asociado[] = [
        {
          cedula: "101230456",
          nombre: "María González",
          numeroAsociado: "A001",
          email: "maria@ejemplo.com",
          telefono: "8888-1111",
        },
        {
          cedula: "203450678",
          nombre: "Carlos Rodríguez",
          numeroAsociado: "A002",
          email: "carlos@ejemplo.com",
          telefono: "8888-2222",
        },
        {
          cedula: "304560789",
          nombre: "Ana Martínez",
          numeroAsociado: "A003",
          email: "ana@ejemplo.com",
          telefono: "8888-3333",
        },
      ]
      resolve(mockData)
    }, 1000)
  })
}

export default function ImportarPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<Asociado[] | null>(null)
  const [importing, setImporting] = useState(false)
  const [importSuccess, setImportSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setError(null)

    if (selectedFile) {
      try {
        // Simulación de lectura de archivo Excel
        const data = await simularLecturaExcel(selectedFile)
        setPreviewData(data)
      } catch (err) {
        console.error("Error al leer el archivo:", err)
        setError("No se pudo leer el archivo. Asegúrese de que sea un archivo Excel válido.")
        setPreviewData(null)
      }
    } else {
      setPreviewData(null)
    }
  }

  const handleImport = async () => {
    if (!file || !previewData) {
      setError("Por favor seleccione un archivo Excel válido.")
      return
    }

    try {
      setImporting(true)

      // Importar cada asociado
      for (const asociado of previewData) {
        await asociadoApi.create(asociado)
      }

      setImportSuccess(true)

      toast({
        title: "Importación exitosa",
        description: `Se importaron ${previewData.length} miembros correctamente.`,
      })

      // Redireccionar después de un tiempo
      setTimeout(() => {
        router.push("/miembros")
      }, 2000)
    } catch (error) {
      console.error("Error al importar datos:", error)
      setError("Ocurrió un error durante la importación. Intente nuevamente.")
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Importar Miembros desde Excel</h1>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Carga de Archivo Excel</CardTitle>
          <CardDescription>Seleccione el archivo Excel con la lista de miembros para importar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {importSuccess && (
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Importación Exitosa</AlertTitle>
              <AlertDescription className="text-green-700">
                Los miembros han sido importados correctamente.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="excel-file">Archivo Excel</Label>
            <div className="flex gap-2">
              <Input
                id="excel-file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={importing || importSuccess}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              El archivo debe contener las columnas: Cédula, Nombre, Número de Asociado, Email, Teléfono.
            </p>
          </div>

          {previewData && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Vista previa de datos</h3>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cédula</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Número Asociado</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Teléfono</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.cedula}</TableCell>
                        <TableCell>{row.nombre}</TableCell>
                        <TableCell>{row.numeroAsociado}</TableCell>
                        <TableCell>{row.email || "-"}</TableCell>
                        <TableCell>{row.telefono || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-sm text-muted-foreground">
                Mostrando {previewData.length} de {previewData.length} registros.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/miembros")} disabled={importing}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={!file || importing || importSuccess}>
            {importing ? (
              <>Importando...</>
            ) : (
              <>
                {importSuccess ? <Check className="mr-2 h-4 w-4" /> : <FileSpreadsheet className="mr-2 h-4 w-4" />}
                {importSuccess ? "Importado" : "Importar Datos"}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
