import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ASOMAMECO - Sistema de Asistencia",
  description: "Sistema de gestión de asistencia para ASOMAMECO",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <ProtectedRoute>
            <Navbar />
            <main>{children}</main>
            <Toaster />
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  )
}
