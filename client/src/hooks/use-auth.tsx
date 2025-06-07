"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api"
// Remove import from @shared/schema
// Add inline interface
interface User {
  id: number
  username: string
  email?: string
  points: number
  oauthProvider?: string
}

interface AuthContextProps {
  user: User | null
  login: (userData: User) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get<User>("/auth/me")
        setUser(response.data)
      } catch (error) {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (userData: User) => {
    try {
      await api.post("/auth/login", userData)
      const response = await api.get<User>("/auth/me")
      setUser(response.data)
      navigate("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.post("/auth/logout")
      setUser(null)
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const value: AuthContextProps = {
    user,
    login,
    logout,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
