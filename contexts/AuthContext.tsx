'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  username: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (user: User) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/auth/validate', {
        credentials: 'include',
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setIsAuthenticated(true)
        
        // Only redirect if we're on the login page
        if (window.location.pathname === '/login') {
          router.push('/dashboard')
        }
      } else {
        setUser(null)
        setIsAuthenticated(false)
        
        // Only redirect to login if we're not already there
        if (window.location.pathname !== '/login') {
          router.push('/login')
        }
      }
    } catch (error) {
      setUser(null)
      setIsAuthenticated(false)
      
      // Only redirect to login if we're not already there
      if (window.location.pathname !== '/login') {
        router.push('/login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (userData: User) => {
    setUser(userData)
    setIsAuthenticated(true)
    router.push('/dashboard')
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    }

    setUser(null)
    setIsAuthenticated(false)
    router.push('/login')
  }

  if (isLoading) {
    return null // Or a loading spinner if you prefer
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}