export interface User {
  id: number
  username: string
  name: string
  role: "admin" | "user"
}

export interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}
