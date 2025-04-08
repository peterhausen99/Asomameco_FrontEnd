"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { asociadoApi } from "@/lib/api"

export default function NuevoMiembroPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    numeroAsociado: "",
    email: "",
    telefono: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)

      // Crear el asociado
      await asociadoApi.create({
        nombre: formData.nombre,
        cedula: formData.cedula,
        numeroAsociado: formData.numeroAsociado,
        email: formData.email || undefined,
        telefono: formData.telefono || undefined,
      })

      toast({
        title: "Miembro agregado",
        description: "El miembro ha sido agregado exitosamente",
      })

      router.push("/miembros")
    } catch (error) {
      console.error("Error al crear miembro:", error)
      toast({
        title: "Error",
        description: "No se pudo agregar el miembro. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Agregar Nuevo Miembro</h1>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Información del Miembro</CardTitle>
            <CardDescription>Ingrese los datos del nuevo miembro de la asociación.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre completo"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cedula">Número de Cédula</Label>
                <Input
                  id="cedula"
                  name="cedula"
                  placeholder="Ej: 101230456"
                  value={formData.cedula}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numeroAsociado">Número de Asociado</Label>
                <Input
                  id="numeroAsociado"
                  name="numeroAsociado"
                  placeholder="Ej: A001"
                  value={formData.numeroAsociado}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  placeholder="Ej: 8888-1111"
                  value={formData.telefono}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/miembros")} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Miembro"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
