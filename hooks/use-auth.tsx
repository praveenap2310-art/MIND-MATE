"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("mindmate-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simple mock authentication - in real app, this would call an API
    const users = JSON.parse(localStorage.getItem("mindmate-users") || "[]")
    const foundUser = users.find((u: any) => u.email === email && u.password === password)

    if (foundUser) {
      const userSession = { id: foundUser.id, email: foundUser.email, name: foundUser.name }
      setUser(userSession)
      localStorage.setItem("mindmate-user", JSON.stringify(userSession))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)

    const users = JSON.parse(localStorage.getItem("mindmate-users") || "[]")

    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      setIsLoading(false)
      return false
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
    }

    users.push(newUser)
    localStorage.setItem("mindmate-users", JSON.stringify(users))

    // Auto-login after registration
    const userSession = { id: newUser.id, email: newUser.email, name: newUser.name }
    setUser(userSession)
    localStorage.setItem("mindmate-user", JSON.stringify(userSession))

    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("mindmate-user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
