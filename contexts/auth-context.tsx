"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, AuthContextType } from "@/lib/auth-types"

// Usuarios precargados
const USERS: { [key: string]: { user: User; password: string } } = {
  admin: {
    user: {
      id: 1,
      username: "admin",
      name: "Administrador",
      role: "admin",
    },
    password: "admin123",
  },
  usuario: {
    user: {
      id: 2,
      username: "usuario",
      name: "Usuario General",
      role: "user",
    },
    password: "usuario123",
  },
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Verificar si hay un usuario en localStorage al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem("asomameco_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("asomameco_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simular una llamada a la API
    await new Promise((resolve) => setTimeout(resolve, 500))

    const userEntry = USERS[username.toLowerCase()]
    if (userEntry && userEntry.password === password) {
      setUser(userEntry.user)
      localStorage.setItem("asomameco_user", JSON.stringify(userEntry.user))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("asomameco_user")
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
