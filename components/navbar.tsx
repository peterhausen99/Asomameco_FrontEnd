"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  // No mostrar la barra de navegación en la página de login
  if (pathname === "/login") {
    return null
  }

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-xl font-bold">
            ASOMAMECO
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:underline">
              Inicio
            </Link>
            <Link href="/eventos" className="text-sm font-medium hover:underline">
              Eventos
            </Link>
            <Link href="/miembros" className="text-sm font-medium hover:underline">
              Miembros
            </Link>
            <Link href="/reportes" className="text-sm font-medium hover:underline">
              Reportes
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{user?.name}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} title="Cerrar sesión">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
